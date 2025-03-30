
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.48.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// API key rotation mechanism - returns a working API key or throws if all fail
async function getWorkingApiKey(): Promise<string> {
  // Primary and fallback API keys
  const primaryKey = Deno.env.get('GEMINI_API_KEY');
  const fallbackKey = Deno.env.get('GEMINI_API_KEY_FALLBACK');
  
  if (!primaryKey && !fallbackKey) {
    throw new Error('No API keys configured');
  }
  
  const keys = [primaryKey, fallbackKey].filter(Boolean) as string[];
  
  // Try the primary key first
  if (keys.length > 0) {
    return keys[0];
  }
  
  throw new Error('All API keys have failed');
}

// Function to try a request with a specific API key
async function tryRequestWithKey(apiKey: string, payload: any): Promise<Response> {
  const API_URL = 'https://generativelanguage.googleapis.com/v1beta';
  
  const response = await fetch(
    `${API_URL}/models/gemini-2.5-pro-exp-03-25:generateContent?key=${apiKey}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    }
  );
  
  return response;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Create a Supabase client with the Auth context of the function
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    );

    // Get the request body
    const { image } = await req.json();

    if (!image) {
      return new Response(
        JSON.stringify({ error: 'Image data is required' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }

    // Prepare the request payload for Gemini
    const payload = {
      contents: [
        {
          parts: [
            {
              text: `Analyze the provided plant image thoroughly to identify any diseases or issues affecting the plant. Ensure your analysis is comprehensive, taking into account visual symptoms, possible causes, and appropriate treatment options. Follow the JSON schema exactly as specified below for your output.

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

Return only the JSON output with no additional text or commentary.
`
            },
            {
              inline_data: {
                mime_type: "image/jpeg",
                data: image
              }
            }
          ]
        }
      ],
      generation_config: {
        temperature: 1,
        max_output_tokens: 65536
      },
      model: "gemini-2.5-pro-exp-03-25"
    };
    
    // Attempt API request with key rotation
    let response: Response | null = null;
    let errorMessage = '';
    
    try {
      // Get a working API key
      const apiKey = await getWorkingApiKey();
      console.log('Using API key:', apiKey.substring(0, 3) + '...');
      
      // Try the request with the selected key
      response = await tryRequestWithKey(apiKey, payload);
      
      // If we hit rate limits, try the fallback key if available
      if (response.status === 429) {
        const fallbackKey = Deno.env.get('GEMINI_API_KEY_FALLBACK');
        if (fallbackKey) {
          console.log('Primary key rate limited, trying fallback key');
          response = await tryRequestWithKey(fallbackKey, payload);
        }
      }
    } catch (keyError) {
      console.error('API key error:', keyError);
      errorMessage = 'Could not obtain a working API key.';
    }
    
    // Handle API response
    if (!response || !response.ok) {
      let statusCode = response ? response.status : 500;
      let errorDetail = errorMessage;
      
      if (response) {
        try {
          const errorText = await response.text();
          console.error(`API request failed with status: ${response.status}`, errorText);
          errorDetail = errorText;
        } catch (e) {
          console.error('Failed to parse error response', e);
        }
      }
      
      // Check if it's a rate limit error
      if (statusCode === 429) {
        return new Response(
          JSON.stringify({ 
            error: 'The API is currently experiencing high demand. Please try again in a few minutes.',
            details: 'Rate limit exceeded'
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 429 }
        );
      }
      
      return new Response(
        JSON.stringify({ error: `API request failed with status: ${statusCode}`, details: errorDetail }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: statusCode }
      );
    }
    
    const data = await response.json();
    console.log('Received response from Gemini API');
    
    // Check if we have a valid response structure
    if (!data.candidates || !data.candidates[0] || !data.candidates[0].content || !data.candidates[0].content.parts || !data.candidates[0].content.parts[0]) {
      console.error('Invalid response structure:', JSON.stringify(data));
      return new Response(
        JSON.stringify({ 
          error: 'Invalid response from AI service',
          details: 'The response from the AI service was not in the expected format'
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      );
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
      
      return new Response(
        JSON.stringify(diagnosisResult),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    } catch (parseError) {
      console.error('Error parsing JSON response:', parseError);
      return new Response(
        JSON.stringify({ error: 'Failed to parse API response' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      );
    }
  } catch (error) {
    console.error('Error in edge function:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error', details: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});
