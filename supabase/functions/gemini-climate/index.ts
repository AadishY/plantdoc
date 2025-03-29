
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
    const { country, state, city } = await req.json();

    if (!country || !state) {
      return new Response(
        JSON.stringify({ error: 'Country and state/region are required' }),
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
    console.log('Preparing request to Gemini API for climate data...');

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
      model: "gemini-2.5-pro-exp-03-25"
    };
    
    // Send request to Gemini API
    console.log('Sending request to Gemini API for climate data...');
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
    console.log('Received response from Gemini API for climate data');
    
    // Extract the JSON string from Gemini's response
    const textResponse = data.candidates[0].content.parts[0].text;
    
    // Try to extract JSON from the response if it contains extra text
    try {
      const jsonMatch = textResponse.match(/\{[\s\S]*\}/);
      const jsonStr = jsonMatch ? jsonMatch[0] : textResponse;
      const climateData = JSON.parse(jsonStr);
      
      return new Response(
        JSON.stringify(climateData),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    } catch (parseError) {
      console.error('Error parsing JSON response:', parseError);
      return new Response(
        JSON.stringify({ error: 'Failed to parse API response for climate data' }),
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
