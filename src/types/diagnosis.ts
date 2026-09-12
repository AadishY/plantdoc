export interface DiseaseLesion {
  label: string;
  box_2d: [number, number, number, number]; // [ymin, xmin, ymax, xmax] normalized 0-1000 or 0-100
  severity: 'low' | 'medium' | 'high' | 'critical';
  confidence: number;
  description?: string;
  lesion_type?: 'necrotic_spot' | 'chlorotic_halo' | 'insect_perforation' | 'blight_scorch' | 'fungal_pustule' | 'powdery_mildew' | 'water_soaked' | 'deficiency_yellowing' | 'general_defect';
  affected_area_pct?: number;
  recommended_action?: string;
}

export interface PlantSegmentation {
  plant_name: string;
  plant_accuracy: number;
  plant_box?: [number, number, number, number]; // [ymin, xmin, ymax, xmax]
  lesions: DiseaseLesion[];
  total_foliar_damage_pct?: number;
  dominant_symptom?: string;
  inspection_timestamp?: string;
}

export interface PrimarySuspect {
  name: string; // The explicit name of the issue
  category: 'Pests' | 'Pathogens' | 'Abiotic / Environmental Stress';
  sub_type?: string; // e.g. Sap-sucking mite, Ascomycete fungus, Micronutrient imbalance
  description?: string; // Clinical diagnosis reasoning
  symptom_evidence?: string[];
  common_examples?: string[]; // e.g. Spider mites, Aphids, Fungus gnats
}

export interface DiagnosisResult {
  plant: string;
  scientific_name?: string;
  family?: string;
  accuracy?: number; // Plant identification accuracy %
  diagnosedByModel?: string; // Model used for clinical formulation (e.g. gemini-3.8-flash, gemini-3.7-flash, gemini-3.6-flash, qwen/qwen3.8-27b)
  aiMode?: 'smart' | 'fast'; // Diagnostic processing mode (smart: Google AI, fast: Groq AI)
  modelShiftNotice?: string; // Notice if failover to secondary or tertiary model occurred
  disease: {
    name: string;
    confidence: number; // Disease confidence %
    severity: 'Low' | 'Medium' | 'High' | 'Critical';
    pathogen_type?: 'Fungal' | 'Bacterial' | 'Viral' | 'Pest / Insect' | 'Nutrient Deficiency' | 'Abiotic Stress' | 'Unknown';
    health_score?: number; // 0 - 100%
    recovery_prognosis?: number; // 0 - 100%
    spread_risk?: 'Low' | 'Medium' | 'High' | 'Critical';
    suspect_category?: 'Pests' | 'Pathogens' | 'Abiotic / Environmental Stress';
  };
  primary_suspect?: PrimarySuspect;
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
    home_remedies?: Array<{
      name: string;
      ingredients: string[];
      preparation: string;
      application: string;
      mechanism: string;
    }>;
    chemical_treatments?: string[];
    timeline?: {
      day_1_3?: string;
      week_1_2?: string;
      month_1?: string;
    };
  };
  secondary_pathogen_risk?: {
    opportunistic_invaders: Array<{
      pathogen_name: string;
      risk_level: 'Low' | 'Moderate' | 'High' | 'Severe';
      entry_mechanism: string;
      warning_flag: string;
    }>;
    insect_attraction_index: {
      score: number; // 0 to 100
      level: 'Low' | 'Moderate' | 'High' | 'Severe';
      attracted_pests: string[];
      vector_summary: string;
    };
  };
  inoculum_vectors?: {
    primary_source: string; // e.g. "Overwintered fallen leaf debris & dormant bud scale cankers"
    transmission_pathways: string[]; // e.g. ["Splashing rain droplets", "Contaminated pruning shears", "Airborne spore drafts"]
    favorable_microclimate: string; // e.g. "Extended leaf wetness >6h with temps between 18-24°C"
    soil_survival_duration?: string; // e.g. "12-24 months in uncomposted leaf mulch"
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
  differential_diagnoses?: Array<{
    disease_name: string;
    probability: number;
    distinguishing_feature: string;
  }>;
  quarantine_urgency_hours?: number;
  recovery_simulation?: Array<{
    day: number;
    stage_name: string;
    expected_health_pct: number;
    visual_symptom: string;
    required_action: string;
  }>;
}

export type DiseaseInfo = DiagnosisResult['disease'];
export type TreatmentInfo = DiagnosisResult['treatment'];
export type FertilizerRecommendation = DiagnosisResult['fertilizer_recommendation'];
export type AboutPlant = DiagnosisResult['about_plant'];
