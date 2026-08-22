import React from 'react';
import { motion } from 'framer-motion';
import { DiagnosisResult } from '@/types/diagnosis';
import { EnhancedCard, EnhancedCardHeader, EnhancedCardTitle, EnhancedCardContent } from '@/components/ui/enhanced-card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Activity, 
  ShieldAlert, 
  HeartHandshake, 
  Bug, 
  Droplets, 
  Sun,
  Wind,
  Calendar, 
  CheckCircle, 
  Sparkles,
  AlertCircle,
  FlaskConical
} from 'lucide-react';

interface DiagnosisVisualizationsProps {
  result: DiagnosisResult;
}

export const DiagnosisVisualizations: React.FC<DiagnosisVisualizationsProps> = ({ result }) => {
  const healthScore = result.disease.health_score ?? (100 - result.disease.confidence * 0.7);
  const prognosis = result.disease.recovery_prognosis ?? (result.disease.severity.toLowerCase() === 'high' ? 65 : 88);
  const pathogen = result.disease.pathogen_type || 'Biological Pathogen';
  const spreadRisk = result.disease.spread_risk || (result.disease.severity === 'High' ? 'High' : 'Moderate');

  const getHealthColor = (score: number) => {
    if (score >= 75) return { stroke: '#10B981', text: 'text-emerald-400', bg: 'bg-emerald-500/20' };
    if (score >= 50) return { stroke: '#F59E0B', text: 'text-amber-400', bg: 'bg-amber-500/20' };
    return { stroke: '#EF4444', text: 'text-red-400', bg: 'bg-red-500/20' };
  };

  const healthColor = getHealthColor(healthScore);

  // SVG Circular Gauge calculation
  const radius = 42;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (healthScore / 100) * circumference;

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* 1. Vital Metrics & Prognosis Dashboard (2 in a row on mobile) */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-2.5 sm:gap-4">
        {/* Plant Health Score Gauge */}
        <EnhancedCard glassIntensity="medium" hoverEffect="glow" className="p-3 sm:p-5 flex flex-col items-center justify-center text-center">
          <div className="flex items-center gap-1.5 sm:gap-2 mb-1.5 sm:mb-2 text-foreground/70 text-[10px] sm:text-xs font-semibold uppercase tracking-wider">
            <Activity className="h-3.5 w-3.5 text-plantDoc-primary" />
            <span>Vitality Index</span>
          </div>
          <div className="relative w-20 h-20 sm:w-28 sm:h-28 my-1 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r={radius}
                className="text-white/10"
                strokeWidth="8"
                stroke="currentColor"
                fill="transparent"
              />
              <motion.circle
                cx="50"
                cy="50"
                r={radius}
                stroke={healthColor.stroke}
                strokeWidth="8"
                strokeLinecap="round"
                fill="transparent"
                initial={{ strokeDashoffset: circumference }}
                animate={{ strokeDashoffset }}
                transition={{ duration: 1.2, ease: "easeOut" }}
                style={{
                  strokeDasharray: circumference,
                }}
              />
            </svg>
            <div className="absolute flex flex-col items-center justify-center">
              <span className={`text-lg sm:text-2xl font-bold ${healthColor.text} font-mono`}>
                {Math.round(healthScore)}%
              </span>
              <span className="text-[9px] sm:text-[10px] text-foreground/60">Vitality</span>
            </div>
          </div>
          <p className="text-[10px] sm:text-xs text-foreground/70 mt-0.5 line-clamp-1 sm:line-clamp-none">
            {healthScore > 70 ? 'Good baseline' : 'Quarantine required'}
          </p>
        </EnhancedCard>

        {/* Pathogen & Transmission Risk Card */}
        <EnhancedCard glassIntensity="medium" hoverEffect="glow" className="p-3 sm:p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2 sm:mb-3">
              <div className="flex items-center gap-1 text-foreground/70 text-[10px] sm:text-xs font-semibold uppercase tracking-wider">
                <Bug className="h-3.5 w-3.5 text-amber-400" />
                <span>Pathogen</span>
              </div>
              <Badge className="bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[9px] sm:text-xs px-1.5 py-0.2 sm:px-2.5 sm:py-0.5">
                {pathogen}
              </Badge>
            </div>

            <div className="space-y-1.5 sm:space-y-2.5 text-[11px] sm:text-xs">
              <div className="flex justify-between items-center py-0.5 sm:py-1 border-b border-white/5">
                <span className="text-foreground/70">Severity:</span>
                <span className={`font-semibold ${result.disease.severity === 'High' ? 'text-red-400' : 'text-amber-400'}`}>
                  {result.disease.severity}
                </span>
              </div>
              <div className="flex justify-between items-center py-0.5 sm:py-1 border-b border-white/5">
                <span className="text-foreground/70">Risk:</span>
                <span className="font-semibold text-white">{spreadRisk}</span>
              </div>
              <div className="flex justify-between items-center py-0.5 sm:py-1">
                <span className="text-foreground/70">Certainty:</span>
                <span className="font-semibold text-plantDoc-primary font-mono">{result.disease.confidence}%</span>
              </div>
            </div>
          </div>

          <div className="mt-2 pt-1.5 border-t border-white/10 flex items-center gap-1 text-[9px] sm:text-[11px] text-foreground/60">
            <ShieldAlert className="h-3 w-3 text-amber-400 shrink-0" />
            <span className="line-clamp-1">Isolate specimen to stop spores.</span>
          </div>
        </EnhancedCard>

        {/* Recovery Prognosis & Estimated Timeline */}
        <EnhancedCard glassIntensity="medium" hoverEffect="glow" className="col-span-2 md:col-span-1 p-3 sm:p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2 sm:mb-3">
              <div className="flex items-center gap-1.5 text-foreground/70 text-[10px] sm:text-xs font-semibold uppercase tracking-wider">
                <HeartHandshake className="h-3.5 w-3.5 text-emerald-400" />
                <span>Recovery Prognosis</span>
              </div>
              <span className="text-xs sm:text-sm font-bold text-emerald-400 font-mono">{Math.round(prognosis)}%</span>
            </div>

            <div className="space-y-1.5 mt-1 sm:mt-2">
              <div className="flex justify-between text-[11px] sm:text-xs text-foreground/70">
                <span>Recovery Chance</span>
                <span className="font-mono">{Math.round(prognosis)}%</span>
              </div>
              <Progress value={prognosis} className="h-1.5 sm:h-2 bg-white/10" />
            </div>

            <div className="mt-2.5 sm:mt-4 grid grid-cols-2 md:grid-cols-1 gap-1 sm:gap-1.5 text-[10px] sm:text-xs text-foreground/80">
              <div className="flex items-center gap-1.5">
                <Calendar className="h-3 w-3 text-plantDoc-primary shrink-0" />
                <span><strong>D 1-3:</strong> Prune foliage</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle className="h-3 w-3 text-emerald-400 shrink-0" />
                <span><strong>W 2-4:</strong> Regrowth</span>
              </div>
            </div>
          </div>

          <div className="mt-1 text-[9px] sm:text-[11px] text-foreground/60 text-right">
            Execute 4-tier remediation
          </div>
        </EnhancedCard>
      </div>

      {/* 2. Micro-Animated Environmental Requirements Bar (Sun, Water, Airflow - 2 in a row on mobile) */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-2.5 sm:gap-4">
        {/* Animated Sun Widget */}
        <div className="glass-card p-3 sm:p-4 rounded-2xl border border-white/10 flex items-center gap-2.5 sm:gap-3.5 hover:border-amber-400/40 transition-colors">
          <div className="relative flex items-center justify-center p-2 sm:p-3 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-400 shrink-0">
            <Sun className="h-4 sm:h-6 w-4 sm:w-6 animate-spin-slow" />
          </div>
          <div className="text-[11px] sm:text-xs">
            <span className="font-semibold text-white block">Light Therapy</span>
            <span className="text-foreground/70 line-clamp-2 sm:line-clamp-none">6-8h bright indirect light</span>
          </div>
        </div>

        {/* Animated Water Droplet Widget */}
        <div className="glass-card p-3 sm:p-4 rounded-2xl border border-white/10 flex items-center gap-2.5 sm:gap-3.5 hover:border-blue-400/40 transition-colors">
          <div className="relative flex items-center justify-center p-2 sm:p-3 rounded-xl bg-blue-500/15 border border-blue-500/30 text-blue-400 shrink-0">
            <Droplets className="h-4 sm:h-6 w-4 sm:w-6 animate-bounce-subtle" />
          </div>
          <div className="text-[11px] sm:text-xs">
            <span className="font-semibold text-white block">Irrigation</span>
            <span className="text-foreground/70 line-clamp-2 sm:line-clamp-none">Water at soil base</span>
          </div>
        </div>

        {/* Animated Airflow Widget */}
        <div className="glass-card col-span-2 md:col-span-1 p-3 sm:p-4 rounded-2xl border border-white/10 flex items-center gap-2.5 sm:gap-3.5 hover:border-emerald-400/40 transition-colors">
          <div className="relative flex items-center justify-center p-2 sm:p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 shrink-0">
            <Wind className="h-4 sm:h-6 w-4 sm:w-6 animate-pulse" />
          </div>
          <div className="text-[11px] sm:text-xs">
            <span className="font-semibold text-white block">Canopy Ventilation</span>
            <span className="text-foreground/70 line-clamp-1 sm:line-clamp-none">Maintain 360° airflow spacing</span>
          </div>
        </div>
      </div>

      {/* 3. Affected Plant Organs & Visual Symptoms Breakdown */}
      {result.symptoms_breakdown && result.symptoms_breakdown.length > 0 && (
        <EnhancedCard glassIntensity="medium">
          <EnhancedCardHeader className="pb-2">
            <EnhancedCardTitle className="text-base flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-amber-400" />
              Observed Symptom Breakdown & Affected Tissues
            </EnhancedCardTitle>
          </EnhancedCardHeader>
          <EnhancedCardContent className="pt-2">
            <div className="flex flex-wrap gap-2 mb-3">
              {(result.affected_parts || ['Leaves']).map((part, idx) => (
                <Badge key={idx} variant="outline" className="bg-plantDoc-primary/10 border-plantDoc-primary/30 text-plantDoc-primary text-xs">
                  Part: {part}
                </Badge>
              ))}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
              {result.symptoms_breakdown.map((item, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-black/30 border border-white/5 flex items-start justify-between gap-2 text-xs">
                  <div className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 shrink-0" />
                    <span className="text-foreground/90">{item.symptom}</span>
                  </div>
                  <Badge className="bg-white/10 text-white text-[10px] shrink-0">
                    {item.severity}
                  </Badge>
                </div>
              ))}
            </div>
          </EnhancedCardContent>
        </EnhancedCard>
      )}

      {/* 4. Soil & Fertilizer Prescription Visualizer */}
      <EnhancedCard glassIntensity="medium" borderGlow={true}>
        <EnhancedCardHeader className="pb-2">
          <EnhancedCardTitle className="text-base flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FlaskConical className="h-4 w-4 text-[#2DD4BF]" />
              Commercial Fertilizer & Soil Nutrition
            </div>
            <Badge className="bg-[#2DD4BF] text-black font-extrabold text-xs rounded-full">
              NPK: {result.fertilizer_recommendation.npk_ratio || '24-8-16'}
            </Badge>
          </EnhancedCardTitle>
        </EnhancedCardHeader>
        <EnhancedCardContent className="pt-2 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-black/30 border border-white/10 space-y-2">
              <div className="text-xs font-semibold text-[#5EEAD4] flex items-center gap-1.5">
                <Sparkles className="h-3.5 w-3.5" />
                Prescribed Commercial Product & Brand
              </div>
              <p className="text-sm font-semibold text-white">
                {result.fertilizer_recommendation.type}
              </p>
              <p className="text-xs text-foreground/80 leading-relaxed">
                {result.fertilizer_recommendation.application}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-black/30 border border-white/10 space-y-2">
              <div className="text-xs font-semibold text-emerald-400 flex items-center gap-1.5">
                <Droplets className="h-3.5 w-3.5" />
                Soil pH & Bioavailability
              </div>
              <p className="text-xs text-foreground/90 leading-relaxed">
                {result.fertilizer_recommendation.soil_ph_advice || 'Maintain well-draining soil with neutral to slightly acidic pH for root aeration.'}
              </p>
              <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden mt-2">
                <div className="bg-gradient-to-r from-amber-400 via-emerald-400 to-blue-400 h-full w-3/4 rounded-full" />
              </div>
            </div>
          </div>
        </EnhancedCardContent>
      </EnhancedCard>
    </div>
  );
};

export default DiagnosisVisualizations;
