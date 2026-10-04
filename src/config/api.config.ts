// PlantDoc AI Configuration
//
// SECURITY: no provider API key is ever shipped to the browser. All model
// traffic goes through the same-origin AI gateway (`/api/ai/*`), implemented by
// `functions/api/ai/[[path]].ts` on Cloudflare Pages and by
// `server/viteAiProxyPlugin.ts` during local development. The gateway attaches
// the secret server-side, so the network tab only ever shows relative URLs.
export const AI_GATEWAY = {
  GEMINI: '/api/ai/gemini',
  GROQ: '/api/ai/groq',
  OPENROUTER: '/api/ai/openrouter',
  STATUS: '/api/ai/status',
} as const;

export interface AiProviderAvailability {
  gemini: boolean;
  groq: boolean;
  openrouter: boolean;
}

let availabilityPromise: Promise<AiProviderAvailability> | null = null;

export const API_CONFIG = {
  DIAGNOSIS_MODELS: [
    "gemini-3.6-flash",
    "gemini-3.7-flash",
    "gemini-3.8-flash"
  ] as const,
  DIAGNOSIS_MODEL: "gemini-3.6-flash", // Primary PlantDoc Vision Clinical Pathology Model (Fast Response)
  DIAGNOSIS_SECONDARY_MODEL: "gemini-3.7-flash", // 2nd Model Failover (Thinking Enabled)
  DIAGNOSIS_TERTIARY_MODEL: "gemini-3.8-flash", // 3rd Model Failover (Thinking Enabled)

  // Groq Fast Mode Models (Vision Diagnosis)
  GROQ_DIAGNOSIS_MODEL: "qwen/qwen3.8-27b", // Groq Fast Vision Model with max reasoning effort

  // OpenRouter Fast Mode Models (Botanical Recommendation)
  OPENROUTER_RECOMMENDATION_MODELS: [
    "inclusionai/ling-3.0-flash-sante:free", // Primary: High-speed biological & botanical specialist (~6-10s)
    "nex-agi/nex-n2.5-mini:free",            // Secondary Failover: Ultra-fast general LLM (~3s)
    "liquid/lfm-2.5-2.6b:free",              // Tertiary Failover: Fast lightweight LLM (~8s)
    "dots-studio/dots-3-note-preview:free"   // Quaternary Failover: Deep reasoning model
  ] as const,
  OPENROUTER_RECOMMENDATION_MODEL: "inclusionai/ling-3.0-flash-sante:free",
  OPENROUTER_BASE_URL: AI_GATEWAY.OPENROUTER,

  SEGMENTATION_MODEL: "gemini-robotics-er-2-preview", // PlantDoc Spatial Lesion Segmentation (vision + bounding boxes)
  RECOMMENDATION_MODELS: [
    "gemma-4-26b-a4b-it",
    "gemini-3.5-flash-lite",
    "gemini-2.5-flash",
    "gemma-4-31b-it"
  ] as const,
  RECOMMENDATION_MODEL: "gemma-4-26b-a4b-it", // Primary Gemma 4 Open Model (with Gemini 3.5 & 2.5 fast failover cascade)
  CLIMATE_MODEL: "gemini-3.5-flash-lite", // PlantDoc Fast Climate Model

  // Same-origin gateway endpoints (keys stay on the server)
  GEMINI_BASE_URL: AI_GATEWAY.GEMINI,
  GROQ_BASE_URL: AI_GATEWAY.GROQ,
  BASE_URL: AI_GATEWAY.GEMINI,
  WIKIMEDIA_USER_AGENT: "PlantDoc/1.0 (https://plantdoc.app; contact@plantdoc.app)",

  /**
   * Asks the gateway which providers are configured. The response contains
   * booleans only — never key material. Cached for the page lifetime.
   */
  getProviderAvailability: (): Promise<AiProviderAvailability> => {
    if (!availabilityPromise) {
      availabilityPromise = fetch(AI_GATEWAY.STATUS, { headers: { Accept: 'application/json' } })
        .then(res => (res.ok ? res.json() : null))
        .then((data: Partial<AiProviderAvailability> | null) => ({
          // Assume available when the probe itself fails, so a transient status
          // hiccup never blocks a diagnosis the gateway could have served.
          gemini: data?.gemini ?? true,
          groq: data?.groq ?? true,
          openrouter: data?.openrouter ?? true,
        }))
        .catch(() => ({ gemini: true, groq: true, openrouter: true }));
    }
    return availabilityPromise;
  }
};
