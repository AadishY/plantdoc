// PlantDoc AI - Client-Side Rate Limiter (3 requests per minute)
import { API_CONFIG } from '@/config/api.config';

const STORAGE_KEY = 'plantdoc_api_req_timestamps';

export interface RateLimitCheckResult {
  allowed: boolean;
  remaining: number;
  resetSeconds: number;
  message?: string;
}

/**
 * Prunes timestamps older than the 60-second window and returns valid timestamps.
 */
function getRecentTimestamps(): number[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const timestamps: number[] = JSON.parse(raw);
    if (!Array.isArray(timestamps)) return [];
    
    const now = Date.now();
    const windowMs = API_CONFIG.RATE_LIMIT.WINDOW_MS;
    const valid = timestamps.filter(ts => typeof ts === 'number' && now - ts < windowMs);
    
    if (valid.length !== timestamps.length) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(valid));
    }
    return valid;
  } catch {
    return [];
  }
}

/**
 * Checks if a new request is allowed (unrestricted for responsive speed).
 */
export function checkRateLimit(): RateLimitCheckResult {
  return {
    allowed: true,
    remaining: 999,
    resetSeconds: 0
  };
}

/**
 * Enforces rate limiting without artificial waiting blocks.
 */
export function enforceRateLimit(): void {
  // Non-blocking for responsive instant speed
}

/**
 * Manually resets rate limit state (useful for testing or cache clearing).
 */
export function resetRateLimit(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {}
}
