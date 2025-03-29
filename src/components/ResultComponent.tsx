
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Droplet, Thermometer, Leaf, Info } from 'lucide-react';
import { DiagnosisResult } from '@/types/diagnosis';

interface ResultComponentProps {
  result: DiagnosisResult;
}

const ResultComponent: React.FC<ResultComponentProps> = ({ result }) => {
  // Function to determine severity color
  const getSeverityColor = (severity: string) => {
    switch (severity.toLowerCase()) {
      case 'low':
        return 'bg-green-500';
      case 'medium':
        return 'bg-yellow-500';
      case 'high':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  // Function to convert confidence to percentage for progress bar
  const getConfidencePercentage = (confidence: number) => {
    return Math.round(confidence);
  };

  return (
    <div className="space-y-6">
      {/* Disease Diagnosis Card */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-xl flex items-center">
            <Info className="h-5 w-5 mr-2 text-plantDoc-primary" />
            Diagnosis Result
          </CardTitle>
          <CardDescription>
            Analysis for {result.plant} plant
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-medium">{result.disease.name}</h3>
              <div className="flex items-center gap-3 mt-2">
                <span className="text-sm text-gray-500">Confidence:</span>
                <div className="flex-1">
                  <Progress value={getConfidencePercentage(result.disease.confidence)} className="h-2" />
                </div>
                <span className="text-sm font-medium">{result.disease.confidence}%</span>
              </div>
            </div>
            
            <div className="mt-2">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500">Severity:</span>
                <span className={`text-sm font-medium px-2 py-0.5 rounded-full text-white ${getSeverityColor(result.disease.severity)}`}>
                  {result.disease.severity}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Treatment & Prevention Card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl flex items-center">
            <Leaf className="h-5 w-5 mr-2 text-plantDoc-primary" />
            Treatment & Prevention
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="treatment" className="w-full">
            <TabsList className="w-full grid grid-cols-3">
              <TabsTrigger value="treatment">Treatment</TabsTrigger>
              <TabsTrigger value="causes">Causes</TabsTrigger>
              <TabsTrigger value="prevention">Prevention</TabsTrigger>
            </TabsList>
            <TabsContent value="treatment" className="pt-4">
              <ul className="space-y-2 list-disc list-inside text-gray-700">
                {result.treatment.steps.map((step, index) => (
                  <li key={index}>{step}</li>
                ))}
              </ul>
            </TabsContent>
            <TabsContent value="causes" className="pt-4">
              <ul className="space-y-2 list-disc list-inside text-gray-700">
                {result.causes?.map((cause, index) => (
                  <li key={index}>{cause}</li>
                )) || <p>No specific causes listed.</p>}
              </ul>
            </TabsContent>
            <TabsContent value="prevention" className="pt-4">
              <ul className="space-y-2 list-disc list-inside text-gray-700">
                {result.treatment.prevention.map((tip, index) => (
                  <li key={index}>{tip}</li>
                ))}
              </ul>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Fertilizer Recommendation Card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl flex items-center">
            <Droplet className="h-5 w-5 mr-2 text-plantDoc-primary" />
            Fertilizer Recommendation
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <p className="font-medium">Recommended: {result.fertilizer_recommendation.type}</p>
            <p className="text-gray-700">Application: {result.fertilizer_recommendation.application}</p>
          </div>
        </CardContent>
      </Card>

      {/* Care Recommendations Card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl flex items-center">
            <Thermometer className="h-5 w-5 mr-2 text-plantDoc-primary" />
            Care Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 list-disc list-inside text-gray-700">
            {result.care_recommendations.map((tip, index) => (
              <li key={index}>{tip}</li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default ResultComponent;
