import React from "react";
import { motion } from "framer-motion";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Separator } from "./ui/separator";
import { Progress } from "./ui/progress";
import { AlertTriangle, Leaf, Droplet, Thermometer, Sun, ArrowRight, Info, Check, XCircle, Sprout, AlertCircle, Shield } from "lucide-react";
import AboutPlant from "./AboutPlant";

interface ResultComponentProps {
  result: any;
  imagePreview: string;
}

const ResultComponent: React.FC<ResultComponentProps> = ({ result, imagePreview }) => {
  if (!result) return null;

  const severityColor = (severity: string) => {
    const severityMap: Record<string, string> = {
      low: "bg-green-500",
      medium: "bg-yellow-500",
      high: "bg-orange-500",
      severe: "bg-red-500",
    };
    return severityMap[severity.toLowerCase()] || "bg-gray-500";
  };

  const confidenceLevel = Math.round(result.confidence || 75);
  const severityLevel = result.severity?.toLowerCase() || "medium";

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            staggerChildren: 0.1,
          },
        },
      }}
      className="space-y-8 mb-12"
    >
      <motion.div
        variants={fadeInUp}
        className="flex flex-col md:flex-row gap-6 items-start"
      >
        <Card className="p-5 border rounded-xl shadow-md flex-shrink-0 w-full md:w-1/3 bg-gradient-to-br from-background to-muted/50">
          <div className="space-y-4">
            <div className="aspect-square rounded-lg overflow-hidden bg-muted">
              {imagePreview && (
                <img
                  src={imagePreview}
                  alt="Plant"
                  className="w-full h-full object-cover"
                />
              )}
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Diagnosis Confidence</h3>
                <Badge variant={confidenceLevel > 70 ? "default" : "outline"} className="font-medium">
                  {confidenceLevel}%
                </Badge>
              </div>
              <Progress value={confidenceLevel} className="h-2" />
              
              <div className="flex justify-between items-center mt-4">
                <h3 className="text-lg font-semibold">Severity Level</h3>
                <div className="flex items-center gap-2">
                  <span className={`inline-block w-3 h-3 rounded-full ${severityColor(severityLevel)}`}></span>
                  <span className="capitalize">{severityLevel}</span>
                </div>
              </div>
              <div className="grid grid-cols-4 gap-1 h-2">
                {["low", "medium", "high", "severe"].map((level) => (
                  <div 
                    key={level} 
                    className={`h-full rounded-sm ${level === severityLevel ? severityColor(level) : "bg-muted"}`}
                  ></div>
                ))}
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-6 border rounded-xl shadow-md flex-1 bg-gradient-to-br from-background to-muted/30">
          <div className="space-y-5">
            <div>
              <Badge variant="outline" className="mb-2 bg-primary/10 text-primary border-primary/20">Plant Diagnosis</Badge>
              <h2 className="text-2xl font-bold">{result.plant_name}</h2>
              <p className="text-lg font-semibold text-primary mt-1">{result.disease_name || "Healthy Plant"}</p>
            </div>
            
            <Separator />
            
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Info className="h-5 w-5 text-primary" />
                  Description
                </h3>
                <p className="mt-1 text-muted-foreground">
                  {result.description || "No description available."}
                </p>
              </div>
              
              {result.causes && (
                <div>
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <AlertCircle className="h-5 w-5 text-primary" />
                    Causes
                  </h3>
                  <p className="mt-1 text-muted-foreground">{result.causes}</p>
                </div>
              )}
            </div>
          </div>
        </Card>
      </motion.div>

      {result.treatment_steps && result.treatment_steps.length > 0 && (
        <motion.div variants={fadeInUp}>
          <Card className="p-6 border rounded-xl shadow-md bg-gradient-to-r from-background to-green-50/30">
            <h3 className="text-xl font-bold flex items-center gap-2 mb-4">
              <Check className="h-6 w-6 text-green-600" />
              Treatment Steps
            </h3>
            <div className="space-y-4">
              {result.treatment_steps.map((step: string, index: number) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-start gap-3"
                >
                  <div className="bg-primary/10 text-primary font-medium rounded-full h-6 w-6 flex items-center justify-center flex-shrink-0 mt-0.5">
                    {index + 1}
                  </div>
                  <p className="text-muted-foreground">{step}</p>
                </motion.div>
              ))}
            </div>
          </Card>
        </motion.div>
      )}

      <motion.div 
        variants={fadeInUp}
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        {result.prevention_tips && result.prevention_tips.length > 0 && (
          <Card className="p-6 border rounded-xl shadow-md bg-gradient-to-br from-background to-blue-50/30">
            <h3 className="text-xl font-bold flex items-center gap-2 mb-4">
              <Shield className="h-6 w-6 text-blue-600" />
              Prevention Tips
            </h3>
            <div className="space-y-3">
              {result.prevention_tips.map((tip: string, index: number) => (
                <div key={index} className="flex items-start gap-3">
                  <ArrowRight className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                  <p className="text-muted-foreground">{tip}</p>
                </div>
              ))}
            </div>
          </Card>
        )}

        <Card className="p-6 border rounded-xl shadow-md bg-gradient-to-br from-background to-purple-50/30">
          <h3 className="text-xl font-bold flex items-center gap-2 mb-4">
            <Leaf className="h-6 w-6 text-purple-600" />
            Care Recommendations
          </h3>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 rounded-lg bg-background border">
                <div className="flex items-center gap-2 text-primary font-medium mb-1">
                  <Droplet className="h-4 w-4" />
                  Watering
                </div>
                <p className="text-sm text-muted-foreground">
                  {result.watering || "Moderate watering, allow soil to dry slightly between waterings."}
                </p>
              </div>
              
              <div className="p-3 rounded-lg bg-background border">
                <div className="flex items-center gap-2 text-primary font-medium mb-1">
                  <Sun className="h-4 w-4" />
                  Light
                </div>
                <p className="text-sm text-muted-foreground">
                  {result.light || "Bright, indirect light. Avoid direct sunlight."}
                </p>
              </div>
              
              <div className="p-3 rounded-lg bg-background border">
                <div className="flex items-center gap-2 text-primary font-medium mb-1">
                  <Thermometer className="h-4 w-4" />
                  Temperature
                </div>
                <p className="text-sm text-muted-foreground">
                  {result.temperature || "65-75°F (18-24°C). Avoid cold drafts and sudden temperature changes."}
                </p>
              </div>
              
              <div className="p-3 rounded-lg bg-background border">
                <div className="flex items-center gap-2 text-primary font-medium mb-1">
                  <Sprout className="h-4 w-4" />
                  Fertilizer
                </div>
                <p className="text-sm text-muted-foreground">
                  {result.fertilizer || "Balanced fertilizer once a month during growing season."}
                </p>
              </div>
            </div>
          </div>
        </Card>
      </motion.div>

      {result.about_plant && (
        <motion.div variants={fadeInUp}>
          <AboutPlant plantInfo={result.about_plant} />
        </motion.div>
      )}

      {result.expert_notes && (
        <motion.div variants={fadeInUp}>
          <Card className="p-6 border rounded-xl shadow-md bg-gradient-to-br from-background to-amber-50/30">
            <h3 className="text-xl font-bold flex items-center gap-2 mb-3">
              <AlertTriangle className="h-6 w-6 text-amber-600" />
              Expert Notes
            </h3>
            <p className="text-muted-foreground">{result.expert_notes}</p>
          </Card>
        </motion.div>
      )}
    </motion.div>
  );
};

export default ResultComponent;
