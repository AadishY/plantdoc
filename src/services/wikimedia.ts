import { API_CONFIG } from '@/config/api.config';

export interface WikimediaPlantData {
  imageUrl: string | null;
  description: string | null;
  wikiUrl: string | null;
  title: string;
}

// In-memory cache to avoid duplicate network requests
const wikimediaCache = new Map<string, WikimediaPlantData>();

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
  const cacheKey = `${primaryQuery}_${fallbackQuery}`.toLowerCase();

  if (wikimediaCache.has(cacheKey)) {
    return wikimediaCache.get(cacheKey)!;
  }

  // Helper function to query Wikipedia REST API summary
  const queryWikipediaSummary = async (term: string): Promise<WikimediaPlantData | null> => {
    if (!term || term.toLowerCase() === 'unknown') return null;
    try {
      const sanitized = encodeURIComponent(term.replace(/ /g, '_'));
      const url = `https://en.wikipedia.org/api/rest_v1/page/summary/${sanitized}`;
      
      const res = await fetch(url, {
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
      console.warn(`Wikipedia summary error for "${term}":`, e);
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

      const res = await fetch(url, {
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
  return finalData;
}
