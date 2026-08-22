export interface DiseaseLesion {
  label: string;
  box_2d: [number, number, number, number]; // [ymin, xmin, ymax, xmax] normalized 0-1000 or 0-100
  severity: 'low' | 'medium' | 'high' | 'critical';
  confidence: number;
  description?: string;
}

export interface PlantSegmentation {
  plant_name: string;
  plant_accuracy: number;
  plant_box?: [number, number, number, number]; // [ymin, xmin, ymax, xmax]
  lesions: DiseaseLesion[];
}

export interface DiagnosisResult {
  plant: string;
  scientific_name?: string;
  family?: string;
  accuracy?: number; // Plant identification accuracy %
  disease: {
    name: string;
    confidence: number; // Disease confidence %
    severity: 'Low' | 'Medium' | 'High' | 'Critical';
    pathogen_type?: 'Fungal' | 'Bacterial' | 'Viral' | 'Pest / Insect' | 'Nutrient Deficiency' | 'Abiotic Stress' | 'Unknown';
    health_score?: number; // 0 - 100%
    recovery_prognosis?: number; // 0 - 100%
    spread_risk?: 'Low' | 'Medium' | 'High' | 'Critical';
  };
  segmentation?: PlantSegmentation;
  affected_parts?: string[];
  symptoms_breakdown?: Array<{
    symptom: string;
    severity: 'Mild' | 'Moderate' | 'Severe';
  }>;
  causes: string[];
  treatment: {
    steps: string[];
    prevention: string[];
    immediate_actions?: string[];
    organic_remedies?: string[];
    chemical_treatments?: string[];
    timeline?: {
      day_1_3?: string;
      week_1_2?: string;
      month_1?: string;
    };
  };
  fertilizer_recommendation: {
    type: string;
    application: string;
    npk_ratio?: string;
    soil_ph_advice?: string;
  };
  care_recommendations: string[];
  about_plant: {
    description: string;
    origin: string;
    common_uses: string[];
    growing_conditions: string;
    toxicity_warning?: string;
  };
}

export type DiseaseInfo = DiagnosisResult['disease'];
export type TreatmentInfo = DiagnosisResult['treatment'];
export type FertilizerRecommendation = DiagnosisResult['fertilizer_recommendation'];
export type AboutPlant = DiagnosisResult['about_plant'];
