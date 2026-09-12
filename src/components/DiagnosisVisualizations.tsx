import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DiagnosisResult } from '@/types/diagnosis';
import { EnhancedCard, EnhancedCardHeader, EnhancedCardTitle, EnhancedCardContent } from '@/components/ui/enhanced-card';
import { Badge } from '@/components/ui/badge';
import { 
  Activity, 
  ShieldAlert, 
  HeartHandshake, 
  Bug, 
  Droplets, 
  Sun,
  Wind,
  Calendar, 
  CheckCircle2, 
  Sparkles,
  AlertCircle,
  FlaskConical,
  Flame,
  ThermometerSun,
  Radiation,
  Dna,
  Microscope,
  Gauge,
  Zap,
  Award,
  Layers,
  Clock,
  Compass,
  TrendingUp,
  AlertTriangle,
  Info,
  ChevronRight,
  Eye
} from 'lucide-react';

interface DiagnosisVisualizationsProps {
  result: DiagnosisResult;
}

interface StageDetail {
  stageNumber: number;
  title: string;
  subtitle: string;
  severityLabel: string;
  percentageRange: string;
  color: string;
  borderColor: string;
  badgeBg: string;
  accentColor: string;
  symptoms: string[];
  clinicalMechanism: string;
  remediationAdvice: string;
}

const STAGE_DETAILS: Record<number, StageDetail> = {
  1: {
    stageNumber: 1,
    title: "Stage 1: Inoculation & Spore Adhesion",
    subtitle: "Incipient Attachment & Stomatal Triage",
    severityLabel: "Low Severity",
    percentageRange: "10% – 25% Horizon",
    color: "text-emerald-400",
    borderColor: "border-emerald-500/40",
    badgeBg: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
    accentColor: "#10B981",
    clinicalMechanism: "Fungal conidia or bacterial cells land on foliar cuticle, germinating microscopic germ tubes that probe stomatal openings and hydathodes.",
    symptoms: [
      "Subtle micro-chlorotic flecks or pale stippling barely visible to naked eye",
      "Foliar cuticle remains structurally intact with normal epidermal turgor",
      "Invisible early mycelial colonization on leaf abaxial (underside) surfaces",
      "No widespread leaf tissue necrosis or vascular collapse yet"
    ],
    remediationAdvice: "Apply preventative bio-fungicidal neem wash or copper shield to arrest spore germ tubes before cuticle penetration."
  },
  2: {
    stageNumber: 2,
    title: "Stage 2: Cuticle Penetration & Incubation",
    subtitle: "Intercellular Hyphal Colonization",
    severityLabel: "Moderate Severity",
    percentageRange: "30% – 55% Horizon",
    color: "text-amber-400",
    borderColor: "border-amber-500/40",
    badgeBg: "bg-amber-500/20 text-amber-300 border-amber-500/30",
    accentColor: "#F59E0B",
    clinicalMechanism: "Pathogen secretes pectinases and cellulases to dissolve the waxy cuticle layer, establishing haustoria inside mesophyll cells.",
    symptoms: [
      "Water-soaked translucent foliar halos around initial infection focal points",
      "Distinct pale yellow or lime-green chlorotic margins outlining lesion zones",
      "Early brown pinpoint necrotic spotting and localized downward leaf curling",
      "Localized chlorophyll depletion causing decreased photosynthetic reflectance"
    ],
    remediationAdvice: "Apply targeted broad-spectrum contact fungicide, lower canopy humidity, and avoid overhead irrigation to arrest spread."
  },
  3: {
    stageNumber: 3,
    title: "Stage 3: Active Necrotic Lesion Expansion",
    subtitle: "Parenchyma Cell Lysis & Structural Breakdown",
    severityLabel: "High Severity",
    percentageRange: "60% – 80% Horizon",
    color: "text-rose-400",
    borderColor: "border-rose-500/40",
    badgeBg: "bg-rose-500/20 text-rose-300 border-rose-500/30",
    accentColor: "#F43F5E",
    clinicalMechanism: "Host cells undergo programmed cell death and tissue necrosis from phytotoxins. Lesions coalesce across leaf veins, destroying foliar integrity.",
    symptoms: [
      "Dark brown, purple, or jet-black necrotic cores with defined target-board rings",
      "Shot-hole dropouts where dead central leaf tissue falls away from the lamina",
      "Extensive leaf curling, brittle margins, and yellowing of the entire leaf blade",
      "Weakened petiole junctions leading to premature foliar abscission (leaf drop)"
    ],
    remediationAdvice: "Execute immediate sanitary excision of all affected foliage and apply curative systemic fungicide (e.g. Chlorothalonil or Daconil)."
  },
  4: {
    stageNumber: 4,
    title: "Stage 4: Systemic Chlorosis & Vascular Collapse",
    subtitle: "Terminal Pathogen Sporulation & Canopy Blight",
    severityLabel: "Critical Severity",
    percentageRange: "85% – 100% Horizon",
    color: "text-red-400",
    borderColor: "border-red-500/40",
    badgeBg: "bg-red-500/20 text-red-300 border-red-500/30",
    accentColor: "#EF4444",
    clinicalMechanism: "Pathogen achieves full systemic vascular invasion of xylem and phloem vessels with heavy asexual sporulation releasing millions of airborne spores.",
    symptoms: [
      "Complete foliar blighting with total leaf necrosis and petiole collapse",
      "Fuzzy fungal sporulation blooms, gray mold, or bacterial ooze on leaf undersides",
      "Stem cankers, vascular discoloration, and extensive canopy defoliation",
      "Impaired sap transit causing irreversible whole-plant wilting"
    ],
    remediationAdvice: "Isolate specimen in quarantine, perform radical surgical cutback of infected branches, and sterilize all gardening tools with isopropyl alcohol."
  }
};

export const DiagnosisVisualizations: React.FC<DiagnosisVisualizationsProps> = React.memo(({ result }) => {
  const [activeRadarMetric, setActiveRadarMetric] = useState<string | null>(null);

  const healthScore = Math.max(5, Math.min(100, result.disease.health_score ?? (100 - (result.disease.confidence || 85) * 0.65)));
  const severityStr = String(result.disease?.severity || '').toLowerCase();
  const prognosis = Math.max(10, Math.min(100, result.disease.recovery_prognosis ?? (severityStr === 'high' || severityStr === 'critical' ? 62 : 88)));
  const confidence = Math.max(10, Math.min(100, result.disease.confidence || 92));
  const spreadRisk = String(result.disease.spread_risk || (severityStr === 'high' ? 'High' : 'Moderate'));

  const diseaseName = String(result.disease.name || '');
  const isHealthy = 
    !diseaseName ||
    diseaseName.toLowerCase().includes('healthy') ||
    diseaseName.toLowerCase().includes('no disease') ||
    diseaseName.toLowerCase().includes('no pathogen') ||
    severityStr === 'none';

  // Pathology progression stage
  const progressionPhase = useMemo(() => {
    if (isHealthy) return { level: 1, label: 'Optimal Tissue Homeostasis', percent: 5, color: 'text-emerald-400', bg: 'bg-emerald-500' };
    if (severityStr === 'critical' || healthScore < 35) {
      return { level: 4, label: 'Phase 4: Systemic Chlorosis & Vascular Necrosis', percent: 90, color: 'text-red-400', bg: 'bg-red-500' };
    }
    if (severityStr === 'high' || healthScore < 55) {
      return { level: 3, label: 'Phase 3: Deep Parenchyma Cellular Lesion Expansion', percent: 70, color: 'text-rose-400', bg: 'bg-rose-500' };
    }
    if (severityStr === 'medium' || healthScore < 75) {
      return { level: 2, label: 'Phase 2: Cuticle Penetration & Intercellular Hyphae', percent: 45, color: 'text-amber-400', bg: 'bg-amber-500' };
    }
    return { level: 1, label: 'Phase 1: Incipient Spore Adhesion & Stomatal Triage', percent: 20, color: 'text-emerald-400', bg: 'bg-emerald-400' };
  }, [healthScore, isHealthy, severityStr]);

  // Selected stage state for interactive symptom inspector (defaults to current progression level)
  const [selectedStage, setSelectedStage] = useState<number>(progressionPhase.level);

  // Derive 5 Botanical Health Dimensions for Radar Polygon Chart
  const radarMetrics = useMemo(() => {
    const severityFactor = severityStr === 'high' || severityStr === 'critical' ? 0.35 : severityStr === 'medium' ? 0.6 : 0.85;
    const spreadFactor = spreadRisk.toLowerCase().includes('high') ? 0.3 : spreadRisk.toLowerCase().includes('moderate') ? 0.6 : 0.9;
    
    return [
      { 
        key: 'vitality', 
        name: 'Foliar Vitality', 
        value: Math.round(healthScore),
        description: 'Overall physiological cellular health and turgor pressure of the leaf tissue.',
        color: '#2DD4BF'
      },
      { 
        key: 'membrane', 
        name: 'Membrane Integrity', 
        value: Math.round(isHealthy ? 95 : Math.max(15, healthScore * 0.9 + severityFactor * 10)),
        description: 'Resistance of foliar epidermal cells against fungal hyphae penetration.',
        color: '#10B981'
      },
      { 
        key: 'chlorophyll', 
        name: 'Photosynthetic Index', 
        value: Math.round(isHealthy ? 92 : Math.max(20, healthScore * 0.85 + 10)),
        description: 'Chlorophyll reflectance and active light-harvesting chloroplast density.',
        color: '#34D399'
      },
      { 
        key: 'immunity', 
        name: 'Host Immunity', 
        value: Math.round(prognosis),
        description: 'Systemic acquired resistance (SAR) and biochemical defense phytoalexins.',
        color: '#60A5FA'
      },
      { 
        key: 'containment', 
        name: 'Barrier Containment', 
        value: Math.round(spreadFactor * 100),
        description: 'Ability to localize lesions and stop spore propagation across the canopy.',
        color: '#F59E0B'
      }
    ];
  }, [healthScore, isHealthy, prognosis, spreadRisk, severityStr]);

  // Radar Polygon Points Calculation
  const radarChartData = useMemo(() => {
    const size = 220;
    const center = size / 2;
    const radius = 80;
    const totalAxes = radarMetrics.length;
    const angleStep = (Math.PI * 2) / totalAxes;

    // Grid circles/rings
    const gridLevels = [0.25, 0.5, 0.75, 1.0];

    const getCoordinates = (index: number, valueRatio: number) => {
      const angle = index * angleStep - Math.PI / 2;
      const x = center + Math.cos(angle) * (radius * valueRatio);
      const y = center + Math.sin(angle) * (radius * valueRatio);
      return { x, y, angle };
    };

    const polygonPoints = radarMetrics.map((m, idx) => {
      const coords = getCoordinates(idx, m.value / 100);
      return `${coords.x},${coords.y}`;
    }).join(' ');

    const axisLines = radarMetrics.map((m, idx) => {
      const outerCoords = getCoordinates(idx, 1.0);
      const labelCoords = getCoordinates(idx, 1.24);
      const currentCoords = getCoordinates(idx, m.value / 100);
      return {
        ...m,
        x1: center,
        y1: center,
        x2: outerCoords.x,
        y2: outerCoords.y,
        labelX: labelCoords.x,
        labelY: labelCoords.y,
        currentX: currentCoords.x,
        currentY: currentCoords.y,
      };
    });

    return { size, center, radius, gridLevels, polygonPoints, axisLines };
  }, [radarMetrics]);

  // Derive NPK numbers from string or default
  const npkString = result.fertilizer_recommendation?.npk_ratio || '10-10-10';
  const npkParts = npkString.split('-').map(n => parseInt(n.trim(), 10) || 10);
  const nVal = npkParts[0] || 10;
  const pVal = npkParts[1] || 10;
  const kVal = npkParts[2] || 10;
  const npkMax = Math.max(nVal, pVal, kVal, 20);

  // Extract recommended pH from advice or default
  const targetPh = useMemo(() => {
    const text = result.fertilizer_recommendation?.soil_ph_advice || '';
    const match = text.match(/([4-8]\.?[0-9]?)/);
    return match ? parseFloat(match[1]) : 6.4;
  }, [result.fertilizer_recommendation?.soil_ph_advice]);

  const activeStageData = STAGE_DETAILS[selectedStage] || STAGE_DETAILS[1];

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* ========================================================================= */}
      {/* 1. PATHOLOGY INFECTION STAGE & SEVERITY HORIZON (PLACED FIRST) */}
      {/* ========================================================================= */}
      <EnhancedCard glassIntensity="medium" className="bg-black/55 backdrop-blur-2xl border border-white/20 rounded-3xl overflow-hidden shadow-2xl">
        <EnhancedCardHeader className="pb-3 border-b border-white/10">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Microscope className="h-5 w-5 text-amber-400" />
              <div>
                <EnhancedCardTitle className="text-base text-white">Pathology Infection Stage & Severity Horizon</EnhancedCardTitle>
                <p className="text-xs text-white/70">Click any infection stage below to inspect symptomatic foliar progression</p>
              </div>
            </div>
            <Badge className="bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs px-2.5 py-1 self-start sm:self-auto font-mono">
              Diagnosed: {result.disease.severity} Severity
            </Badge>
          </div>
        </EnhancedCardHeader>

        <EnhancedCardContent className="pt-4 space-y-5">
          {/* Active Stage Status Banner */}
          <div className="p-3.5 rounded-2xl bg-black/40 border border-amber-500/30 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <span className="relative flex h-3 w-3 shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-500" />
              </span>
              <span className={`text-xs sm:text-sm font-bold ${progressionPhase.color}`}>
                Current Diagnosis: {progressionPhase.label}
              </span>
            </div>
            <span className="text-xs font-mono text-white/70 shrink-0">
              Epidemic Spread: <strong className="text-white">{spreadRisk}</strong>
            </span>
          </div>

          {/* Continuous Spectrum Progression Bar */}
          <div className="space-y-2">
            <div className="relative w-full h-4 bg-white/10 rounded-full overflow-hidden p-0.5 border border-white/15">
              <div 
                className="h-full rounded-full bg-gradient-to-r from-emerald-500 via-amber-500 to-red-500 transition-all duration-700 shadow-[0_0_15px_rgba(245,158,11,0.5)]"
                style={{ width: `${progressionPhase.percent}%` }}
              />
            </div>

            {/* Interactive Stage Selectors */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
              {[1, 2, 3, 4].map((stageNum) => {
                const stage = STAGE_DETAILS[stageNum];
                const isSelected = selectedStage === stageNum;
                const isCurrentDiagnosed = progressionPhase.level === stageNum;

                return (
                  <button
                    key={stageNum}
                    type="button"
                    onClick={() => setSelectedStage(stageNum)}
                    className={`p-3 rounded-2xl text-left transition-all duration-200 cursor-pointer relative overflow-hidden border ${
                      isSelected 
                        ? `${stage.borderColor} bg-white/[0.08] shadow-[0_0_20px_rgba(0,0,0,0.5)] scale-[1.02]` 
                        : 'border-white/10 bg-black/30 hover:bg-white/[0.04] opacity-80 hover:opacity-100'
                    }`}
                  >
                    {isCurrentDiagnosed && (
                      <span className="absolute top-2 right-2 flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#2DD4BF] opacity-75" />
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-[#2DD4BF]" />
                      </span>
                    )}

                    <div className="flex items-center gap-1.5 mb-1">
                      <span className={`text-[11px] font-mono font-bold ${stage.color}`}>
                        Stage {stageNum}
                      </span>
                      {isCurrentDiagnosed && (
                        <span className="text-[9px] font-mono px-1.5 py-0.2 rounded-full bg-[#2DD4BF]/20 text-[#5EEAD4] border border-[#2DD4BF]/30">
                          Active
                        </span>
                      )}
                    </div>
                    
                    <div className="text-xs font-bold text-white line-clamp-1">
                      {stageNum === 1 && "Inoculation"}
                      {stageNum === 2 && "Penetration"}
                      {stageNum === 3 && "Necrosis"}
                      {stageNum === 4 && "Systemic"}
                    </div>
                    
                    <span className="text-[10px] text-white/50 block font-mono mt-0.5">
                      {stage.percentageRange.split(' ')[0]}
                    </span>

                    {isSelected && (
                      <div className="mt-2 text-[10px] text-[#5EEAD4] flex items-center gap-1 font-mono font-semibold">
                        <Eye className="h-3 w-3" />
                        <span>Viewing Symptoms</span>
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 🔍 Interactive Stage Symptoms & Pathological Mechanism Detail Card */}
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedStage}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }}
              className={`p-4 sm:p-5 rounded-3xl bg-black/70 border ${activeStageData.borderColor} space-y-3.5 shadow-xl`}
            >
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-3">
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h4 className="text-sm sm:text-base font-extrabold text-white">
                      {activeStageData.title}
                    </h4>
                    <Badge className={`${activeStageData.badgeBg} text-[10px] font-mono font-bold px-2 py-0.5 rounded-full`}>
                      {activeStageData.severityLabel}
                    </Badge>
                  </div>
                  <p className="text-xs text-white/70 mt-0.5 italic">
                    {activeStageData.subtitle}
                  </p>
                </div>

                <div className="text-[11px] font-mono text-white/60">
                  {selectedStage === progressionPhase.level ? (
                    <span className="text-[#5EEAD4] font-bold flex items-center gap-1">
                      <CheckCircle2 className="h-3.5 w-3.5 text-[#2DD4BF]" />
                      Current Diagnosed Specimen Stage
                    </span>
                  ) : (
                    <span className="text-white/50">Comparative Progression Stage</span>
                  )}
                </div>
              </div>

              {/* Biological Pathology Mechanism */}
              <div className="p-3 rounded-2xl bg-white/[0.04] border border-white/10 space-y-1">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-amber-300 block flex items-center gap-1.5">
                  <Dna className="h-3.5 w-3.5" />
                  Pathological Cellular Mechanism:
                </span>
                <p className="text-xs text-white/90 leading-relaxed">
                  {activeStageData.clinicalMechanism}
                </p>
              </div>

              {/* Exact Symptoms Checklist */}
              <div className="space-y-2">
                <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#5EEAD4] block flex items-center gap-1.5">
                  <Sparkles className="h-3.5 w-3.5" />
                  Observable Foliar Symptoms During This Stage:
                </span>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {activeStageData.symptoms.map((symptom, idx) => (
                    <div 
                      key={idx} 
                      className="p-2.5 rounded-xl bg-black/50 border border-white/10 flex items-start gap-2 text-xs text-white/85"
                    >
                      <CheckCircle2 className="h-3.5 w-3.5 text-[#2DD4BF] shrink-0 mt-0.5" />
                      <span>{symptom}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Targeted Stage Remediation */}
              <div className="p-3 rounded-2xl bg-emerald-950/30 border border-emerald-500/30 flex items-start gap-2.5">
                <ShieldAlert className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                <div className="space-y-0.5">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-300 block">
                    Targeted Agronomic Stage Remediation:
                  </span>
                  <p className="text-xs text-white/90 leading-relaxed">
                    {activeStageData.remediationAdvice}
                  </p>
                </div>
              </div>

            </motion.div>
          </AnimatePresence>

        </EnhancedCardContent>
      </EnhancedCard>

      {/* ========================================================================= */}
      {/* 2. ADVANCED BOTANICAL RADAR & TRIPLE-RING VITALITY MATRIX */}
      {/* ========================================================================= */}
      <EnhancedCard glassIntensity="intense" borderGlow={true} className="bg-black/55 backdrop-blur-2xl border border-white/20 rounded-3xl overflow-hidden shadow-2xl">
        <EnhancedCardHeader className="pb-3 border-b border-white/10">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-[#2DD4BF]/20 text-[#2DD4BF] border border-[#2DD4BF]/30 flex items-center justify-center">
                <Activity className="h-4 w-4" />
              </div>
              <div>
                <EnhancedCardTitle className="text-lg font-black text-white flex items-center gap-2">
                  <span>Botanical Vitality & Multi-Vector Radar Matrix</span>
                </EnhancedCardTitle>
                <p className="text-xs text-white/70">5-Dimensional foliar cellular dynamics and pathogen resistance profile</p>
              </div>
            </div>
            <Badge className="bg-[#2DD4BF]/20 text-[#5EEAD4] border border-[#2DD4BF]/40 text-xs px-3 py-1 font-mono self-start sm:self-auto">
              Vector Telemetry v3.6
            </Badge>
          </div>
        </EnhancedCardHeader>

        <EnhancedCardContent className="pt-6 space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            
            {/* Left: Dynamic SVG Radar / Polygon Visualizer (Fixed Animation) */}
            <div className="lg:col-span-6 flex flex-col items-center justify-center p-4 rounded-3xl bg-black/45 border border-white/10 relative overflow-hidden">
              {/* Radar ambient glow */}
              <div className="absolute inset-0 bg-radial from-[#2DD4BF]/10 to-transparent pointer-events-none" />

              <div className="relative w-full max-w-[300px] aspect-square flex items-center justify-center">
                <svg viewBox={`0 0 ${radarChartData.size} ${radarChartData.size}`} className="w-full h-full transform-gpu overflow-visible">
                  <defs>
                    <linearGradient id="radarPolygonGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#2DD4BF" stopOpacity="0.55" />
                      <stop offset="50%" stopColor="#10B981" stopOpacity="0.4" />
                      <stop offset="100%" stopColor="#059669" stopOpacity="0.2" />
                    </linearGradient>
                    <filter id="radarGlow" x="-20%" y="-20%" width="140%" height="140%">
                      <feGaussianBlur stdDeviation="3" result="blur" />
                      <feComposite in="SourceGraphic" in2="blur" operator="over" />
                    </filter>
                  </defs>

                  {/* Concentric Pentagon Background Grid Rings */}
                  {radarChartData.gridLevels.map((lvl, idx) => {
                    const gridPoints = radarMetrics.map((_, aIdx) => {
                      const angle = aIdx * ((Math.PI * 2) / radarMetrics.length) - Math.PI / 2;
                      const x = radarChartData.center + Math.cos(angle) * (radarChartData.radius * lvl);
                      const y = radarChartData.center + Math.sin(angle) * (radarChartData.radius * lvl);
                      return `${x},${y}`;
                    }).join(' ');

                    return (
                      <g key={idx}>
                        <polygon
                          points={gridPoints}
                          fill={idx === radarChartData.gridLevels.length - 1 ? 'rgba(255,255,255,0.02)' : 'none'}
                          stroke="rgba(255, 255, 255, 0.12)"
                          strokeWidth="1"
                          strokeDasharray={idx < 3 ? '2 2' : 'none'}
                        />
                        {/* Percentage markers */}
                        <text
                          x={radarChartData.center + 4}
                          y={radarChartData.center - radarChartData.radius * lvl + 8}
                          fill="rgba(255, 255, 255, 0.35)"
                          fontSize="7"
                          fontFamily="monospace"
                        >
                          {lvl * 100}%
                        </text>
                      </g>
                    );
                  })}

                  {/* Radial Axis Lines */}
                  {radarChartData.axisLines.map((axis, idx) => (
                    <line
                      key={idx}
                      x1={axis.x1}
                      y1={axis.y1}
                      x2={axis.x2}
                      y2={axis.y2}
                      stroke="rgba(255, 255, 255, 0.15)"
                      strokeWidth="1"
                    />
                  ))}

                  {/* The Dynamic Radar Area Polygon (Clean Smooth Transition) */}
                  <motion.polygon
                    points={radarChartData.polygonPoints}
                    fill="url(#radarPolygonGrad)"
                    stroke="#2DD4BF"
                    strokeWidth="2.5"
                    strokeLinejoin="round"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    filter="url(#radarGlow)"
                  />

                  {/* Interactive Glowing Vertices (Steady Elegant Points) */}
                  {radarChartData.axisLines.map((axis, idx) => (
                    <g 
                      key={idx} 
                      className="cursor-pointer group"
                      onMouseEnter={() => setActiveRadarMetric(axis.key)}
                      onMouseLeave={() => setActiveRadarMetric(null)}
                      onClick={() => setActiveRadarMetric(activeRadarMetric === axis.key ? null : axis.key)}
                    >
                      <circle
                        cx={axis.currentX}
                        cy={axis.currentY}
                        r={activeRadarMetric === axis.key ? "6.5" : "4.5"}
                        fill="#060907"
                        stroke={activeRadarMetric === axis.key ? "#5EEAD4" : "#2DD4BF"}
                        strokeWidth="2"
                        className="transition-all duration-200"
                      />
                      {/* Vertex Label */}
                      <text
                        x={axis.labelX}
                        y={axis.labelY}
                        fill={activeRadarMetric === axis.key ? '#5EEAD4' : 'rgba(255,255,255,0.75)'}
                        fontSize="8.5"
                        fontWeight={activeRadarMetric === axis.key ? 'bold' : 'normal'}
                        textAnchor="middle"
                        dominantBaseline="central"
                        fontFamily="sans-serif"
                        className="select-none transition-colors"
                      >
                        {axis.name.split(' ')[0]}
                      </text>
                    </g>
                  ))}
                </svg>
              </div>

              {/* Active Hover Metric Tooltip Box */}
              <div className="w-full mt-3 p-2.5 rounded-2xl bg-black/60 border border-white/10 text-center min-h-[44px] flex items-center justify-center">
                {activeRadarMetric ? (
                  (() => {
                    const m = radarMetrics.find(x => x.key === activeRadarMetric);
                    if (!m) return null;
                    return (
                      <div className="animate-fade-in text-xs">
                        <strong className="text-[#5EEAD4] font-bold mr-1">{m.name} ({m.value}%):</strong>
                        <span className="text-white/80">{m.description}</span>
                      </div>
                    );
                  })()
                ) : (
                  <span className="text-[11px] text-white/50 font-mono flex items-center gap-1.5 justify-center">
                    <Info className="h-3 w-3 text-[#2DD4BF]" />
                    Hover or tap polygon vertices to inspect physiological metrics
                  </span>
                )}
              </div>
            </div>

            {/* Right: Triple-Metric Vitality Arc Rings & Telemetry Stat Cards */}
            <div className="lg:col-span-6 space-y-4">
              
              {/* 3 Metric Mini Cards */}
              <div className="grid grid-cols-3 gap-2.5">
                {/* 1. Vitality */}
                <div className="p-3.5 rounded-2xl bg-black/45 border border-white/10 flex flex-col items-center text-center space-y-1 hover:border-[#2DD4BF]/40 transition-colors">
                  <span className="text-[10px] font-mono text-white/60 uppercase tracking-wider">Vitality Index</span>
                  <div className="text-xl sm:text-2xl font-black text-[#5EEAD4] font-mono">
                    {Math.round(healthScore)}%
                  </div>
                  <span className="text-[9px] text-white/70">
                    {healthScore >= 70 ? 'Vigorous' : healthScore >= 45 ? 'Compromised' : 'Critical'}
                  </span>
                </div>

                {/* 2. Recovery Prognosis */}
                <div className="p-3.5 rounded-2xl bg-black/45 border border-white/10 flex flex-col items-center text-center space-y-1 hover:border-emerald-400/40 transition-colors">
                  <span className="text-[10px] font-mono text-white/60 uppercase tracking-wider">Recovery Rate</span>
                  <div className="text-xl sm:text-2xl font-black text-emerald-400 font-mono">
                    {Math.round(prognosis)}%
                  </div>
                  <span className="text-[9px] text-white/70">30-Day Remission</span>
                </div>

                {/* 3. AI Vision Confidence */}
                <div className="p-3.5 rounded-2xl bg-black/45 border border-white/10 flex flex-col items-center text-center space-y-1 hover:border-blue-400/40 transition-colors">
                  <span className="text-[10px] font-mono text-white/60 uppercase tracking-wider">AI Confidence</span>
                  <div className="text-xl sm:text-2xl font-black text-sky-400 font-mono">
                    {Math.round(confidence)}%
                  </div>
                  <span className="text-[9px] text-white/70">Vision Certainty</span>
                </div>
              </div>

              {/* Dimension Bars with Progress */}
              <div className="p-4 rounded-3xl bg-black/45 border border-white/10 space-y-3">
                <span className="text-[11px] font-mono text-white/70 uppercase tracking-wider font-bold block flex items-center justify-between">
                  <span>Botanical Health Breakdown</span>
                  <span className="text-[#5EEAD4]">Composite 100 pt Scale</span>
                </span>

                <div className="space-y-2.5">
                  {radarMetrics.map((m) => (
                    <div key={m.key} className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="text-white/80 font-medium flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: m.color }} />
                          {m.name}
                        </span>
                        <span className="font-mono font-bold text-white">{m.value}%</span>
                      </div>
                      <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden p-0.5 border border-white/5">
                        <div
                          className="h-full rounded-full transition-all duration-500"
                          style={{ 
                            width: `${m.value}%`,
                            backgroundColor: m.color 
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>

          </div>
        </EnhancedCardContent>
      </EnhancedCard>

      {/* ========================================================================= */}
      {/* 3. 30-DAY PROGNOSIS TRAJECTORY CURVE (Treated vs Untreated) */}
      {/* ========================================================================= */}
      <EnhancedCard glassIntensity="medium" className="bg-black/55 backdrop-blur-2xl border border-white/20 rounded-3xl">
        <EnhancedCardHeader className="pb-3 border-b border-white/10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-emerald-400" />
              <EnhancedCardTitle className="text-base text-white">30-Day Foliar Recovery Forecast Curve</EnhancedCardTitle>
            </div>
            <span className="text-xs font-mono text-emerald-400 font-bold">
              Projected Remission: {Math.round(prognosis)}%
            </span>
          </div>
        </EnhancedCardHeader>

        <EnhancedCardContent className="pt-4 space-y-4">
          {/* SVG Trajectory Chart */}
          <div className="p-4 rounded-3xl bg-black/45 border border-white/10">
            <div className="relative w-full h-40">
              <svg viewBox="0 0 400 150" className="w-full h-full overflow-visible">
                <defs>
                  <linearGradient id="treatedAreaGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#10B981" stopOpacity="0.35" />
                    <stop offset="100%" stopColor="#10B981" stopOpacity="0.0" />
                  </linearGradient>
                  <linearGradient id="untreatedAreaGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#EF4444" stopOpacity="0.25" />
                    <stop offset="100%" stopColor="#EF4444" stopOpacity="0.0" />
                  </linearGradient>
                </defs>

                {/* Horizontal Gridlines */}
                <line x1="40" y1="20" x2="380" y2="20" stroke="rgba(255,255,255,0.08)" strokeDasharray="3 3" />
                <line x1="40" y1="65" x2="380" y2="65" stroke="rgba(255,255,255,0.08)" strokeDasharray="3 3" />
                <line x1="40" y1="110" x2="380" y2="110" stroke="rgba(255,255,255,0.08)" strokeDasharray="3 3" />

                <text x="15" y="24" fill="rgba(255,255,255,0.4)" fontSize="9" fontFamily="monospace">100%</text>
                <text x="20" y="69" fill="rgba(255,255,255,0.4)" fontSize="9" fontFamily="monospace">50%</text>
                <text x="25" y="114" fill="rgba(255,255,255,0.4)" fontSize="9" fontFamily="monospace">0%</text>

                {/* Curve 1: Treated Recovery Trajectory (Green) */}
                <path
                  d="M 50 100 C 130 90, 200 45, 370 25 L 370 120 L 50 120 Z"
                  fill="url(#treatedAreaGrad)"
                />
                <path
                  d="M 50 100 C 130 90, 200 45, 370 25"
                  fill="none"
                  stroke="#10B981"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                />

                {/* Curve 2: Untreated Deterioration Trajectory (Red Dashed) */}
                <path
                  d="M 50 100 C 130 105, 220 120, 370 135 L 370 135 L 50 120 Z"
                  fill="url(#untreatedAreaGrad)"
                />
                <path
                  d="M 50 100 C 130 105, 220 120, 370 135"
                  fill="none"
                  stroke="#EF4444"
                  strokeWidth="2"
                  strokeDasharray="4 4"
                  strokeLinecap="round"
                />

                {/* Key Milestones */}
                <circle cx="50" cy="100" r="4" fill="#2DD4BF" />
                <circle cx="150" cy="72" r="4" fill="#10B981" />
                <circle cx="260" cy="42" r="4" fill="#34D399" />
                <circle cx="370" cy="25" r="5" fill="#5EEAD4" stroke="#000" strokeWidth="2" />
              </svg>
            </div>

            {/* Timeline Milestones Legend */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 text-xs border-t border-white/10 mt-2">
              <div className="p-2 rounded-xl bg-white/5">
                <span className="text-[10px] font-mono text-[#5EEAD4] font-bold block">Day 1: Triage</span>
                <span className="text-white/75 text-[11px]">Immediate leaf pruning & systemic spray</span>
              </div>
              <div className="p-2 rounded-xl bg-white/5">
                <span className="text-[10px] font-mono text-emerald-400 font-bold block">Day 7: Spore Arrest</span>
                <span className="text-white/75 text-[11px]">Hyphae halted; barrier sealed</span>
              </div>
              <div className="p-2 rounded-xl bg-white/5">
                <span className="text-[10px] font-mono text-teal-300 font-bold block">Day 14: Budding</span>
                <span className="text-white/75 text-[11px]">Fresh unblemished foliage emerging</span>
              </div>
              <div className="p-2 rounded-xl bg-white/5">
                <span className="text-[10px] font-mono text-sky-400 font-bold block">Day 30: Remission</span>
                <span className="text-white/75 text-[11px]">Full cellular vigor & SAR restored</span>
              </div>
            </div>
          </div>
        </EnhancedCardContent>
      </EnhancedCard>

      {/* ========================================================================= */}
      {/* 4. SOIL NPK NUTRITION & BIOAVAILABILITY SPECTRUM */}
      {/* ========================================================================= */}
      {result.fertilizer_recommendation && (
        <EnhancedCard glassIntensity="medium" borderGlow={true} className="bg-black/55 backdrop-blur-2xl border border-white/20 rounded-3xl">
          <EnhancedCardHeader className="pb-3 border-b border-white/10">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FlaskConical className="h-4 w-4 text-[#2DD4BF]" />
                <EnhancedCardTitle className="text-base text-white">Prescribed Soil Bio-Nutrition & NPK Dynamics</EnhancedCardTitle>
              </div>
              <Badge className="bg-[#2DD4BF] text-black font-extrabold text-xs rounded-full px-3">
                NPK: {result.fertilizer_recommendation.npk_ratio || '10-10-10'}
              </Badge>
            </div>
          </EnhancedCardHeader>

          <EnhancedCardContent className="pt-4 space-y-5">
            
            {/* Visual NPK Macronutrient Formulation Profile */}
            <div className="p-4 rounded-3xl bg-black/45 border border-white/10 space-y-3">
              <span className="text-[11px] font-mono text-white/70 uppercase tracking-wider block font-bold">
                Macronutrient Bio-Availability Balance
              </span>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
                {/* Nitrogen */}
                <div className="p-3 rounded-2xl bg-emerald-950/30 border border-emerald-500/30 space-y-1.5">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-emerald-300 font-bold">Nitrogen (N)</span>
                    <span className="font-mono text-white font-bold">{nVal} Ratio</span>
                  </div>
                  <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden">
                    <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${(nVal / npkMax) * 100}%` }} />
                  </div>
                  <span className="text-[10px] text-white/60 block">Photosynthetic chlorophyll synthesis & leafy vigor</span>
                </div>

                {/* Phosphorus */}
                <div className="p-3 rounded-2xl bg-amber-950/30 border border-amber-500/30 space-y-1.5">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-amber-300 font-bold">Phosphorus (P)</span>
                    <span className="font-mono text-white font-bold">{pVal} Ratio</span>
                  </div>
                  <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden">
                    <div className="bg-amber-500 h-full rounded-full" style={{ width: `${(pVal / npkMax) * 100}%` }} />
                  </div>
                  <span className="text-[10px] text-white/60 block">Root cellular ATP energy & fungal defense</span>
                </div>

                {/* Potassium */}
                <div className="p-3 rounded-2xl bg-blue-950/30 border border-blue-500/30 space-y-1.5">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-blue-300 font-bold">Potassium (K)</span>
                    <span className="font-mono text-white font-bold">{kVal} Ratio</span>
                  </div>
                  <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden">
                    <div className="bg-blue-500 h-full rounded-full" style={{ width: `${(kVal / npkMax) * 100}%` }} />
                  </div>
                  <span className="text-[10px] text-white/60 block">Stomatal guard cell turgor & epidermal thickness</span>
                </div>
              </div>
            </div>

            {/* Dynamic Soil pH Spectrum Visualizer */}
            <div className="p-4 rounded-3xl bg-black/45 border border-white/10 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono text-white/70 uppercase tracking-wider block font-bold">
                  Soil pH Absorption Spectrum
                </span>
                <span className="text-xs font-mono font-bold text-amber-300">
                  Target pH: {targetPh.toFixed(1)}
                </span>
              </div>

              {/* Continuous Rainbow Spectrum Bar */}
              <div className="relative pt-4 pb-2">
                {/* Pointer Marker */}
                <div 
                  className="absolute top-0 transform -translate-x-1/2 flex flex-col items-center transition-all duration-500"
                  style={{ left: `${Math.max(5, Math.min(95, ((targetPh - 4.0) / 5.0) * 100))}%` }}
                >
                  <div className="px-2 py-0.5 rounded-full bg-white text-black text-[9px] font-mono font-bold shadow-md">
                    pH {targetPh.toFixed(1)}
                  </div>
                  <div className="w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-t-[5px] border-t-white" />
                </div>

                <div className="w-full h-3 rounded-full bg-gradient-to-r from-red-500 via-amber-400 via-emerald-400 to-blue-600 shadow-inner" />

                {/* pH Scale Ticks */}
                <div className="flex justify-between text-[10px] font-mono text-white/50 pt-1">
                  <span>pH 4.0 (Acidic)</span>
                  <span className="text-emerald-300 font-bold">pH 6.5 (Optimal)</span>
                  <span>pH 9.0 (Alkaline)</span>
                </div>
              </div>

              <p className="text-xs text-white/80 leading-relaxed pt-1">
                {result.fertilizer_recommendation.soil_ph_advice || 'Maintain well-aerated loamy soil with neutral to slightly acidic pH for maximum macronutrient bioavailability.'}
              </p>
            </div>

            {/* Prescribed Formulation Details */}
            <div className="p-4 rounded-3xl bg-black/40 border border-white/10 space-y-2">
              <div className="text-xs font-semibold text-[#5EEAD4] flex items-center gap-1.5">
                <Sparkles className="h-3.5 w-3.5" />
                Clinical Formulation & Dosage Protocol
              </div>
              <p className="text-sm font-semibold text-white">
                {result.fertilizer_recommendation.type}
              </p>
              <p className="text-xs text-white/85 leading-relaxed">
                {result.fertilizer_recommendation.application}
              </p>
            </div>

          </EnhancedCardContent>
        </EnhancedCard>
      )}

      {/* ========================================================================= */}
      {/* 5. PATHOGEN TRANSMISSION & EPIDEMIOLOGY MATRIX */}
      {/* ========================================================================= */}
      {result.inoculum_vectors && (
        <EnhancedCard glassIntensity="medium" className="bg-black/55 backdrop-blur-2xl border border-white/20 rounded-3xl">
          <EnhancedCardHeader className="pb-3 border-b border-white/10">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Compass className="h-4 w-4 text-[#2DD4BF]" />
                <EnhancedCardTitle className="text-base text-white">Pathogen Inoculum Vectors & Transmission Dynamics</EnhancedCardTitle>
              </div>
              <Badge className="bg-[#2DD4BF]/20 text-[#5EEAD4] border border-[#2DD4BF]/30 text-[10px]">
                Epidemiology Telemetry
              </Badge>
            </div>
          </EnhancedCardHeader>

          <EnhancedCardContent className="pt-4 space-y-4">
            <div className="p-4 rounded-2xl bg-black/40 border border-white/10 space-y-1.5">
              <div className="flex items-center gap-2 text-xs font-bold text-amber-300">
                <Radiation className="h-3.5 w-3.5" />
                <span>Primary Inoculum Reservoir:</span>
              </div>
              <p className="text-xs text-white/90 leading-relaxed">
                {result.inoculum_vectors.primary_source || 'Overwintered plant debris, soil-borne mycelium, or infected nursery stock.'}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              <div className="p-3.5 rounded-2xl bg-black/40 border border-white/10 space-y-1">
                <span className="text-[10px] font-mono text-[#5EEAD4] font-bold uppercase tracking-wider block">
                  Active Dispersal Mechanism:
                </span>
                <p className="text-white/80 leading-relaxed">
                  {result.inoculum_vectors.dispersal_mechanism || 'Rain-splash droplets and wind currents across the foliar canopy.'}
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-black/40 border border-white/10 space-y-1">
                <span className="text-[10px] font-mono text-purple-300 font-bold uppercase tracking-wider block">
                  Overwintering / Dormancy State:
                </span>
                <p className="text-white/80 leading-relaxed">
                  {result.inoculum_vectors.overwintering_mode || 'Sclerotia or dormant fungal mycelium within bud scales and leaf litter.'}
                </p>
              </div>
            </div>

            {result.inoculum_vectors.environmental_triggers && (
              <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-xs text-white/80 flex items-center gap-2">
                <ThermometerSun className="h-4 w-4 text-amber-400 shrink-0" />
                <span>
                  <strong>Epidemic Conditions:</strong> {result.inoculum_vectors.environmental_triggers}
                </span>
              </div>
            )}
          </EnhancedCardContent>
        </EnhancedCard>
      )}

    </div>
  );
});

export default DiagnosisVisualizations;
