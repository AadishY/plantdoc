
export interface DiagnosisResult {
  plant: string;
  disease: {
    name: string;
    confidence: number;
    severity: string;
  };
  causes?: string[];
  treatment: {
    steps: string[];
    prevention: string[];
  };
  fertilizer_recommendation: {
    type: string;
    application: string;
  };
  care_recommendations: string[];
}
