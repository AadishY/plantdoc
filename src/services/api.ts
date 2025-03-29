
import { DiagnosisResult } from '@/types/diagnosis';
import { PlantRecommendation, GrowingConditions } from '@/types/recommendation';

// Base URL for Google Gemini API
const API_URL = 'https://generativelanguage.googleapis.com/v1beta';

// Get API key from env variable or use a default (for development only)
// In production, this should be securely stored and accessed
const API_KEY = "AIzaSyAkydbLKfcTBmG3qFC928oYIipZpV5AXqk";

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
              text: `Analyze this plant image and diagnose any diseases or issues. 
                     Return your analysis in JSON format with the following structure:
                     {
                       "plant": "Plant species name",
                       "disease": {
                         "name": "Disease name",
                         "confidence": confidence percentage (number),
                         "severity": "Low/Medium/High"
                       },
                       "causes": ["Likely cause 1", "Likely cause 2"],
                       "treatment": {
                         "steps": ["Treatment step 1", "Treatment step 2", "Treatment step 3"],
                         "prevention": ["Prevention tip 1", "Prevention tip 2"]
                       },
                       "fertilizer_recommendation": {
                         "type": "Recommended fertilizer type",
                         "application": "Application instructions"
                       },
                       "care_recommendations": [
                         "Care tip 1",
                         "Care tip 2"
                       ],
                       "about_plant": {
                         "description": "Brief description of the plant species",
                         "origin": "Geographic origin of the plant",
                         "common_uses": ["Use 1", "Use 2"],
                         "growing_conditions": "Preferred growing conditions"
                       }
                     }
                     Only provide the JSON, no other text.`
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
        temperature: 0.4,
        max_output_tokens: 2048
      },
      model: "gemini-1.5-pro"
    };
    
    // Send request to Gemini API
    const response = await fetch(
      `${API_URL}/models/gemini-1.5-pro:generateContent?key=${API_KEY}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      }
    );
    
    if (!response.ok) {
      throw new Error(`API request failed with status: ${response.status}`);
    }
    
    const data = await response.json();
    
    // Extract the JSON string from Gemini's response
    const textResponse = data.candidates[0].content.parts[0].text;
    
    // Parse the JSON string to get the diagnosis result
    try {
      // Try to extract JSON from the response if it contains extra text
      const jsonMatch = textResponse.match(/\{[\s\S]*\}/);
      const jsonStr = jsonMatch ? jsonMatch[0] : textResponse;
      const diagnosisResult = JSON.parse(jsonStr) as DiagnosisResult;
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

// Function to generate plant image
export const generatePlantImage = async (plantName: string): Promise<string> => {
  try {
    // Prepare the request payload for Gemini
    const payload = {
      prompt: {
        text: `A realistic, detailed image of a ${plantName} plant. Show the plant in a natural setting with good light to showcase its features.`
      },
      model: "gemini-2.0-flash-exp-image-generation"
    };
    
    // Send request to Gemini API
    const response = await fetch(
      `${API_URL}/models/gemini-2.0-flash-exp-image-generation:generateContent?key=${API_KEY}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      }
    );
    
    if (!response.ok) {
      console.error('Image generation failed:', await response.text());
      return ''; // Return empty string if generation fails
    }
    
    const data = await response.json();
    
    // Extract the image data from response
    if (data.candidates && 
        data.candidates[0] && 
        data.candidates[0].content && 
        data.candidates[0].content.parts && 
        data.candidates[0].content.parts[0] &&
        data.candidates[0].content.parts[0].inline_data &&
        data.candidates[0].content.parts[0].inline_data.data) {
      return `data:image/jpeg;base64,${data.candidates[0].content.parts[0].inline_data.data}`;
    }
    
    return ''; // Return empty string if image data isn't found
  } catch (error) {
    console.error('Error in generatePlantImage:', error);
    return ''; // Return empty string on error
  }
};

// Get climate data based on location
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
      model: "gemini-1.5-pro"
    };
    
    // Send request to Gemini API
    const response = await fetch(
      `${API_URL}/models/gemini-1.5-pro:generateContent?key=${API_KEY}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      }
    );
    
    if (!response.ok) {
      throw new Error(`API request failed with status: ${response.status}`);
    }
    
    const data = await response.json();
    
    // Extract the JSON string from Gemini's response
    const textResponse = data.candidates[0].content.parts[0].text;
    
    // Parse the JSON string
    try {
      // Try to extract JSON from the response if it contains extra text
      const jsonMatch = textResponse.match(/\{[\s\S]*\}/);
      const jsonStr = jsonMatch ? jsonMatch[0] : textResponse;
      const climateData = JSON.parse(jsonStr);
      return climateData;
    } catch (parseError) {
      console.error('Error parsing climate data:', parseError);
      // Return default values if parsing fails
      return { temperature: 25, rainfall: 150, humidity: 60 };
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
                         "imageUrl": "Leave this empty, I'll use a placeholder",
                         "growthTime": "Fast/Medium/Slow growth",
                         "waterNeeds": "Low/Medium/High",
                         "sunlight": "Full sun/Partial sun/Shade",
                         "description": "Brief description of the plant and why it's suitable for these conditions",
                         "careInstructions": ["Care instruction 1", "Care instruction 2", "Care instruction 3"],
                         "bestSeason": "Spring/Summer/Fall/Winter"
                       },
                       // more plants...
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
                     
                     Only provide the JSON array, no other text.`
            }
          ]
        }
      ],
      generation_config: {
        temperature: 0.4,
        max_output_tokens: 2048
      },
      model: "gemini-1.5-pro"
    };
    
    // Send request to Gemini API
    const response = await fetch(
      `${API_URL}/models/gemini-1.5-pro:generateContent?key=${API_KEY}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      }
    );
    
    if (!response.ok) {
      throw new Error(`API request failed with status: ${response.status}`);
    }
    
    const data = await response.json();
    
    // Extract the JSON string from Gemini's response
    const textResponse = data.candidates[0].content.parts[0].text;
    
    // Parse the JSON string to get the recommendations
    try {
      // Try to extract JSON from the response if it contains extra text
      const jsonMatch = textResponse.match(/\[[\s\S]*\]/);
      const jsonStr = jsonMatch ? jsonMatch[0] : textResponse;
      const recommendations = JSON.parse(jsonStr) as PlantRecommendation[];
      
      // Generate images for each plant (in parallel)
      const recommendationsWithImages = await Promise.all(
        recommendations.map(async plant => {
          try {
            const imageUrl = await generatePlantImage(plant.name);
            return {
              ...plant,
              generatedImageUrl: imageUrl
            };
          } catch (error) {
            console.error(`Error generating image for ${plant.name}:`, error);
            return plant;
          }
        })
      );
      
      return recommendationsWithImages;
    } catch (parseError) {
      console.error('Error parsing JSON response:', parseError);
      throw new Error('Failed to parse API response for plant recommendations');
    }
  } catch (error) {
    console.error('Error in getPlantRecommendations:', error);
    throw error;
  }
};
