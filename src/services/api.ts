
import { DiagnosisResult } from '@/types/diagnosis';

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
                       ]
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
