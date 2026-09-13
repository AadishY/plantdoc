import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Leaf, 
  Loader2, 
  Upload, 
  AlertOctagon, 
  RefreshCw, 
  Sparkles, 
  ShieldAlert, 
  CheckCircle2, 
  Image as ImageIcon,
  Scan,
  Microscope,
  Dna,
  ShieldCheck,
  Pill,
  Sun,
  Camera,
  Focus,
  Activity,
  Layers,
  HelpCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import Header from "@/components/Header";
import UploadComponent from "@/components/UploadComponent";
import ResultComponent from "@/components/ResultComponent";
import { DiagnosisResultSkeleton } from "@/components/ui/skeleton-loaders";
import { diagnosePlant, formatUserFriendlyError } from "@/services/api";
import { DiagnosisResult } from "@/types/diagnosis";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import { AiModeToggle, AiProcessingMode } from "@/components/AiModeToggle";

interface DiagnosisPhase {
  phase: number;
  title: string;
  subtitle: string;
  detail: string;
  badge: string;
  icon: any;
}

const DIAGNOSIS_PHASES: DiagnosisPhase[] = [
  {
    phase: 1,
    title: "Foliar Cellular & Chlorophyll Scan",
    subtitle: "Analyzing specimen color gamut, chloroplast density, and necrotic discoloration...",
    detail: "Resolution: 1280px Progressive WebP | Offscreen Canvas Downsampler",
    badge: "Cellular Telemetry",
    icon: Scan
  },
  {
    phase: 2,
    title: "Spatial Lesion & Multi-Spot Localization",
    subtitle: "Detecting all pinpoint necrotic spots, insect feeding holes, and halo perimeters...",
    detail: "Sub-Pixel Reticle Lock | Coordinate Grid: [ymin, xmin, ymax, xmax]",
    badge: "Sub-Pixel Lesions",
    icon: Focus
  },
  {
    phase: 3,
    title: "Phytopathology & Etiology Validation",
    subtitle: "Cross-referencing global taxonomic database for fungal, bacterial, and pest strains...",
    detail: "Taxonomic Phytopathology Engine | Botanical Differential Diagnosis",
    badge: "Pathogen Analysis",
    icon: Microscope
  },
  {
    phase: 4,
    title: "Clinical Prescription Formulation",
    subtitle: "Synthesizing exact retail brand fungicides, organic recipes, and NPK dosage matrix...",
    detail: "Protocol: 5-Tier Remediation Checklist | Commercial Retail Products",
    badge: "Clinical Matrix",
    icon: Pill
  },
  {
    phase: 5,
    title: "Final Synthesis & Dossier Assembly",
    subtitle: "Compiling high-resolution lesion coordinate overlays and clinical treatment report...",
    detail: "Status: Finalizing Diagnostic Report & Treatment Matrix",
    badge: "Final Processing",
    icon: ShieldCheck
  }
];

const DiagnosePage: React.FC = () => {
  useDocumentTitle(
    "Foliar Pathology Diagnosis & Lesion Vision — PlantDoc AI",
    "Upload a foliage photo for instant AI plant disease detection, sub-pixel lesion segmentation, and clinical organic and chemical treatment matrices.",
    "/diagnose",
    "foliar diagnosis, plant leaf disease scanner, AI crop diagnosis, lesion localization, tomato blight, powdery mildew, fungal spot identifier, organic plant treatments"
  );

  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingStepIdx, setLoadingStepIdx] = useState(0);
  const [aiMode, setAiMode] = useState<AiProcessingMode>("smart");
  const [diagnosisResult, setDiagnosisResult] = useState<DiagnosisResult | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [modelShiftNotice, setModelShiftNotice] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Elapsed timer during loading
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  useEffect(() => {
    let timer: any;
    if (isLoading) {
      setElapsedSeconds(0);
      timer = setInterval(() => {
        setElapsedSeconds(prev => prev + 1);
      }, 1000);
    } else {
      setElapsedSeconds(0);
    }
    return () => clearInterval(timer);
  }, [isLoading]);

  // Advance sequentially with generous dwell time through phases 1 to 4, staying on Phase 5 until diagnosis arrives
  useEffect(() => {
    if (isLoading) {
      setLoadingStepIdx(0);
      const timeouts = [
        setTimeout(() => setLoadingStepIdx(1), 3500),
        setTimeout(() => setLoadingStepIdx(2), 7500),
        setTimeout(() => setLoadingStepIdx(3), 12000),
        setTimeout(() => setLoadingStepIdx(4), 17000),
      ];
      return () => {
        timeouts.forEach(t => clearTimeout(t));
      };
    }
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
    setModelShiftNotice(null);
    toast.success(`Foliage specimen loaded: ${file.name} (${Math.round(file.size / 1024)} KB)`);
  };

  const handleDiagnose = async () => {
    if (!selectedImage) {
      toast.error("Please upload a foliage image first to begin diagnosis");
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);
    setModelShiftNotice(null);
    toast.info("Initiating clinical diagnosis via PlantDoc AI Vision Engine...");

    try {
      const result = await diagnosePlant(
        selectedImage,
        (shiftMsg) => {
          setModelShiftNotice(shiftMsg);
        },
        aiMode
      );
      setDiagnosisResult(result);
      toast.success(
        `Diagnosis complete via ${aiMode === 'fast' ? 'Fast Mode' : 'Smart Mode'}! Identified: ${result.disease.name || 'Specimen Analyzed'}`
      );

      // Seamlessly scroll to result view
      setTimeout(() => {
        const target = document.getElementById('diagnosis-result-view');
        if (target) {
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    } catch (error: any) {
      const friendlyMsg = formatUserFriendlyError(error);
      console.warn("[PlantDoc AI]:", friendlyMsg);
      setErrorMessage(friendlyMsg);
      toast.error(friendlyMsg);
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
    setModelShiftNotice(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    toast.info("Specimen cleared. Ready for new foliage upload.");
  };

  const CurrentPhaseIcon = DIAGNOSIS_PHASES[loadingStepIdx]?.icon || Leaf;

  return (
    <div className="min-h-screen flex flex-col relative overflow-x-hidden pb-12 touch-pan-y">
      <Header />
      
      <main className="flex-1 py-8 md:py-12 container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto">
          
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center p-3 bg-[#2DD4BF]/20 rounded-2xl mb-3 border border-[#2DD4BF]/40 shadow-[0_0_20px_rgba(45,212,191,0.35)]">
              <Leaf className="h-6 w-6 text-[#2DD4BF]" />
            </div>
            <h1 className="text-3xl md:text-5xl font-black mb-3 tracking-tight text-white bg-gradient-to-r from-white via-emerald-100 to-[#2DD4BF] bg-clip-text text-transparent drop-shadow-sm">
              Plant Disease Diagnosis
            </h1>
            <p className="text-white/80 max-w-xl mx-auto text-sm md:text-base leading-relaxed mb-6">
              Upload a foliage photo to localize lesions with PlantDoc AI vision segmentation and receive clinical-grade treatment protocols.
            </p>

            {/* Smart Mode vs. Fast Mode AI Model Selector */}
            <div className="flex justify-center">
              <AiModeToggle
                mode={aiMode}
                onChange={setAiMode}
                page="diagnose"
              />
            </div>
          </div>
          
          {/* 1. Upload View & Loading Stage */}
          {!diagnosisResult && (
            <div className="w-full relative animate-fade-in space-y-6">
              
              {/* Educational Best Practices Tips Bar (only when idle) */}
              {!previewUrl && !isLoading && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="p-3.5 rounded-2xl bg-black/45 border border-white/10 flex items-center gap-3 backdrop-blur-xl">
                    <div className="p-2 rounded-xl bg-[#2DD4BF]/20 text-[#2DD4BF] border border-[#2DD4BF]/30">
                      <Camera className="h-4 w-4" />
                    </div>
                    <div className="text-xs">
                      <strong className="text-white block font-semibold">Clear Close-Up</strong>
                      <span className="text-white/60 text-[11px]">Capture single leaf or lesion spot</span>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-black/45 border border-white/10 flex items-center gap-3 backdrop-blur-xl">
                    <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
                      <Sun className="h-4 w-4" />
                    </div>
                    <div className="text-xs">
                      <strong className="text-white block font-semibold">Bright Lighting</strong>
                      <span className="text-white/60 text-[11px]">Even daylight without heavy shadows</span>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-black/45 border border-white/10 flex items-center gap-3 backdrop-blur-xl">
                    <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                      <Focus className="h-4 w-4" />
                    </div>
                    <div className="text-xs">
                      <strong className="text-white block font-semibold">Sharp Focus</strong>
                      <span className="text-white/60 text-[11px]">Crisp edges for sub-pixel localization</span>
                    </div>
                  </div>
                </div>
              )}

              {/* IDLE UPLOAD COMPONENT */}
              {!isLoading && (
                <UploadComponent 
                  onImageSelect={handleImageChange}
                  onRemoveImage={handleReset}
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
              )}
              
              {/* Error Notice Card with Retry Action */}
              {errorMessage && (
                <div className="p-5 border border-red-500/40 rounded-2xl bg-red-500/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-red-300 text-sm bg-black/45 backdrop-blur-xl">
                  <div className="flex items-center gap-3">
                    <ShieldAlert className="h-6 w-6 text-red-400 shrink-0" />
                    <div>
                      <strong className="text-white block font-bold">Diagnostic Notice</strong>
                      <span className="text-white/80">{errorMessage}</span>
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
              
              {/* SPACIOUS & AIRY HOLOGRAPHIC DIAGNOSTIC CONSOLE */}
              {isLoading && (
                <div className="p-8 sm:p-12 md:p-14 rounded-3xl bg-black/75 backdrop-blur-3xl border border-[#2DD4BF]/40 space-y-8 shadow-[0_0_60px_rgba(45,212,191,0.25)] relative overflow-hidden animate-fade-in text-center">
                  {/* Volumetric Radial Ambient Glows */}
                  <div className="absolute -top-32 -left-32 w-64 h-64 bg-[#2DD4BF]/20 rounded-full blur-[100px] pointer-events-none animate-pulse" />
                  <div className="absolute -bottom-32 -right-32 w-64 h-64 bg-[#10B981]/20 rounded-full blur-[100px] pointer-events-none animate-pulse" />

                  {/* Top Telemetry & Timer Status Bar */}
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-b border-white/10 pb-5 max-w-2xl mx-auto">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#2DD4BF]/15 border border-[#2DD4BF]/30 text-[#5EEAD4] text-xs font-mono">
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#2DD4BF] opacity-75" />
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-[#2DD4BF]" />
                      </span>
                      <span>Active Vision Ensembles</span>
                    </div>

                    <div className="flex items-center gap-4 text-xs font-mono text-white/70">
                      <span className="flex items-center gap-1.5 text-white/90">
                        <Activity className="h-3.5 w-3.5 text-[#2DD4BF] animate-pulse" />
                        <span>Elapsed: <strong className="text-white font-bold">{elapsedSeconds < 10 ? `0${elapsedSeconds}` : elapsedSeconds}s</strong></span>
                      </span>
                      <span className="text-white/40">|</span>
                      <span>Analysis: <strong className="text-[#5EEAD4]">Neural Vision Analyzer</strong></span>
                    </div>
                  </div>

                  {/* Dynamic Model Failover Alert Banner */}
                  <AnimatePresence>
                    {modelShiftNotice && (
                      <motion.div 
                        initial={{ opacity: 0, y: -8, scale: 0.96 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -8, scale: 0.96 }}
                        className="my-3 p-3 sm:p-4 rounded-2xl bg-amber-500/20 border border-amber-500/50 text-amber-200 text-xs sm:text-sm font-mono flex items-center justify-center gap-2.5 max-w-2xl mx-auto shadow-[0_0_30px_rgba(245,158,11,0.25)] backdrop-blur-xl text-center"
                      >
                        <AlertOctagon className="h-4 w-4 text-amber-400 shrink-0 animate-bounce" />
                        <span className="font-semibold">{modelShiftNotice}</span>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Centerpiece: Specimen Holographic Scanning Reticle */}
                  <div className="relative flex flex-col items-center justify-center my-4">
                    <div className="relative w-40 h-40 sm:w-48 sm:h-48 rounded-3xl overflow-hidden p-1.5 bg-black/85 border border-[#2DD4BF]/70 shadow-[0_0_40px_rgba(45,212,191,0.45)]">
                      {/* Uploaded Thumbnail with Live Scan Sweep */}
                      {previewUrl ? (
                        <div className="relative w-full h-full rounded-2xl overflow-hidden bg-black flex items-center justify-center">
                          <img 
                            src={previewUrl} 
                            alt="Foliage specimen undergoing active neural scanning and lesion detection" 
                            className="w-full h-full object-cover filter contrast-125 brightness-95 scale-105"
                          />
                          
                          {/* 1. Coordinate Grid Pattern */}
                          <div 
                            className="absolute inset-0 opacity-25 pointer-events-none" 
                            style={{
                              backgroundImage: 'linear-gradient(to right, rgba(45, 212, 191, 0.4) 1px, transparent 1px), linear-gradient(to bottom, rgba(45, 212, 191, 0.4) 1px, transparent 1px)',
                              backgroundSize: '16px 16px'
                            }}
                          />

                          {/* 2. Sweeping Emerald Laser Beam */}
                          <motion.div 
                            className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#2DD4BF] to-transparent shadow-[0_0_20px_#2DD4BF,0_0_8px_#5EEAD4] z-20 pointer-events-none"
                            animate={{ top: ['0%', '100%', '0%'] }}
                            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                          />

                          {/* 3. Trailing Glow Beam */}
                          <motion.div 
                            className="absolute left-0 right-0 h-8 bg-gradient-to-b from-[#2DD4BF]/30 via-[#2DD4BF]/10 to-transparent blur-sm z-10 pointer-events-none"
                            animate={{ top: ['-5%', '95%', '-5%'] }}
                            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                          />

                          {/* 4. Target Bounding Reticle */}
                          <motion.div 
                            className="absolute w-20 h-16 border border-[#5EEAD4] rounded-lg bg-[#2DD4BF]/10 shadow-[0_0_15px_rgba(45,212,191,0.5)] flex items-center justify-center z-15 pointer-events-none"
                            animate={{ 
                              scale: [0.95, 1.05, 0.95],
                              opacity: [0.6, 1, 0.6],
                              x: ['-10px', '15px', '-10px'],
                              y: ['-15px', '10px', '-15px']
                            }}
                            transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
                          >
                            <div className="w-1.5 h-1.5 rounded-full bg-[#5EEAD4] animate-ping" />
                          </motion.div>

                          {/* 5. Center Target Crosshair */}
                          <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-40">
                            <div className="w-6 h-0.5 bg-[#5EEAD4]" />
                            <div className="h-6 w-0.5 bg-[#5EEAD4] absolute" />
                          </div>
                        </div>
                      ) : (
                        <div className="w-full h-full rounded-2xl bg-black/60 flex items-center justify-center text-[#5EEAD4]">
                          <Leaf className="h-12 w-12 animate-pulse" />
                        </div>
                      )}

                      {/* Rotating Outer Reticle Rings */}
                      <div className="absolute -inset-2 rounded-3xl border border-dashed border-[#5EEAD4]/40 animate-spin pointer-events-none" style={{ animationDuration: '14s' }} />
                      <div className="absolute -inset-4 rounded-3xl border border-[#2DD4BF]/25 animate-pulse pointer-events-none" />
                    </div>

                    {/* Scanning Matrix Coordinates Chip */}
                    <div className="mt-4 inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-black/80 border border-[#2DD4BF]/40 text-[11px] font-mono text-[#5EEAD4] shadow-[0_0_15px_rgba(45,212,191,0.2)]">
                      <Scan className="h-3.5 w-3.5 text-[#2DD4BF] animate-spin" />
                      <span>Foliar Sub-Pixel Matrix Active • Bounding Target Lock</span>
                    </div>
                  </div>

                  {/* Active Phase Description Header */}
                  <div className="space-y-3 max-w-xl mx-auto">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#2DD4BF]/20 border border-[#2DD4BF]/40 text-[#5EEAD4] text-xs font-mono font-semibold">
                      <CurrentPhaseIcon className="h-3.5 w-3.5 animate-pulse" />
                      <span>Phase {loadingStepIdx + 1} of {DIAGNOSIS_PHASES.length}: {DIAGNOSIS_PHASES[loadingStepIdx].badge}</span>
                    </div>

                    <h3 className="text-xl sm:text-3xl font-black text-white tracking-tight">
                      {DIAGNOSIS_PHASES[loadingStepIdx].title}
                    </h3>
                    <p className="text-sm text-white/80 leading-relaxed px-4">
                      {DIAGNOSIS_PHASES[loadingStepIdx].subtitle}
                    </p>
                  </div>

                  {/* High-Tech Shimmering Progress Bar */}
                  <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden max-w-md mx-auto p-0.5 border border-white/15">
                    <div 
                      className="bg-gradient-to-r from-[#2DD4BF] via-[#10B981] to-[#34D399] h-full rounded-full transition-all duration-500 shadow-[0_0_15px_rgba(45,212,191,0.8)]"
                      style={{ width: `${((loadingStepIdx + 1) / DIAGNOSIS_PHASES.length) * 100}%` }}
                    />
                  </div>

                  {/* 5-Phase Interactive Milestone Stepper Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 text-left max-w-4xl mx-auto pt-2">
                    {DIAGNOSIS_PHASES.map((p, idx) => {
                      const isCompleted = idx < loadingStepIdx;
                      const isActive = idx === loadingStepIdx;
                      const PhaseIcon = p.icon;

                      return (
                        <div 
                          key={p.phase}
                          className={`p-3.5 rounded-2xl border transition-all duration-300 relative ${
                            isActive 
                              ? 'bg-[#2DD4BF]/15 border-[#2DD4BF]/60 shadow-[0_0_25px_rgba(45,212,191,0.25)] scale-[1.02]' 
                              : isCompleted 
                                ? 'bg-emerald-950/30 border-emerald-500/40 text-white/90' 
                                : 'bg-white/5 border-white/10 opacity-50'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-[10px] font-mono font-bold text-white/60">PHASE 0{p.phase}</span>
                            {isCompleted ? (
                              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                            ) : isActive ? (
                              <Loader2 className="h-4 w-4 text-[#5EEAD4] animate-spin" />
                            ) : (
                              <PhaseIcon className="h-3.5 w-3.5 text-white/30" />
                            )}
                          </div>
                          <div className="font-bold text-xs text-white leading-tight mb-1 truncate">
                            {p.title}
                          </div>
                          <div className="text-[10px] text-white/70 font-mono line-clamp-1">
                            {p.badge}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Live Diagnostic Telemetry Ticker */}
                  <div className="inline-block text-[11px] font-mono text-white/70 bg-black/50 px-4 py-2 rounded-full border border-white/10">
                    {DIAGNOSIS_PHASES[loadingStepIdx].detail}
                  </div>
                </div>
              )}

              {/* Action Buttons (when not loading) */}
              {!isLoading && (
                <div className="flex flex-col sm:flex-row gap-4 justify-center pt-2">
                  <Button
                    onClick={handleDiagnose}
                    disabled={!selectedImage || isLoading}
                    className="bg-gradient-to-r from-[#2DD4BF] via-[#10B981] to-[#059669] hover:from-[#5EEAD4] hover:via-[#34D399] hover:to-[#10B981] text-black font-extrabold px-9 py-6 text-base rounded-full shadow-[0_0_35px_rgba(45,212,191,0.55)] transition-all hover:scale-105 disabled:opacity-50 disabled:pointer-events-none border border-[#5EEAD4]/60"
                  >
                    <Sparkles className="h-5 w-5 mr-2" />
                    Diagnose Foliage Photo
                  </Button>
                  
                  {previewUrl && (
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
              )}
            </div>
          )}
          
          {/* 2. Results View */}
          {diagnosisResult && (
            <div id="diagnosis-result-view" className="space-y-6 animate-fade-in">
              {/* Reset/New Upload Action Bar */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 sm:p-5 rounded-2xl glass-card border border-white/15 bg-black/55 backdrop-blur-2xl gap-4 shadow-xl">
                <div className="flex items-center gap-2.5 text-sm text-white/90">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#2DD4BF] animate-pulse" />
                  <span>
                    Clinical dossier prepared for{' '}
                    <strong className="text-white">
                      {diagnosisResult.plant.toLowerCase().includes('cannot identify') ? 'Unidentified Specimen' : diagnosisResult.plant}
                    </strong>
                  </span>
                </div>
                <Button
                  onClick={handleReset}
                  variant="outline"
                  size="sm"
                  className="w-full sm:w-auto border-[#2DD4BF]/40 text-white hover:bg-[#2DD4BF]/20 rounded-full text-xs h-9 px-4 gap-2 transition-all hover:scale-105 shadow-md"
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

export default React.memo(DiagnosePage);
