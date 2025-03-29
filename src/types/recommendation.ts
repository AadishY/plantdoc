
export interface PlantRecommendation {
  name: string;
  scientificName: string;
  imageUrl?: string;
  generatedImageUrl?: string;
  growthTime: string;
  waterNeeds: string;
  sunlight: string;
  description: string;
  careInstructions?: string[];
  bestSeason?: string;
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
