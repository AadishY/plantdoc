
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.48.0";
import { corsHeaders, getWorkingApiKey, tryRequestWithKey, GEMINI_MODEL } from "../_shared/config.ts";

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
      model: GEMINI_MODEL
    };
    
    // Attempt API request with key rotation
    let response: Response | null = null;
    let errorMessage = '';
    
    try {
      // Get a working API key
      const apiKey = await getWorkingApiKey();
      console.log('Using API key:', apiKey.substring(0, 3) + '...');
      
      // Try the request with the selected key
      console.log('Sending request to Gemini API for climate data...');
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
    
    // If we still have an error or no response, return default climate data
    if (!response || !response.ok) {
      console.error('Error getting climate data, using defaults');
      
      // For climate data, we'll just return default values rather than an error
      return new Response(
        JSON.stringify({ 
          temperature: 25, 
          rainfall: 150, 
          humidity: 60,
          note: "Using default values due to API limitations"
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
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
      
      // Return default climate data on parsing error
      return new Response(
        JSON.stringify({ 
          temperature: 25, 
          rainfall: 150, 
          humidity: 60,
          note: "Using default values due to parsing error"
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
  } catch (error) {
    console.error('Error in edge function:', error);
    
    // Return default climate data on any error
    return new Response(
      JSON.stringify({ 
        temperature: 25, 
        rainfall: 150, 
        humidity: 60,
        note: "Using default values due to server error"
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
