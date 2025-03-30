
import { DiagnosisResult } from '@/types/diagnosis';
import { PlantRecommendation, GrowingConditions } from '@/types/recommendation';
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

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
    
    // Call the Supabase Edge Function for plant diagnosis
    const { data, error, statusText } = await supabase.functions.invoke('gemini-diagnose', {
      body: { image: imageBase64 }
    });
    
    if (error) {
      console.error('Error calling edge function:', error);
      
      // Check if it's a rate limit error by looking at statusText or error message
      if (error.message?.includes('429') || statusText === '429' || error.message?.includes('rate limit')) {
        toast.error("API quota exceeded. Please try again later.");
        throw new Error("API quota exceeded. The service is currently experiencing high demand. Please try again in a few minutes.");
      }
      
      throw new Error(error.message);
    }
    
    // Check if data contains an error message
    if (data && 'error' in data) {
      console.error('Error in response data:', data.error);
      throw new Error(data.error);
    }
    
    return data as DiagnosisResult;
  } catch (error) {
    console.error('Error in diagnosePlant:', error);
    throw error;
  }
};

// Function to get climate data based on location
export const getClimateDatabByLocation = async (country: string, state: string, city?: string): Promise<{ temperature: number, rainfall: number, humidity: number }> => {
  try {
    // Call the Supabase Edge Function for climate data
    const { data, error, statusText } = await supabase.functions.invoke('gemini-climate', {
      body: { country, state, city }
    });
    
    if (error) {
      console.error('Error calling edge function:', error);
      
      // Check if it's a rate limit error
      if (error.message?.includes('429') || statusText === '429' || error.message?.includes('rate limit')) {
        toast.error("API quota exceeded. Using default climate values.");
      }
      
      throw new Error(error.message);
    }
    
    // Check if data contains an error message
    if (data && 'error' in data) {
      console.error('Error in response data:', data.error);
      throw new Error(data.error);
    }
    
    return data as { temperature: number, rainfall: number, humidity: number };
  } catch (error) {
    console.error('Error getting climate data:', error);
    // Return default values on error
    return { temperature: 25, rainfall: 150, humidity: 60 };
  }
};

// Plant recommendation function
export const getPlantRecommendations = async (conditions: GrowingConditions): Promise<PlantRecommendation[]> => {
  try {
    // Call the Supabase Edge Function for plant recommendations
    const { data, error, statusText } = await supabase.functions.invoke('gemini-recommend', {
      body: conditions
    });
    
    if (error) {
      console.error('Error calling edge function:', error);
      
      // Check if it's a rate limit error
      if (error.message?.includes('429') || statusText === '429' || error.message?.includes('rate limit')) {
        toast.error("API quota exceeded. Please try again later.");
        throw new Error("API quota exceeded. The service is currently experiencing high demand. Please try again in a few minutes.");
      }
      
      throw new Error(error.message);
    }
    
    // Check if data contains an error message
    if (data && 'error' in data) {
      console.error('Error in response data:', data.error);
      throw new Error(data.error);
    }
    
    return data as PlantRecommendation[];
  } catch (error) {
    console.error('Error in getPlantRecommendations:', error);
    throw error;
  }
};
