
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
    
    // Send request to Gemini API
    console.log('Sending request to Gemini API...');
    const response = await fetch(
      `${API_URL}/models/gemini-2.5-pro-exp-03-25:generateContent?key=${API_KEY}`,
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
      const diagnosisResult = JSON.parse(jsonStr);
      
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
