import { DiagnosisResult } from '@/types/diagnosis';
import { PlantRecommendation, GrowingConditions } from '@/types/recommendation';
import { toast } from "sonner";
import { API_CONFIG } from "@/config/api.config";

const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

if (!apiKey) {
  console.error('VITE_GEMINI_API_KEY is not set. Please check your environment variables.');
}

// 💡 MODIFIED FUNCTION
const prepareImageForAPI = async (imageFile: File): Promise<{ mimeType: string, base64Data: string }> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        const dataUrl = reader.result;
        // Split the Data URL into its two parts
        const parts = dataUrl.split(',');
        
        if (parts.length !== 2) {
          return reject(new Error('Invalid Data URL format'));
        }

        // Part 0: "data:image/png;base64"
        // We need to extract just "image/png"
        const mimeType = parts[0].split(':')[1].split(';')[0];
        
        // Part 1: The actual Base64 data
        const base64Data = parts[1];
        
        resolve({ mimeType, base64Data });
      } else {
        reject(new Error('Failed to read file as string'));
      }
    };
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(imageFile);
  });
};

const isRateLimitError = (error: any): boolean => {
  return (
    error?.message?.includes('429') || 
    error?.message?.toLowerCase().includes('rate limit') ||
    error?.status === 429
  );
};

export const diagnosePlant = async (imageFile: File): Promise<DiagnosisResult> => {
  try {
    const { mimeType, base64Data } = await prepareImageForAPI(imageFile);

    console.log(`Prepared image with MIME type: ${mimeType}`);
    
    //
    // 💡 FIX: 'tools' and 'thinking_config' are now top-level keys.
    // 'config' wrapper and 'model' key have been removed.
    //
    const payload = {
      contents: [
        {
          parts: [
            {
              text: `Analyze the provided plant image thoroughly to identify any diseases or issues affecting the plant. Ensure your analysis is comprehensive, taking into account visual symptoms, possible causes, and appropriate treatment options. Follow the JSON schema exactly as specified below for your output.

{
  "plant": "Plant species name ",
  "disease": {
    "name": "Precise name of the identified disease based on visual symptoms",
    "confidence": <confidence percentage as a number>,
    "severity": "Low" | "Medium" | "High"
  },
  "causes": [
    "List potential causes such as pest infestation, fungal or bacterial infection, environmental stress, or nutritional deficiency"
  ],
  "treatment": {
    "steps": [
      "Step-by-step professional treatment instruction addressing immediate interventions and symptom alleviation",
      "Detailed treatment step including application method and safety precautions",
      "Follow-up step outlining post-treatment care and monitoring procedures",
      "Can be any numbers of point, and give briefly"
    ],
    "prevention": [
      "Detailed professional prevention tip focusing on cultural practices, sanitation, and environmental adjustments to mitigate recurrence",
      "Additional prevention measure addressing routine maintenance practices and early symptom detection"
    ]
  },
  "fertilizer_recommendation": {
    "type": "Recommended fertilizer type or specific composition tailored to the plant's nutrient deficiencies",
    "application": "Detailed instructions on application frequency, dosage, and method to ensure optimal nutrient uptake"
  },
  "care_recommendations": [
    "Additional care tip regarding optimal watering, pruning, and pest control measures",
    "Further recommendation including adjustments in sunlight exposure, soil improvement, and overall maintenance practices"
  ],
  "about_plant": {
    "description": "IMPORTANT IF YOU ARE NOT SURE THEN DO NOT GIVE RESPONSE. Provide a brief and accurate description of the plant species based solely on the image; if not confidently identified, state that it cannot be identified.",
    "origin": "Known geographic origin of the plant, if ascertainable from the image",
    "common_uses": [
      "Common uses such as ornamental, medicinal, culinary, or other practical applications"
    ],
    "growing_conditions": "Preferred environmental, soil, and climatic conditions required for optimal growth"
  }
}

Return only the JSON output with no additional text or commentary.
`
            },
            {
              inline_data: {
                mime_type: mimeType,
                data: base64Data
              }
            }
          ]
        }
      ],
      generation_config: {
        thinking_config: {
          "thinking_budget": -1,
        }
        temperature: 1,
        max_output_tokens: 65536
      },
      tools: [ // <-- Moved to top level
        {
          "google_search": {} 
        }
      ],
      // 'model' key removed from payload
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
      console.error(`API request failed with status: ${response.status}`, errorText);
      
      if (response.status === 429) {
        toast.error("API quota exceeded. Please try again later.");
        throw new Error("API quota exceeded. The service is currently experiencing high demand. Please try again in a few minutes.");
      }
      
      throw new Error(`API request failed with status: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('Received response from Gemini API');
    
    if (!data.candidates || !data.candidates[0] || !data.candidates[0].content || !data.candidates[0].content.parts || !data.candidates[0].content.parts[0]) {
      console.error('Invalid response structure:', JSON.stringify(data));
      throw new Error('Invalid response from AI service');
    }
    
    const textResponse = data.candidates[0].content.parts[0].text;
    
    try {
      const jsonMatch = textResponse.match(/\{[\s\S]*\}/);
      const jsonStr = jsonMatch ? jsonMatch[0] : textResponse;
      let diagnosisResult;
      
      try {
        diagnosisResult = JSON.parse(jsonStr);
      } catch (jsonError) {
        console.error('Failed to parse Gemini response as JSON:', jsonError);
        diagnosisResult = {
          plant: "Unknown",
          disease: {
            name: "Unable to identify",
            confidence: 0,
            severity: "Unknown"
          },
          causes: ["Could not determine causes from the image"],
          treatment: {
            steps: ["Please try again with a clearer image"],
            prevention: ["Ensure proper lighting when taking photos"]
          },
          fertilizer_recommendation: {
            type: "Not available",
            application: "Not available"
          },
          care_recommendations: ["Try uploading a clearer image of the plant"],
          about_plant: {
            description: "Could not identify the plant from the provided image",
            origin: "Unknown",
            common_uses: ["Unknown"],
            growing_conditions: "Unknown"
          }
        };
      }
      
      // Fallbacks to ensure app doesn't crash on incomplete JSON
      diagnosisResult.plant = diagnosisResult.plant || "Unknown";
      diagnosisResult.disease = diagnosisResult.disease || { name: "Unable to identify", confidence: 0, severity: "Unknown" };
      diagnosisResult.causes = diagnosisResult.causes || ["Could not determine causes"];
      diagnosisResult.treatment = diagnosisResult.treatment || { steps: [], prevention: [] };
      diagnosisResult.treatment.steps = diagnosisResult.treatment.steps || [];
      diagnosisResult.treatment.prevention = diagnosisResult.treatment.prevention || [];
      diagnosisResult.fertilizer_recommendation = diagnosisResult.fertilizer_recommendation || { type: "Not available", application: "Not available" };
      diagnosisResult.care_recommendations = diagnosisResult.care_recommendations || [];
      diagnosisResult.about_plant = diagnosisResult.about_plant || { description: "No information available", origin: "Unknown", common_uses: [], growing_conditions: "Unknown" };
      diagnosisResult.about_plant.common_uses = diagnosisResult.about_plant.common_uses || [];
      
      return diagnosisResult;
    } catch (parseError) {
      console.error('Error parsing JSON response:', parseError);
      throw new Error('Failed to parse API response');
    }
  } catch (error) {
    console.error('Error in diagnosePlant:', error);
    throw error;
  }
};

export const getClimateDatabByLocation = async (country: string, state: string, city?: string): Promise<{ temperature: number, rainfall: number, humidity: number }> => {
  try {
    //
    // 💡 FIX: 'tools' is now a top-level key.
    // 'config' wrapper and 'model' key have been removed.
    //
    const payload = {
      contents: [
        {
          parts: [
            {
              text: `Given the location information:
                      Country: ${country}
                      State/Province: ${state}
                      City: ${city || 'Not specified'}
                      
                      Provide me with the following climate data as an accurate estimate:
                      1. Average annual temperature in Celsius
                      2. Average annual rainfall in millimeters
                      3. Average humidity percentage
                      
                      Return only a JSON object with the following structure:
                      {
                         "temperature": number,
                         "rainfall": number,
                         "humidity": number
                      }
                      
                      Only provide the JSON object, no other text.`
            }
          ]
        }
      ],
      generation_config: {
        temperature: 0.2,
        max_output_tokens: 1024
      },
      tools: [ // <-- Moved to top level
        {
          "google_search": {}
        }
      ]
      // 'model' key removed from payload
    };

    const response = await fetch(
      `${API_CONFIG.BASE_URL}/models/${API_CONFIG.CLIMATE_MODEL}:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      }
    );

    if (!response.ok) {
      console.error('Error getting climate data, using defaults');
      
      // Return default values if API fails
      return { 
        temperature: 25, 
        rainfall: 150, 
        humidity: 60 
      };
    }
    
    const data = await response.json();
    console.log('Received response from Gemini API for climate data');
    
    const textResponse = data.candidates[0].content.parts[0].text;
    
    try {
      const jsonMatch = textResponse.match(/\{[\s\S]*\}/);
      const jsonStr = jsonMatch ? jsonMatch[0] : textResponse;
      const climateData = JSON.parse(jsonStr);
      
      return climateData;
    } catch (parseError) {
      console.error('Error parsing JSON response:', parseError);
      
      // Return default values if parsing fails
      return { 
        temperature: 25, 
        rainfall: 150, 
        humidity: 60 
      };
    }
  } catch (error) {
    console.error('Error getting climate data:', error);
    // Return default values on any other error
    return { temperature: 25, rainfall: 150, humidity: 60 };
  }
};

export const getPlantRecommendations = async (conditions: GrowingConditions): Promise<PlantRecommendation[]> => {
  try {
    //
    // 💡 FIX: 'tools' is now a top-level key.
    // 'config' wrapper and 'model' key have been removed.
    //
    const payload = {
      contents: [
        {
          parts: [
            {
              text: `Given the following growing conditions, recommend 6 plants that would thrive in this environment.
                      Return your recommendations in JSON format as an array with the following structure for each plant:
                      [
  {
    "name": "Common plant name",
    "scientificName": "Latin name",
    "growthTime": "Fast/Medium/Slow growth",
    "waterNeeds": "Low/Medium/High",
    "sunlight": "Full sun/Partial sun/Shade",
    "description": "Concise overview of the plant and why it thrives under these conditions",
    "careInstructions": [
      "Specific care step 1",
      "Specific care step 2",
      "Specific care step 3"
    ],
    "bestSeason": "Spring/Summer/Fall/Winter"
  },
  // 5 more plants…
]

                      
                      Growing Conditions:
                      - Country: ${conditions.country || 'Not specified'}
                      - State/Region: ${conditions.state || 'Not specified'}
                      - City: ${conditions.city || 'Not specified'}
                      - Temperature: ${conditions.temperature}°C
                      - Humidity: ${conditions.humidity}%
                      - Rainfall: ${conditions.rainfall}mm annually
                      - Soil pH: ${conditions.ph}
                      - Soil Type: ${conditions.soilType}
                      - Sunlight: ${conditions.sunlight}
                      - Nitrogen level: ${conditions.nitrogen}%
                      - Phosphorus level: ${conditions.phosphorus}%
                      - Potassium level: ${conditions.potassium}%
                      
                      Only provide the JSON array, no other text. and be sure to give total 6 plants`
            }
          ]
        }
      ],
      generation_config: {
        temperature: 1,
        max_output_tokens: 8000
      },
      tools: [ // <-- Moved to top level
        {
          "google_search": {}
        }
      ]
      // 'model' key removed from payload
    };

    const response = await fetch(
      `${API_CONFIG.BASE_URL}/models/${API_CONFIG.RECOMMENDATION_MODEL}:generateContent?key=${apiKey}`,
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
      console.error(`API request failed with status: ${response.status}`, errorText);
      
      if (response.status === 429) {
        toast.error("API quota exceeded. Please try again later.");
        throw new Error("API quota exceeded. The service is currently experiencing high demand. Please try again in a few minutes.");
      }
      
      throw new Error(`API request failed with status: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('Received response from Gemini API for plant recommendations');
    
    if (!data.candidates || !data.candidates[0] || !data.candidates[0].content || !data.candidates[0].content.parts || !data.candidates[0].content.parts[0]) {
      console.error('Invalid response structure:', JSON.stringify(data));
      throw new Error('Invalid response from AI service');
    }
    
    const textResponse = data.candidates[0].content.parts[0].text;
    
    try {
      const jsonMatch = textResponse.match(/\[[\s\S]*\]/);
      const jsonStr = jsonMatch ? jsonMatch[0] : textResponse;
      let recommendations = [];
      
      try {
        recommendations = JSON.parse(jsonStr);
      } catch (jsonError) {
        console.error('Failed to parse Gemini response as JSON:', jsonError);
        // Provide a default fallback if JSON is invalid
        recommendations = [
          {
            name: "Unknown",
            scientificName: "Unknown",
            growthTime: "Unknown",
            waterNeeds: "Unknown",
            sunlight: "Unknown",
            description: "Unknown",
            careInstructions: ["Unknown"],
            bestSeason: "Unknown"
          }
        ];
      }
      
      // Validate and provide fallbacks for each plant object
      if (Array.isArray(recommendations)) {
        recommendations.forEach(plant => {
          plant.name = plant.name || "Unknown";
          plant.scientificName = plant.scientificName || "Unknown";
          plant.growthTime = plant.growthTime || "Medium";
          plant.waterNeeds = plant.waterNeeds || "Medium";
          plant.sunlight = plant.sunlight || "Partial sun";
          plant.description = plant.description || "No description available";
          plant.careInstructions = plant.careInstructions || ["General care information not available"];
          plant.bestSeason = plant.bestSeason || "Year-round";
        });
      }
      
      return recommendations;
    } catch (parseError) {
      console.error('Error parsing JSON response:', parseError);
      throw new Error('Failed to parse API response for plant recommendations');
    }
  } catch (error) {
    console.error('Error in getPlantRecommendations:', error);
    throw error;
  }
};
