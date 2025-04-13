
import React, { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import * as GeminiService from "@/services/geminiService";
import UploadComponent from "@/components/UploadComponent";
import ResultComponent from "@/components/ResultComponent";
import { Leaf, Upload, AlertCircle } from "lucide-react";

// Import types
import type { DiagnosisResult } from "@/types/diagnosis";

const DiagnosePage: React.FC = () => {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [diagnosisResult, setDiagnosisResult] = useState<DiagnosisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleFileUpload = useCallback((file: File, preview: string) => {
    setImageFile(file);
    setImagePreview(preview);
    setError(null);
    // Reset previous results when a new image is uploaded
    setDiagnosisResult(null);
  }, []);

  const handleDiagnose = useCallback(async () => {
    if (!imageFile) {
      toast({
        title: "No image selected",
        description: "Please upload an image of your plant first.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const result = await GeminiService.diagnosePlant(imageFile);
      
      if (!result) {
        throw new Error("Failed to analyze the plant. Please try again.");
      }
      
      setDiagnosisResult(result);
      toast({
        title: "Analysis Complete",
        description: "Your plant has been successfully analyzed.",
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An unknown error occurred";
      setError(errorMessage);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
      console.error("Diagnosis error:", err);
    } finally {
      setIsLoading(false);
    }
  }, [imageFile, toast]);

  const handleReset = useCallback(() => {
    setImageFile(null);
    setImagePreview("");
    setDiagnosisResult(null);
    setError(null);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto px-4 py-8 max-w-6xl"
    >
      <div className="space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-3xl md:text-4xl font-bold text-primary flex items-center justify-center gap-2">
            <Leaf className="h-8 w-8" />
            Plant Diagnosis
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Upload a clear image of your plant to receive an accurate diagnosis and personalized care recommendations
          </p>
        </div>

        <Separator className="my-6" />

        {!diagnosisResult ? (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="p-6 border rounded-xl shadow-md bg-gradient-to-br from-background to-muted/30">
              <div className="space-y-6">
                <UploadComponent onFileUpload={handleFileUpload} />

                {imagePreview && (
                  <div className="mt-6 space-y-4">
                    <div className="aspect-video md:aspect-auto md:h-80 bg-muted rounded-lg overflow-hidden">
                      <img
                        src={imagePreview}
                        alt="Plant preview"
                        className="w-full h-full object-contain"
                      />
                    </div>
                    
                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                      <Button 
                        onClick={handleDiagnose} 
                        disabled={isLoading}
                        className="flex items-center gap-2"
                      >
                        {isLoading ? (
                          <div className="animate-spin h-5 w-5 border-2 border-current border-t-transparent rounded-full"></div>
                        ) : (
                          <Upload className="h-5 w-5" />
                        )}
                        {isLoading ? "Analyzing Plant..." : "Diagnose Plant"}
                      </Button>
                      
                      <Button
                        variant="outline"
                        onClick={handleReset}
                        disabled={isLoading}
                      >
                        Reset
                      </Button>
                    </div>
                  </div>
                )}

                {error && (
                  <div className="bg-destructive/10 text-destructive p-4 rounded-lg flex items-start gap-3">
                    <AlertCircle className="h-5 w-5 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium">Analysis Failed</p>
                      <p className="text-sm mt-1">{error}</p>
                    </div>
                  </div>
                )}
              </div>
            </Card>
          </motion.div>
        ) : (
          <>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Diagnosis Results</h2>
              <Button 
                variant="outline" 
                onClick={handleReset}
                className="flex items-center gap-2"
              >
                Diagnose Another Plant
              </Button>
            </div>
            
            <ResultComponent result={diagnosisResult} imagePreview={imagePreview} />
          </>
        )}
      </div>
    </motion.div>
  );
};

export default DiagnosePage;
