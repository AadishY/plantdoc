import { API_CONFIG } from '@/config/api.config';

// Base URL and headers for API requests
const baseUrl = API_CONFIG.BASE_URL;
const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

if (!apiKey) {
  console.error('VITE_GEMINI_API_KEY is not set. Please check your environment variables.');
}

// Function to make a request to the Gemini API
const makeGeminiRequest = async (model: string, prompt: string, image?: string) => {
  // Prepare the basic content parts
  const contentParts: any[] = [
    {
      text: prompt
    }
  ];
  
  // Add image if provided
  if (image) {
    contentParts.push({
      inline_data: {
        mime_type: "image/jpeg",
        data: image
      }
    });
  }
  
  // Prepare the payload
  const payload = {
    contents: [
      {
        parts: contentParts
      }
    ],
    generation_config: {
      temperature: 1,
      max_output_tokens: 8000
    }
  };
  
  try {
    const response = await fetch(
      `${baseUrl}/models/${model}:generateContent?key=${apiKey}`,
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
      throw new Error(`API request failed with status: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error in API request:', error);
    throw error;
  }
};

// Function to diagnose a plant from an image
export const diagnosePlant = async (imageFile: File) => {
  // Convert the image file to base64
  const imageBase64 = await fileToBase64(imageFile);
  
  const prompt = `Analyze the provided plant image thoroughly to identify any diseases or issues affecting the plant. Ensure your analysis is comprehensive, taking into account visual symptoms, possible causes, and appropriate treatment options. Follow the JSON schema exactly as specified below for your output.

{
  "plant": "Plant species name",
  "disease": {
    "name": "Disease name",
    "confidence": <confidence percentage as a number>,
    "severity": "Low" | "Medium" | "High"
  },
  "causes": ["Likely cause 1", "Likely cause 2", ...],
  "treatment": {
    "steps": ["Proper professional detailed Treatment step 1", "Proper professional detailed Treatment step 2", "Proper professional detailed Treatment step 3", ...],
    "prevention": ["Proper detailed professional Prevention tip 1", "Proper professional detailed Prevention tip 2", ...]
  },
  "fertilizer_recommendation": {
    "type": "Recommended fertilizer type, its name or it composition",
    "application": "Application instructions"
  },
  "care_recommendations": [
    "Care tip 1 or anyother details like what to add",
    "Care tip 2",
    ...
  ],
  "about_plant": {
    "description": "IMPORTANT IF YOU ARE NOT SURE THEN DO NO GIVE RESPONSE. Brief description of the plant species by identifying from the image only, do not need to give random answer if you dont know simply say can't indentified",
    "origin": "Geographic origin of the plant",
    "common_uses": ["Use 1", "Use 2", ...],
    "growing_conditions": "Preferred growing conditions"
  }
}

Return only the JSON output with no additional text or commentary.`;

  try {
    const data = await makeGeminiRequest(API_CONFIG.DIAGNOSIS_MODEL, prompt, imageBase64);
    
    // Extract the JSON string from Gemini's response
    const textResponse = data.candidates[0].content.parts[0].text;
    
    // Try to extract JSON from the response
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
  } catch (error) {
    console.error('Error in diagnose plant:', error);
    throw error;
  }
};

// Helper function to convert File to base64 string
const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      // Extract the base64 part from the Data URL
      const base64String = reader.result as string;
      // Remove the data URL prefix (e.g., "data:image/jpeg;base64,")
      const base64Content = base64String.split(',')[1];
      resolve(base64Content);
    };
    reader.onerror = error => reject(error);
  });
};

// Function to get climate data
export const getClimateData = async (country: string, state: string, city?: string) => {
  const prompt = `Given the location information:
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
    
    Only provide the JSON object, no other text.`;

  try {
    const data = await makeGeminiRequest(API_CONFIG.CLIMATE_MODEL, prompt);
    
    // Extract the JSON string from Gemini's response
    const textResponse = data.candidates[0].content.parts[0].text;
    
    // Try to extract JSON from the response
    const jsonMatch = textResponse.match(/\{[\s\S]*\}/);
    const jsonStr = jsonMatch ? jsonMatch[0] : textResponse;
    
    try {
      const climateData = JSON.parse(jsonStr);
      return climateData;
    } catch (parseError) {
      console.error('Error parsing JSON response:', parseError);
      
      // Return default climate data on parsing error
      return { 
        temperature: 25, 
        rainfall: 150, 
        humidity: 60,
        note: "Using default values due to parsing error"
      };
    }
  } catch (error) {
    console.error('Error in get climate data:', error);
    
    // Return default climate data on any error
    return { 
      temperature: 25, 
      rainfall: 150, 
      humidity: 60,
      note: "Using default values due to server error"
    };
  }
};

// Function to get plant recommendations
export const getPlantRecommendations = async (conditions: any) => {
  const prompt = `Given the following growing conditions, recommend 6 plants that would thrive in this environment.
    Return your recommendations in JSON format as an array with the following structure for each plant:
    [
      {
        "name": "Common plant name",
        "scientificName": "Latin name",
        "growthTime": "Fast/Medium/Slow growth",
        "waterNeeds": "Low/Medium/High",
        "sunlight": "Full sun/Partial sun/Shade",
        "description": "Brief description of the plant and why it's suitable for these conditions",
        "careInstructions": ["Care instruction 1", "Care instruction 2", "Care instruction 3"],
        "bestSeason": "Spring/Summer/Fall/Winter"
      },
      // 5 more plants...
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
    
    Only provide the JSON array, no other text. and be sure to give total 6 plants`;

  try {
    const data = await makeGeminiRequest(API_CONFIG.RECOMMENDATION_MODEL, prompt);
    
    // Extract the JSON string from Gemini's response
    const textResponse = data.candidates[0].content.parts[0].text;
    
    // Try to extract JSON from the response
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
    
    // Ensure we always return an array of 6 plants
    while (recommendations.length < 6) {
      // Add placeholder plants if we don't have enough
      recommendations.push({
        name: `Plant ${recommendations.length + 1}`,
        scientificName: "Placeholder",
        growthTime: "Medium",
        waterNeeds: "Medium",
        sunlight: "Partial sun",
        description: "Plant recommendation data not available",
        careInstructions: ["General care information not available"],
        bestSeason: "Year-round"
      });
    }
    
    return recommendations;
  } catch (error) {
    console.error('Error in get plant recommendations:', error);
    throw error;
  }
};
