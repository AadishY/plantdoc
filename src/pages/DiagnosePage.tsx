import React, { useState, useRef, useEffect } from "react";
import { Leaf, Loader2, Upload, AlertOctagon, RefreshCw, Sparkles, ShieldAlert, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import Header from "@/components/Header";
import UploadComponent from "@/components/UploadComponent";
import ResultComponent from "@/components/ResultComponent";
import { diagnosePlant } from "@/services/api";
import { DiagnosisResult } from "@/types/diagnosis";

const LOADING_STEPS = [
  "Initializing PlantDoc AI neural vision model...",
  "Scanning foliar cellular structure and chlorophyll density...",
  "Executing spatial lesion localization and boundary detection...",
  "Formulating clinical remediation matrix & fertilizer dosage..."
];

const DiagnosePage: React.FC = () => {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingStepIdx, setLoadingStepIdx] = useState(0);
  const [diagnosisResult, setDiagnosisResult] = useState<DiagnosisResult | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Rotate loading step messages for premium UX
  useEffect(() => {
    let interval: any;
    if (isLoading) {
      setLoadingStepIdx(0);
      interval = setInterval(() => {
        setLoadingStepIdx(prev => (prev + 1) % LOADING_STEPS.length);
      }, 1400);
    }
    return () => clearInterval(interval);
  }, [isLoading]);

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const handleImageChange = (file: File) => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setSelectedImage(file);
    setPreviewUrl(URL.createObjectURL(file));
    setDiagnosisResult(null);
    setErrorMessage(null);
  };

  const handleDiagnose = async () => {
    if (!selectedImage) {
      toast.error("Please upload an image first");
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    try {
      const result = await diagnosePlant(selectedImage);
      setDiagnosisResult(result);
      toast.success("Diagnosis & lesion segmentation complete!");
    } catch (error: any) {
      console.error("Diagnosis error:", error);
      const msg = error.message || "Failed to analyze plant specimen. Please ensure photo is well-lit.";
      setErrorMessage(msg);
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setSelectedImage(null);
    setPreviewUrl(null);
    setDiagnosisResult(null);
    setErrorMessage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="min-h-screen flex flex-col relative overflow-x-hidden pb-12">
      <Header />
      
      <main className="flex-1 py-8 md:py-12 container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto">
          
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center p-3 bg-[#2DD4BF]/20 rounded-2xl mb-3 border border-[#2DD4BF]/40 shadow-[0_0_20px_rgba(45,212,191,0.35)]">
              <Leaf className="h-6 w-6 text-[#2DD4BF]" />
            </div>
            <h1 className="text-3xl md:text-5xl font-extrabold mb-3 tracking-tight text-white bg-gradient-to-r from-white via-emerald-100 to-[#2DD4BF] bg-clip-text text-transparent drop-shadow-sm">
              Plant Disease Diagnosis
            </h1>
            <p className="text-white/80 max-w-xl mx-auto text-sm md:text-base leading-relaxed">
              Upload a foliage photo to localize lesions with PlantDoc AI vision segmentation and receive clinical-grade treatment protocols.
            </p>
          </div>
          
          {/* 1. Upload View (Visible only when no diagnosis result has been generated) */}
          {!diagnosisResult && (
            <div className="w-full relative animate-fade-in space-y-6">
              <UploadComponent 
                onImageSelect={handleImageChange}
                onDrop={(acceptedFiles) => {
                  if (acceptedFiles && acceptedFiles[0]) {
                    handleImageChange(acceptedFiles[0]);
                  }
                }}
                previewUrl={previewUrl}
                isLoading={isLoading}
                fileInputRef={fileInputRef}
                className="bg-black/45 backdrop-blur-2xl hover:border-[#2DD4BF]/50 border-white/15 transition-all duration-300 transform-gpu shadow-[0_8px_32px_rgba(0,0,0,0.5),inset_0_1px_0_0_rgba(255,255,255,0.1)]"
              />
              
              {/* Error Notice Card with Retry Action */}
              {errorMessage && (
                <div className="p-5 border border-red-500/40 rounded-2xl bg-red-500/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-red-300 text-sm bg-black/45 backdrop-blur-xl">
                  <div className="flex items-center gap-3">
                    <ShieldAlert className="h-6 w-6 text-red-400 shrink-0" />
                    <div>
                      <strong className="text-white block">Diagnostic Warning</strong>
                      <span>{errorMessage}</span>
                    </div>
                  </div>
                  <Button
                    onClick={handleDiagnose}
                    size="sm"
                    className="bg-red-500 hover:bg-red-600 text-white shrink-0 rounded-full text-xs font-semibold px-4"
                  >
                    Retry Diagnosis
                  </Button>
                </div>
              )}
              
              {/* Loading Status Indicator */}
              {isLoading && (
                <div className="p-6 rounded-3xl bg-black/55 backdrop-blur-2xl border border-[#2DD4BF]/40 text-center space-y-3 shadow-[0_0_35px_rgba(45,212,191,0.2)] animate-pulse">
                  <div className="flex items-center justify-center gap-3 text-[#5EEAD4] font-bold text-sm sm:text-base">
                    <Loader2 className="h-5 w-5 animate-spin" />
                    <span>{LOADING_STEPS[loadingStepIdx]}</span>
                  </div>
                  <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden max-w-md mx-auto">
                    <div className="bg-gradient-to-r from-[#2DD4BF] via-[#10B981] to-[#059669] h-full rounded-full animate-progress" />
                  </div>
                  <p className="text-xs text-foreground/70 font-mono">
                    PlantDoc AI Vision Diagnostics: Neural pathology analysis & lesion localization active
                  </p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-2">
                <Button
                  onClick={handleDiagnose}
                  disabled={!selectedImage || isLoading}
                  className="bg-gradient-to-r from-[#2DD4BF] via-[#10B981] to-[#059669] hover:from-[#5EEAD4] hover:via-[#34D399] hover:to-[#10B981] text-black font-extrabold px-9 py-6 text-base rounded-full shadow-[0_0_35px_rgba(45,212,191,0.55)] transition-all hover:scale-105 disabled:opacity-50 disabled:pointer-events-none border border-[#5EEAD4]/60"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin mr-2" />
                      Diagnosing & Segmenting...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-5 w-5 mr-2" />
                      Diagnose Plant Photo
                    </>
                  )}
                </Button>
                
                {previewUrl && !isLoading && (
                  <Button 
                    variant="outline" 
                    onClick={handleReset}
                    className="bg-black/50 hover:bg-black/80 text-white font-semibold border-white/20 hover:border-[#2DD4BF]/60 hover:text-[#5EEAD4] transition-all py-6 text-base rounded-full hover:scale-105 backdrop-blur-xl shadow-lg"
                  >
                    <Upload className="h-5 w-5 mr-2" />
                    New Upload
                  </Button>
                )}
              </div>
            </div>
          )}
          
          {/* 2. Results View (Shows ONLY the segmented image viewer & diagnosis report, with a New Diagnosis action) */}
          {diagnosisResult && (
            <div className="space-y-6 animate-fade-in">
              {/* Reset/New Upload Action Bar */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 sm:p-5 rounded-2xl glass-card border border-white/15 bg-black/50 gap-4 shadow-xl">
                <div className="flex items-center gap-2.5 text-sm text-foreground/85">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#2DD4BF] animate-pulse" />
                  <span>Clinical report formulated for <strong className="text-white">{diagnosisResult.plant}</strong></span>
                </div>
                <Button
                  onClick={handleReset}
                  variant="outline"
                  size="sm"
                  className="w-full sm:w-auto border-[#2DD4BF]/40 text-white hover:bg-[#2DD4BF]/20 rounded-full text-xs h-9 px-4 gap-2 transition-all hover:scale-105"
                >
                  <RefreshCw className="h-3.5 w-3.5 text-[#2DD4BF]" />
                  <span>Diagnose Another Plant</span>
                </Button>
              </div>

              {/* Segmented Image Viewer & Full Clinical Protocol */}
              <ResultComponent result={diagnosisResult} imageUrl={previewUrl} />
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default DiagnosePage;
