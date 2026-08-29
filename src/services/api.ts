import { DiagnosisResult } from '@/types/diagnosis';
import { PlantRecommendation, GrowingConditions, PlantCategory } from '@/types/recommendation';
import { toast } from 'sonner';
import { fetchPlantWikimediaData } from './wikimedia';
import { API_CONFIG } from '@/config/api.config';

// Helper to downsample and convert image File to ultra-lightweight WebP base64 (99% payload reduction)
const prepareImageForAPI = async (file: File): Promise<{ mimeType: string, base64Data: string }> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const reader = new FileReader();

    reader.onload = (e) => {
      if (!e.target?.result) {
        reject(new Error("Failed to read image file."));
        return;
      }
      img.src = e.target.result as string;
    };
    reader.onerror = () => reject(new Error("Failed to read image file from disk."));

    img.onload = () => {
      try {
        const MAX_DIMENSION = 1280;
        let width = img.naturalWidth || img.width;
        let height = img.naturalHeight || img.height;

        if (width > MAX_DIMENSION || height > MAX_DIMENSION) {
          if (width > height) {
            height = Math.round((height * MAX_DIMENSION) / width);
            width = MAX_DIMENSION;
          } else {
            width = Math.round((width * MAX_DIMENSION) / height);
            height = MAX_DIMENSION;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          throw new Error("Failed to get canvas context for downsampling.");
        }

        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, 0, 0, width, height);

        // Convert to high-efficiency WebP with JPEG fallback
        let dataUrl = canvas.toDataURL('image/webp', 0.85);
        let mimeType = 'image/webp';

        if (!dataUrl.startsWith('data:image/webp')) {
          dataUrl = canvas.toDataURL('image/jpeg', 0.88);
          mimeType = 'image/jpeg';
        }

        const base64Data = dataUrl.substring(dataUrl.indexOf(',') + 1);
        resolve({ mimeType, base64Data });
      } catch (err) {
        // Fallback to direct file read if canvas downsampling fails
        const base64Url = img.src;
        const mime = base64Url.substring(base64Url.indexOf(':') + 1, base64Url.indexOf(';')) || 'image/jpeg';
        const data = base64Url.substring(base64Url.indexOf(',') + 1);
        resolve({ mimeType: mime, base64Data: data });
      }
    };

    img.onerror = () => reject(new Error("Failed to decode uploaded image data."));
    reader.readAsDataURL(file);
  });
};

// Resilient multi-pass extraction of JSON from model outputs
function extractJsonFromText(text: string): any {
  if (!text) return null;
  const cleaned = text.replace(/```json/gi, '').replace(/```/g, '').trim();

  // 1. Direct JSON parse
  try {
    return JSON.parse(cleaned);
  } catch {}

  // 2. Search for ```json ... ``` blocks
  const codeBlockMatch = text.match(/```(?:json)?\s*([\s\S]*?)\s*```/i);
  if (codeBlockMatch && codeBlockMatch[1]) {
    try {
      return JSON.parse(codeBlockMatch[1].trim());
    } catch {}
  }

  // 3. Outermost [ ... ]
  const firstBracket = cleaned.indexOf('[');
  const lastBracket = cleaned.lastIndexOf(']');
  if (firstBracket !== -1 && lastBracket !== -1 && lastBracket > firstBracket) {
    try {
      return JSON.parse(cleaned.substring(firstBracket, lastBracket + 1));
    } catch {}
  }

  // 4. Outermost { ... }
  const firstBrace = cleaned.indexOf('{');
  const lastBrace = cleaned.lastIndexOf('}');
  if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
    try {
      const obj = JSON.parse(cleaned.substring(firstBrace, lastBrace + 1));
      if (obj.plants && Array.isArray(obj.plants)) return obj.plants;
      if (obj.recommendations && Array.isArray(obj.recommendations)) return obj.recommendations;
      return obj;
    } catch {}
  }

  return null;
}

// Resilient fetch wrapper with generous 45s timeout and automatic retry on network glitches
async function fetchWithTimeout(url: string, options: RequestInit, timeoutMs: number = 45000, retries: number = 1): Promise<Response> {
  for (let attempt = 0; attempt <= retries; attempt++) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal
      });
      clearTimeout(timeoutId);
      if (!response.ok && (response.status >= 500 || response.status === 429) && attempt < retries) {
        await new Promise(r => setTimeout(r, 1200));
        continue;
      }
      return response;
    } catch (error: any) {
      clearTimeout(timeoutId);
      if (attempt < retries) {
        await new Promise(r => setTimeout(r, 1200));
        continue;
      }
      if (error.name === 'AbortError') {
        throw new Error('Connection timed out. Please check your network connection and try again.');
      }
      throw error;
    }
  }
  throw new Error('Network connection issue detected. Please check your internet connection and try again.');
}

// User-friendly error message formatter (replaces raw API quotas with clean actionable messages)
export function formatUserFriendlyError(error: any): string {
  if (!error) return "Diagnosis could not be completed. Please try again.";
  const msg = typeof error === 'string' ? error : (error.message || String(error));
  const lower = msg.toLowerCase();

  // 1. Quota / Rate limit (429) -> Server busy
  if (lower.includes('429') || lower.includes('quota') || lower.includes('rate limit') || lower.includes('resource_exhausted') || lower.includes('exceeded')) {
    return "Our diagnostic AI servers are currently experiencing high request volume. Please wait a few seconds and try again.";
  }

  // 2. Network / Offline / Timeout / Abort
  if (lower.includes('aborted') || lower.includes('timed out') || lower.includes('timeout') || lower.includes('failed to fetch') || lower.includes('network') || lower.includes('offline') || lower.includes('err_connection')) {
    return "Network connection issue detected. Please check your internet connection and try again.";
  }

  // 3. Server errors (500, 502, 503, 504, overloaded)
  if (lower.includes('500') || lower.includes('502') || lower.includes('503') || lower.includes('504') || lower.includes('overloaded') || lower.includes('internal server error') || lower.includes('unavailable')) {
    return "AI diagnostic servers are momentarily busy. Please try again in a few moments.";
  }

  // 4. Bad image (400)
  if (lower.includes('400') || lower.includes('invalid plant image') || lower.includes('image file') || lower.includes('decode uploaded image')) {
    return "Unable to process the foliage image. Please upload a clear, well-lit photo of the plant.";
  }

  // 5. Missing API key
  if (lower.includes('missing api key') || lower.includes('api_key') || lower.includes('vite_gemini_api_key')) {
    return "PlantDoc AI connection is not configured. Please ensure your API key is provided.";
  }

  // 6. Parsing error / Empty response
  if (lower.includes('empty response') || lower.includes('parse') || lower.includes('json')) {
    return "The diagnosis could not be processed. Please ensure the plant leaf is clearly visible and try again.";
  }

  return "Unable to analyze the foliage specimen. Please ensure the leaf is clearly visible in good lighting and try again.";
}

// -------------------------------------------------------------
// Parallel Segmentation Fetcher using fast gemini-3.5-flash-lite
// -------------------------------------------------------------
async function fetchSpatialSegmentation(
  base64Data: string,
  mimeType: string,
  apiKey: string
): Promise<{ plant_box?: [number, number, number, number]; lesions?: Array<{ label: string; box_2d: [number, number, number, number]; severity: 'low' | 'medium' | 'high' | 'critical'; confidence: number; description?: string }> }> {
  try {
    const promptText = `You are PlantDoc AI High-Precision Spatial Vision Diagnostics Engine.
Your task is to detect precise 2D bounding boxes for ALL visible disease lesions, necrotic spots, insect feeding holes, chlorotic halo patches, rust pustules, cercospora/septoria specks, powdery mildew spots, or damaged tissue across this entire plant foliage.

CRITICAL ACCURACY & EXHAUSTIVE MULTI-SPOT COVERAGE RULES:
1. EXHAUSTIVE MULTI-LESION DETECTION: Inspect the entire foliar surface systematically across leaf margins, veins, apex, center, and petioles. If there are multiple small lesions, scattered necrotic spots, insect chew holes, rust pustules, or fungal specks across the leaf, detect and localize ALL of them with separate, individual tight bounding boxes (detect up to 30 distinct spots).
2. DO NOT SKIP SMALL DAMAGE PORTIONS: Every pinpoint lesion, small puncture hole, or minor circular spot must have its own distinct bounding box.
3. NEVER BUNDLE DISTANT SPOTS: Never group multiple separate spots into one large box. Every individual lesion or hole must have its own tight bounding box.
4. STRICT SPATIAL PRECISION: Every bounding box [ymin, xmin, ymax, xmax] must tightly wrap the exact perimeter of the specific lesion or hole:
   - ymin: uppermost edge of the infected spot (0 to 1000)
   - xmin: leftmost edge of the infected spot (0 to 1000)
   - ymax: lowermost edge of the infected spot (0 to 1000)
   - xmax: rightmost edge of the infected spot (0 to 1000)
5. NO HEALTHY TISSUE: Never place boxes over clean, healthy green leaf tissue.
6. HEALTHY PLANTS: If the plant specimen is healthy with no disease spots or holes, return "lesions": [].

Output strictly valid JSON matching this schema:
{
  "plant_box": [ymin, xmin, ymax, xmax],
  "lesions": [
    {
      "label": "Short descriptive symptom name characterizing the foliar defect",
      "box_2d": [ymin, xmin, ymax, xmax],
      "severity": "low" | "medium" | "high" | "critical",
      "confidence": 96.0,
      "description": "Concise single-sentence description of the affected cellular tissue damage and physiological impact"
    }
  ]
}`;

    const payload = {
      contents: [
        {
          parts: [
            { text: promptText },
            {
              inline_data: {
                mime_type: mimeType,
                data: base64Data
              }
            }
          ]
        }
      ],
      generationConfig: {
        temperature: 0.1,
        maxOutputTokens: 8192
      }
    };

    const response = await fetchWithTimeout(
      `${API_CONFIG.BASE_URL}/models/${API_CONFIG.SEGMENTATION_MODEL}:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      },
      30000 // 30s timeout for segmentation
    );

    if (!response.ok) return { lesions: [] };
    const data = await response.json();
    const candidate = data.candidates?.[0];
    if (!candidate?.content?.parts) return { lesions: [] };

    let text = '';
    for (const part of candidate.content.parts) {
      if (part.text && !part.thought) {
        text += part.text + '\n';
      } else if (part.text && !text) {
        text += part.text + '\n';
      }
    }

    const parsed = extractJsonFromText(text);
    if (parsed && Array.isArray(parsed.lesions)) {
      return parsed;
    }
    return { lesions: [] };
  } catch (err) {
    console.warn('Fast segmentation fallback (non-blocking):', err);
    return { lesions: [] };
  }
}

// -------------------------------------------------------------
// Main Clinical Diagnosis Fetcher using gemini-3.6-flash
// -------------------------------------------------------------
async function fetchClinicalDiagnosis(
  base64Data: string,
  mimeType: string,
  apiKey: string
): Promise<any> {
  const promptText = `You are the PlantDoc AI Vision Diagnostics Engine. Analyze the provided plant image thoroughly to identify the plant species, diagnose any diseases or nutritional deficiencies, and produce clinical remediation protocols.

CRITICAL RULES:
1. Identify the exact common vernacular name and full Latin botanical binomial (Genus species).
2. If the specimen is HEALTHY, explicitly set:
   - "disease": { "name": "Healthy Specimen / No Disease Detected", "confidence": 98.0, "severity": "Low", "pathogen_type": "None (Healthy)", "health_score": 98, "recovery_prognosis": 100, "spread_risk": "Low" }
   - "treatment": { "immediate_actions": ["No emergency quarantine required."], "organic_remedies": ["Maintain regular watering and balanced sunlight."], "chemical_treatments": ["No chemical fungicides necessary."], "steps": ["1. Continue regular preventive care", "2. Inspect foliage bi-weekly"], "prevention": ["Maintain optimal spacing and airflow"], "timeline": { "day_1_3": "Routine inspection", "week_1_2": "Regular watering", "month_1": "Apply maintenance fertilizer" } }
3. If DISEASED, pinpoint the specific pathogen classification (Fungal, Bacterial, Viral, Pest / Insect, Nutrient Deficiency, Abiotic Stress).
4. REAL PRODUCT FERTILIZER MANDATE: In "fertilizer_recommendation", provide a real-world commercial retail product brand name with its exact manufacturer, complete NPK macronutrient ratio, and precise mixing dilution instructions for root zone or foliar application. Do not output vague generic terms.
5. REAL PRODUCT CHEMICAL TREATMENTS MANDATE: In "treatment.chemical_treatments", specify real retail commercial fungicide, bactericide, or pesticide brand names, stating the active chemical ingredient, concentration percentage, and exact volumetric mixing dosage per gallon or liter of water with safety intervals.
6. REAL PRODUCT ORGANIC REMEDIES MANDATE: In "treatment.organic_remedies", specify real commercial bio-organic product brand names, biological agents, or verified organic formulations with exact volumetric preparation ratios and application schedules.

CRITICAL: Output ONLY a valid JSON object matching this schema:

{
  "plant": "Common name of the plant",
  "scientific_name": "Full Latin botanical binomial (Genus species)",
  "family": "Botanical family classification",
  "accuracy": 96.5,
  "disease": {
    "name": "Precise pathology disease name or 'Healthy / No Disease Detected'",
    "confidence": 94.0,
    "severity": "Low" | "Medium" | "High" | "Critical",
    "pathogen_type": "Fungal" | "Bacterial" | "Viral" | "Pest / Insect" | "Nutrient Deficiency" | "Abiotic Stress",
    "health_score": 75,
    "recovery_prognosis": 85,
    "spread_risk": "Low" | "Medium" | "High" | "Critical"
  },
  "affected_parts": ["Leaves", "Stem", "Fruit"],
  "symptoms_breakdown": [
    {
      "symptom": "Detailed clinical description of observed foliar discoloration, necrosis, or tissue deformation",
      "severity": "Low" | "Moderate" | "High" | "Severe"
    }
  ],
  "causes": [
    "Primary pathogen etiology or environmental stress factor",
    "Secondary contributing microclimate condition"
  ],
  "treatment": {
    "immediate_actions": [
      "Physical quarantine and environmental isolation instructions",
      "Sanitary pruning procedure with tool disinfection guidelines"
    ],
    "organic_remedies": [
      "OMRI-listed organic brand or bio-fungicide with exact concentration and spraying intervals",
      "Biological control agent or natural foliar treatment recipe"
    ],
    "chemical_treatments": [
      "Commercial retail fungicide or pesticide brand with active ingredient, percentage, and exact dilution per gallon/liter",
      "Protective contact or systemic treatment with application frequency and safety interval"
    ],
    "steps": [
      "1. Immediate physical quarantine and sanitation",
      "2. Disinfection of horticultural tools with 70% alcohol",
      "3. Curative chemical or biological foliar spray application",
      "4. Modification of irrigation method and canopy aeration"
    ],
    "prevention": [
      "Optimal plant spacing distance and airflow requirements",
      "Drip or base irrigation schedule avoiding leaf wetness",
      "Soil mulching and pathogen barrier maintenance"
    ],
    "timeline": {
      "day_1_3": "Initial quarantine, infected tissue pruning, and first treatment application",
      "week_1_2": "Foliar monitoring for lesion recurrence and secondary booster spray",
      "month_1": "Long-term vigor assessment and resumption of balanced fertilization"
    }
  },
  "fertilizer_recommendation": {
    "type": "Specific commercial product brand name with complete NPK grade",
    "application": "Precise dilution ratio and root or foliar application frequency",
    "npk_ratio": "Numerical NPK ratio",
    "soil_ph_advice": "Recommended target soil pH range for optimal nutrient bioavailability"
  },
  "care_recommendations": [
    "Required daily sunlight duration and exposure type",
    "Soil moisture management and irrigation schedule",
    "Ambient relative humidity and temperature range"
  ],
  "about_plant": {
    "description": "Comprehensive botanical profile, morphological characteristics, and ecological adaptations",
    "origin": "Native geographic origin and indigenous climate zone",
    "common_uses": ["Culinary", "Ornamental", "Medicinal", "Agricultural"],
    "growing_conditions": "Ideal substrate composition, thermal envelope, and moisture parameters",
    "toxicity_warning": "Specific pet and livestock toxicity status"
  }
}

Return ONLY the JSON. No markdown commentary.`;

  const payload = {
    contents: [
      {
        parts: [
          { text: promptText },
          {
            inline_data: {
              mime_type: mimeType,
              data: base64Data
            }
          }
        ]
      }
    ],
    generationConfig: {
      temperature: 0.1,
      maxOutputTokens: 8192
    }
  };

  const response = await fetchWithTimeout(
    `${API_CONFIG.BASE_URL}/models/${API_CONFIG.DIAGNOSIS_MODEL}:generateContent?key=${apiKey}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    },
    45000 // 45s timeout
  );

  if (!response.ok) {
    const errorText = await response.text();
    console.error(`Diagnosis API failed (${response.status}):`, errorText);
    
    if (response.status === 429) {
      throw new Error("Our diagnostic AI servers are currently experiencing high request volume. Please wait a few seconds and try again.");
    }
    if (response.status === 400) {
      throw new Error("Unable to process this image. Please upload a clear, well-lit photo of the plant foliage.");
    }
    if (response.status >= 500) {
      throw new Error("AI diagnostic servers are momentarily busy. Please try again in a few moments.");
    }
    throw new Error(`Diagnosis request failed (${response.status})`);
  }

  const data = await response.json();
  const candidate = data.candidates?.[0];
  if (!candidate || !candidate.content?.parts) {
    throw new Error('The diagnosis could not be processed. Please ensure the plant leaf is clearly visible and try again.');
  }

  let fullText = '';
  for (const part of candidate.content.parts) {
    if (part.text && !part.thought) {
      fullText += part.text + '\n';
    } else if (part.text && !fullText) {
      fullText += part.text + '\n';
    }
  }

  const parsed = extractJsonFromText(fullText);
  if (!parsed) {
    console.error('Failed to parse JSON. Raw output:', fullText);
    throw new Error('Unable to analyze the foliage specimen. Please ensure the leaf is clearly visible in good lighting and try again.');
  }

  return parsed;
}

// -------------------------------------------------------------
// Unified diagnosePlant: Concurrent Parallel Execution
// -------------------------------------------------------------
export const diagnosePlant = async (imageFile: File): Promise<DiagnosisResult> => {
  try {
    const apiKey = API_CONFIG.getApiKey();
    if (!apiKey) {
      toast.error('PlantDoc AI is missing VITE_GEMINI_API_KEY in .env');
      throw new Error('Missing API Key in environment. Please add VITE_GEMINI_API_KEY to your .env file.');
    }

    const { mimeType, base64Data } = await prepareImageForAPI(imageFile);

    // Launch BOTH models in parallel:
    // 1. gemini-3.6-flash -> Clinical Diagnosis, Treatment & Pathology
    // 2. gemini-3.5-flash-lite -> Fast Spatial Bounding Box Segmentation (with code execution)
    const [diagnosisRes, segmentationRes] = await Promise.all([
      fetchClinicalDiagnosis(base64Data, mimeType, apiKey),
      fetchSpatialSegmentation(base64Data, mimeType, apiKey)
    ]);

    const parsed = diagnosisRes;
    const segData = segmentationRes;

    const isHealthy = 
      !parsed.disease?.name ||
      parsed.disease.name.toLowerCase().includes('healthy') ||
      parsed.disease.name.toLowerCase().includes('no disease') ||
      parsed.disease.name.toLowerCase().includes('no pathogen') ||
      parsed.disease.severity?.toLowerCase() === 'none';

    // Merge fast segmentation lesion boxes into the main diagnosis result
    const lesions = isHealthy ? [] : (
      (segData && Array.isArray(segData.lesions) && segData.lesions.length > 0)
        ? segData.lesions
        : (parsed.segmentation?.lesions || [])
    );

    const diagnosisResult: DiagnosisResult = {
      plant: parsed.plant || "Identified Plant",
      scientific_name: parsed.scientific_name || parsed.plant || "Botanical Species",
      family: parsed.family || "Plantae",
      accuracy: typeof parsed.accuracy === 'number' ? parsed.accuracy : 95.0,
      disease: {
        name: parsed.disease?.name || (isHealthy ? "Healthy Specimen / No Disease Detected" : "Foliar Anomaly"),
        confidence: typeof parsed.disease?.confidence === 'number' ? parsed.disease.confidence : 92.0,
        severity: parsed.disease?.severity || (isHealthy ? "Low" : "Medium"),
        pathogen_type: parsed.disease?.pathogen_type || (isHealthy ? "None (Healthy)" : "Biological Pathogen"),
        health_score: typeof parsed.disease?.health_score === 'number' ? parsed.disease.health_score : (isHealthy ? 98 : 75),
        recovery_prognosis: typeof parsed.disease?.recovery_prognosis === 'number' ? parsed.disease.recovery_prognosis : (isHealthy ? 100 : 85),
        spread_risk: parsed.disease?.spread_risk || "Low"
      },
      segmentation: {
        plant_name: parsed.plant || "Identified Plant",
        plant_accuracy: typeof parsed.accuracy === 'number' ? parsed.accuracy : 95.0,
        plant_box: (segData.plant_box && segData.plant_box.length === 4
          ? [segData.plant_box[0], segData.plant_box[1], segData.plant_box[2], segData.plant_box[3]]
          : [100, 100, 900, 900]) as [number, number, number, number],
        lesions: lesions as any
      },
      affected_parts: Array.isArray(parsed.affected_parts) ? parsed.affected_parts : ["Leaves"],
      symptoms_breakdown: Array.isArray(parsed.symptoms_breakdown) ? parsed.symptoms_breakdown : [],
      causes: Array.isArray(parsed.causes) && parsed.causes.length > 0 ? parsed.causes : ["Favorable environmental conditions for plant growth."],
      treatment: {
        steps: Array.isArray(parsed.treatment?.steps) ? parsed.treatment.steps : ["Provide optimal environmental care and sunlight."],
        prevention: Array.isArray(parsed.treatment?.prevention) ? parsed.treatment.prevention : ["Maintain regular sanitation and appropriate spacing."],
        immediate_actions: Array.isArray(parsed.treatment?.immediate_actions) ? parsed.treatment.immediate_actions : [],
        organic_remedies: Array.isArray(parsed.treatment?.organic_remedies) ? parsed.treatment.organic_remedies : [],
        chemical_treatments: Array.isArray(parsed.treatment?.chemical_treatments) ? parsed.treatment.chemical_treatments : [],
        timeline: parsed.treatment?.timeline || {
          day_1_3: "Initial inspection and sanitation",
          week_1_2: "Monitor foliar progress",
          month_1: "Resume regular maintenance"
        }
      },
      fertilizer_recommendation: {
        type: parsed.fertilizer_recommendation?.type || "Miracle-Gro Water Soluble All Purpose Plant Food (24-8-16) or FoxFarm Grow Big",
        application: parsed.fertilizer_recommendation?.application || "Dilute 1/2 tbsp per gallon of water and apply every 14 days around root zone",
        npk_ratio: parsed.fertilizer_recommendation?.npk_ratio || "24-8-16",
        soil_ph_advice: parsed.fertilizer_recommendation?.soil_ph_advice || "Optimal pH range 6.0 - 6.8 for root nutrient bioavailability"
      },
      care_recommendations: Array.isArray(parsed.care_recommendations) ? parsed.care_recommendations : ["Ensure adequate sunlight and well-draining soil."],
      about_plant: {
        description: parsed.about_plant?.description || "Specimen information.",
        origin: parsed.about_plant?.origin || "Cultivated worldwide",
        common_uses: Array.isArray(parsed.about_plant?.common_uses) ? parsed.about_plant.common_uses : ["Ornamental"],
        growing_conditions: parsed.about_plant?.growing_conditions || "Moderate light and well-draining soil",
        toxicity_warning: parsed.about_plant?.toxicity_warning || "Check toxicity with local veterinary guidelines."
      }
    };

    return diagnosisResult;
  } catch (error: any) {
    console.error('Error in diagnosePlant:', error);
    throw error;
  }
};

export const getClimateDatabByLocation = async (
  country: string,
  state: string,
  city?: string
): Promise<{ temperature: number, rainfall: number, humidity: number }> => {
  try {
    const apiKey = API_CONFIG.getApiKey();
    if (!apiKey) {
      return { temperature: 24, rainfall: 850, humidity: 65 };
    }

    const promptText = `Provide the typical average annual climate data for:
Location: ${city ? `${city}, ` : ''}${state}, ${country}

Output ONLY a JSON object:
{
  "temperature": <average temperature in Celsius as a number>,
  "rainfall": <average annual rainfall in mm as a number>,
  "humidity": <average relative humidity in % as a number>
}`;

    const payload = {
      contents: [{ parts: [{ text: promptText }] }],
      generationConfig: { temperature: 0.1, maxOutputTokens: 256 }
    };

    const response = await fetch(
      `${API_CONFIG.BASE_URL}/models/${API_CONFIG.CLIMATE_MODEL}:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      }
    );

    if (!response.ok) {
      return { temperature: 24, rainfall: 850, humidity: 65 };
    }

    const data = await response.json();
    const candidate = data.candidates?.[0];
    if (!candidate?.content?.parts) {
      return { temperature: 24, rainfall: 850, humidity: 65 };
    }

    let text = '';
    for (const part of candidate.content.parts) {
      if (part.text) text += part.text + '\n';
    }

    const parsed = extractJsonFromText(text);
    if (parsed && typeof parsed.temperature === 'number') {
      return {
        temperature: parsed.temperature,
        rainfall: parsed.rainfall || 800,
        humidity: parsed.humidity || 65
      };
    }

    return { temperature: 24, rainfall: 850, humidity: 65 };
  } catch (err) {
    console.warn('Fast climate lookup fallback triggered:', err);
    return { temperature: 24, rainfall: 850, humidity: 65 };
  }
};

export const getPlantRecommendations = async (
  conditionsOrTemp: GrowingConditions | number,
  categoryOrRainfall: PlantCategory | string | number = 'Mix',
  hasAutoDetectedOrSoilType?: boolean | string,
  paramPh?: number,
  paramSunlight?: string,
  paramExperience?: string,
  paramPurpose?: string,
  paramCategory: string = 'Mix'
): Promise<PlantRecommendation[]> => {
  try {
    const apiKey = API_CONFIG.getApiKey();
    if (!apiKey) {
      toast.error('PlantDoc AI is missing VITE_GEMINI_API_KEY in .env');
      throw new Error('Missing API Key in environment');
    }

    let temperature = 24;
    let rainfall = 140;
    let humidity = 60;
    let soilType = 'Loamy';
    let ph = 6.5;
    let sunlight = 'Full Sun';
    let category = 'Mix';
    let locationStr = 'Global Temperate';

    if (typeof conditionsOrTemp === 'object') {
      const c = conditionsOrTemp as GrowingConditions;
      temperature = c.temperature;
      rainfall = c.rainfall;
      humidity = c.humidity;
      soilType = c.soilType;
      ph = c.ph;
      sunlight = c.sunlight;
      category = (categoryOrRainfall as string) || 'Mix';
      locationStr = `${c.city ? `${c.city}, ` : ''}${c.state}, ${c.country}`;
    } else {
      temperature = conditionsOrTemp;
      rainfall = typeof categoryOrRainfall === 'number' ? categoryOrRainfall : 140;
      soilType = typeof hasAutoDetectedOrSoilType === 'string' ? hasAutoDetectedOrSoilType : 'Loamy';
      ph = paramPh || 6.5;
      sunlight = paramSunlight || 'Full Sun';
      category = paramCategory || 'Mix';
    }

    const promptText = `You are the PlantDoc AI Botanical Recommendation Engine.
Suggest EXACTLY 6 distinct, thrive-tested plant species suited for these environmental conditions and category:

- Category Filter: "${category}" (When 'Crops', provide food and vegetable crops; when 'Fruit', provide fruit trees and berry bushes; when 'Flower', provide flowering ornamentals; when 'Herbs', provide culinary and medicinal herbs; when 'Mix', provide a balanced blend).
- Geographic Region: ${locationStr}
- Average Temperature: ${temperature}°C
- Annual Rainfall: ${rainfall}mm
- Humidity Level: ${humidity}%
- Soil Type: ${soilType}
- Soil pH: ${ph}
- Sunlight Exposure: ${sunlight}

Output ONLY a JSON array of 6 objects matching this schema:
[
  {
    "id": "plant-1",
    "name": "Widely recognized common vernacular plant name",
    "scientificName": "Accurate Latin botanical binomial (Genus species)",
    "description": "Comprehensive agronomic profile detailing why this species thrives under these exact temperature, rainfall, and soil parameters in ${locationStr}.",
    "matchScore": 95,
    "sunlight": "Full Sun" | "Partial Shade" | "Full Shade",
    "waterNeeds": "Low" | "Medium" | "High",
    "soilPreference": "${soilType} with pH around ${ph}",
    "growthRate": "Slow" | "Medium" | "Fast",
    "season": "Spring / Summer",
    "careInstructions": [
      "Substrate preparation and moisture management guideline",
      "Macro-nutrient fertilization schedule during vegetative and reproductive phases",
      "Canopy maintenance and pest prevention procedure"
    ],
    "compatibilityReason": "Thrives in ${temperature}°C temperatures and ${rainfall}mm rainfall conditions in ${locationStr}."
  }
]

Do not return placeholder images. Real photos will be fetched from Wikimedia API using scientificName.
Return ONLY the JSON array.`;

    const payload = {
      contents: [{ parts: [{ text: promptText }] }],
      generationConfig: {
        temperature: 0.3,
        maxOutputTokens: 4096
      }
    };

    const response = await fetchWithTimeout(
      `${API_CONFIG.BASE_URL}/models/${API_CONFIG.RECOMMENDATION_MODEL}:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      },
      45000 // 45s timeout
    );

    if (!response.ok) {
      if (response.status === 429) {
        throw new Error("Our botanical recommendation servers are currently experiencing high request volume. Please wait a few seconds and try again.");
      }
      if (response.status >= 500) {
        throw new Error("AI recommendation servers are momentarily busy. Please try again in a few moments.");
      }
      throw new Error(`Recommendation request failed (${response.status})`);
    }

    const data = await response.json();
    const candidate = data.candidates?.[0];
    if (!candidate || !candidate.content?.parts) {
      throw new Error('No recommendation data returned. Please try adjusting your parameters.');
    }

    let fullText = '';
    for (const part of candidate.content.parts) {
      if (part.text) fullText += part.text + '\n';
    }

    const parsedArray = extractJsonFromText(fullText);

    if (!Array.isArray(parsedArray) || parsedArray.length === 0) {
      console.error('Model did not return a valid plant recommendation array. Raw output:', fullText);
      throw new Error('Model did not return a valid plant recommendation array');
    }

    // Attach Wikimedia images & summaries in parallel
    const enrichedPlants = await Promise.all(
      parsedArray.map(async (p: any, idx: number) => {
        const sciName = p.scientificName || p.name;
        const wikiData = await fetchPlantWikimediaData(sciName, p.name);

        const imageUrl = wikiData?.imageUrl || '';
        const wikipediaUrl = wikiData?.wikiUrl || `https://en.wikipedia.org/wiki/${encodeURIComponent(sciName.replace(/ /g, '_'))}`;
        const searchSeedUrl = `https://www.google.com/search?q=${encodeURIComponent(`${p.name} ${sciName} seeds buy online`)}`;

        return {
          id: p.id || `plant-${idx + 1}`,
          name: p.name,
          scientificName: sciName,
          description: wikiData?.description || p.description,
          matchScore: typeof p.matchScore === 'number' ? p.matchScore : 90,
          sunlight: p.sunlight || 'Full Sun',
          waterNeeds: p.waterNeeds || 'Medium',
          soilPreference: p.soilPreference || `${soilType} (pH ${ph})`,
          growthRate: p.growthRate || 'Medium',
          growthTime: p.growthTime || p.growthRate || '90-120 days',
          season: p.season || 'Spring / Summer',
          imageUrl: imageUrl,
          careInstructions: Array.isArray(p.careInstructions) ? p.careInstructions : ['Provide adequate sunlight and water regularly.'],
          compatibilityReason: p.compatibilityReason || 'Well-matched to local climate conditions.',
          wikiUrl: wikipediaUrl,
          wikipediaUrl: wikipediaUrl,
          searchSeedUrl: searchSeedUrl
        } as PlantRecommendation;
      })
    );

    return enrichedPlants;
  } catch (error: any) {
    console.error('Error in getPlantRecommendations:', error);
    throw error;
  }
};
