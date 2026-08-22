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
    <div className="space-y-6">
      {/* 1. Vital Metrics & Prognosis Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Plant Health Score Gauge */}
        <EnhancedCard glassIntensity="medium" hoverEffect="glow" className="p-5 flex flex-col items-center justify-center text-center">
          <div className="flex items-center gap-2 mb-2 text-foreground/70 text-xs font-semibold uppercase tracking-wider">
            <Activity className="h-4 w-4 text-plantDoc-primary" />
            Plant Vitality Index
          </div>
          <div className="relative w-28 h-28 my-1 flex items-center justify-center">
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
              <span className={`text-2xl font-bold ${healthColor.text} font-mono`}>
                {Math.round(healthScore)}%
              </span>
              <span className="text-[10px] text-foreground/60">Vitality</span>
            </div>
          </div>
          <p className="text-xs text-foreground/70 mt-1">
            {healthScore > 70 ? 'Good recovery baseline' : 'Immediate quarantine required'}
          </p>
        </EnhancedCard>

        {/* Pathogen & Transmission Risk Card */}
        <EnhancedCard glassIntensity="medium" hoverEffect="glow" className="p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-1.5 text-foreground/70 text-xs font-semibold uppercase tracking-wider">
                <Bug className="h-4 w-4 text-amber-400" />
                Pathogen Profile
              </div>
              <Badge className="bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs">
                {pathogen}
              </Badge>
            </div>

            <div className="space-y-2.5 text-xs">
              <div className="flex justify-between items-center py-1 border-b border-white/5">
                <span className="text-foreground/70">Severity Level:</span>
                <span className={`font-semibold ${result.disease.severity === 'High' ? 'text-red-400' : 'text-amber-400'}`}>
                  {result.disease.severity}
                </span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-white/5">
                <span className="text-foreground/70">Transmission Risk:</span>
                <span className="font-semibold text-white">{spreadRisk}</span>
              </div>
              <div className="flex justify-between items-center py-1">
                <span className="text-foreground/70">Diagnostic Confidence:</span>
                <span className="font-semibold text-plantDoc-primary font-mono">{result.disease.confidence}%</span>
              </div>
            </div>
          </div>

          <div className="mt-3 pt-2 border-t border-white/10 flex items-center gap-1.5 text-[11px] text-foreground/60">
            <ShieldAlert className="h-3.5 w-3.5 text-amber-400 shrink-0" />
            <span>Isolate specimen to stop airborne sporulation.</span>
          </div>
        </EnhancedCard>

        {/* Recovery Prognosis & Estimated Timeline */}
        <EnhancedCard glassIntensity="medium" hoverEffect="glow" className="p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-1.5 text-foreground/70 text-xs font-semibold uppercase tracking-wider">
                <HeartHandshake className="h-4 w-4 text-emerald-400" />
                Recovery Prognosis
              </div>
              <span className="text-sm font-bold text-emerald-400 font-mono">{Math.round(prognosis)}%</span>
            </div>

            <div className="space-y-2 mt-2">
              <div className="flex justify-between text-xs text-foreground/70">
                <span>Estimated Recovery Chance</span>
                <span className="font-mono">{Math.round(prognosis)}%</span>
              </div>
              <Progress value={prognosis} className="h-2 bg-white/10" />
            </div>

            <div className="mt-4 space-y-1.5 text-xs text-foreground/80">
              <div className="flex items-center gap-2">
                <Calendar className="h-3.5 w-3.5 text-plantDoc-primary shrink-0" />
                <span><strong>Days 1-3:</strong> Sanitization & foliar pruning</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                <span><strong>Week 2-4:</strong> Regrowth of uninfected nodes</span>
              </div>
            </div>
          </div>

          <div className="mt-2 text-[11px] text-foreground/60 text-right">
            Execute 4-tier remediation plan
          </div>
        </EnhancedCard>
      </div>

      {/* 2. Micro-Animated Environmental Requirements Bar (Sun, Water, Airflow) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Animated Sun Widget */}
        <div className="glass-card p-4 rounded-2xl border border-white/10 flex items-center gap-3.5 hover:border-amber-400/40 transition-colors">
          <div className="relative flex items-center justify-center p-3 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-400 shrink-0">
            <Sun className="h-6 w-6 animate-spin-slow" />
          </div>
          <div className="text-xs">
            <span className="font-semibold text-white block">Light Therapy</span>
            <span className="text-foreground/70">6-8h bright indirect light; avoid scorching infected tissue</span>
          </div>
        </div>

        {/* Animated Water Droplet Widget */}
        <div className="glass-card p-4 rounded-2xl border border-white/10 flex items-center gap-3.5 hover:border-blue-400/40 transition-colors">
          <div className="relative flex items-center justify-center p-3 rounded-xl bg-blue-500/15 border border-blue-500/30 text-blue-400 shrink-0">
            <Droplets className="h-6 w-6 animate-bounce-subtle" />
          </div>
          <div className="text-xs">
            <span className="font-semibold text-white block">Irrigation Protocol</span>
            <span className="text-foreground/70">Water strictly at soil base; keep foliage 100% dry</span>
          </div>
        </div>

        {/* Animated Airflow Widget */}
        <div className="glass-card p-4 rounded-2xl border border-white/10 flex items-center gap-3.5 hover:border-emerald-400/40 transition-colors">
          <div className="relative flex items-center justify-center p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 shrink-0">
            <Wind className="h-6 w-6 animate-pulse" />
          </div>
          <div className="text-xs">
            <span className="font-semibold text-white block">Canopy Ventilation</span>
            <span className="text-foreground/70">Maintain 360° airflow spacing to stop spore germination</span>
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
