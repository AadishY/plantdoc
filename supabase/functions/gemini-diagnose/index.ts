
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
  "plant": {
    "name": "Scientific and common name of the plant species",
    "identification_confidence": <confidence percentage as a number between 0-100>,
    "description": "Detailed description of the plant species with key identifying features"
  },
  "disease": {
    "name": "Scientific and common name of the disease or condition",
    "confidence": <confidence percentage as a number between 0-100>,
    "severity": "Low" | "Medium" | "High",
    "symptoms": ["Observed symptom 1", "Observed symptom 2", ...],
    "progression": "Description of how the disease typically progresses if left untreated"
  },
  "causes": {
    "primary": ["Most likely primary cause 1", "Most likely primary cause 2", ...],
    "secondary": ["Possible secondary factor 1", "Possible secondary factor 2", ...],
    "environmental_factors": ["Environmental factor 1", "Environmental factor 2", ...]
  },
  "treatment": {
    "immediate_actions": ["Urgent step 1", "Urgent step 2", ...],
    "long_term_steps": ["Long-term step 1", "Long-term step 2", ...],
    "chemical_treatments": {
      "organic": ["Organic treatment 1", "Organic treatment 2", ...],
      "synthetic": ["Synthetic treatment 1", "Synthetic treatment 2", ...]
    },
    "prevention": ["Prevention tip 1", "Prevention tip 2", ...]
  },
  "fertilizer_recommendation": {
    "type": "Recommended fertilizer type with specific NPK ratio if applicable",
    "application": "Detailed application instructions including timing and amount",
    "frequency": "How often to apply"
  },
  "care_recommendations": {
    "watering": "Specific watering instructions",
    "light": "Light requirements",
    "soil": "Soil recommendations",
    "pruning": "Pruning guidelines if applicable",
    "additional_tips": ["Care tip 1", "Care tip 2", ...]
  },
  "prognosis": "Assessment of recovery chances and expected timeline",
  "similar_conditions": ["Similar condition 1 to consider", "Similar condition 2 to consider", ...],
  "references": ["Scientific or authoritative reference 1", "Reference 2", ...]
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
