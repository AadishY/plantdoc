import { API_CONFIG } from '@/config/api.config';
import { fetchPublicWithRetry } from '@/utils/network';

export interface WikimediaPlantData {
  imageUrl: string | null;
  description: string | null;
  wikiUrl: string | null;
  title: string;
}

// Keep small botanical summaries across route changes and browser sessions.
// A bounded TTL prevents stale taxonomy/media links from living forever while
// avoiding repeat requests when a user revisits recommendations on mobile.
const wikimediaCache = new Map<string, WikimediaPlantData>();
const WIKIMEDIA_CACHE_TTL_MS = 7 * 24 * 60 * 60 * 1000;

interface WikimediaCacheEntry {
  cachedAt: number;
  data: WikimediaPlantData;
}

function readPersistentCache(key: string): WikimediaPlantData | null {
  for (const storage of [window.localStorage, window.sessionStorage]) {
    try {
      const raw = storage.getItem(key);
      if (!raw) continue;
      const parsed = JSON.parse(raw) as Partial<WikimediaCacheEntry> & WikimediaPlantData;

      // Accept the previous session-only shape once, then rewrite it below.
      if (typeof parsed.cachedAt !== 'number' && typeof parsed.title === 'string') {
        return parsed as WikimediaPlantData;
      }
      if (
        typeof parsed.cachedAt === 'number' &&
        parsed.data &&
        Date.now() - parsed.cachedAt < WIKIMEDIA_CACHE_TTL_MS
      ) {
        return parsed.data;
      }
      storage.removeItem(key);
    } catch {
      // Storage can be unavailable or contain malformed data in private mode.
    }
  }
  return null;
}

function writePersistentCache(key: string, data: WikimediaPlantData) {
  const entry: WikimediaCacheEntry = { cachedAt: Date.now(), data };
  for (const storage of [window.localStorage, window.sessionStorage]) {
    try {
      storage.setItem(key, JSON.stringify(entry));
    } catch {
      // Non-blocking: the in-memory cache still prevents duplicate requests.
    }
  }
}

/**
 * Fetch verified real plant image and details from Wikimedia / Wikipedia API.
 * Uses scientific (Latin) name first for exact botanical matching, then falls back to common name.
 */
export async function fetchPlantWikimediaData(
  scientificName: string,
  commonName?: string
): Promise<WikimediaPlantData> {
  const primaryQuery = (scientificName || '').trim();
  const fallbackQuery = (commonName || '').trim();
  const cacheKey = `wiki_${primaryQuery}_${fallbackQuery}`.toLowerCase().replace(/[^a-z0-9_]/g, '');

  if (wikimediaCache.has(cacheKey)) {
    return wikimediaCache.get(cacheKey)!;
  }

  if (typeof window !== 'undefined') {
    const persisted = readPersistentCache(cacheKey);
    if (persisted) {
      wikimediaCache.set(cacheKey, persisted);
      return persisted;
    }
  }

  // Helper function to query Wikipedia REST API summary
  const queryWikipediaSummary = async (term: string): Promise<WikimediaPlantData | null> => {
    if (!term || term.toLowerCase() === 'unknown') return null;
    try {
      const sanitized = encodeURIComponent(term.replace(/ /g, '_'));
      const url = `https://en.wikipedia.org/api/rest_v1/page/summary/${sanitized}`;
      
      const res = await fetchPublicWithRetry(url, {
        headers: {
          'Api-User-Agent': API_CONFIG.WIKIMEDIA_USER_AGENT,
          'Accept': 'application/json'
        }
      });

      if (res.ok) {
        const data = await res.json();
        // Ignore disambiguation pages
        if (data.type === 'disambiguation') return null;

        const imageUrl = data.thumbnail?.source || data.originalimage?.source || null;
        const description = data.extract || null;
        const wikiUrl = data.content_urls?.desktop?.page || null;

        if (imageUrl || description) {
          return {
            imageUrl,
            description,
            wikiUrl: wikiUrl || `https://en.wikipedia.org/wiki/${sanitized}`,
            title: data.title || term
          };
        }
      }
    } catch (e) {
      // Non-blocking fallback
    }
    return null;
  };

  // Helper function to search Wikipedia via MediaWiki API generator
  const searchWikipediaMedia = async (term: string): Promise<WikimediaPlantData | null> => {
    if (!term || term.toLowerCase() === 'unknown') return null;
    try {
      const url = `https://en.wikipedia.org/w/api.php?action=query&generator=search&gsrsearch=${encodeURIComponent(
        term + ' plant'
      )}&gsrlimit=1&prop=pageimages|extracts&exintro&explaintext&exchars=250&pithumbsize=600&format=json&origin=*`;

      const res = await fetchPublicWithRetry(url, {
        headers: {
          'Api-User-Agent': API_CONFIG.WIKIMEDIA_USER_AGENT
        }
      });

      if (res.ok) {
        const data = await res.json();
        if (data.query?.pages) {
          const page = Object.values(data.query.pages)[0] as any;
          if (page && (page.thumbnail?.source || page.extract)) {
            return {
              imageUrl: page.thumbnail?.source || null,
              description: page.extract || null,
              wikiUrl: page.pageid ? `https://en.wikipedia.org/?curid=${page.pageid}` : null,
              title: page.title || term
            };
          }
        }
      }
    } catch (e) {
      console.warn(`Wikipedia search error for "${term}":`, e);
    }
    return null;
  };

  // Execution pipeline:
  // 1. Exact scientific name summary
  let result: WikimediaPlantData | null = null;
  if (primaryQuery) {
    result = await queryWikipediaSummary(primaryQuery);
  }

  // 2. Exact common name summary
  if (!result?.imageUrl && fallbackQuery) {
    result = await queryWikipediaSummary(fallbackQuery);
  }

  // 3. MediaWiki search with scientific name
  if (!result?.imageUrl && primaryQuery) {
    const searchRes = await searchWikipediaMedia(primaryQuery);
    if (searchRes) {
      result = {
        imageUrl: searchRes.imageUrl || result?.imageUrl || null,
        description: result?.description || searchRes.description,
        wikiUrl: result?.wikiUrl || searchRes.wikiUrl,
        title: result?.title || searchRes.title
      };
    }
  }

  // 4. MediaWiki search with common name
  if (!result?.imageUrl && fallbackQuery) {
    const searchRes = await searchWikipediaMedia(fallbackQuery);
    if (searchRes) {
      result = {
        imageUrl: searchRes.imageUrl || result?.imageUrl || null,
        description: result?.description || searchRes.description,
        wikiUrl: result?.wikiUrl || searchRes.wikiUrl,
        title: result?.title || searchRes.title
      };
    }
  }

  const finalData: WikimediaPlantData = result || {
    imageUrl: null,
    description: null,
    wikiUrl: primaryQuery
      ? `https://en.wikipedia.org/wiki/${encodeURIComponent(primaryQuery)}`
      : null,
    title: primaryQuery || fallbackQuery || 'Plant'
  };

  wikimediaCache.set(cacheKey, finalData);
  if (typeof window !== 'undefined') writePersistentCache(cacheKey, finalData);
  return finalData;
}
