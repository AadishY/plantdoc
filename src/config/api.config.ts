// PlantDoc AI Configuration
export const API_CONFIG = {
  DIAGNOSIS_MODEL: "gemini-3.6-flash", // PlantDoc Vision Clinical Diagnosis Model
  SEGMENTATION_MODEL: "gemini-3.5-flash-lite", // PlantDoc Fast Spatial Lesion Segmentation Model
  RECOMMENDATION_MODEL: "gemini-3.6-flash", // PlantDoc Botanical Recommendation Model
  CLIMATE_MODEL: "gemini-3.5-flash-lite", // PlantDoc Fast Climate Model
  BASE_URL: "https://generativelanguage.googleapis.com/v1beta",
  WIKIMEDIA_USER_AGENT: "PlantDoc/1.0 (https://plantdoc.app; contact@plantdoc.app)",
  
  // Environment API key getter
  getApiKey: (): string => {
    return (import.meta.env.VITE_GEMINI_API_KEY || '').trim();
  }
};
