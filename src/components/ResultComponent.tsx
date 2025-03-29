
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Droplet, Thermometer, Leaf, Info, Shield, AlertTriangle } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
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
    <div className="space-y-6 animate-enter">
      {/* Disease Diagnosis Card */}
      <Card className="glass-card overflow-hidden border-none shadow-xl">
        <CardHeader className="pb-2 bg-gradient-to-r from-plantDoc-primary/20 to-transparent">
          <CardTitle className="text-xl flex items-center">
            <Info className="h-5 w-5 mr-2 text-plantDoc-primary" />
            Diagnosis Result
          </CardTitle>
          <CardDescription>
            Analysis for {result.plant} plant
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-medium">{result.disease.name}</h3>
              <div className="flex items-center gap-3 mt-3">
                <span className="text-sm text-foreground/70">Confidence:</span>
                <div className="flex-1">
                  <Progress value={getConfidencePercentage(result.disease.confidence)} className="h-2" />
                </div>
                <span className="text-sm font-medium">{result.disease.confidence}%</span>
              </div>
            </div>
            
            <div className="mt-2 flex items-center">
              <span className="text-sm text-foreground/70 mr-2">Severity:</span>
              <span className={`text-sm font-medium px-2 py-0.5 rounded-full text-white flex items-center gap-1 ${getSeverityColor(result.disease.severity)}`}>
                {result.disease.severity === 'High' && <AlertTriangle className="h-3 w-3" />}
                {result.disease.severity}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Treatment & Prevention Card */}
      <Card className="glass-card overflow-hidden border-none shadow-xl">
        <CardHeader className="bg-gradient-to-r from-plantDoc-primary/20 to-transparent">
          <CardTitle className="text-xl flex items-center">
            <Leaf className="h-5 w-5 mr-2 text-plantDoc-primary" />
            Treatment & Prevention
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Tabs defaultValue="treatment" className="w-full">
            <TabsList className="w-full grid grid-cols-3 rounded-none bg-muted/50 p-0 h-12">
              <TabsTrigger value="treatment" className="rounded-none data-[state=active]:bg-plantDoc-primary/20">Treatment</TabsTrigger>
              <TabsTrigger value="causes" className="rounded-none data-[state=active]:bg-plantDoc-primary/20">Causes</TabsTrigger>
              <TabsTrigger value="prevention" className="rounded-none data-[state=active]:bg-plantDoc-primary/20">Prevention</TabsTrigger>
            </TabsList>
            <div className="p-6">
              <TabsContent value="treatment" className="mt-0 animate-enter">
                <ul className="space-y-2 list-none">
                  {result.treatment.steps.map((step, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <div className="w-5 h-5 rounded-full bg-plantDoc-primary/20 flex-shrink-0 flex items-center justify-center mt-0.5">
                        <span className="text-xs font-medium">{index+1}</span>
                      </div>
                      <span>{step}</span>
                    </li>
                  ))}
                </ul>
              </TabsContent>
              <TabsContent value="causes" className="mt-0 animate-enter">
                <ul className="space-y-2 list-none">
                  {result.causes?.map((cause, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <div className="w-5 h-5 rounded-full bg-plantDoc-primary/20 flex-shrink-0 flex items-center justify-center mt-0.5">
                        <Shield className="h-3 w-3 text-plantDoc-primary" />
                      </div>
                      <span>{cause}</span>
                    </li>
                  )) || <p>No specific causes listed.</p>}
                </ul>
              </TabsContent>
              <TabsContent value="prevention" className="mt-0 animate-enter">
                <ul className="space-y-2 list-none">
                  {result.treatment.prevention.map((tip, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <div className="w-5 h-5 rounded-full bg-plantDoc-primary/20 flex-shrink-0 flex items-center justify-center mt-0.5">
                        <Shield className="h-3 w-3 text-plantDoc-primary" />
                      </div>
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </TabsContent>
            </div>
          </Tabs>
        </CardContent>
      </Card>

      {/* Recommendations Section */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Fertilizer Recommendation Card */}
        <Card className="glass-card overflow-hidden border-none shadow-xl">
          <CardHeader className="bg-gradient-to-r from-plantDoc-primary/20 to-transparent">
            <CardTitle className="text-xl flex items-center">
              <Droplet className="h-5 w-5 mr-2 text-plantDoc-primary" />
              Fertilizer Recommendation
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-plantDoc-primary"></div>
                <h3 className="font-medium">Recommended:</h3>
              </div>
              <p className="text-foreground/80 pl-4">{result.fertilizer_recommendation.type}</p>
              
              <Separator className="my-3 bg-foreground/10" />
              
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-plantDoc-primary"></div>
                <h3 className="font-medium">Application:</h3>
              </div>
              <p className="text-foreground/80 pl-4">{result.fertilizer_recommendation.application}</p>
            </div>
          </CardContent>
        </Card>

        {/* Care Recommendations Card */}
        <Card className="glass-card overflow-hidden border-none shadow-xl">
          <CardHeader className="bg-gradient-to-r from-plantDoc-primary/20 to-transparent">
            <CardTitle className="text-xl flex items-center">
              <Thermometer className="h-5 w-5 mr-2 text-plantDoc-primary" />
              Care Recommendations
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <ul className="space-y-2 list-none">
              {result.care_recommendations.map((tip, index) => (
                <li key={index} className="flex items-start gap-2">
                  <div className="w-5 h-5 rounded-full bg-plantDoc-primary/20 flex-shrink-0 flex items-center justify-center mt-0.5">
                    <Leaf className="h-3 w-3 text-plantDoc-primary" />
                  </div>
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ResultComponent;
