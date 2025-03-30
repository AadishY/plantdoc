
// Shared configuration for all Gemini API functions

// The model to use for all Gemini API requests
// This can be modified to use different versions of Gemini
export const GEMINI_MODEL = "gemini-2.0-flash";

// CORS headers used by all edge functions
export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// API key rotation mechanism - returns a working API key or throws if all fail
export async function getWorkingApiKey(): Promise<string> {
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
export async function tryRequestWithKey(apiKey: string, payload: any): Promise<Response> {
  const API_URL = 'https://generativelanguage.googleapis.com/v1beta';
  
  const response = await fetch(
    `${API_URL}/models/${GEMINI_MODEL}:generateContent?key=${apiKey}`,
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
