/**
 * Small browser-network helpers shared by API clients.
 *
 * These helpers never queue or rate-limit requests. They only fail fast while
 * the browser is offline and turn stalled connections into actionable errors
 * so the UI can recover through its existing provider failover paths.
 */

const DEFAULT_TIMEOUT_MS = 45_000;

export function isBrowserOnline(): boolean {
  return typeof navigator === 'undefined' || navigator.onLine !== false;
}

export function assertBrowserOnline(): void {
  if (!isBrowserOnline()) {
    throw new Error('You appear to be offline. Reconnect to the internet and try again.');
  }
}

/**
 * Fetch with a real request deadline that also preserves a caller-provided
 * AbortSignal. This avoids requests staying pending forever on flaky mobile
 * networks without introducing any artificial request pacing.
 */
export async function fetchWithDeadline(
  input: RequestInfo | URL,
  init: RequestInit = {},
  timeoutMs: number = DEFAULT_TIMEOUT_MS
): Promise<Response> {
  assertBrowserOnline();

  const controller = new AbortController();
  const callerSignal = init.signal;
  let didTimeOut = false;

  const onCallerAbort = () => controller.abort();
  if (callerSignal?.aborted) {
    controller.abort();
  } else {
    callerSignal?.addEventListener('abort', onCallerAbort, { once: true });
  }

  const timer = window.setTimeout(() => {
    didTimeOut = true;
    controller.abort();
  }, Math.max(1, timeoutMs));

  try {
    return await fetch(input, { ...init, signal: controller.signal });
  } catch (error) {
    if (didTimeOut) {
      throw new Error('Connection timed out before the service responded.');
    }
    if (!isBrowserOnline()) {
      throw new Error('Your internet connection was lost. Reconnect and try again.');
    }
    throw error;
  } finally {
    window.clearTimeout(timer);
    callerSignal?.removeEventListener('abort', onCallerAbort);
  }
}

function wait(ms: number): Promise<void> {
  return new Promise((resolve) => window.setTimeout(resolve, ms));
}

function shouldRetryResponse(response: Response): boolean {
  return response.status === 408 || response.status === 425 || response.status === 429 || response.status >= 500;
}

/**
 * A deliberately conservative retry helper for safe, public GET requests.
 * POST inference requests are not retried here because retrying an ambiguous
 * request can duplicate work and provider usage; those calls use model
 * failover instead.
 */
export async function fetchPublicWithRetry(
  input: RequestInfo | URL,
  init: RequestInit = {},
  timeoutMs: number = 5_500,
  attempts: number = 2
): Promise<Response> {
  let lastError: unknown;
  const maxAttempts = Math.max(1, attempts);

  for (let attempt = 0; attempt < maxAttempts; attempt += 1) {
    try {
      const response = await fetchWithDeadline(input, init, timeoutMs);
      if (!shouldRetryResponse(response) || attempt === maxAttempts - 1) {
        return response;
      }
      lastError = new Error(`Request failed with HTTP ${response.status}`);
    } catch (error) {
      lastError = error;
      if (attempt === maxAttempts - 1 || !isBrowserOnline()) break;
    }

    // A short jittered retry absorbs transient radio handoffs without creating
    // a visible delay or client-side throttling policy.
    await wait(150 + attempt * 180 + Math.floor(Math.random() * 90));
  }

  throw lastError instanceof Error ? lastError : new Error('Unable to reach the public data service.');
}
