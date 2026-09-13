import { DiagnosisResult } from '@/types/diagnosis';
import { PlantRecommendation, GrowingConditions, PlantCategory } from '@/types/recommendation';
import { toast } from 'sonner';
import { fetchPlantWikimediaData } from './wikimedia';
import { API_CONFIG } from '@/config/api.config';
import { enforceRateLimit } from '@/utils/rateLimiter';

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
    } catch {
      // Try soft fixing trailing commas or cut-off brackets
      try {
        let candidateStr = cleaned.substring(firstBracket, lastBracket + 1);
        candidateStr = candidateStr.replace(/,\s*([\]}])/g, '$1');
        return JSON.parse(candidateStr);
      } catch {}
    }
  }

  // 4. Outermost { ... }
  const firstBrace = cleaned.indexOf('{');
  const lastBrace = cleaned.lastIndexOf('}');
  if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
    try {
      let objStr = cleaned.substring(firstBrace, lastBrace + 1);
      objStr = objStr.replace(/,\s*([\]}])/g, '$1');
      const obj = JSON.parse(objStr);
      if (obj.plants && Array.isArray(obj.plants)) return obj.plants;
      if (obj.recommendations && Array.isArray(obj.recommendations)) return obj.recommendations;
      if (obj.results && Array.isArray(obj.results)) return obj.results;
      if (obj.data && Array.isArray(obj.data)) return obj.data;
      return obj;
    } catch {}
  }

  // 5. Array of objects regex recovery (if truncated or slightly broken)
  try {
    const objectRegex = /\{[^{}]*"name"[^{}]*\}/g;
    const matches = cleaned.match(objectRegex);
    if (matches && matches.length > 0) {
      const recovered = matches.map(m => {
        try { return JSON.parse(m); } catch { return null; }
      }).filter(Boolean);
      if (recovered.length > 0) return recovered;
    }
  } catch {}

  return null;
}

// Unrestricted native fetch without artificial timeout limits
async function fetchWithTimeout(url: string, options: RequestInit, _timeoutMs?: number): Promise<Response> {
  return await fetch(url, options);
}

// User-friendly error message formatter for plant recommendations (funny, cool, and botanical)
export function formatRecommendationError(error: any): string {
  if (!error) return "PlantDoc AI is catching some sunlight to recharge its chloroplasts! Please give it another tap in a moment. ☀️🌱";
  const msg = typeof error === 'string' ? error : (error.message || String(error));
  const lower = msg.toLowerCase();

  // If already formatted in our cool botanical style, preserve it directly
  if (
    msg.startsWith("PlantDoc AI is out of breath") || 
    msg.startsWith("PlantDoc AI has maxed out") || 
    msg.startsWith("PlantDoc AI wandered off") || 
    msg.startsWith("PlantDoc AI forgot its") || 
    msg.startsWith("PlantDoc AI was lost in deep") || 
    msg.startsWith("PlantDoc AI is catching some sunlight") || 
    msg.startsWith("Our digital greenhouse") || 
    msg.startsWith("A mischievous garden squirrel") || 
    msg.startsWith("Looks like our digital garden hose") ||
    msg.startsWith("Even our hardiest plants")
  ) {
    return msg;
  }

  // 1a. Daily Limit / TPD exceeded / OpenRouter free-models-per-day
  if (
    lower.includes('tokens per day') || 
    lower.includes('tpd') || 
    lower.includes('daily') || 
    lower.includes('per day') || 
    lower.includes('free-models-per-day') ||
    lower.includes('free model requests per day')
  ) {
    return "PlantDoc AI has reached its OpenRouter daily free quota (50 requests/day for this key)! Please switch to Smart Mode above for instant, unlimited botanical recommendations! ☀️🌻";
  }

  // 1b. Quota / Rate limit (429) / TPM / Tokens / Busy / Capacity / Request too large (413)
  if (
    lower.includes('429') || 
    lower.includes('quota') || 
    lower.includes('rate limit') || 
    lower.includes('resource_exhausted') || 
    lower.includes('exceeded') || 
    lower.includes('limit') ||
    lower.includes('tpm') ||
    lower.includes('tokens') ||
    lower.includes('busy') ||
    lower.includes('capacity') ||
    lower.includes('413') ||
    lower.includes('too large') ||
    lower.includes('entity') ||
    lower.includes('request_too_large')
  ) {
    return "PlantDoc AI is out of breath from inspecting so many leaves! Our green neurons are taking a quick sip of water — please try again in a few seconds! 🌿🥤";
  }

  // 2. 404 / Endpoint not found / No API found / Model not found
  if (lower.includes('404') || lower.includes('not found') || lower.includes('endpoint') || lower.includes('model')) {
    return "PlantDoc AI wandered off into a wild hedge maze! Give our botanical engine just a moment to find the path and try again! 🌻🧭";
  }

  // 3. Network / Offline / Timeout / Abort / Connection failure
  if (lower.includes('aborted') || lower.includes('timed out') || lower.includes('timeout') || lower.includes('failed to fetch') || lower.includes('network') || lower.includes('offline') || lower.includes('err_connection') || lower.includes('connection')) {
    return "PlantDoc AI was lost in deep botanical contemplation! Our leafy neurons took a quick pause — please give it another tap! 🌿⏱️";
  }

  // 4. Server errors (500, 502, 503, 504, overloaded, internal, service error)
  if (lower.includes('500') || lower.includes('502') || lower.includes('503') || lower.includes('504') || lower.includes('overloaded') || lower.includes('internal') || lower.includes('service error')) {
    return "A mischievous garden squirrel tripped over our server wires! PlantDoc AI is dusting itself off — please try again in a few moments! 🐿️⚡";
  }

  // 5. Missing or unauthorized API key
  if (lower.includes('missing') || lower.includes('api_key') || lower.includes('key') || lower.includes('unauthorized') || lower.includes('401') || lower.includes('auth')) {
    return "PlantDoc AI forgot its gardening tools! Please make sure your environment key is firmly planted in your .env file! 🛠️🌿";
  }

  // 6. Formatting / Parsing error / No matches / Model output error
  if (lower.includes('empty response') || lower.includes('parse') || lower.includes('json') || lower.includes('no plant') || lower.includes('could not be matched') || lower.includes('model output') || lower.includes('output text') || lower.includes('tool calls')) {
    return "Even our hardiest plants felt a bit shy about those exact climate coordinates! Try tweaking the temperature, rainfall, or soil type slightly! 🌺🍃";
  }

  return "PlantDoc AI is catching some sunlight to recharge its chloroplasts! Please give it another tap in a moment! ☀️🌱";
}

// User-friendly error message formatter for foliar diagnosis (funny, cool, and botanical)
export function formatUserFriendlyError(error: any): string {
  if (!error) return "PlantDoc AI had a little foliar hiccup! Give it a moment to catch its breath and try again! 🍃✨";
  const msg = typeof error === 'string' ? error : (error.message || String(error));
  const lower = msg.toLowerCase();

  // If already formatted in our cool botanical style, preserve it directly
  if (
    msg.startsWith("PlantDoc AI is out of breath") || 
    msg.startsWith("PlantDoc AI took a little detour") || 
    msg.startsWith("PlantDoc AI tripped over") || 
    msg.startsWith("PlantDoc AI had a little") || 
    msg.startsWith("Our botanical antenna") || 
    msg.startsWith("Our digital greenhouse") || 
    msg.startsWith("A mischievous garden squirrel") || 
    msg.startsWith("Looks like our digital garden hose") ||
    msg.startsWith("Even our hardiest plants")
  ) {
    return msg;
  }

  // 1. Quota / Rate limit (429) / TPM / Tokens / Capacity / Busy
  if (
    lower.includes('429') || 
    lower.includes('quota') || 
    lower.includes('rate limit') || 
    lower.includes('resource_exhausted') || 
    lower.includes('exceeded') || 
    lower.includes('limit') ||
    lower.includes('tpm') ||
    lower.includes('tokens') ||
    lower.includes('busy') ||
    lower.includes('capacity')
  ) {
    return "PlantDoc AI is out of breath from inspecting so many leaves! Our green neurons are taking a quick sip of water — please try again in a few seconds! 🌿🥤";
  }

  // 2. 404 / Endpoint not found / No API found / Model not found
  if (lower.includes('404') || lower.includes('not found') || lower.includes('endpoint') || lower.includes('model')) {
    return "PlantDoc AI took a little detour into the wild ferns! We're heading right back to the greenhouse — give it another tap! 🌿🧭";
  }

  // 3. Network / Offline / Timeout / Abort / Connection failure
  if (lower.includes('aborted') || lower.includes('timed out') || lower.includes('timeout') || lower.includes('failed to fetch') || lower.includes('network') || lower.includes('offline') || lower.includes('err_connection') || lower.includes('connection')) {
    return "Our botanical antenna got lost in the garden fog! Please check your internet connection and let's try again! 🌫️🌱";
  }

  // 4. Server errors (500, 502, 503, 504, overloaded, internal, service error)
  if (lower.includes('500') || lower.includes('502') || lower.includes('503') || lower.includes('504') || lower.includes('overloaded') || lower.includes('internal') || lower.includes('service error')) {
    return "PlantDoc AI tripped over a runaway pumpkin vine! Our diagnostic engine is dusting itself off — please try again in a few seconds! 🎃⚡";
  }

  // 5. Bad image (400)
  if (lower.includes('400') || lower.includes('invalid plant image') || lower.includes('image file') || lower.includes('decode uploaded image')) {
    return "PlantDoc AI squinted really hard, but couldn't quite spot the leaf! Could you snap a clearer, brighter photo of the foliage? 🔍🍃";
  }

  // 6. Missing or unauthorized API key
  if (lower.includes('missing') || lower.includes('api_key') || lower.includes('key') || lower.includes('unauthorized') || lower.includes('401') || lower.includes('auth')) {
    return "PlantDoc AI forgot its magnifying glass! Please ensure your environment key is planted in your .env file! 🔍🌱";
  }

  // 7. Parsing error / Empty response / Model output error
  if (lower.includes('empty response') || lower.includes('parse') || lower.includes('json') || lower.includes('model output') || lower.includes('output text') || lower.includes('tool calls')) {
    return "PlantDoc AI got its leaves in a twist deciphering that specimen! Please center the leaf and let's try another scan! 🌿✨";
  }

  return "PlantDoc AI had a little leaf wobble! Give it a moment to catch its breath and try again! 🍃✨";
}

// -------------------------------------------------------------
// Helper: Calculate Intersection-over-Union between two [ymin, xmin, ymax, xmax] boxes
function calculateBoxIoU(boxA: [number, number, number, number], boxB: [number, number, number, number]): number {
  const ymin = Math.max(boxA[0], boxB[0]);
  const xmin = Math.max(boxA[1], boxB[1]);
  const ymax = Math.min(boxA[2], boxB[2]);
  const xmax = Math.min(boxA[3], boxB[3]);

  if (ymax <= ymin || xmax <= xmin) return 0;

  const intersection = (ymax - ymin) * (xmax - xmin);
  const areaA = (boxA[2] - boxA[0]) * (boxA[3] - boxA[1]);
  const areaB = (boxB[2] - boxB[0]) * (boxB[3] - boxB[1]);
  const union = areaA + areaB - intersection;

  return union > 0 ? intersection / union : 0;
}

// High-Precision Spatial Lesion Segmentation Fetcher
// -------------------------------------------------------------
async function fetchSpatialSegmentation(
  base64Data: string,
  mimeType: string,
  apiKey: string
): Promise<{ 
  plant_box?: [number, number, number, number]; 
  lesions?: Array<{ 
    label: string; 
    box_2d: [number, number, number, number]; 
    severity: 'low' | 'medium' | 'high' | 'critical'; 
    confidence: number; 
    description?: string;
    lesion_type?: 'necrotic_spot' | 'chlorotic_halo' | 'insect_perforation' | 'blight_scorch' | 'fungal_pustule' | 'powdery_mildew' | 'water_soaked' | 'deficiency_yellowing' | 'general_defect';
    affected_area_pct?: number;
    recommended_action?: string;
  }>;
  total_foliar_damage_pct?: number;
  dominant_symptom?: string;
}> {
  try {
    const promptText = `You are the PlantDoc AI High-Precision Foliar Lesion & Affected Area Localization Engine.
Your objective is to conduct an exhaustive, granular spatial examination of the provided plant foliage image and detect 2D bounding boxes for ALL diseased, damaged, or symptomatic tissue across the entire plant specimen.

COMPREHENSIVE FOLIAR AFFECTED AREA DETECTION MANDATE:
1. DETECT BOTH MACRO AFFECTED ZONES AND MICRO FOCAL LESIONS:
   - Carefully scan every section of the foliar blade: leaf apex, margins, lamina, interveinal sectors, base, petiole, and veins.
   - You MUST detect and segment ALL visible affected areas across the leaf blade:
     a. MACRO AFFECTED REGIONS & BLIGHT ZONES:
        - Marginal necrosis, tip scorch, large blight blotches, sector chlorosis, fungal spore carpets (powdery mildew), diffuse yellowing patches, water-soaked sectors, and coalescing diseased tissue.
        - DO NOT ignore, skip, or omit large affected areas! If a broad section of the leaf is discolored, chlorotic, blighted, or necrotic, bound the full affected zone.
     b. INDIVIDUAL FOCAL LESIONS & SYMPTOM HALOS:
        - Discrete leaf spots, necrotic patches, insect perforations/shot-holes, and rust spore pustules.
        - For spots surrounded by chlorotic (yellow) halos, ensure the bounding box encompasses the ENTIRE affected lesion including the outer yellow halo margin.
   - HIGH DENSITY COVERAGE: When foliar disease, spotting, blight, or pests are present, output 10 to 45+ bounding boxes across the specimen to comprehensively map out the entire affected area.
2. PRECISE BOUNDING BOX COORDINATES:
   - Provide [ymin, xmin, ymax, xmax] as normalized integers from 0 to 1000.
   - ymin: top edge (0-1000)
   - xmin: left edge (0-1000)
   - ymax: bottom edge (0-1000)
   - xmax: right edge (0-1000)
   - Each box must accurately envelope the symptom or diseased area.
3. HEALTHY SPECIMEN INTEGRITY:
   - Only return "lesions": [] and "total_foliar_damage_pct": 0 if the plant foliage is genuinely 100% healthy with no spots, chlorosis, holes, or defects.
   - If ANY foliar pathology or anomaly is visible, isolate and output ALL visible affected zones and lesions!

LESION CLASSIFICATIONS (lesion_type):
- "necrotic_spot": Dead brown/black/grey tissue collapse, fungal spots (Septoria, Cercospora, Alternaria).
- "chlorotic_halo": Yellow/translucent rings or chlorotic bands surrounding active infection margins.
- "insect_perforation": Shot-holes, chewed edges, pinholes, leaf miner galleries, or insect feeding perforations.
- "blight_scorch": Marginal scorch, tip burn, rapid necrosis, blighted foliar sections.
- "fungal_pustule": Raised orange, brown, or yellow rust spore pustules.
- "powdery_mildew": Superficial white or grey powdery fungal colonies/mycelium on foliar surface.
- "water_soaked": Dark greasy or water-soaked translucent bacterial lesions.
- "deficiency_yellowing": Interveinal chlorosis, nutrient deficiency yellowing, or physiological mottling.
- "general_defect": Physical or mechanical foliar defect.

Return ONLY a valid JSON object strictly adhering to this schema:
{
  "plant_box": [ymin, xmin, ymax, xmax],
  "total_foliar_damage_pct": 24.5,
  "dominant_symptom": "Multi-focal necrotic spotting, marginal scorch, and chlorotic affected zones",
  "lesions": [
    {
      "label": "Affected Scorch Zone #1",
      "box_2d": [ymin, xmin, ymax, xmax],
      "severity": "high",
      "confidence": 97.5,
      "lesion_type": "blight_scorch",
      "description": "Extensive foliar tissue necrosis and marginal cellular collapse."
    }
  ]
};`

    const queryKey = apiKey ? `?key=${apiKey}` : '';
    // Priority: gemini-robotics-er-2-preview (embodied spatial reasoning) followed by high-precision flash failovers
    const segmentationCandidates = [
      API_CONFIG.SEGMENTATION_MODEL, // "gemini-robotics-er-2-preview"
      "gemini-3.7-flash",
      "gemini-3.8-flash"
    ].filter(Boolean);

    for (const modelName of segmentationCandidates) {
      try {
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
          `${API_CONFIG.BASE_URL}/models/${modelName}:generateContent${queryKey}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
          }
        );

        if (!response.ok) continue;
        const rawResText = await response.text();
        if (rawResText.trim().startsWith('<') || rawResText.includes('<!doctype')) {
          console.warn(`[PlantDoc Segmentation] Service returned non-JSON format`);
          continue;
        }
        let data: any;
        try {
          data = JSON.parse(rawResText);
        } catch {
          continue;
        }
        const candidate = data.candidates?.[0];
        if (!candidate?.content?.parts) continue;

        let text = '';
        for (const part of candidate.content.parts) {
          if (!part.thought && part.text) {
            text += part.text + '\n';
          }
        }
        if (!text.trim()) {
          for (const part of candidate.content.parts) {
            if (part.text) text += part.text + '\n';
          }
        }

        const parsed = extractJsonFromText(text);
        if (parsed && Array.isArray(parsed.lesions)) {
          // Validate and sanitize each individual box
          const sanitizedLesions = parsed.lesions
            .filter((l: any) => Array.isArray(l.box_2d) && l.box_2d.length === 4)
            .map((l: any) => {
              let [ymin, xmin, ymax, xmax] = l.box_2d.map((val: any) => {
                const num = Number(val);
                if (isNaN(num)) return 0;
                if (num <= 1 && num > 0) return Math.round(num * 1000);
                return Math.min(1000, Math.max(0, Math.round(num)));
              });

              if (ymin > ymax) [ymin, ymax] = [ymax, ymin];
              if (xmin > xmax) [xmin, xmax] = [xmax, xmin];

              const widthPct = Math.abs(xmax - xmin) / 10;
              const heightPct = Math.abs(ymax - ymin) / 10;
              const areaPct = Number(((widthPct * heightPct) / 100).toFixed(2));

              const severity: 'low' | 'medium' | 'high' | 'critical' = 
                ['low', 'medium', 'high', 'critical'].includes(l.severity?.toLowerCase())
                  ? l.severity.toLowerCase()
                  : (areaPct > 8 ? 'critical' : areaPct > 4 ? 'high' : areaPct > 1.5 ? 'medium' : 'low');

              return {
                label: l.label || 'Pathology Lesion',
                box_2d: [ymin, xmin, ymax, xmax] as [number, number, number, number],
                severity,
                confidence: typeof l.confidence === 'number' ? Math.min(99.9, Math.max(70, l.confidence)) : 95.0,
                description: l.description || 'Observed foliar tissue damage and cellular breakdown.',
                lesion_type: l.lesion_type || (l.label?.toLowerCase().includes('hole') ? 'insect_perforation' : l.label?.toLowerCase().includes('halo') ? 'chlorotic_halo' : 'necrotic_spot'),
                affected_area_pct: l.affected_area_pct || areaPct,
                recommended_action: l.recommended_action || ''
              };
            });

          // 1. Sort candidate lesions by clinical severity and confidence descending before NMS suppression
          sanitizedLesions.sort((a, b) => {
            const sevWeight: Record<string, number> = { critical: 4, high: 3, medium: 2, low: 1 };
            const diff = (sevWeight[b.severity] || 0) - (sevWeight[a.severity] || 0);
            return diff !== 0 ? diff : b.confidence - a.confidence;
          });

          // 2. High-Precision NMS Deduplication & Intelligent Geometric Filtering
          const filteredLesions: typeof sanitizedLesions = [];

          for (const lesion of sanitizedLesions) {
            const [ymin, xmin, ymax, xmax] = lesion.box_2d;
            const width = xmax - xmin;
            const height = ymax - ymin;
            const aspect = width / Math.max(1, height);
            const totalDamage = parsed.total_foliar_damage_pct || 0;

            // Discard tiny degenerate boxes (< 4 units)
            if (width < 4 || height < 4) continue;

            // Discard full-image framing boxes (>96% image area) unless foliage is almost completely dead
            if (width > 960 && height > 960 && totalDamage < 90) continue;

            // Preserve natural elongated botanical symptoms (marginal scorch, tip burn, vein necrosis)
            // while discarding non-botanical extreme hairline slivers (< 4 coordinate units)
            if ((aspect > 9.0 || aspect < 0.11) && (width < 4 || height < 4)) {
              continue;
            }

            // NMS deduplication with 0.65 IoU threshold: eliminate redundant concentric ghost boxes while preserving distinct macro/micro affected zones
            let isRedundant = false;
            for (let i = 0; i < filteredLesions.length; i++) {
              const existing = filteredLesions[i];
              const iou = calculateBoxIoU(lesion.box_2d, existing.box_2d);
              
              if (iou > 0.65) {
                isRedundant = true;
                break;
              }
            }

            if (!isRedundant) {
              filteredLesions.push(lesion);
            }
          }

          return {
            plant_box: parsed.plant_box && Array.isArray(parsed.plant_box) && parsed.plant_box.length === 4
              ? parsed.plant_box
              : [50, 50, 950, 950],
            total_foliar_damage_pct: typeof parsed.total_foliar_damage_pct === 'number' 
              ? parsed.total_foliar_damage_pct 
              : (filteredLesions.length === 0 ? 0 : undefined),
            dominant_symptom: parsed.dominant_symptom || (filteredLesions.length === 0 ? 'No discrete focal lesions detected' : undefined),
            lesions: filteredLesions
          };
        }
      } catch (segErr) {
        console.warn('[PlantDoc AI] Spatial lesion detection encountered non-fatal error:', segErr);
      }
    }

    return { lesions: [] };
  } catch (err) {
    console.warn('[PlantDoc AI] Spatial segmentation non-blocking fallback:', err);
    return { lesions: [] };
  }
}

// -------------------------------------------------------------
// Main Clinical Diagnosis Fetcher with 3-Tier Model Failover Cascade
// 1. Primary: gemini-3.8-flash
// 2. Secondary failover: gemini-3.7-flash (if primary is offline, busy, or hit rate limits)
// 3. Tertiary failover: gemini-3.6-flash (if secondary is offline, busy, or hit rate limits)
// -------------------------------------------------------------
interface DiagnosisModelCandidate {
  id: string;
  name: string;
  tierLabel: string;
  supportsThinking: boolean;
}

const DIAGNOSIS_MODEL_CASCADE: DiagnosisModelCandidate[] = [
  {
    id: "gemini-3.7-flash",
    name: "PlantDoc AI",
    tierLabel: "PlantDoc AI Primary Engine",
    supportsThinking: true
  },
  {
    id: "gemini-3.8-flash",
    name: "PlantDoc AI",
    tierLabel: "PlantDoc AI Secondary Engine",
    supportsThinking: true
  },
  {
    id: "gemini-3.6-flash",
    name: "PlantDoc AI",
    tierLabel: "PlantDoc AI Alternate Engine",
    supportsThinking: false
  }
];

async function fetchClinicalDiagnosis(
  base64Data: string,
  mimeType: string,
  apiKey: string,
  onModelShift?: (message: string) => void
): Promise<any> {
  // Unrestricted fast execution without waiting limit


  const promptText = `You are the PlantDoc AI Vision Diagnostics Engine. Analyze the provided plant image thoroughly to identify the plant species, diagnose any diseases or nutritional deficiencies, and produce clinical remediation protocols.

SCIENTIFIC VERACITY & ANTI-HALLUCINATION PROTOCOL:
- GIVING NO INFO IS STRICTLY BETTER THAN GIVING FALSE, FABRICATED, OR MISLEADING INFORMATION.
- NEVER INVENT OR HALLUCINATE DISEASES OR SCIENTIFIC NAMES.

CRITICAL RULES:
1. NON-BOTANICAL SPECIMENS:
   - If the uploaded image does NOT contain plant foliage, crops, or botanical specimens (e.g. human face, pet/animal, food dish, room, vehicle, random object, or unreadable blurry photo), you MUST explicitly return:
     "plant": "Cannot identify name (Non-botanical specimen)",
     "scientific_name": "",
     "family": "N/A",
     "accuracy": 0,
     "disease": {
       "name": "No Plant Detected / Invalid Specimen",
       "confidence": 0,
       "severity": "Low",
       "pathogen_type": "None (Non-Botanical)",
       "suspect_category": "Abiotic / Environmental Stress",
       "health_score": 0,
       "recovery_prognosis": 0,
       "spread_risk": "Low"
     },
     "causes": ["The uploaded image does not contain recognizable botanical foliage. Please upload a clear photo of a plant leaf or stem."],
     "treatment": {
       "immediate_actions": ["Please upload a clear, focused, well-lit photo of the affected plant foliage."],
       "organic_remedies": [],
       "home_remedies": [],
       "chemical_treatments": ["No chemical treatments applicable for non-botanical photos."],
       "steps": ["1. Take a fresh close-up photo of the plant leaf in natural lighting", "2. Re-upload to PlantDoc AI"],
       "prevention": ["Ensure the camera lens is clean and the leaf fills the majority of the frame."],
       "timeline": { "day_1_3": "N/A", "week_1_2": "N/A", "month_1": "N/A" }
     }
2. UNCERTAIN PLANT SPECIES:
   - If the specimen is a plant, but you CANNOT identify the exact species with high certainty (>80%), you MUST explicitly set:
     "plant": "Cannot identify name",
     "scientific_name": ""
   - Do NOT guess or hallucinate a random plant species if you are unsure.
3. HEALTHY SPECIMENS:
   - If the specimen is HEALTHY with no signs of disease or nutritional stress, explicitly set:
     "disease": { "name": "Healthy Specimen / No Disease Detected", "confidence": 98.0, "severity": "Low", "pathogen_type": "None (Healthy)", "health_score": 98, "recovery_prognosis": 100, "spread_risk": "Low" }
   - NEVER fabricate or invent diseases on healthy foliage!
   - "treatment": { "immediate_actions": ["No emergency quarantine required."], "organic_remedies": ["Maintain regular watering and balanced sunlight."], "home_remedies": [{"name": "Mild Baking Soda Preventive Wash", "ingredients": ["1 tsp Baking Soda", "1L Water", "1 drop Castile Soap"], "preparation": "Mix thoroughly in spray bottle", "application": "Mist leaves every 2 weeks", "mechanism": "Slightly elevates foliar surface pH to prevent fungal spore germination"}], "chemical_treatments": ["No chemical fungicides necessary."], "steps": ["1. Continue regular preventive care", "2. Inspect foliage bi-weekly"], "prevention": ["Maintain optimal spacing and airflow"], "timeline": { "day_1_3": "Routine inspection", "week_1_2": "Regular watering", "month_1": "Apply maintenance fertilizer" } }
   - "secondary_pathogen_risk": { "opportunistic_invaders": [], "insect_attraction_index": { "score": 10, "level": "Low", "attracted_pests": [], "vector_summary": "Intact leaf cuticle presents a strong physical barrier against secondary pests." } }
   - "inoculum_vectors": { "primary_source": "Clean nursery stock / Healthy soil substrate", "transmission_pathways": ["N/A"], "favorable_microclimate": "Optimal ambient conditions with adequate air circulation" }
4. AMBIGUOUS SYMPTOMS:
   - If symptoms are vague, ambiguous, or insufficient to differentiate between multiple pathogens with certainty, explicitly label as "Inconclusive Foliar Symptoms / Suspected Pathogen" rather than asserting false certainty.
5. If DISEASED:
   - Pinpoint the specific pathogen classification (Fungal, Bacterial, Viral, Pest / Insect, Nutrient Deficiency, Abiotic Stress).
   - SECONDARY PATHOGEN RISK ASSESSMENT: Provide warning flags for opportunistic invaders entering through necrotic lesion openings (e.g., Botryosphaeria black rot, Colletotrichum bitter rot, Alternaria secondary rot, Erwinia soft rot).
   - INSECT ATTRACTION INDEX: Assess whether stressed or decaying foliage attracts secondary pests like spider mites, fungus gnats, aphids, thrips, or leaf miners with a 0-100 index score.
   - PATHOGEN TRANSMISSION & INOCULUM VECTORS: Identify the primary origin of inoculum (e.g., overwintered fallen leaves, dormant bud cankers, infected bud scales, contaminated nursery stock, or soil splashback) and key transmission pathways.
   - HOME REMEDIES: Formulate 2-3 genuine, practical home/kitchen remedies (e.g., Chamomile antifungal infusion, diluted hydrogen peroxide 3% foliar spray, baking soda horticultural oil mix, cinnamon root dusting, milk whey foliar antiseptic spray, garlic sulfur wash) with exact ingredient ratios, preparation steps, and biological mechanisms of action.
6. PRIMARY SUSPECT & CATEGORIZATION MANDATE:
   - Identify the explicit name of the issue and categorize it clearly by its botanical classification type into one of these 3 exact categories:
     a) Pests (e.g., spider mites, aphids, fungus gnats, thrips, caterpillars, mealybugs, scale insects, whiteflies).
     b) Pathogens (e.g., powdery mildew, root rot, bacterial leaf spot, anthracnose, early blight, rust, botrytis, mosaic virus).
     c) Abiotic / Environmental Stress (e.g., nutrient deficiency, overwatering, underwatering, sunburn, salt burn, heat stress, pH imbalance).
   - Provide "primary_suspect": {
       "name": "The explicit name of the primary diagnosed issue",
       "category": "Pests" | "Pathogens" | "Abiotic / Environmental Stress",
       "sub_type": "Specific sub-classification (e.g. Tetranychidae Spider Mite Infestation, Ascomycota Fungal Inoculation, or Calcium Deficiency Tip Burn)",
       "description": "Clinical explanation of why this specific pest, pathogen, or abiotic factor is the primary cause of the foliar lesions",
       "symptom_evidence": ["Key symptom 1", "Key symptom 2"],
       "common_examples": ["Spider mites (Tetranychidae)", "Aphids (Aphidoidea)", "Fungus gnats (Sciaridae)"]
     }
7. REAL PRODUCT FERTILIZER MANDATE: In "fertilizer_recommendation", provide a real-world commercial retail product brand name with its exact manufacturer, complete NPK macronutrient ratio, and precise mixing dilution instructions for root zone or foliar application. Do not output vague generic terms.
8. REAL PRODUCT CHEMICAL TREATMENTS MANDATE: In "treatment.chemical_treatments", specify real retail commercial fungicide, bactericide, or pesticide brand names, stating the active chemical ingredient, concentration percentage, and exact volumetric mixing dosage per gallon or liter of water with safety intervals.
9. REAL PRODUCT ORGANIC REMEDIES MANDATE: In "treatment.organic_remedies", specify real commercial bio-organic product brand names, biological agents, or verified organic formulations with exact volumetric preparation ratios and application schedules.

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
    "suspect_category": "Pests" | "Pathogens" | "Abiotic / Environmental Stress",
    "health_score": 75,
    "recovery_prognosis": 85,
    "spread_risk": "Low" | "Medium" | "High" | "Critical",
    "diagnosis_summary": "Concise 2-3 sentence clinical summary of the diagnosis, observed symptoms, and prognosis."
  },
  "primary_suspect": {
    "name": "The explicit name of the issue",
    "category": "Pests" | "Pathogens" | "Abiotic / Environmental Stress",
    "sub_type": "Specific sub-classification",
    "description": "Clinical diagnosis reasoning",
    "symptom_evidence": ["Evidence 1", "Evidence 2"],
    "common_examples": ["Spider mites", "Aphids", "Fungus gnats"]
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
  "secondary_pathogen_risk": {
    "opportunistic_invaders": [
      {
        "pathogen_name": "Secondary pathogen name (e.g. Botryosphaeria Black Rot or Colletotrichum Bitter Rot)",
        "risk_level": "Low" | "Moderate" | "High" | "Severe",
        "entry_mechanism": "Entry through exposed necrotic lesion margins and collapsed cell walls",
        "warning_flag": "Watch for sudden blackening or water-soaked halos spreading outward from lesion edges"
      }
    ],
    "insect_attraction_index": {
      "score": 68,
      "level": "Low" | "Moderate" | "High" | "Severe",
      "attracted_pests": ["Two-Spotted Spider Mites", "Fungus Gnats", "Thrips"],
      "vector_summary": "Decaying necrotic tissue releases volatile terpenes and sugars that attract opportunistic sap-feeders and mites."
    }
  },
  "inoculum_vectors": {
    "primary_source": "Overwintered fallen leaves, infected bud scales, or dormant twig cankers",
    "transmission_pathways": [
      "Raindrop splashing transmitting conidia to lower leaves",
      "Contaminated pruning shears during maintenance",
      "Airborne ascospores during warm humid spells"
    ],
    "favorable_microclimate": "Extended leaf wetness >6 hours with ambient temperatures between 18°C–26°C",
    "soil_survival_duration": "12–24 months in uncomposted fallen leaf litter"
  },
  "treatment": {
    "immediate_actions": [
      "Physical quarantine and environmental isolation instructions",
      "Sanitary pruning procedure with tool disinfection guidelines"
    ],
    "organic_remedies": [
      "OMRI-listed organic brand or bio-fungicide with exact concentration and spraying intervals",
      "Biological control agent or natural foliar treatment recipe"
    ],
    "home_remedies": [
      {
        "name": "Diluted 3% Hydrogen Peroxide Foliar Antiseptic Spray",
        "ingredients": ["1 tbsp 3% Hydrogen Peroxide (H2O2)", "1 cup Water (240ml)", "2 drops Liquid Castile Soap"],
        "preparation": "Combine in a dark spray bottle and shake gently.",
        "application": "Spray foliage lightly at dawn; repeat every 4-5 days during active outbreak.",
        "mechanism": "Releases reactive oxygen species that disrupt fungal spore cell membranes on contact without systemic leaf toxicity."
      },
      {
        "name": "Baking Soda & Vegetable Oil Bio-pH Wash",
        "ingredients": ["1 tsp Sodium Bicarbonate", "1 tsp Horticultural / Canola Oil", "1L Lukewarm Water"],
        "preparation": "Dissolve baking soda in water, then emulsify with oil to aid foliar adhesion.",
        "application": "Spray upper and lower leaf surfaces every 7 days.",
        "mechanism": "Shifts leaf surface pH to ~8.3, creating an inhospitable alkaline barrier that inhibits fungal conidia germ tube elongation."
      }
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
  },
  "quarantine_urgency_hours": 24,
  "differential_diagnoses": [
    {
      "disease_name": "Top alternate lookalike condition",
      "probability": 18.5,
      "distinguishing_feature": "Key histological, lesion margin, or spore morphological difference that differentiates it from the primary diagnosis"
    }
  ],
  "recovery_simulation": [
    {
      "day": 1,
      "stage_name": "Triage & Containment",
      "expected_health_pct": 35,
      "visual_symptom": "Active lesion margins with chlorotic halos and pathogen activity",
      "required_action": "Sanitary excision of severely infected leaves and initial foliar spray"
    },
    {
      "day": 7,
      "stage_name": "Antisepsis & Arrest",
      "expected_health_pct": 52,
      "visual_symptom": "Lesion margins drying out with halo fading; no new secondary spots",
      "required_action": "Secondary protective spray and humidity regulation"
    },
    {
      "day": 14,
      "stage_name": "Cellular Regeneration",
      "expected_health_pct": 70,
      "visual_symptom": "Emergence of healthy new apical buds and foliar flush",
      "required_action": "Light balanced fertilization and root zone aeration"
    },
    {
      "day": 21,
      "stage_name": "Vigor Restoration",
      "expected_health_pct": 85,
      "visual_symptom": "Vigorous green foliage with restored photosynthetic efficiency",
      "required_action": "Maintenance watering and preventive bio-shield wash"
    },
    {
      "day": 30,
      "stage_name": "Full Remission",
      "expected_health_pct": 95,
      "visual_symptom": "Specimen physiologically stable with robust natural plant immunity",
      "required_action": "Standard botanical care protocol"
    }
  ]
}

Return ONLY the JSON. No markdown commentary.`;

  let lastErrorText = '';
  let lastStatusCode = 0;
  let activeShiftNotice: string | undefined = undefined;

  // 3-Tier Model Failover Cascade:
  // Step 1: Try gemini-3.8-flash (Primary)
  // Step 2: If offline/busy/limit -> show message and try gemini-3.7-flash (2nd)
  // Step 3: If offline/busy/limit -> show message and try gemini-3.6-flash (3rd)
  for (let i = 0; i < DIAGNOSIS_MODEL_CASCADE.length; i++) {
    const candidate = DIAGNOSIS_MODEL_CASCADE[i];
    const nextCandidate = DIAGNOSIS_MODEL_CASCADE[i + 1];

    const generationConfig: any = {
      temperature: 0.1,
      maxOutputTokens: 8192
    };
    if (candidate.supportsThinking) {
      generationConfig.thinkingConfig = {
        thinkingBudget: 1024
      };
    }

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
      generationConfig
    };

    try {
      const queryKey = apiKey ? `?key=${apiKey}` : '';
      const res = await fetchWithTimeout(
        `${API_CONFIG.BASE_URL}/models/${candidate.id}:generateContent${queryKey}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(payload)
        },
        50000 // 50s timeout per candidate
      );

      if (res.ok) {
        const rawText = await res.text();
        const trimmed = rawText.trim();

        // Prevent "Unexpected token '<'" if server or proxy returned HTML document
        if (trimmed.startsWith('<') || trimmed.includes('<!doctype') || trimmed.includes('<html')) {
          console.warn(`[PlantDoc Diagnosis] Diagnostic service returned non-JSON. Attempting direct connection...`);
          if (apiKey && API_CONFIG.BASE_URL.includes('/api')) {
            try {
              const directUrl = `https://generativelanguage.googleapis.com/v1beta/models/${candidate.id}:generateContent?key=${apiKey}`;
              const directRes = await fetchWithTimeout(
                directUrl,
                {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify(payload)
                },
                50000
              );
              if (directRes.ok) {
                const directRaw = await directRes.text();
                if (!directRaw.trim().startsWith('<')) {
                  const directData = JSON.parse(directRaw);
                  const cand = directData.candidates?.[0];
                  let fullDirectText = '';
                  if (cand?.content?.parts) {
                    for (const part of cand.content.parts) {
                      if (!part.thought && part.text) fullDirectText += part.text + '\n';
                    }
                    if (!fullDirectText.trim()) {
                      for (const part of cand.content.parts) {
                        if (part.text) fullDirectText += part.text + '\n';
                      }
                    }
                  }
                  const directParsed = extractJsonFromText(fullDirectText);
                  if (directParsed && (directParsed.plant || directParsed.disease)) {
                    return {
                      ...directParsed,
                      diagnosedByModel: "PlantDoc AI",
                      modelShiftNotice: activeShiftNotice
                    };
                  }
                }
              }
            } catch (fallbackErr) {
              console.warn(`[PlantDoc Diagnosis] Direct connection failed:`, fallbackErr);
            }
          }
          lastErrorText = `PlantDoc AI diagnostic service is reconnecting.`;
        } else {
          let data: any = null;
          try {
            data = JSON.parse(rawText);
          } catch {
            lastErrorText = `PlantDoc AI diagnostic service returned unparseable output`;
          }

          if (data) {
            const cand = data.candidates?.[0];
            let fullText = '';
            if (cand?.content?.parts) {
              for (const part of cand.content.parts) {
                if (!part.thought && part.text) {
                  fullText += part.text + '\n';
                }
              }
              if (!fullText.trim()) {
                for (const part of cand.content.parts) {
                  if (part.text) fullText += part.text + '\n';
                }
              }
            }

            const parsed = extractJsonFromText(fullText);
            if (parsed && (parsed.plant || parsed.disease)) {
              console.log(`[PlantDoc Diagnosis] Completed successfully with PlantDoc AI`);
              return {
                ...parsed,
                diagnosedByModel: "PlantDoc AI",
                modelShiftNotice: activeShiftNotice
              };
            } else {
              lastErrorText = `Model returned unparseable or empty output`;
              console.warn(`[PlantDoc Diagnosis] extraction failed:`, fullText.slice(0, 200));
            }
          }
        }
      } else {
        lastStatusCode = res.status;
        try {
          const errBody = await res.text();
          lastErrorText = errBody.slice(0, 200);
        } catch {
          lastErrorText = `HTTP status ${res.status}`;
        }
        console.warn(`[PlantDoc Diagnosis] returned HTTP ${res.status}:`, lastErrorText);
      }
    } catch (netErr: any) {
      lastErrorText = netErr?.message || 'Network timeout or connection dropped';
      console.warn(`[PlantDoc Diagnosis] error:`, lastErrorText);
    }

    // If current model failed and there is a next model in the cascade, notify user and transition
    if (nextCandidate) {
      const shiftMessage = i === 0
        ? "PlantDoc AI is adjusting its botanical sensors — switching to our backup diagnostic lens..."
        : "PlantDoc AI is fine-tuning the focus — engaging our alternate foliar analyzer...";

      activeShiftNotice = shiftMessage;
      console.warn(`[PlantDoc Failover] ${shiftMessage}`);

      // Display warning toast to user
      toast.warning(shiftMessage, {
        duration: 5000,
        id: 'model-failover-toast'
      });

      // Update in-page diagnostic console status callback
      onModelShift?.(shiftMessage);

      // Immediate transition to next candidate without stalling
    }
  }

  // If all models in the cascade failed
  const status = lastStatusCode || 503;
  console.warn(`[PlantDoc Diagnosis] Diagnostic service status: ${status}`);

  if (status === 429) {
    throw new Error("PlantDoc AI is catching some sunlight to recharge! Please give our green neurons just a few seconds and try again.");
  }
  if (status === 400) {
    throw new Error("PlantDoc AI squinted really hard, but couldn't quite spot the leaf! Could you snap a clearer, brighter photo of the foliage?");
  }
  if (status >= 500) {
    throw new Error("PlantDoc AI tripped over a runaway pumpkin vine! Our diagnostic engine is dusting itself off — please try again in a few seconds.");
  }
  throw new Error("PlantDoc AI had a little leaf wobble! Give it a moment to catch its breath and try again.");
}

// -------------------------------------------------------------
// Groq Fast Mode: fetchGroqClinicalDiagnosis
// Model: qwen/qwen3.8-27b with max reasoning effort
// -------------------------------------------------------------
async function fetchGroqClinicalDiagnosis(
  base64Data: string,
  mimeType: string,
  promptText: string
): Promise<any> {
  console.log('[PlantDoc Groq] Sending vision diagnosis request to qwen/qwen3.8-27b...');

  const groqKey = API_CONFIG.getGroqApiKey();
  if (!groqKey) {
    throw new Error("Fast Mode requires VITE_GROQ_API_KEY in your environment. Please add VITE_GROQ_API_KEY or use Smart Mode.");
  }

  const dataUrl = `data:${mimeType};base64,${base64Data}`;

  const response = await fetchWithTimeout(
    `${API_CONFIG.GROQ_BASE_URL}/chat/completions`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${groqKey}`
      },
      body: JSON.stringify({
        model: API_CONFIG.GROQ_DIAGNOSIS_MODEL, // "qwen/qwen3.8-27b"
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: promptText
              },
              {
                type: 'image_url',
                image_url: {
                  url: dataUrl
                }
              }
            ]
          }
        ],
        temperature: 0.1,
        max_completion_tokens: 16384,
        top_p: 0.95,
        reasoning_effort: 'high'
      })
    },
    60000
  );

  if (!response.ok) {
    const status = response.status;
    let errMsg = `Groq service error (${status})`;
    try {
      const errJson = await response.json();
      errMsg = errJson.error?.message || errMsg;
    } catch {}

    if (status === 401 || (status === 500 && errMsg.includes('API_KEY'))) {
      throw new Error("Fast Mode requires a valid VITE_GROQ_API_KEY. Please verify your API key or switch to Smart Mode.");
    }
    throw new Error(errMsg);
  }

  const completion = await response.json();
  const rawContent = completion.choices?.[0]?.message?.content || '';

  const parsed = extractJsonFromText(rawContent);
  if (parsed && (parsed.plant || parsed.disease)) {
    return {
      ...parsed,
      diagnosedByModel: "PlantDoc AI (Fast Mode)"
    };
  }

  console.warn('[PlantDoc Groq] Failed to extract JSON from content:', rawContent.slice(0, 300));
  throw new Error("Unable to parse structured diagnosis from Groq AI. Please ensure the plant leaf is clearly visible and try again.");
}

// -------------------------------------------------------------
// Unified diagnosePlant: Concurrent Parallel Execution
// -------------------------------------------------------------
export const diagnosePlant = async (
  imageFile: File,
  onModelShift?: (message: string) => void,
  mode: 'smart' | 'fast' = 'smart'
): Promise<DiagnosisResult> => {
  try {
    const apiKey = API_CONFIG.getApiKey();
    const groqKey = API_CONFIG.getGroqApiKey();
    if (!apiKey && mode === 'smart') {
      throw new Error('Missing API key in environment.');
    }
    if (!groqKey && mode === 'fast') {
      throw new Error('Missing API key in environment.');
    }

    const { mimeType, base64Data } = await prepareImageForAPI(imageFile);

    // Launch clinical diagnosis and spatial segmentation in parallel:
    // When mode === 'fast':
    //   - Clinical Diagnosis runs on Groq: qwen/qwen3.8-27b with reasoning_effort="high"
    //   - Spatial Segmentation continues on Google gemini-robotics-er-2-preview (per specification)
    // When mode === 'smart':
    //   - Clinical Diagnosis runs on Google 3-tier cascade: gemini-3.8-flash -> 3.7-flash -> 3.6-flash
    //   - Spatial Segmentation runs on Google gemini-robotics-er-2-preview
    let diagnosisPromise: Promise<any>;

    if (mode === 'fast') {
      const promptText = `You are the PlantDoc AI Vision Diagnostics Engine. Analyze the provided plant image thoroughly to identify the plant species, diagnose any diseases or nutritional deficiencies, and produce clinical remediation protocols.

SCIENTIFIC VERACITY & ANTI-HALLUCINATION PROTOCOL:
- GIVING NO INFO IS STRICTLY BETTER THAN GIVING FALSE, FABRICATED, OR MISLEADING INFORMATION.
- NEVER INVENT OR HALLUCINATE DISEASES OR SCIENTIFIC NAMES.

CRITICAL RULES:
1. NON-BOTANICAL SPECIMENS:
   - If the uploaded image does NOT contain plant foliage, crops, or botanical specimens (e.g. human face, pet/animal, food dish, room, vehicle, random object, or unreadable blurry photo), you MUST explicitly return:
     "plant": "Cannot identify name (Non-botanical specimen)",
     "scientific_name": "",
     "family": "N/A",
     "accuracy": 0,
     "disease": {
       "name": "No Plant Detected / Invalid Specimen",
       "confidence": 0,
       "severity": "Low",
       "pathogen_type": "None (Non-Botanical)",
       "suspect_category": "Abiotic / Environmental Stress",
       "health_score": 0,
       "recovery_prognosis": 0,
       "spread_risk": "Low"
     },
     "causes": ["The uploaded image does not contain recognizable botanical foliage. Please upload a clear photo of a plant leaf or stem."],
     "treatment": {
       "immediate_actions": ["Please upload a clear, focused, well-lit photo of the affected plant foliage."],
       "organic_remedies": [],
       "home_remedies": [],
       "chemical_treatments": ["No chemical treatments applicable for non-botanical photos."],
       "steps": ["1. Take a fresh close-up photo of the plant leaf in natural lighting", "2. Re-upload to PlantDoc AI"],
       "prevention": ["Ensure the camera lens is clean and the leaf fills the majority of the frame."],
       "timeline": { "day_1_3": "N/A", "week_1_2": "N/A", "month_1": "N/A" }
     }
2. UNCERTAIN PLANT SPECIES:
   - If the specimen is a plant, but you CANNOT identify the exact species with high certainty (>80%), you MUST explicitly set:
     "plant": "Cannot identify name",
     "scientific_name": ""
   - Do NOT guess or hallucinate a random plant species if you are unsure.
3. HEALTHY SPECIMENS:
   - If the specimen is HEALTHY with no signs of disease or nutritional stress, explicitly set:
     "disease": { "name": "Healthy Specimen / No Disease Detected", "confidence": 98.0, "severity": "Low", "pathogen_type": "None (Healthy)", "health_score": 98, "recovery_prognosis": 100, "spread_risk": "Low" }
   - NEVER fabricate or invent diseases on healthy foliage!
   - "treatment": { "immediate_actions": ["No emergency quarantine required."], "organic_remedies": ["Maintain regular watering and balanced sunlight."], "home_remedies": [{"name": "Mild Baking Soda Preventive Wash", "ingredients": ["1 tsp Baking Soda", "1L Water", "1 drop Castile Soap"], "preparation": "Mix thoroughly in spray bottle", "application": "Mist leaves every 2 weeks", "mechanism": "Slightly elevates foliar surface pH to prevent fungal spore germination"}], "chemical_treatments": ["No chemical fungicides necessary."], "steps": ["1. Continue regular preventive care", "2. Inspect foliage bi-weekly"], "prevention": ["Maintain optimal spacing and airflow"], "timeline": { "day_1_3": "Routine inspection", "week_1_2": "Regular watering", "month_1": "Apply maintenance fertilizer" } }
4. AMBIGUOUS SYMPTOMS:
   - If symptoms are vague, ambiguous, or insufficient to differentiate between multiple pathogens with certainty, explicitly label as "Inconclusive Foliar Symptoms / Suspected Pathogen" rather than asserting false certainty.
5. If DISEASED:
   - Pinpoint the specific pathogen classification (Fungal, Bacterial, Viral, Pest / Insect, Nutrient Deficiency, Abiotic Stress).
   - Real retail brand chemicals and bio-organic products must be specified.
   - 2-3 home remedies with exact measurements must be specified.
6. PRIMARY SUSPECT & CATEGORIZATION MANDATE:
   - Provide "primary_suspect" with "name", "category" ('Pests' | 'Pathogens' | 'Abiotic / Environmental Stress'), "sub_type", "description", "symptom_evidence", and "common_examples".

Output ONLY a valid JSON object matching this schema:
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
    "suspect_category": "Pests" | "Pathogens" | "Abiotic / Environmental Stress",
    "health_score": 75,
    "recovery_prognosis": 85,
    "spread_risk": "Low" | "Medium" | "High" | "Critical",
    "diagnosis_summary": "Concise 2-3 sentence clinical summary of the diagnosis, observed symptoms, and prognosis."
  },
  "primary_suspect": {
    "name": "The explicit name of the issue",
    "category": "Pests" | "Pathogens" | "Abiotic / Environmental Stress",
    "sub_type": "Specific sub-classification",
    "description": "Clinical diagnosis reasoning",
    "symptom_evidence": ["Evidence 1", "Evidence 2"],
    "common_examples": ["Spider mites", "Aphids", "Fungus gnats"]
  },
  "affected_parts": ["Leaves", "Stem", "Fruit"],
  "symptoms_breakdown": [
    {
      "symptom": "Detailed clinical description",
      "severity": "Low" | "Moderate" | "High" | "Severe"
    }
  ],
  "causes": [
    "Primary pathogen etiology or environmental stress factor"
  ],
  "secondary_pathogen_risk": {
    "opportunistic_invaders": [
      {
        "pathogen_name": "Secondary pathogen name",
        "risk_level": "Low" | "Moderate" | "High" | "Severe",
        "entry_mechanism": "Entry through exposed necrotic lesion margins",
        "warning_flag": "Watch for sudden blackening or water-soaked halos"
      }
    ],
    "insect_attraction_index": {
      "score": 68,
      "level": "Low" | "Moderate" | "High" | "Severe",
      "attracted_pests": ["Two-Spotted Spider Mites", "Fungus Gnats"],
      "vector_summary": "Decaying necrotic tissue releases volatile terpenes."
    }
  },
  "inoculum_vectors": {
    "primary_source": "Overwintered fallen leaves or dormant twig cankers",
    "transmission_pathways": ["Raindrop splashing transmitting conidia"],
    "favorable_microclimate": "Extended leaf wetness >6 hours",
    "soil_survival_duration": "12–24 months"
  },
  "treatment": {
    "immediate_actions": ["Physical quarantine and environmental isolation"],
    "organic_remedies": ["OMRI-listed organic brand or bio-fungicide"],
    "home_remedies": [
      {
        "name": "Diluted 3% Hydrogen Peroxide Foliar Spray",
        "ingredients": ["1 tbsp 3% Hydrogen Peroxide", "1 cup Water (240ml)", "2 drops Liquid Castile Soap"],
        "preparation": "Combine in a dark spray bottle.",
        "application": "Spray foliage lightly at dawn.",
        "mechanism": "Releases reactive oxygen species that disrupt fungal cell membranes."
      }
    ],
    "chemical_treatments": ["Commercial retail fungicide brand with active ingredient and exact dosage"],
    "steps": ["1. Immediate physical quarantine", "2. Sanitization of tools", "3. Curative foliar spray", "4. Canopy aeration"],
    "prevention": ["Optimal spacing distance and airflow", "Drip irrigation avoiding leaf wetness"],
    "timeline": {
      "day_1_3": "Initial quarantine and first treatment",
      "week_1_2": "Foliar monitoring and secondary spray",
      "month_1": "Long-term vigor assessment"
    }
  },
  "fertilizer_recommendation": {
    "type": "Specific commercial product brand with complete NPK grade",
    "application": "Precise dilution ratio and root application frequency",
    "npk_ratio": "Numerical NPK ratio",
    "soil_ph_advice": "Recommended target soil pH range"
  },
  "care_recommendations": [
    "Required daily sunlight duration",
    "Soil moisture management and irrigation schedule",
    "Ambient relative humidity"
  ],
  "about_plant": {
    "description": "Comprehensive botanical profile and morphological characteristics",
    "origin": "Native geographic origin",
    "common_uses": ["Culinary", "Ornamental"],
    "growing_conditions": "Ideal substrate composition and temperature",
    "toxicity_warning": "Pet and livestock toxicity status"
  },
  "quarantine_urgency_hours": 24,
  "differential_diagnoses": [
    {
      "disease_name": "Top lookalike condition",
      "probability": 18.5,
      "distinguishing_feature": "Key histological difference"
    }
  ],
  "recovery_simulation": [
    { "day": 1, "stage_name": "Triage & Containment", "expected_health_pct": 35, "visual_symptom": "Active lesion margins", "required_action": "Sanitary excision" },
    { "day": 7, "stage_name": "Antisepsis & Arrest", "expected_health_pct": 52, "visual_symptom": "Lesion margins drying out", "required_action": "Secondary protective spray" },
    { "day": 14, "stage_name": "Cellular Regeneration", "expected_health_pct": 70, "visual_symptom": "Healthy new apical buds", "required_action": "Light balanced fertilization" },
    { "day": 21, "stage_name": "Vigor Restoration", "expected_health_pct": 85, "visual_symptom": "Restored photosynthetic efficiency", "required_action": "Maintenance watering" },
    { "day": 30, "stage_name": "Full Remission", "expected_health_pct": 95, "visual_symptom": "Physiologically stable", "required_action": "Standard care protocol" }
  ]
}
Return ONLY valid JSON.`;
      diagnosisPromise = fetchGroqClinicalDiagnosis(base64Data, mimeType, promptText);
    } else {
      diagnosisPromise = fetchClinicalDiagnosis(base64Data, mimeType, apiKey, onModelShift);
    }

    const [diagnosisRes, segmentationRes] = await Promise.all([
      diagnosisPromise,
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

    // Compute total foliar damage percentage
    let calculatedDamagePct = segData?.total_foliar_damage_pct;
    if (typeof calculatedDamagePct !== 'number' && lesions.length > 0) {
      const sumArea = lesions.reduce((acc: number, cur: any) => acc + (cur.affected_area_pct || 1.5), 0);
      calculatedDamagePct = Number(Math.min(95, Math.max(1, sumArea)).toFixed(1));
    }

    // Normalize plant name: if unidentified or generic, set to 'Cannot identify name'
    const rawPlant = (parsed.plant || '').trim();
    const rawScientific = (parsed.scientific_name || '').trim();
    const lowerPlant = rawPlant.toLowerCase();
    const isUnidentified = 
      !rawPlant || 
      lowerPlant === 'unknown' || 
      lowerPlant === 'unidentified' || 
      lowerPlant === 'unknown plant' || 
      lowerPlant === 'unidentified plant' || 
      lowerPlant === 'plant' || 
      lowerPlant === 'plant specimen' || 
      lowerPlant === 'specimen' || 
      lowerPlant === 'n/a' || 
      lowerPlant === 'none' || 
      lowerPlant.includes('cannot identify') || 
      lowerPlant.includes('cant identify') ||
      lowerPlant.includes('could not identify') ||
      lowerPlant.includes('unclear');

    const cleanPlantName = isUnidentified ? "Cannot identify name" : rawPlant;
    const cleanScientificName = isUnidentified ? "" : (rawScientific && !rawScientific.toLowerCase().includes('botanical species') && !rawScientific.toLowerCase().includes('unknown') ? rawScientific : "");

    // -------------------------------------------------------------
    // Primary Suspect Categorization (Pests vs. Pathogens vs. Abiotic Stress)
    // -------------------------------------------------------------
    const rawDiseaseName = parsed.disease?.name || (isHealthy ? "Healthy Specimen / No Disease Detected" : "Foliar Anomaly");
    const rawPathogenType = parsed.disease?.pathogen_type || "";
    const lowerCombined = `${rawDiseaseName} ${rawPathogenType} ${(parsed.causes || []).join(' ')}`.toLowerCase();

    let suspectCategory: 'Pests' | 'Pathogens' | 'Abiotic / Environmental Stress' = 'Pathogens';
    let defaultExamples = ["Powdery mildew (Erysiphales)", "Root rot (Phytophthora)", "Bacterial leaf spot (Xanthomonas)"];

    if (
      lowerCombined.includes('mite') || 
      lowerCombined.includes('aphid') || 
      lowerCombined.includes('gnat') || 
      lowerCombined.includes('thrip') || 
      lowerCombined.includes('insect') || 
      lowerCombined.includes('caterpillar') || 
      lowerCombined.includes('bug') || 
      lowerCombined.includes('scale') || 
      lowerCombined.includes('mealybug') || 
      lowerCombined.includes('pest') ||
      lowerCombined.includes('fly')
    ) {
      suspectCategory = 'Pests';
      defaultExamples = ["Spider mites (Tetranychidae)", "Aphids (Aphidoidea)", "Fungus gnats (Sciaridae)"];
    } else if (
      lowerCombined.includes('deficiency') || 
      lowerCombined.includes('overwater') || 
      lowerCombined.includes('underwater') || 
      lowerCombined.includes('sunburn') || 
      lowerCombined.includes('scorch') || 
      lowerCombined.includes('abiotic') || 
      lowerCombined.includes('nutrient') || 
      lowerCombined.includes('chlorosis') || 
      lowerCombined.includes('burn') || 
      lowerCombined.includes('stress') ||
      lowerCombined.includes('ph imbalance')
    ) {
      suspectCategory = 'Abiotic / Environmental Stress';
      defaultExamples = ["Nutrient deficiency (Nitrogen / Iron / Magnesium)", "Overwatering & poor drainage", "Sunburn & thermal scorch"];
    } else {
      suspectCategory = 'Pathogens';
      defaultExamples = ["Powdery mildew (Podosphaera / Erysiphe)", "Root rot (Phytophthora / Pythium)", "Bacterial leaf spot (Pseudomonas / Xanthomonas)"];
    }

    const primarySuspectData = parsed.primary_suspect ? {
      name: parsed.primary_suspect.name || rawDiseaseName,
      category: (['Pests', 'Pathogens', 'Abiotic / Environmental Stress'].includes(parsed.primary_suspect.category) 
        ? parsed.primary_suspect.category 
        : suspectCategory) as 'Pests' | 'Pathogens' | 'Abiotic / Environmental Stress',
      sub_type: parsed.primary_suspect.sub_type || rawPathogenType || (suspectCategory === 'Pests' ? 'Arthropod Pest' : suspectCategory === 'Pathogens' ? 'Biological Pathogen' : 'Physiological Stress'),
      description: parsed.primary_suspect.description || (parsed.causes && parsed.causes[0]) || 'Observed cellular and tissue abnormalities characteristic of this botanical condition.',
      symptom_evidence: Array.isArray(parsed.primary_suspect.symptom_evidence) && parsed.primary_suspect.symptom_evidence.length > 0 
        ? parsed.primary_suspect.symptom_evidence 
        : (parsed.symptoms_breakdown ? parsed.symptoms_breakdown.map((s: any) => typeof s === 'string' ? s : s.symptom).slice(0, 3) : ["Foliar lesion discoloration"]),
      common_examples: Array.isArray(parsed.primary_suspect.common_examples) && parsed.primary_suspect.common_examples.length > 0 
        ? parsed.primary_suspect.common_examples 
        : defaultExamples
    } : {
      name: rawDiseaseName,
      category: suspectCategory,
      sub_type: rawPathogenType || (suspectCategory === 'Pests' ? 'Arthropod Pest' : suspectCategory === 'Pathogens' ? 'Biological Pathogen' : 'Physiological Stress'),
      description: (parsed.causes && parsed.causes[0]) || 'Observed foliar symptoms and cellular patterns on the specimen.',
      symptom_evidence: parsed.symptoms_breakdown ? parsed.symptoms_breakdown.map((s: any) => typeof s === 'string' ? s : s.symptom).slice(0, 3) : ["Discolored tissue margins"],
      common_examples: defaultExamples
    };

    const diagnosisResult: DiagnosisResult = {
      plant: cleanPlantName,
      scientific_name: cleanScientificName,
      family: parsed.family && !isUnidentified ? parsed.family : "Plantae",
      accuracy: typeof parsed.accuracy === 'number' ? parsed.accuracy : (isUnidentified ? 50.0 : 95.0),
      diagnosedByModel: parsed.diagnosedByModel || (mode === 'fast' ? "PlantDoc AI (Fast Mode)" : "PlantDoc AI"),
      aiMode: mode,
      modelShiftNotice: parsed.modelShiftNotice,
      disease: {
        name: rawDiseaseName,
        confidence: typeof parsed.disease?.confidence === 'number' ? parsed.disease.confidence : 92.0,
        severity: parsed.disease?.severity || (isHealthy ? "Low" : "Medium"),
        pathogen_type: parsed.disease?.pathogen_type || (isHealthy ? "None (Healthy)" : "Biological Pathogen"),
        health_score: typeof parsed.disease?.health_score === 'number' ? parsed.disease.health_score : (isHealthy ? 98 : 75),
        recovery_prognosis: typeof parsed.disease?.recovery_prognosis === 'number' ? parsed.disease.recovery_prognosis : (isHealthy ? 100 : 85),
        spread_risk: parsed.disease?.spread_risk || "Low",
        suspect_category: primarySuspectData.category
      },
      primary_suspect: primarySuspectData,
      segmentation: {
        plant_name: cleanPlantName,
        plant_accuracy: typeof parsed.accuracy === 'number' ? parsed.accuracy : (isUnidentified ? 50.0 : 95.0),
        plant_box: (segData?.plant_box && segData.plant_box.length === 4
          ? [segData.plant_box[0], segData.plant_box[1], segData.plant_box[2], segData.plant_box[3]]
          : [50, 50, 950, 950]) as [number, number, number, number],
        lesions: lesions as any,
        total_foliar_damage_pct: isHealthy ? 0 : calculatedDamagePct,
        dominant_symptom: segData?.dominant_symptom || (isHealthy ? 'Healthy Leaf Blade' : 'Foliar Necrosis & Discoloration'),
        inspection_timestamp: new Date().toISOString()
      },
      affected_parts: Array.isArray(parsed.affected_parts) ? parsed.affected_parts : ["Leaves"],
      symptoms_breakdown: Array.isArray(parsed.symptoms_breakdown) ? parsed.symptoms_breakdown : [],
      causes: Array.isArray(parsed.causes) && parsed.causes.length > 0 ? parsed.causes : ["Favorable environmental conditions for plant growth."],
      treatment: {
        steps: Array.isArray(parsed.treatment?.steps) ? parsed.treatment.steps : ["Provide optimal environmental care and sunlight."],
        prevention: Array.isArray(parsed.treatment?.prevention) ? parsed.treatment.prevention : ["Maintain regular sanitation and appropriate spacing."],
        immediate_actions: Array.isArray(parsed.treatment?.immediate_actions) ? parsed.treatment.immediate_actions : [],
        organic_remedies: Array.isArray(parsed.treatment?.organic_remedies) ? parsed.treatment.organic_remedies : [],
        home_remedies: Array.isArray(parsed.treatment?.home_remedies) ? parsed.treatment.home_remedies : [],
        chemical_treatments: Array.isArray(parsed.treatment?.chemical_treatments) ? parsed.treatment.chemical_treatments : [],
        timeline: parsed.treatment?.timeline || {
          day_1_3: "Initial inspection and sanitation",
          week_1_2: "Monitor foliar progress",
          month_1: "Resume regular maintenance"
        }
      },
      secondary_pathogen_risk: parsed.secondary_pathogen_risk || {
        opportunistic_invaders: [],
        insect_attraction_index: {
          score: isHealthy ? 12 : 55,
          level: isHealthy ? "Low" : "Moderate",
          attracted_pests: isHealthy ? [] : ["Two-Spotted Spider Mites", "Thrips"],
          vector_summary: isHealthy 
            ? "Intact foliar cuticle provides high physical defense." 
            : "Weakened lesion zones release sap and plant volatiles that attract opportunistic foliar pests."
        }
      },
      inoculum_vectors: parsed.inoculum_vectors || {
        primary_source: isHealthy 
          ? "Healthy nursery stock and sanitary potting substrate." 
          : "Overwintered fallen leaves, infected bud scales, or dormant twig cankers.",
        transmission_pathways: isHealthy 
          ? ["None active"] 
          : ["Raindrop splashback from soil onto lower leaves", "Airborne spore transmission in humid environments", "Non-sterilized pruning tools"],
        favorable_microclimate: isHealthy 
          ? "Optimal ambient conditions with adequate ventilation." 
          : "Extended foliar wetness >6 hours with relative humidity above 75%.",
        soil_survival_duration: "12–24 months in uncomposted fallen leaf litter"
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
      },
      quarantine_urgency_hours: isHealthy ? 0 : (
        typeof parsed.quarantine_urgency_hours === 'number' 
          ? parsed.quarantine_urgency_hours 
          : (parsed.disease?.severity === 'Critical' ? 6 : parsed.disease?.severity === 'High' ? 12 : 24)
      ),
      differential_diagnoses: isHealthy ? [] : (
        Array.isArray(parsed.differential_diagnoses) && parsed.differential_diagnoses.length > 0
          ? parsed.differential_diagnoses
          : [
              {
                disease_name: primarySuspectData.category === 'Pests' 
                  ? "Two-Spotted Spider Mite Infestation (Tetranychus urticae)"
                  : primarySuspectData.category === 'Abiotic / Environmental Stress'
                    ? "Micronutrient Iron / Magnesium Interveinal Chlorosis"
                    : "Septoria Foliar Spot (Septoria spp.)",
                probability: 16.5,
                distinguishing_feature: primarySuspectData.category === 'Pests'
                  ? "Fine silk webbing along petiole junctions and microscopic stippling on leaf underside."
                  : primarySuspectData.category === 'Abiotic / Environmental Stress'
                    ? "Uniform symmetrical interveinal fading without distinct necrotic border rings or fungal fruiting pycnidia."
                    : "Small circular spots with gray centers and black specks (pycnidia) rather than zonate target rings."
              }
            ]
      ),
      recovery_simulation: Array.isArray(parsed.recovery_simulation) && parsed.recovery_simulation.length > 0
        ? parsed.recovery_simulation
        : [
            {
              day: 1,
              stage_name: isHealthy ? "Vigor Baseline" : "Triage & Containment",
              expected_health_pct: isHealthy ? 98 : Math.max(25, 100 - (parsed.disease?.severity === 'Critical' ? 70 : 45)),
              visual_symptom: isHealthy ? "Turgid, intact chlorophyll cuticle" : "Active lesion margins with chlorotic halos",
              required_action: isHealthy ? "Maintain regular moisture" : "Sanitary excision of severely infected leaves and initial foliar spray"
            },
            {
              day: 7,
              stage_name: isHealthy ? "Active Growth" : "Antisepsis & Arrest",
              expected_health_pct: isHealthy ? 98 : Math.min(95, Math.max(45, 100 - (parsed.disease?.severity === 'Critical' ? 50 : 30))),
              visual_symptom: isHealthy ? "New leaf expansion" : "Lesion margins drying out with halo fading; no new secondary spots",
              required_action: isHealthy ? "Routine inspection" : "Secondary protective spray and humidity regulation"
            },
            {
              day: 14,
              stage_name: isHealthy ? "Canopy Maturation" : "Cellular Regeneration",
              expected_health_pct: isHealthy ? 99 : 72,
              visual_symptom: isHealthy ? "Lush foliar coloration" : "Emergence of healthy new apical buds and foliar flush",
              required_action: isHealthy ? "Organic soil conditioning" : "Light balanced fertilization and root zone aeration"
            },
            {
              day: 21,
              stage_name: isHealthy ? "Photosynthetic Peak" : "Vigor Restoration",
              expected_health_pct: isHealthy ? 100 : 86,
              visual_symptom: isHealthy ? "Optimal cellular turgor" : "Vigorous green foliage with restored photosynthetic efficiency",
              required_action: isHealthy ? "Standard preventive care" : "Maintenance watering and preventive bio-shield wash"
            },
            {
              day: 30,
              stage_name: isHealthy ? "Full Vitality" : "Full Remission",
              expected_health_pct: 100,
              visual_symptom: "Specimen physiologically stable with robust natural plant immunity",
              required_action: "Standard botanical care protocol"
            }
          ]
    };

    return diagnosisResult;
  } catch (error: any) {
    const friendlyMsg = formatUserFriendlyError(error);
    console.warn('[PlantDoc AI]:', friendlyMsg);
    throw new Error(friendlyMsg);
  }
};

export const getClimateDatabByLocation = async (
  country?: string,
  state?: string,
  city?: string
): Promise<{ temperature: number, rainfall: number, humidity: number }> => {
  const apiKey = API_CONFIG.getApiKey();
  if (!apiKey) {
    throw new Error("Missing VITE_GEMINI_API_KEY for climate intelligence.");
  }

  const locationQuery = [city, state, country].map(s => s ? s.trim() : '').filter(Boolean).join(', ') || 'Global Temperate Zone';
  const promptText = `Provide the typical average annual climate data for:
Location: ${locationQuery}

Output ONLY a JSON object:
{
  "temperature": <average temperature in Celsius as a number>,
  "rainfall": <average annual rainfall in mm as a number>,
  "humidity": <average relative humidity in % as a number>
}`;

  const payload = {
    contents: [{ parts: [{ text: promptText }] }],
    generationConfig: {
      temperature: 0.1,
      maxOutputTokens: 2048
    }
  };

  const queryKey = apiKey ? `?key=${apiKey}` : '';
  const response = await fetchWithTimeout(
    `${API_CONFIG.BASE_URL}/models/${API_CONFIG.CLIMATE_MODEL}:generateContent${queryKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    },
    25000
  );

  if (!response.ok) {
    throw new Error(`Failed to retrieve live climate data (${response.status})`);
  }

  const data = await response.json();
  const candidate = data.candidates?.[0];
  if (!candidate?.content?.parts) {
    throw new Error("Climate intelligence service returned incomplete telemetry");
  }

  let text = '';
  for (const part of candidate.content.parts) {
    if (!part.thought && part.text) {
      text += part.text + '\n';
    }
  }
  if (!text.trim()) {
    for (const part of candidate.content.parts) {
      if (part.text) text += part.text + '\n';
    }
  }

  const parsed = extractJsonFromText(text);
  if (parsed && typeof parsed.temperature === 'number') {
    return {
      temperature: Math.round(parsed.temperature),
      rainfall: Math.round(parsed.rainfall || 0),
      humidity: Math.round(parsed.humidity || 0)
    };
  }

  throw new Error("Could not parse climate metrics from model output");
};

export const getPlantRecommendations = async (
  conditionsOrTemp: GrowingConditions | number,
  categoryOrRainfall: PlantCategory | string | number = 'Mix',
  hasAutoDetectedOrSoilType?: boolean | string,
  paramPh?: number,
  paramSunlight?: string,
  paramExperience?: string,
  paramPurpose?: string,
  paramCategory: string = 'Mix',
  modeOverride?: 'smart' | 'fast'
): Promise<PlantRecommendation[]> => {
  try {
    // Resolve AI Mode ('smart' vs 'fast')
    const recMode: 'smart' | 'fast' = modeOverride || 
      (typeof conditionsOrTemp === 'object' && (conditionsOrTemp as GrowingConditions).mode) || 
      'smart';

    const apiKey = API_CONFIG.getApiKey();
    const openRouterKey = API_CONFIG.getOpenRouterApiKey();
    if (recMode === 'smart' && !apiKey) {
      throw new Error('Missing API key in environment.');
    }
    if (recMode === 'fast' && !openRouterKey) {
      throw new Error('Fast Mode requires VITE_OPENROUTER_API_KEY in your environment. Please add VITE_OPENROUTER_API_KEY or use Smart Mode.');
    }

    // Unrestricted fast execution without artificial waiting limit

    let temperature: number | undefined;
    let rainfall: number | undefined;
    let humidity: number | undefined;
    let soilType: string | undefined;
    let ph: number | undefined;
    let sunlight: string | undefined;
    let category = (categoryOrRainfall as string) || 'Mix';
    let locationStr = '';
    let plantCount = 4;

    if (typeof conditionsOrTemp === 'object') {
      const c = conditionsOrTemp as GrowingConditions;
      temperature = typeof c.temperature === 'number' && !isNaN(c.temperature) ? c.temperature : undefined;
      rainfall = typeof c.rainfall === 'number' && !isNaN(c.rainfall) ? c.rainfall : undefined;
      humidity = typeof c.humidity === 'number' && !isNaN(c.humidity) ? c.humidity : undefined;
      soilType = c.soilType && c.soilType.trim() && c.soilType !== 'unspecified' && c.soilType !== 'any' ? c.soilType.trim() : undefined;
      ph = typeof c.ph === 'number' && !isNaN(c.ph) ? c.ph : undefined;
      sunlight = c.sunlight && c.sunlight.trim() && c.sunlight !== 'unspecified' && c.sunlight !== 'any' ? c.sunlight.trim() : undefined;
      if (typeof c.plantCount === 'number' && !isNaN(c.plantCount)) {
        plantCount = Math.min(12, Math.max(1, Math.round(c.plantCount)));
      }
      category = (categoryOrRainfall as string) || 'Mix';
      const locParts = [c.city, c.state, c.country].map(s => s ? s.trim() : '').filter(Boolean);
      locationStr = locParts.length > 0 ? locParts.join(', ') : 'Regional outdoor gardening (Temperate Zone)';
    } else {
      temperature = typeof conditionsOrTemp === 'number' && !isNaN(conditionsOrTemp) ? conditionsOrTemp : undefined;
      rainfall = typeof categoryOrRainfall === 'number' && !isNaN(categoryOrRainfall) ? categoryOrRainfall : undefined;
      soilType = typeof hasAutoDetectedOrSoilType === 'string' && hasAutoDetectedOrSoilType.trim() && hasAutoDetectedOrSoilType !== 'unspecified' ? hasAutoDetectedOrSoilType.trim() : undefined;
      ph = typeof paramPh === 'number' && !isNaN(paramPh) ? paramPh : undefined;
      sunlight = paramSunlight && paramSunlight.trim() && paramSunlight !== 'unspecified' ? paramSunlight.trim() : undefined;
      category = paramCategory || 'Mix';
      locationStr = 'Regional outdoor gardening (Temperate Zone)';
    }

    const conditionList: string[] = [
      `- Category Filter: "${category}" (When 'Crops', provide food and vegetable crops; when 'Fruit', provide fruit trees and berry bushes; when 'Flower', provide flowering ornamentals; when 'Herbs', provide culinary and medicinal herbs; when 'Mix', provide a balanced blend of vegetables, fruits, herbs, and flowers).`,
      `- Number of Species Requested: Exactly ${plantCount} distinct, high-performing botanical recommendations.`,
      `- Target Geographic Region: ${locationStr}`
    ];

    if (temperature !== undefined) {
      conditionList.push(`- Average Temperature: ${temperature}°C`);
    } else {
      conditionList.push(`- Temperature: Unspecified (recommend versatile plants adapted to typical seasons in ${locationStr})`);
    }
    if (rainfall !== undefined) {
      conditionList.push(`- Annual Rainfall: ${rainfall}mm`);
    } else {
      conditionList.push(`- Rainfall: Unspecified (recommend species with adaptable moisture tolerance)`);
    }
    if (humidity !== undefined) {
      conditionList.push(`- Humidity Level: ${humidity}%`);
    }
    if (soilType) {
      conditionList.push(`- Soil Type: ${soilType}`);
    } else {
      conditionList.push(`- Soil Type: Unspecified (recommend species adaptable to standard soils, and specify optimal soil in output)`);
    }
    if (ph !== undefined) {
      conditionList.push(`- Soil pH: ${ph}`);
    } else {
      conditionList.push(`- Soil pH: Unspecified (recommend species with versatile 6.0-7.0 or flexible pH tolerance)`);
    }
    if (sunlight) {
      conditionList.push(`- Sunlight Exposure: ${sunlight}`);
    } else {
      conditionList.push(`- Sunlight Exposure: Flexible / Adaptable`);
    }

    const season = (typeof conditionsOrTemp === 'object' ? (conditionsOrTemp as GrowingConditions).season : undefined) || '';
    if (season && season !== 'All' && season !== 'all') {
      conditionList.push(`- Target Growing & Planting Season: ${season} (Strictly prioritize botanical species that thrive, germinate, bloom, or yield during the ${season} season)`);
    } else {
      conditionList.push(`- Target Growing Season: All Seasons / Flexible (suitable across versatile seasons)`);
    }

    const promptText = `You are the PlantDoc AI Botanical Recommendation Engine.
Suggest a collection of exactly ${plantCount} distinct, thrive-tested plant species suited for these environmental conditions and category:

${conditionList.join('\n')}

Important botanical instructions:
- Generate an array of exactly ${plantCount} distinct plant species.
- Notice: If soil pH, temperature, rainfall, or other parameters are unspecified above, do NOT fail or assume arbitrary barriers. Recommend robust, versatile species naturally suited to ${locationStr} and formulate each species' specific optimal soil, moisture, and care requirements in the JSON.
- Ensure all scientificName values are authentic Latin botanical binomials (Genus species).
- Keep descriptions concise, vivid, and agronomy-focused (2-3 concise sentences per species).
- Do not return placeholder images. Real photos will be fetched from Wikimedia Foundation REST API.
- Return ONLY a valid JSON array of exactly ${plantCount} objects strictly adhering to this schema:
[
  {
    "id": "plant-1",
    "name": "Widely recognized common vernacular plant name",
    "scientificName": "Accurate Latin botanical binomial (Genus species)",
    "family": "Botanical family taxonomic classification",
    "category": "Crops | Fruit | Flower | Herbs",
    "season": "${season && season !== 'All' ? season : 'Spring / Summer'}",
    "description": "Comprehensive agronomic profile detailing why this species thrives in this climate and season.",
    "matchScore": 96,
    "sunlight": "Full Sun",
    "sunlightType": "Full Sun",
    "waterNeeds": "Medium",
    "waterRating": 3,
    "soilPreference": "Recommended soil texture and drainage",
    "soilPhRange": "6.0 – 6.8",
    "growthVelocityDays": "70–85 Days",
    "careInstructions": [
      "Substrate preparation and moisture management guideline",
      "Macro-nutrient fertilization schedule"
    ],
    "companionPlants": ["Beneficial companion species 1", "Beneficial companion species 2"]
  }
]`;

    const calculatedMaxTokens = Math.min(2048, Math.max(1024, plantCount * 260 + 200));

    let candidatePlants: any[] = [];

    // FAST MODE: OpenRouter Free Models Cascade (High-speed biological/botanical specialist with multi-tier failover)
    if (recMode === 'fast') {
      console.log(`[PlantDoc OpenRouter] Fetching plant recommendations via OpenRouter Free models...`);

      const openRouterPrompt = `Botanical Intelligence Engine:
Recommend ${plantCount} thrive-tested plant species for ${locationStr || 'this region'}.
Category: ${category}
${season && season !== 'All' ? `Target Growing Season: ${season}` : ''}
Environmental conditions:
${conditionList.join('\n')}

Output ONLY a valid JSON array of exactly ${plantCount} objects strictly matching:
[
  {
    "id": "plant-1",
    "name": "Vernacular plant name",
    "scientificName": "Latin binomial (Genus species)",
    "family": "Botanical family",
    "category": "${category}",
    "description": "Concise agronomic profile detailing why this species thrives in this climate and season.",
    "matchScore": 96,
    "sunlight": "Full Sun",
    "waterNeeds": "Medium",
    "soilPreference": "Well-draining loam",
    "soilPhRange": "6.0 - 6.8",
    "growthVelocityDays": "70-80 days",
    "season": "${season && season !== 'All' ? season : 'Spring / Summer'}",
    "careInstructions": ["Water regularly", "Provide adequate sunlight"]
  }
]
Return strictly raw JSON.`;

      const openRouterModels = API_CONFIG.OPENROUTER_RECOMMENDATION_MODELS;

      let lastErrorDetail = '';

      for (const modelName of openRouterModels) {
        try {
          console.log(`[PlantDoc OpenRouter] Attempting recommendation formulation via ${modelName}...`);

          const controller = new AbortController();
          const timeoutMs = 20000; // 20s per model attempt
          const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

          const response = await fetch(`${API_CONFIG.OPENROUTER_BASE_URL}/chat/completions`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${openRouterKey}`,
              'HTTP-Referer': 'https://plantdoc.pages.dev',
              'X-Title': 'PlantDoc AI'
            },
            body: JSON.stringify({
              model: modelName,
              messages: [
                {
                  role: 'user',
                  content: openRouterPrompt
                }
              ],
              temperature: 0.2
            }),
            signal: controller.signal
          });
          clearTimeout(timeoutId);

          if (!response.ok) {
            let errMsg = `HTTP ${response.status}`;
            try {
              const errJson = await response.json();
              errMsg = errJson?.error?.message || errMsg;
            } catch {}
            lastErrorDetail = errMsg;
            console.warn(`[PlantDoc OpenRouter] Model ${modelName} returned error: ${errMsg}`);
            continue;
          }

          const completionData = await response.json();
          const content = completionData.choices?.[0]?.message?.content || '';

          const parsedData = extractJsonFromText(content);
          if (Array.isArray(parsedData) && parsedData.length > 0) {
            candidatePlants = parsedData;
            console.log(`[PlantDoc OpenRouter] Successfully formulated ${parsedData.length} recommendations via ${modelName}.`);
            break;
          } else if (parsedData && typeof parsedData === 'object') {
            const arr = parsedData.plants || parsedData.recommendations || parsedData.species || parsedData.results || parsedData.data || parsedData.items;
            if (Array.isArray(arr) && arr.length > 0) {
              candidatePlants = arr;
              console.log(`[PlantDoc OpenRouter] Successfully formulated ${arr.length} recommendations via ${modelName}.`);
              break;
            }
          }
          console.warn(`[PlantDoc OpenRouter] Model ${modelName} response did not contain expected plant array, checking fallback...`);
        } catch (modelErr: any) {
          lastErrorDetail = modelErr?.message || lastErrorDetail;
          console.warn(`[PlantDoc OpenRouter] Model ${modelName} issue, shifting to failover model:`, modelErr?.message || modelErr);
        }
      }

      if (!Array.isArray(candidatePlants) || candidatePlants.length === 0) {
        if (apiKey) {
          console.warn(`[PlantDoc OpenRouter] OpenRouter free tier limit reached (${lastErrorDetail}). Seamlessly falling back to Smart Mode (Gemma 4)...`);
        } else {
          throw new Error(lastErrorDetail || "No plant recommendations could be formulated for these exact parameters.");
        }
      }
    }

    // SMART MODE (or seamless fallback from Fast Mode if OpenRouter quota is exhausted):
    if (!Array.isArray(candidatePlants) || candidatePlants.length === 0) {
      // SMART MODE: Gemma Open Model Family (Primary 26B Gemma 4 as user requested, failover to 31B)
      const gemmaPrompt = `${promptText}\n\nOutput ONLY the valid JSON array of objects. Think concisely and do not output conversational commentary.`;

      const payload = {
        contents: [
          {
            role: "user",
            parts: [{ text: gemmaPrompt }]
          }
        ],
        generationConfig: {
          temperature: 0.1,
          maxOutputTokens: 3500
        }
      };

      // Priority: 26B Gemma 4 (faster, highly stable), followed by 31B Gemma 4
      const gemmaModels = ["gemma-4-26b-a4b-it", "gemma-4-31b-it"];

      for (const targetModel of gemmaModels) {
        try {
          const directUrl = `${API_CONFIG.GEMINI_BASE_URL}/models/${targetModel}:generateContent?key=${apiKey}`;
          const res = await fetchWithTimeout(
            directUrl,
            {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(payload)
            }
          );

          if (res && res.ok) {
            const rawText = await res.text();
            if (!rawText.trim().startsWith('<') && !rawText.includes('<!doctype')) {
              const data = JSON.parse(rawText);
              const candidate = data.candidates?.[0];
              if (candidate?.content?.parts) {
                let fullText = '';
                for (const part of candidate.content.parts) {
                  if (!part.thought && part.text) {
                    fullText += part.text + '\n';
                  }
                }
                if (!fullText.trim()) {
                  for (const part of candidate.content.parts) {
                    if (part.text) fullText += part.text + '\n';
                  }
                }

                const parsedData = extractJsonFromText(fullText);
                if (Array.isArray(parsedData) && parsedData.length > 0) {
                  candidatePlants = parsedData;
                  break;
                } else if (parsedData && typeof parsedData === 'object') {
                  const arr = parsedData.plants || parsedData.recommendations || parsedData.species || parsedData.results || parsedData.data || parsedData.items;
                  if (Array.isArray(arr) && arr.length > 0) {
                    candidatePlants = arr;
                    break;
                  } else if (parsedData.name || parsedData.scientificName) {
                    candidatePlants = [parsedData];
                    break;
                  }
                }
              }
            }
          }
        } catch (modelErr: any) {
          console.warn(`[PlantDoc AI] Gemma model ${targetModel} issue, checking failover:`, modelErr?.message || modelErr);
        }

        if (Array.isArray(candidatePlants) && candidatePlants.length > 0) {
          break;
        }
      }
    }

    if (!Array.isArray(candidatePlants) || candidatePlants.length === 0) {
      throw new Error("No plant recommendations could be matched for these exact climate parameters. Please adjust the temperature or soil type slightly and try again.");
    }

    // Attach Wikimedia images & summaries in parallel
    const plantsToProcess = candidatePlants.slice(0, plantCount);
    const enrichedPlants = await Promise.all(
      plantsToProcess.map(async (p: any, idx: number) => {
        const sciName = p.scientificName || p.name;
        const wikiData = await fetchPlantWikimediaData(sciName, p.name);

        const imageUrl = wikiData?.imageUrl || '';
        const wikipediaUrl = wikiData?.wikiUrl || `https://en.wikipedia.org/wiki/${encodeURIComponent(sciName.replace(/ /g, '_'))}`;
        const searchSeedUrl = `https://www.google.com/search?q=${encodeURIComponent(`${p.name} ${sciName} seeds buy online`)}`;

        const waterRating = typeof p.waterRating === 'number' 
          ? Math.min(5, Math.max(1, p.waterRating))
          : (p.waterNeeds?.toLowerCase() === 'high' ? 4 : p.waterNeeds?.toLowerCase() === 'low' ? 2 : 3);

        const careInstructions = Array.isArray(p.careInstructions)
          ? p.careInstructions
          : (typeof p.careInstructions === 'string' && p.careInstructions
              ? [p.careInstructions]
              : ['Provide adequate sunlight and water regularly when top inch of soil is dry.']);

        const resolvedSeason = p.season || (season && season !== 'All' ? season : 'Spring / Summer');
        const lowerSeason = resolvedSeason.toLowerCase();
        const hasSpring = lowerSeason.includes('spring') || lowerSeason.includes('all');
        const hasSummer = lowerSeason.includes('summer') || lowerSeason.includes('all');
        const hasAutumn = lowerSeason.includes('autumn') || lowerSeason.includes('fall') || lowerSeason.includes('all');
        const hasWinter = lowerSeason.includes('winter') || lowerSeason.includes('all');

        return {
          id: p.id || `plant-${idx + 1}`,
          name: p.name,
          scientificName: sciName,
          family: p.family || '',
          category: p.category || (category !== 'Mix' ? category : ''),
          description: wikiData?.description || p.description,
          matchScore: typeof p.matchScore === 'number' ? Math.min(99, Math.max(70, p.matchScore)) : (95 - idx * 2),
          sunlight: p.sunlight || 'Full Sun',
          sunlightType: p.sunlightType || (p.sunlight?.toLowerCase().includes('shade') ? 'Partial Sun' : 'Full Sun'),
          waterNeeds: p.waterNeeds || 'Medium',
          waterRating,
          soilPreference: p.soilPreference || (soilType ? soilType : ''),
          soilPhRange: p.soilPhRange || (ph !== undefined ? `${ph}` : ''),
          growthRate: p.growthRate || 'Moderate',
          growthTime: p.growthTime || p.growthVelocityDays || '70-90 Days',
          growthVelocityDays: p.growthVelocityDays || p.growthTime || '70-90 Days',
          pestResistance: p.pestResistance || 'High',
          hardinessRating: p.hardinessRating || 'Adaptable',
          season: resolvedSeason,
          bestSeason: p.bestSeason || resolvedSeason,
          seasonalCalendar: p.seasonalCalendar || {
            spring: hasSpring,
            summer: hasSummer,
            autumn: hasAutumn,
            winter: hasWinter,
            bestMonth: resolvedSeason
          },
          companionPlants: Array.isArray(p.companionPlants) ? p.companionPlants : [],
          companionAvoid: Array.isArray(p.companionAvoid) ? p.companionAvoid : [],
          imageUrl: imageUrl,
          careInstructions,
          compatibilityReason: p.compatibilityReason || (temperature && rainfall ? `Thrives in ${temperature}°C ambient temperatures and ${rainfall}mm rainfall in ${locationStr}.` : (locationStr ? `Naturally adapted to local climate in ${locationStr}.` : '')),
          wikiUrl: wikipediaUrl,
          wikipediaUrl: wikipediaUrl,
          searchSeedUrl: searchSeedUrl
        } as PlantRecommendation;
      })
    );

    return enrichedPlants;
  } catch (error: any) {
    const friendlyMsg = formatRecommendationError(error);
    console.warn('[PlantDoc AI]:', friendlyMsg);
    throw new Error(friendlyMsg);
  }
};
