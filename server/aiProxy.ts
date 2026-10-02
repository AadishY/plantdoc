/**
 * PlantDoc AI — Server-side AI gateway (shared by Cloudflare Pages Functions
 * and the Vite dev server middleware).
 *
 * Browsers never see a provider API key: the client calls same-origin
 * `/api/ai/...` routes and this module attaches the secret server-side.
 */

export interface ProxyEnv {
  GEMINI_API_KEY?: string;
  GROQ_API_KEY?: string;
  OPENROUTER_API_KEY?: string;
  // Legacy VITE_* names stay supported so existing deployments keep working.
  VITE_GEMINI_API_KEY?: string;
  VITE_GROQ_API_KEY?: string;
  VITE_OPENROUTER_API_KEY?: string;
  [key: string]: string | undefined;
}

const GEMINI_BASE = 'https://generativelanguage.googleapis.com/v1beta';
const GROQ_BASE = 'https://api.groq.com/openai/v1';
const OPENROUTER_BASE = 'https://openrouter.ai/api/v1';

// Only these upstream model routes may be reached through the gateway, so the
// proxy can never be abused as an open relay for arbitrary Google API calls.
const ALLOWED_MODEL_PREFIXES = ['gemini-', 'gemma-'];
const ALLOWED_MODEL_METHODS = new Set(['generateContent', 'streamGenerateContent']);

const MAX_BODY_BYTES = 12 * 1024 * 1024; // ~12MB — ample for a downsampled WebP

const json = (body: unknown, status = 200): Response =>
  new Response(JSON.stringify(body), {
    status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'no-store',
      'X-Robots-Tag': 'noindex',
    },
  });

const pick = (env: ProxyEnv, ...names: string[]): string => {
  for (const name of names) {
    const value = env?.[name];
    if (typeof value === 'string' && value.trim()) return value.trim();
  }
  return '';
};

export const getKeys = (env: ProxyEnv) => ({
  gemini: pick(env, 'GEMINI_API_KEY', 'VITE_GEMINI_API_KEY'),
  groq: pick(env, 'GROQ_API_KEY', 'VITE_GROQ_API_KEY'),
  openrouter: pick(env, 'OPENROUTER_API_KEY', 'VITE_OPENROUTER_API_KEY'),
});

const missingKey = (provider: string): Response =>
  json(
    {
      error: {
        message: `PlantDoc AI is missing its ${provider} server credentials. Set the key as a server environment variable and redeploy.`,
        code: 503,
        status: 'UNAVAILABLE',
      },
    },
    503
  );

/** Streams the upstream response through untouched, minus provider headers. */
const relay = async (upstream: Response): Promise<Response> => {
  const headers = new Headers();
  const contentType = upstream.headers.get('content-type');
  if (contentType) headers.set('Content-Type', contentType);
  headers.set('Cache-Control', 'no-store');
  headers.set('X-Robots-Tag', 'noindex');
  return new Response(upstream.body, { status: upstream.status, headers });
};

/**
 * Handles any `/api/ai/*` request. Returns `null` when the path is not an AI
 * gateway route so the caller can fall through to its own routing.
 */
export async function handleAiProxy(request: Request, env: ProxyEnv): Promise<Response | null> {
  const url = new URL(request.url);
  const path = url.pathname.replace(/^\/api\/ai\/?/, '');
  if (!url.pathname.startsWith('/api/ai')) return null;

  const keys = getKeys(env);

  // Lightweight capability probe — reports availability, never key material.
  if (path === 'status') {
    return json({
      gemini: Boolean(keys.gemini),
      groq: Boolean(keys.groq),
      openrouter: Boolean(keys.openrouter),
    });
  }

  if (request.method !== 'POST') {
    return json({ error: { message: 'Method not allowed.', code: 405 } }, 405);
  }

  const rawBody = await request.text();
  if (rawBody.length > MAX_BODY_BYTES) {
    return json({ error: { message: 'Payload too large.', code: 413 } }, 413);
  }

  const forward = async (target: string, headers: Record<string, string>) => {
    try {
      const upstream = await fetch(target, { method: 'POST', headers, body: rawBody });
      return await relay(upstream);
    } catch (error) {
      return json(
        {
          error: {
            message: 'Upstream AI provider is unreachable. Please try again shortly.',
            code: 502,
            detail: error instanceof Error ? error.message : 'network error',
          },
        },
        502
      );
    }
  };

  // ---- Google Gemini / Gemma --------------------------------------------
  if (path.startsWith('gemini/models/')) {
    if (!keys.gemini) return missingKey('Google AI');
    const spec = decodeURIComponent(path.slice('gemini/models/'.length));
    const [model, method] = spec.split(':');
    const safeModel = /^[a-zA-Z0-9._-]+$/.test(model || '') && ALLOWED_MODEL_PREFIXES.some(p => model.startsWith(p));
    if (!safeModel || !ALLOWED_MODEL_METHODS.has(method)) {
      return json({ error: { message: 'Unsupported model route.', code: 400 } }, 400);
    }
    return forward(`${GEMINI_BASE}/models/${model}:${method}`, {
      'Content-Type': 'application/json',
      'x-goog-api-key': keys.gemini,
    });
  }

  // ---- Groq --------------------------------------------------------------
  if (path === 'groq/chat/completions') {
    if (!keys.groq) return missingKey('Groq');
    return forward(`${GROQ_BASE}/chat/completions`, {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${keys.groq}`,
    });
  }

  // ---- OpenRouter --------------------------------------------------------
  if (path === 'openrouter/chat/completions') {
    if (!keys.openrouter) return missingKey('OpenRouter');
    return forward(`${OPENROUTER_BASE}/chat/completions`, {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${keys.openrouter}`,
      'HTTP-Referer': 'https://plantdoc.pages.dev',
      'X-Title': 'PlantDoc AI',
    });
  }

  return json({ error: { message: 'Unknown AI gateway route.', code: 404 } }, 404);
}
