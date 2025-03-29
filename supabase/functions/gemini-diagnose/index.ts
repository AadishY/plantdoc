
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.48.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

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

    // Base URL for Google Gemini API
    const API_URL = 'https://generativelanguage.googleapis.com/v1beta';
    // Get API key from environment variables (stored in Supabase secrets)
    const API_KEY = Deno.env.get('GEMINI_API_KEY');

    if (!API_KEY) {
      console.error('Missing GEMINI_API_KEY in environment variables');
      return new Response(
        JSON.stringify({ error: 'API key configuration error' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      );
    }

    console.log('Using API key:', API_KEY.substring(0, 3) + '...');
    console.log('Preparing request to Gemini API...');

    // Enhanced prompt with more detailed instructions for better plant analysis
    const enhancedPrompt = `You are an expert botanist and plant pathologist with extensive knowledge of plant species, plant diseases, and plant care. Analyze the provided plant image thoroughly to identify any diseases or issues affecting the plant.

First, carefully observe all visual details of the plant:
1. Leaf appearance (color, spots, curling, wilting)
2. Stem condition
3. Overall plant structure and health
4. Any visible pests or signs of pest damage
5. Growing conditions that can be inferred from the image

Be methodical and precise in your analysis. Consider all possible causes for the observed symptoms, including diseases, nutrient deficiencies, pests, environmental stress, and inadequate care.

Your response must follow this exact JSON structure:

{
  "plant": "Scientific and common name of the plant species",
  "disease": {
    "name": "Scientific and common name of the disease or condition",
    "confidence": <confidence percentage as a number between 0-100>,
    "severity": "Low" | "Medium" | "High"
  },
  "causes": ["Most likely cause 1", "Most likely cause 2", ...],
  "treatment": {
    "steps": ["Treatment step 1", "Treatment step 2", ...],
    "prevention": ["Prevention tip 1", "Prevention tip 2", ...]
  },
  "fertilizer_recommendation": {
    "type": "Recommended fertilizer type with specific NPK ratio if applicable",
    "application": "Detailed application instructions including timing and amount"
  },
  "care_recommendations": ["Care tip 1", "Care tip 2", ...],
  "about_plant": {
    "description": "Detailed description of the plant species with key identifying features",
    "origin": "Geographic origin of the plant",
    "common_uses": ["Use 1", "Use 2", ...],
    "growing_conditions": "Ideal growing conditions for this plant"
  }
}

If you cannot identify the plant or disease with confidence, indicate this clearly in your response with appropriate confidence levels. If certain fields cannot be determined from the image, include them but note the limitations.

Return only the JSON output with no additional text or commentary.`;

    // Prepare the request payload for Gemini
    const payload = {
      contents: [
        {
          parts: [
            {
              text: enhancedPrompt
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
        temperature: 0.4,
        max_output_tokens: 65536
      },
      model: "gemini-1.5-pro"
    };
    
    // Send request to Gemini API
    console.log('Sending request to Gemini API...');
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
      const errorText = await response.text();
      console.error(`API request failed with status: ${response.status}`, errorText);
      return new Response(
        JSON.stringify({ error: `API request failed with status: ${response.status}` }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      );
    }
    
    const data = await response.json();
    console.log('Received response from Gemini API');
    
    // Extract the JSON string from Gemini's response
    const textResponse = data.candidates[0].content.parts[0].text;
    
    // Try to extract JSON from the response if it contains extra text
    try {
      const jsonMatch = textResponse.match(/\{[\s\S]*\}/);
      const jsonStr = jsonMatch ? jsonMatch[0] : textResponse;
      const parsedResponse = JSON.parse(jsonStr);
      
      // Ensure the response matches our expected format
      const diagnosisResult = {
        plant: parsedResponse.plant || "Unknown plant",
        disease: {
          name: parsedResponse.disease?.name || "Unknown condition",
          confidence: parsedResponse.disease?.confidence || 0,
          severity: parsedResponse.disease?.severity || "Low"
        },
        causes: parsedResponse.causes || [],
        treatment: {
          steps: parsedResponse.treatment?.steps || [],
          prevention: parsedResponse.treatment?.prevention || []
        },
        fertilizer_recommendation: {
          type: parsedResponse.fertilizer_recommendation?.type || "No specific recommendation",
          application: parsedResponse.fertilizer_recommendation?.application || "No application instructions"
        },
        care_recommendations: parsedResponse.care_recommendations || [],
        about_plant: parsedResponse.about_plant || null
      };
      
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
      JSON.stringify({ error: 'Internal server error' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});
