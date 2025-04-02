
export interface PlantRecommendation {
  name: string;
  scientificName: string;
  growthTime: string;
  waterNeeds: string;
  sunlight: string;
  description: string;
  careInstructions: string[];  // Changed from optional to required
  bestSeason: string;          // Changed from optional to required
  idealTemperature?: {
    min: number;
    max: number;
  };
}

export interface GrowingConditions {
  nitrogen: number;
  phosphorus: number;
  potassium: number;
  ph: number;
  rainfall: number;
  temperature: number;
  humidity: number;
  country: string;
  state: string;
  city?: string;
  soilType: string;
  sunlight: string;
}
