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

// -------------------------------------------------------------
// Parallel Segmentation Fetcher using fast gemini-3.5-flash-lite
// -------------------------------------------------------------
async function fetchSpatialSegmentation(
  base64Data: string,
  mimeType: string,
  apiKey: string
): Promise<{ plant_box?: [number, number, number, number]; lesions?: Array<{ label: string; box_2d: [number, number, number, number]; severity: 'low' | 'medium' | 'high' | 'critical'; confidence: number; description?: string }> }> {
  try {
    const promptText = `You are PlantDoc AI Spatial Vision Diagnostics Engine.
Your task is to detect precise 2D bounding boxes for all visible disease lesions, necrotic spots, insect feeding holes, chlorotic halo patches, rust pustules, or powdery mildew on this plant foliage.

CRITICAL ACCURACY & LOCALIZATION RULES:
1. STRICT SPATIAL PRECISION: Every bounding box must tightly wrap the exact perimeter of the specific lesion or hole:
   - ymin: uppermost edge of the infected spot (0 to 1000)
   - xmin: leftmost edge of the infected spot (0 to 1000)
   - ymax: lowermost edge of the infected spot (0 to 1000)
   - xmax: rightmost edge of the infected spot (0 to 1000)
2. INDIVIDUAL LESION DETECTION: If there are multiple separate spots or insect holes, mark EACH ONE individually. NEVER group multiple distinct spots into one large box. Output separate tight boxes for each individual spot (up to 10 distinct spots).
3. NO HEALTHY TISSUE: Never place boxes over clean, healthy green leaf tissue.
4. HEALTHY PLANTS: If the plant specimen is healthy with no disease spots or holes, return "lesions": [].

Output strictly valid JSON:
{
  "plant_box": [ymin, xmin, ymax, xmax],
  "lesions": [
    {
      "label": "Short Symptom Name (e.g. Necrotic Spot, Leaf Hole, Mildew Patch)",
      "box_2d": [ymin, xmin, ymax, xmax],
      "severity": "low" | "medium" | "high" | "critical",
      "confidence": 96.0,
      "description": "Short 1-sentence info about the affected tissue damage (e.g. Necrotic foliar cell death impairing photosynthesis)"
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
        maxOutputTokens: 4096,
        thinkingConfig: {
          thinkingBudget: 1024
        }
      },
      tools: [
        {
          codeExecution: {}
        }
      ]
    };

    const response = await fetch(
      `${API_CONFIG.BASE_URL}/models/${API_CONFIG.SEGMENTATION_MODEL}:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      }
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
    console.warn('Fast segmentation parallel fetch fallback:', err);
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
1. Identify the exact common name and Latin binomial (e.g. Tomato / Solanum lycopersicum).
2. If the specimen is HEALTHY, explicitly set:
   - "disease": { "name": "Healthy Specimen / No Disease Detected", "confidence": 98.0, "severity": "Low", "pathogen_type": "None (Healthy)", "health_score": 98, "recovery_prognosis": 100, "spread_risk": "Low" }
   - "treatment": { "immediate_actions": ["No emergency quarantine required."], "organic_remedies": ["Maintain regular watering and balanced sunlight."], "chemical_treatments": ["No chemical fungicides necessary."], "steps": ["1. Continue regular preventive care", "2. Inspect foliage bi-weekly"], "prevention": ["Maintain optimal spacing and airflow"], "timeline": { "day_1_3": "Routine inspection", "week_1_2": "Regular watering", "month_1": "Apply maintenance fertilizer" } }
3. If DISEASED, pinpoint specific pathogen (Fungal, Bacterial, Viral, Pest, Deficiency).
4. REAL PRODUCT FERTILIZER MANDATE: In "fertilizer_recommendation", you MUST provide a REAL-WORLD commercial product brand name, manufacturer, and exact formulation (e.g. "Miracle-Gro Water Soluble All Purpose Plant Food (24-8-16)", "FoxFarm Grow Big Liquid Concentrate (6-4-4)", "Espoma Organic Garden-tone (3-4-4)", "Osmocote Smart-Release Plant Food (15-9-12)", "Alaska 5-1-1 Liquid Fish Fertilizer", "Jack's Classic 20-20-20 All Purpose", "Down to Earth Organic Bone Meal (3-15-0)"). DO NOT use generic phrases like "rich nitrogen based fertilizer" or "balanced fertilizer". Always include the exact real brand, NPK ratio, and precise mixing dosage (e.g. "Mix 1/2 tablespoon per gallon of water and apply every 14 days around root zone").
5. REAL PRODUCT CHEMICAL TREATMENTS MANDATE: In "treatment.chemical_treatments", you MUST specify real commercial product brand names alongside active chemical ingredients and exact mixing dosages (e.g. "Daconil Fungicide Concentrate (Active: Chlorothalonil 29.6%) — Mix 1.5 tbsp (22ml) per gallon of water and spray foliar surfaces until runoff every 7-10 days", "Bonide Copper Fungicide Spray / Dust (Active: Copper Octanoate 10.0%) — Apply 1.5 fl oz per gallon of water", "Spectracide Immunox Multi-Purpose Fungicide (Active: Myclobutanil 1.55%) — Mix 1 fl oz per gallon", "BioAdvanced 3-in-1 Insect, Disease & Mite Control (Active: Tebuconazole 0.8% + Tau-Fluvalinate 0.61%) — Apply 5 tbsp per gallon", "Monterey Garden Insect Spray (Active: Spinosad 0.5%) — Mix 2 fl oz per gallon"). DO NOT output generic chemical names alone.
6. REAL PRODUCT ORGANIC REMEDIES MANDATE: In "treatment.organic_remedies", you MUST specify real commercial bio-organic product brand names or exact verified biological recipes (e.g. "Southern Ag Triple Action Neem Oil (70% Hydrophobic Extract of Neem Oil) — Mix 2 tbsp per gallon of water with mild soap", "Serenade Garden Disease Control Bio-Fungicide (Active: Bacillus amyloliquefaciens QST 713 strain) — Spray foliar canopy every 7 days", "Monterey Complete Disease Control (Active: Bacillus subtilis) — 1 tbsp per gallon").

CRITICAL: Output ONLY a valid JSON object matching this schema:

{
  "plant": "Common name of the plant (e.g. Tomato, Monstera, Rose)",
  "scientific_name": "Latin botanical name (e.g. Solanum lycopersicum)",
  "family": "Botanical family (e.g. Solanaceae)",
  "accuracy": 96.5,
  "disease": {
    "name": "Precise disease name or 'Healthy / No Disease Detected'",
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
      "symptom": "Yellowing leaf margins with brown necrotic centers",
      "severity": "Moderate"
    }
  ],
  "causes": [
    "Primary pathogen or environmental stress factor",
    "Secondary contributing cultural condition"
  ],
  "treatment": {
    "immediate_actions": [
      "Isolate the plant immediately to prevent cross-contamination",
      "Prune and dispose of severely infected leaves using sanitized shears"
    ],
    "organic_remedies": [
      "Southern Ag Triple Action Neem Oil — Mix 2 tbsp per gallon of water and spray foliar surfaces every 7 days",
      "Serenade Garden Disease Control (Bacillus subtilis bio-fungicide) — Apply in early morning to colonize leaf surface"
    ],
    "chemical_treatments": [
      "Daconil Fungicide Concentrate (Chlorothalonil 29.6%) — Mix 1.5 tbsp per gallon of water and spray foliage thoroughly every 7-10 days",
      "Bonide Liquid Copper Fungicide (Copper Octanoate 10%) — Mix 1.5 fl oz per gallon of water at first symptom onset"
    ],
    "steps": [
      "1. Isolate and prune infected foliage",
      "2. Disinfect pruning tools with 70% isopropyl alcohol",
      "3. Apply targeted organic or chemical antifungal treatment",
      "4. Adjust watering routine to water at the soil base only"
    ],
    "prevention": [
      "Ensure adequate 30-40cm plant spacing for proper airflow",
      "Avoid overhead watering; irrigate in early morning at soil level",
      "Apply organic mulch around the base to prevent soil splash"
    ],
    "timeline": {
      "day_1_3": "Prune infected tissue and isolate plant; apply initial treatment",
      "week_1_2": "Monitor new growth for spot recurrence; repeat foliar spray",
      "month_1": "Assess overall recovery and resume balanced fertilization"
    }
  },
  "fertilizer_recommendation": {
    "type": "Miracle-Gro Water Soluble All Purpose Plant Food (24-8-16) or FoxFarm Grow Big (6-4-4)",
    "application": "Dilute 1/2 tablespoon per gallon of water and apply every 14 days around the root zone to promote foliar recovery",
    "npk_ratio": "24-8-16",
    "soil_ph_advice": "Maintain soil pH between 6.0 and 6.8 for optimal nutrient bioavailability"
  },
  "care_recommendations": [
    "Provide 6-8 hours of bright indirect or filtered direct sunlight",
    "Allow top 2 inches of soil to dry out between waterings",
    "Maintain ambient humidity around 50-60% with good ventilation"
  ],
  "about_plant": {
    "description": "Botanical description of the plant species, growth characteristics, and native habitat",
    "origin": "Native geographic origin and climate zone",
    "common_uses": ["Culinary", "Ornamental", "Medicinal"],
    "growing_conditions": "Preferred soil, light, temperature (18-28°C), and water conditions",
    "toxicity_warning": "Non-toxic to pets / Toxic to cats and dogs if ingested"
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
      temperature: 0.2,
      maxOutputTokens: 8192,
      thinkingConfig: {
        thinkingBudget: 2048
      }
    }
  };

  const response = await fetch(
    `${API_CONFIG.BASE_URL}/models/${API_CONFIG.DIAGNOSIS_MODEL}:generateContent?key=${apiKey}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    console.error(`Diagnosis API failed (${response.status}):`, errorText);
    
    if (response.status === 429) {
      throw new Error("PlantDoc AI quota limit reached. Please wait a few moments and try again.");
    }
    if (response.status === 400) {
      throw new Error("Invalid plant image or unsupported image format. Please upload a clear photo.");
    }
    throw new Error(`Diagnosis request failed (${response.status})`);
  }

  const data = await response.json();
  const candidate = data.candidates?.[0];
  if (!candidate || !candidate.content?.parts) {
    throw new Error('PlantDoc AI returned an empty response. Please re-upload a clear plant photo.');
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
    throw new Error('Could not parse clinical diagnosis structure. Please retry with a well-lit foliage photo.');
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

- Category Filter: "${category}" (e.g. if 'Crops', suggest food/grain/vegetable crops; if 'Fruit', suggest fruit trees/berries; if 'Flower', suggest flowering ornamentals; if 'Herbs', suggest culinary/medicinal herbs; if 'Mix', provide a balanced mix of crops, flowers, and fruits).
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
    "name": "Common Plant Name (e.g. Lavender, Roma Tomato, Dwarf Meyer Lemon)",
    "scientificName": "Accurate Latin botanical binomial (e.g. Lavandula angustifolia, Solanum lycopersicum)",
    "description": "Comprehensive description of the plant and why it thrives in these exact climate parameters in ${locationStr}.",
    "matchScore": 95,
    "sunlight": "Full Sun" | "Partial Shade" | "Full Shade",
    "waterNeeds": "Low" | "Medium" | "High",
    "soilPreference": "${soilType} with pH around ${ph}",
    "growthRate": "Slow" | "Medium" | "Fast",
    "season": "Spring / Summer",
    "careInstructions": [
      "Provide well-draining soil and water at the base",
      "Apply balanced organic fertilizer during early vegetative phase",
      "Prune dead foliage to maintain airflow"
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

    const response = await fetch(
      `${API_CONFIG.BASE_URL}/models/${API_CONFIG.RECOMMENDATION_MODEL}:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      }
    );

    if (!response.ok) {
      if (response.status === 429) {
        throw new Error("Botanical recommendation quota reached. Please retry in a few moments.");
      }
      throw new Error(`Recommendation request failed (${response.status})`);
    }

    const data = await response.json();
    const candidate = data.candidates?.[0];
    if (!candidate || !candidate.content?.parts) {
      throw new Error('Empty recommendation response from PlantDoc AI.');
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
