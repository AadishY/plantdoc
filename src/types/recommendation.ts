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
  waterRating?: number; // 1-5 droplets
  sunlight: string;
  sunlightType?: 'Full Sun' | 'Partial Sun' | 'Shade';
  description: string;
  careInstructions: string[];
  bestSeason?: string;
  season?: string;
  soilPreference?: string;
  soilPhRange?: string; // e.g. "6.0 – 6.8"
  growthVelocityDays?: string; // e.g. "65–80 Days"
  pestResistance?: 'High' | 'Moderate' | 'Exceptional';
  hardinessRating?: string; // e.g. "USDA 4–9"
  companionPlants?: string[];
  companionAvoid?: string[];
  seasonalCalendar?: {
    spring: boolean;
    summer: boolean;
    autumn: boolean;
    winter: boolean;
    bestMonth?: string;
  };
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

export type PlantingSeason = 'All' | 'Spring' | 'Summer' | 'Autumn' | 'Winter';

export interface GrowingConditions {
  country?: string;
  state?: string;
  city?: string;
  nitrogen?: number;
  phosphorus?: number;
  potassium?: number;
  ph?: number;
  rainfall?: number;
  temperature?: number;
  humidity?: number;
  soilType?: string;
  sunlight?: string;
  season?: string;
  plantCount?: number;
  mode?: 'smart' | 'fast';
}

