// PlantDoc AI Configuration
export const API_CONFIG = {
  DIAGNOSIS_MODELS: [
    "gemini-3.7-flash",
    "gemini-3.8-flash",
    "gemini-3.6-flash"
  ] as const,
  DIAGNOSIS_MODEL: "gemini-3.7-flash", // Primary PlantDoc Vision Clinical Pathology Model (Thinking Enabled, Highly Available)
  DIAGNOSIS_SECONDARY_MODEL: "gemini-3.8-flash", // 2nd Model Failover (Thinking Enabled)
  DIAGNOSIS_TERTIARY_MODEL: "gemini-3.6-flash", // 3rd Model Failover

  // Groq Fast Mode Models (Vision Diagnosis)
  GROQ_DIAGNOSIS_MODEL: "qwen/qwen3.8-27b", // Groq Fast Vision Model with max reasoning effort

  // OpenRouter Fast Mode Models (Botanical Recommendation)
  OPENROUTER_RECOMMENDATION_MODEL: "inclusionai/ling-3.0-flash-sante:free", // Primary OpenRouter Free Model
  OPENROUTER_FALLBACK_MODEL: "openrouter/free", // Secondary OpenRouter Free Failover
  OPENROUTER_BASE_URL: "https://openrouter.ai/api/v1",

  SEGMENTATION_MODEL: "gemini-robotics-er-2-preview", // PlantDoc Spatial Embodied Reasoning & Lesion Segmentation (Always Google AI)
  RECOMMENDATION_MODEL: "gemma-4-26b-a4b-it", // Primary Gemma 4 Open Model (with gemma-4-31b-it failover)
  CLIMATE_MODEL: "gemini-3.5-flash-lite", // PlantDoc Fast Climate Model
  // Direct Edge / Cloud Endpoints (100% Serverless SPA)
  GEMINI_BASE_URL: "https://generativelanguage.googleapis.com/v1beta",
  GROQ_BASE_URL: "https://api.groq.com/openai/v1",
  BASE_URL: "https://generativelanguage.googleapis.com/v1beta",
  WIKIMEDIA_USER_AGENT: "PlantDoc/1.0 (https://plantdoc.app; contact@plantdoc.app)",
  
  // Rate limiting policy: max 3 requests per minute
  RATE_LIMIT: {
    MAX_REQUESTS_PER_MINUTE: 3,
    WINDOW_MS: 60 * 1000 // 60 seconds
  },
  
  // Environment API key getters (safe for browser import.meta and Node.js process.env)
  getApiKey: (): string => {
    try {
      const metaEnv = typeof import.meta !== 'undefined' && import.meta ? (import.meta as any).env : undefined;
      const procEnv = typeof process !== 'undefined' && process ? process.env : undefined;
      const key = (metaEnv?.VITE_GEMINI_API_KEY || metaEnv?.GEMINI_API_KEY || procEnv?.VITE_GEMINI_API_KEY || procEnv?.GEMINI_API_KEY || '');
      return String(key).trim();
    } catch {
      return '';
    }
  },

  getGroqApiKey: (): string => {
    try {
      const metaEnv = typeof import.meta !== 'undefined' && import.meta ? (import.meta as any).env : undefined;
      const procEnv = typeof process !== 'undefined' && process ? process.env : undefined;
      const key = (metaEnv?.VITE_GROQ_API_KEY || metaEnv?.GROQ_API_KEY || procEnv?.VITE_GROQ_API_KEY || procEnv?.GROQ_API_KEY || '');
      return String(key).trim();
    } catch {
      return '';
    }
  },

  getOpenRouterApiKey: (): string => {
    try {
      const metaEnv = typeof import.meta !== 'undefined' && import.meta ? (import.meta as any).env : undefined;
      const procEnv = typeof process !== 'undefined' && process ? process.env : undefined;
      const key = (metaEnv?.VITE_OPENROUTER_API_KEY || metaEnv?.OPENROUTER_API_KEY || procEnv?.VITE_OPENROUTER_API_KEY || procEnv?.OPENROUTER_API_KEY || '');
      return String(key).trim();
    } catch {
      return '';
    }
  }
};


