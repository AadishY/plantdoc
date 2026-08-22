export interface PlantLink {
  title: string;
  url: string;
  type: 'wiki' | 'care' | 'buy' | 'calendar' | 'search';
}

export type PlantCategory = 'Mix' | 'Crops' | 'Fruit' | 'Flower' | 'Herbs';

export interface PlantRecommendation {
  id?: string;
  name: string;
  scientificName: string;
  family?: string;
  category?: string;
  growthTime?: string;
  growthRate?: string;
  waterNeeds: string;
  sunlight: string;
  description: string;
  careInstructions: string[];
  bestSeason?: string;
  season?: string;
  soilPreference?: string;
  companionPlants?: string[];
  idealTemperature?: {
    min: number;
    max: number;
  };
  matchScore?: number;
  compatibilityReason?: string;
  // Wikimedia / Wikipedia fetched data
  imageUrl?: string | null;
  imageLoading?: boolean;
  wikiUrl?: string;
  wikipediaUrl?: string;
  wikiSummary?: string;
  searchSeedUrl?: string;
  links?: PlantLink[];
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
