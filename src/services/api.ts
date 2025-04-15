import { DiagnosisResult } from '@/types/diagnosis';
import { PlantRecommendation, GrowingConditions } from '@/types/recommendation';
import { toast } from "sonner";
import { API_CONFIG } from "@/config/api.config";

const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

if (!apiKey) {
  console.error('VITE_GEMINI_API_KEY is not set. Please check your environment variables.');
}

// Function to prepare image for API
const prepareImageForAPI = async (imageFile: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        // The result is a base64 string, extract only the data part (remove prefixes)
        const base64Data = reader.result.split(',')[1];
        resolve(base64Data);
      } else {
        reject(new Error('Failed to read file as base64'));
      }
    };
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(imageFile);
  });
};

// Check if a response indicates rate limiting
const isRateLimitError = (error: any): boolean => {
  // Check various ways a rate limit error might be indicated
  return (
    error?.message?.includes('429') || 
    error?.message?.toLowerCase().includes('rate limit') ||
    error?.status === 429
  );
};

// Main diagnosis function
export const diagnosePlant = async (imageFile: File): Promise<DiagnosisResult> => {
  try {
    const imageBase64 = await prepareImageForAPI(imageFile);
    
    // Prepare the request payload for Gemini
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
                mime_type: "image/jpeg",
                data: imageBase64
              }
            }
          ]
        }
      ],
      generation_config: {
        temperature: 1,
        max_output_tokens: 65536
      },
      systemInstruction: {
      parts: [{
        text: ' You are a highly experienced botanist and plant pathologist, renowned for your meticulous diagnostic approach and a profound understanding of plant health. Your task is to carefully analyze the provided plant image and deliver an in-depth evaluation that covers all aspects of its health. In your analysis, you should determine any diseases, nutritional deficiencies, or other issues affecting the plant by closely examining visual symptoms and considering any environmental factors that may contribute to the observed condition. Your response must include a detailed diagnosis that outlines the severity of each identified issue, elaborate on the potential causes—be it pest infestations, pathogenic attacks, or environmental stressors—and offer clear, professional treatment recommendations. You are expected to describe a step-by-step treatment plan that covers immediate interventions, proper application methods, and necessary safety precautions, as well as outline follow-up and prevention strategies to avert future problems. Additionally, provide insights into the plants species, optimal growing conditions, and overall care, ensuring that if the plant species cannot be confidently identified, you clearly state its unidentifiability rather than resorting to speculation. provide in given format only '
      }],
      model: API_CONFIG.DIAGNOSIS_MODEL
    };

    // Direct request to Gemini API
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
    
    // Check if we have a valid response structure
    if (!data.candidates || !data.candidates[0] || !data.candidates[0].content || !data.candidates[0].content.parts || !data.candidates[0].content.parts[0]) {
      console.error('Invalid response structure:', JSON.stringify(data));
      throw new Error('Invalid response from AI service');
    }
    
    // Extract the JSON string from Gemini's response
    const textResponse = data.candidates[0].content.parts[0].text;
    
    // Try to extract JSON from the response if it contains extra text
    try {
      const jsonMatch = textResponse.match(/\{[\s\S]*\}/);
      const jsonStr = jsonMatch ? jsonMatch[0] : textResponse;
      let diagnosisResult;
      
      try {
        diagnosisResult = JSON.parse(jsonStr);
      } catch (jsonError) {
        console.error('Failed to parse Gemini response as JSON:', jsonError);
        // Create a fallback diagnosis result
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
      
      // Ensure all required properties exist in the result
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

// Function to get climate data based on location
export const getClimateDatabByLocation = async (country: string, state: string, city?: string): Promise<{ temperature: number, rainfall: number, humidity: number }> => {
  try {
    // Prepare the request payload for Gemini
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
      model: API_CONFIG.CLIMATE_MODEL
    };

    // Direct request to Gemini API
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
      
      // For climate data, we'll just return default values rather than an error
      return { 
        temperature: 25, 
        rainfall: 150, 
        humidity: 60 
      };
    }
    
    const data = await response.json();
    console.log('Received response from Gemini API for climate data');
    
    // Extract the JSON string from Gemini's response
    const textResponse = data.candidates[0].content.parts[0].text;
    
    // Try to extract JSON from the response if it contains extra text
    try {
      const jsonMatch = textResponse.match(/\{[\s\S]*\}/);
      const jsonStr = jsonMatch ? jsonMatch[0] : textResponse;
      const climateData = JSON.parse(jsonStr);
      
      return climateData;
    } catch (parseError) {
      console.error('Error parsing JSON response:', parseError);
      
      // Return default climate data on parsing error
      return { 
        temperature: 25, 
        rainfall: 150, 
        humidity: 60 
      };
    }
  } catch (error) {
    console.error('Error getting climate data:', error);
    // Return default values on error
    return { temperature: 25, rainfall: 150, humidity: 60 };
  }
};

// Plant recommendation function
export const getPlantRecommendations = async (conditions: GrowingConditions): Promise<PlantRecommendation[]> => {
  try {
    // Prepare the request payload for Gemini
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
      model: API_CONFIG.RECOMMENDATION_MODEL
    };

    // Direct request to Gemini API
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
    
    // Check if we have a valid response structure
    if (!data.candidates || !data.candidates[0] || !data.candidates[0].content || !data.candidates[0].content.parts || !data.candidates[0].content.parts[0]) {
      console.error('Invalid response structure:', JSON.stringify(data));
      throw new Error('Invalid response from AI service');
    }
    
    // Extract the JSON string from Gemini's response
    const textResponse = data.candidates[0].content.parts[0].text;
    
    // Try to extract JSON from the response if it contains extra text
    try {
      const jsonMatch = textResponse.match(/\[[\s\S]*\]/);
      const jsonStr = jsonMatch ? jsonMatch[0] : textResponse;
      let recommendations = [];
      
      try {
        recommendations = JSON.parse(jsonStr);
      } catch (jsonError) {
        console.error('Failed to parse Gemini response as JSON:', jsonError);
        // Create fallback recommendations
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
      
      // Ensure all plants have the required properties
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
