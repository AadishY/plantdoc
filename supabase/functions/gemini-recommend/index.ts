
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
    const conditions = await req.json();

    if (!conditions) {
      return new Response(
        JSON.stringify({ error: 'Growing conditions are required' }),
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
    console.log('Preparing request to Gemini API for plant recommendations...');

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
      model: "gemini-2.5-pro-exp-03-25"
    };
    
    // Send request to Gemini API
    console.log('Sending request to Gemini API for plant recommendations...');
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
      
      // Check if it's a rate limit error
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ 
            error: 'The API is currently experiencing high demand. Please try again in a few minutes.',
            details: 'Rate limit exceeded'
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 429 }
        );
      }
      
      return new Response(
        JSON.stringify({ error: `API request failed with status: ${response.status}` }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      );
    }
    
    const data = await response.json();
    console.log('Received response from Gemini API for plant recommendations');
    
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
            name: "Snake Plant",
            scientificName: "Sansevieria trifasciata",
            growthTime: "Slow",
            waterNeeds: "Low",
            sunlight: "Partial sun",
            description: "A hardy plant that thrives in most conditions. Great for beginners.",
            careInstructions: ["Water sparingly", "Tolerates low light", "Prefers warm temperatures"],
            bestSeason: "Year-round"
          },
          {
            name: "Pothos",
            scientificName: "Epipremnum aureum",
            growthTime: "Fast",
            waterNeeds: "Medium",
            sunlight: "Partial sun",
            description: "Very adaptable vine that can thrive in various conditions.",
            careInstructions: ["Allow soil to dry between waterings", "Prune regularly", "Can grow in water or soil"],
            bestSeason: "Year-round"
          }
        ];
      }
      
      // Ensure all plants have the required properties
      recommendations = recommendations.map(plant => ({
        name: plant.name || "Unknown",
        scientificName: plant.scientificName || "Unknown",
        growthTime: plant.growthTime || "Medium",
        waterNeeds: plant.waterNeeds || "Medium",
        sunlight: plant.sunlight || "Partial sun",
        description: plant.description || "No description available",
        careInstructions: Array.isArray(plant.careInstructions) ? plant.careInstructions : ["General care information not available"],
        bestSeason: plant.bestSeason || "Year-round"
      }));
      
      // Ensure we always return at least one recommendation
      if (recommendations.length === 0) {
        recommendations = [
          {
            name: "Jade Plant",
            scientificName: "Crassula ovata",
            growthTime: "Slow",
            waterNeeds: "Low",
            sunlight: "Full sun",
            description: "A resilient succulent that adapts to many environments.",
            careInstructions: ["Water when soil is dry", "Needs good drainage", "Prefers bright light"],
            bestSeason: "Year-round"
          }
        ];
      }
      
      return new Response(
        JSON.stringify(recommendations),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    } catch (parseError) {
      console.error('Error parsing JSON response:', parseError);
      return new Response(
        JSON.stringify({ error: 'Failed to parse API response for plant recommendations' }),
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
