import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Activity, 
  Calendar, 
  CheckCircle2, 
  Clock, 
  Sparkles, 
  ShieldCheck, 
  TrendingUp, 
  AlertTriangle,
  ChevronRight,
  Info,
  Droplets,
  Layers
} from 'lucide-react';
import { EnhancedCard, EnhancedCardHeader, EnhancedCardTitle } from '@/components/ui/enhanced-card';
import { Badge } from '@/components/ui/badge';
import { DiagnosisResult } from '@/types/diagnosis';

interface InteractiveRecoveryTimelineProps {
  result: DiagnosisResult;
}

export const InteractiveRecoveryTimeline: React.FC<InteractiveRecoveryTimelineProps> = ({ result }) => {
  const isHealthy = 
    !result.disease.name ||
    result.disease.name.toLowerCase().includes('healthy') ||
    result.disease.name.toLowerCase().includes('no disease') ||
    result.disease.severity?.toLowerCase() === 'none';

  const defaultSimulation = [
    {
      day: 1,
      stage_name: isHealthy ? "Baseline Health" : "Emergency Triage",
      expected_health_pct: isHealthy ? 98 : (result.disease.severity === 'Critical' ? 28 : result.disease.severity === 'High' ? 42 : 55),
      visual_symptom: isHealthy 
        ? "Normal cellular turgor and uniform chlorophyll distribution." 
        : "Active necrotizing lesion spots with chlorotic yellow halo margins.",
      required_action: isHealthy 
        ? "Routine light and substrate hydration check." 
        : "Sanitary pruning of leaves with >50% necrosis using 70% isopropanol shears. Quarantine host from adjacent plants."
    },
    {
      day: 7,
      stage_name: isHealthy ? "Active Photosynthesis" : "Antisepsis & Pathogen Arrest",
      expected_health_pct: isHealthy ? 98 : (result.disease.severity === 'Critical' ? 48 : result.disease.severity === 'High' ? 60 : 70),
      visual_symptom: isHealthy 
        ? "Expansion of apical shoots and stable transpiration." 
        : "Lesion margins desiccating into crisp brownish borders; chlorotic halos cease radial expansion.",
      required_action: isHealthy 
        ? "Maintain adequate air circulation." 
        : "Apply secondary targeted bio-fungicide or copper booster. Strictly avoid overhead leaf splashing."
    },
    {
      day: 14,
      stage_name: isHealthy ? "Vegetative Expansion" : "Cellular Regeneration",
      expected_health_pct: isHealthy ? 99 : (result.disease.severity === 'Critical' ? 68 : result.disease.severity === 'High' ? 76 : 82),
      visual_symptom: isHealthy 
        ? "Vibrant new growth with deep emerald green pigment." 
        : "Emergence of fresh, unblemished apical shoots and petiole nodes; dead tissue compartmentalized.",
      required_action: isHealthy 
        ? "Apply standard balanced organic feed." 
        : "Initiate light root zone fertilization with high potassium (K) to reinforce foliar cell wall lignification."
    },
    {
      day: 21,
      stage_name: isHealthy ? "Canopy Maturation" : "Vigor Restoration",
      expected_health_pct: isHealthy ? 100 : (result.disease.severity === 'Critical' ? 84 : result.disease.severity === 'High' ? 88 : 92),
      visual_symptom: isHealthy 
        ? "Peak photosynthetic enzyme activity and robust stomatal regulation." 
        : "Substantial foliar canopy replenishment; new leaves displaying 100% chlorophyll density without lesions.",
      required_action: isHealthy 
        ? "Inspect pest monitor cards." 
        : "Gradually re-acclimate specimen to standard ambient lighting and humidity."
    },
    {
      day: 30,
      stage_name: isHealthy ? "Sustained Vitality" : "Full Clinical Remission",
      expected_health_pct: typeof result.disease.recovery_prognosis === 'number' ? result.disease.recovery_prognosis : 95,
      visual_symptom: isHealthy 
        ? "Specimen at maximum botanical vigor." 
        : "Pathogen eradicated from vascular system. Plant has developed acquired systemic resistance.",
      required_action: isHealthy 
        ? "Seasonal maintenance protocol." 
        : "Resume standard horticultural maintenance with bi-weekly preventive neem or bio-inoculant foliar wash."
    }
  ];

  const stages = result.recovery_simulation && result.recovery_simulation.length >= 3 
    ? result.recovery_simulation 
    : defaultSimulation;

  const [selectedDayIdx, setSelectedDayIdx] = useState<number>(0);
  const activeStage = stages[selectedDayIdx] || stages[0];

  const getHealthColor = (pct: number) => {
    if (pct >= 85) return 'text-[#2DD4BF] border-[#2DD4BF]/40 bg-[#2DD4BF]/10';
    if (pct >= 65) return 'text-emerald-400 border-emerald-500/40 bg-emerald-500/10';
    if (pct >= 45) return 'text-amber-400 border-amber-500/40 bg-amber-500/10';
    return 'text-rose-400 border-rose-500/40 bg-rose-500/10';
  };

  const getHealthGaugeGradient = (pct: number) => {
    if (pct >= 85) return 'from-[#2DD4BF] to-[#10B981]';
    if (pct >= 65) return 'from-emerald-400 to-[#2DD4BF]';
    if (pct >= 45) return 'from-amber-400 to-emerald-400';
    return 'from-rose-500 to-amber-400';
  };

  return (
    <EnhancedCard glassIntensity="intense" borderGlow={true} className="bg-black/55 backdrop-blur-2xl rounded-3xl border border-white/20 overflow-hidden shadow-2xl">
      <EnhancedCardHeader className="border-b border-white/10 pb-4 pt-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-[#2DD4BF]/20 border border-[#2DD4BF]/40 text-[#2DD4BF] shadow-[0_0_15px_rgba(45,212,191,0.35)]">
              <TrendingUp className="h-5 w-5" />
            </div>
            <div>
              <EnhancedCardTitle className="text-xl sm:text-2xl text-white font-black tracking-tight">
                30-Day Prognosis & Dynamic Recovery Simulator
              </EnhancedCardTitle>
              <p className="text-xs text-white/70 mt-0.5">
                Interactive timeline simulating cellular regeneration under prescribed clinical protocol
              </p>
            </div>
          </div>

          <Badge className="bg-white/10 text-white border border-white/15 text-xs px-3 py-1 font-mono rounded-full self-start sm:self-auto">
            Prognosis: {typeof result.disease.recovery_prognosis === 'number' ? `${result.disease.recovery_prognosis}%` : '88% Expected Recovery'}
          </Badge>
        </div>
      </EnhancedCardHeader>

      <div className="p-5 sm:p-7 space-y-6">
        {/* Interactive Days Milestone Selector */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-white/60 flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5 text-[#2DD4BF]" />
              Select Trajectory Milestone:
            </span>
            <span className="text-xs font-mono text-[#5EEAD4]">
              {activeStage.day === 1 ? 'Day 01 (Initial Triage)' : `Day ${activeStage.day < 10 ? `0${activeStage.day}` : activeStage.day}`}
            </span>
          </div>

          {/* Stepper Buttons */}
          <div className="grid grid-cols-5 gap-2 sm:gap-3">
            {stages.map((stage, idx) => {
              const isSelected = selectedDayIdx === idx;
              return (
                <button
                  key={idx}
                  onClick={() => setSelectedDayIdx(idx)}
                  className={`p-2.5 sm:p-3.5 rounded-2xl border text-center transition-all duration-300 relative group overflow-hidden ${
                    isSelected
                      ? 'bg-[#2DD4BF]/20 border-[#2DD4BF] shadow-[0_0_20px_rgba(45,212,191,0.35)] scale-[1.02]'
                      : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20'
                  }`}
                >
                  <div className="text-[10px] sm:text-xs font-mono font-bold text-white/60 mb-0.5">
                    DAY {stage.day}
                  </div>
                  <div className={`text-xs sm:text-sm font-black truncate ${isSelected ? 'text-[#5EEAD4]' : 'text-white'}`}>
                    {stage.expected_health_pct}%
                  </div>
                  <div className="text-[9px] text-white/50 font-mono hidden md:block truncate mt-0.5">
                    {stage.stage_name}
                  </div>

                  {/* Active Indicator bar */}
                  {isSelected && (
                    <motion.div 
                      layoutId="activeTimelineBar"
                      className="absolute bottom-0 left-2 right-2 h-1 bg-[#2DD4BF] rounded-full shadow-[0_0_8px_#2DD4BF]" 
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Dynamic Interactive Stage Inspection Panel */}
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedDayIdx}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="p-5 sm:p-6 rounded-3xl bg-black/60 border border-white/15 space-y-5 relative overflow-hidden"
          >
            {/* Top Stage Header with Health Percentage Gauge */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="px-2.5 py-0.5 rounded-full bg-black/80 border border-[#2DD4BF]/40 text-[#5EEAD4] text-[10px] font-mono font-bold">
                    MILESTONE: DAY {activeStage.day}
                  </span>
                  <span className="text-white/40 text-xs font-mono">|</span>
                  <span className="text-xs font-mono text-white/70">
                    Expected Foliar Vigor: <strong className="text-white">{activeStage.expected_health_pct}%</strong>
                  </span>
                </div>
                <h4 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                  {activeStage.stage_name}
                </h4>
              </div>

              {/* Circular Health Gauge Card */}
              <div className="flex items-center gap-3 self-start sm:self-auto px-4 py-2 rounded-2xl bg-black/80 border border-white/10">
                <div className="relative w-12 h-12 flex items-center justify-center">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                    <path
                      className="text-white/10"
                      strokeWidth="3.5"
                      stroke="currentColor"
                      fill="none"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                    <path
                      className="text-[#2DD4BF] transition-all duration-700 ease-out"
                      strokeDasharray={`${activeStage.expected_health_pct}, 100`}
                      strokeWidth="3.5"
                      strokeLinecap="round"
                      stroke="currentColor"
                      fill="none"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                  </svg>
                  <span className="absolute text-xs font-mono font-extrabold text-white">
                    {activeStage.expected_health_pct}%
                  </span>
                </div>
                <div>
                  <span className="text-[10px] font-mono text-white/50 block">Specimen Health</span>
                  <span className={`text-xs font-bold ${activeStage.expected_health_pct >= 75 ? 'text-emerald-400' : 'text-amber-400'}`}>
                    {activeStage.expected_health_pct >= 85 ? 'High Vitality' : activeStage.expected_health_pct >= 60 ? 'Remission Active' : 'Under Triage'}
                  </span>
                </div>
              </div>
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Visual Symptoms at this stage */}
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2">
                <div className="flex items-center gap-2 text-amber-300 text-xs font-mono font-bold uppercase tracking-wider">
                  <Layers className="h-4 w-4" />
                  <span>Expected Foliar Presentation</span>
                </div>
                <p className="text-xs text-white/85 leading-relaxed">
                  {activeStage.visual_symptom}
                </p>
              </div>

              {/* Prescribed Action for this stage */}
              <div className="p-4 rounded-2xl bg-[#2DD4BF]/10 border border-[#2DD4BF]/30 space-y-2">
                <div className="flex items-center gap-2 text-[#5EEAD4] text-xs font-mono font-bold uppercase tracking-wider">
                  <CheckCircle2 className="h-4 w-4" />
                  <span>Mandatory Clinical Protocol</span>
                </div>
                <p className="text-xs text-white/90 leading-relaxed font-medium">
                  {activeStage.required_action}
                </p>
              </div>
            </div>

            {/* Microclimate Tip */}
            <div className="p-3.5 rounded-2xl bg-black/40 border border-white/10 flex items-start gap-3 text-xs text-white/70">
              <Info className="h-4 w-4 text-[#2DD4BF] shrink-0 mt-0.5" />
              <div className="leading-relaxed">
                <strong className="text-white font-semibold">Agronomic Best Practice: </strong>
                {activeStage.day <= 7 
                  ? "Keep specimen strictly separated from other plants. Sanitize hands and pruning tools before touching adjacent foliage."
                  : activeStage.day <= 14 
                    ? "Ensure morning solar exposure to evaporate overnight foliar condensation quickly, as free leaf moisture catalyzes fungal sporulation."
                    : "Maintain consistent soil hydration without waterlogging. Continue bi-weekly monitoring of new flush for lesion recurrence."}
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </EnhancedCard>
  );
};

export default React.memo(InteractiveRecoveryTimeline);
