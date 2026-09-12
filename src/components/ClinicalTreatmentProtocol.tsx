import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { EnhancedCard, EnhancedCardHeader, EnhancedCardTitle, EnhancedCardContent } from '@/components/ui/enhanced-card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Flame, 
  Sprout, 
  FlaskConical, 
  ShieldCheck, 
  Calendar, 
  CheckCircle2, 
  AlertTriangle,
  Clock,
  Sparkles,
  Droplets,
  Scissors,
  Copy,
  Check,
  TrendingUp,
  Activity,
  Zap,
  Gauge,
  ShoppingBag,
  Leaf,
  ShieldAlert,
  Sun,
  CloudRain,
  ThermometerSun,
  Eye,
  Wind,
  Calculator,
  RotateCcw,
  HelpCircle,
  Dna,
  Microscope,
  Award,
  Home,
  Utensils
} from 'lucide-react';
import { DiagnosisResult } from '@/types/diagnosis';
import { toast } from 'sonner';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip as RechartsTooltip 
} from 'recharts';

interface ClinicalTreatmentProtocolProps {
  result: DiagnosisResult;
}

export const ClinicalTreatmentProtocol: React.FC<ClinicalTreatmentProtocolProps> = ({ result }) => {
  const [completedSteps, setCompletedSteps] = useState<Record<number, boolean>>({});
  const [hasCopied, setHasCopied] = useState(false);
  
  // Interactive Sprayer Calculator State
  const [tankSize, setTankSize] = useState<'1L' | '1Gal' | '5L'>('1Gal');
  const [infestationLevel, setInfestationLevel] = useState<'mild' | 'moderate' | 'severe'>('moderate');

  const isUnidentifiedPlant = 
    !result.plant || 
    result.plant.toLowerCase().includes('cannot identify') || 
    result.plant.toLowerCase().includes('cant identify') ||
    result.plant.toLowerCase().includes('unknown');

  const immediateActions = result.treatment.immediate_actions && result.treatment.immediate_actions.length > 0
    ? result.treatment.immediate_actions
    : [
        "Isolate this specimen immediately at least 2 meters away from healthy plants to halt airborne spore transfer.",
        "Prune and remove all visibly infected leaves using sanitized shears, cutting 2-3 cm below the lesion into healthy tissue.",
        "Seal infected clippings in a closed disposal bag; DO NOT compost diseased material.",
        "Sterilize shears with 70% isopropyl alcohol or 10% bleach solution between every single cut."
      ];

  const organicRemedies = result.treatment.organic_remedies && result.treatment.organic_remedies.length > 0
    ? result.treatment.organic_remedies
    : [
        "Southern Ag Triple Action Neem Oil: Mix 2 tbsp per gallon of water with mild soap. Spray top and undersides of leaves every 7 days.",
        "Serenade Garden Disease Control (Bacillus subtilis bio-fungicide): Spray foliar canopy in early morning to outcompete fungal pathogens.",
        "Potassium Bicarbonate Foliar Wash: Dissolve 3g potassium bicarbonate in 1L water to alter foliar pH and inhibit spore germination.",
        "Organic Mulching Barrier: Apply 5cm of straw or bark mulch around base to prevent fungal spores in soil from splashing onto lower leaves."
      ];

  const homeRemedies = result.treatment.home_remedies && result.treatment.home_remedies.length > 0
    ? result.treatment.home_remedies
    : [
        {
          name: "Diluted 3% Hydrogen Peroxide Foliar Antiseptic Spray",
          ingredients: ["1 tbsp 3% Hydrogen Peroxide (H2O2)", "1 cup Water (240ml)", "2 drops Liquid Castile Soap"],
          preparation: "Combine ingredients in a dark spray bottle and shake gently to blend.",
          application: "Mist affected foliar surfaces early in the morning before direct sunlight; repeat every 4–5 days.",
          mechanism: "Releases reactive oxygen species that rapidly disrupt fungal cell walls and oxidize bacterial spores without leaving chemical residue."
        },
        {
          name: "Baking Soda & Vegetable Oil Bio-pH Wash",
          ingredients: ["1 tsp Sodium Bicarbonate", "1 tsp Canola or Horticultural Oil", "1 Liter Lukewarm Water"],
          preparation: "Dissolve baking soda in water, then emulsify with oil to ensure foliar adherence.",
          application: "Thoroughly spray upper and lower leaf surfaces once weekly.",
          mechanism: "Shifts the phyllosphere surface pH to alkaline (~8.3), preventing fungal spore germination and mycelium elongation."
        },
        {
          name: "Chamomile & Cinnamon Antifungal Infusion",
          ingredients: ["2 Chamomile Tea Bags", "1/2 tsp Ground Cinnamon", "500ml Boiling Water"],
          preparation: "Steep chamomile and cinnamon in boiling water for 30 minutes, strain through a fine mesh filter, and cool completely.",
          application: "Spray foliar canopy or apply around root flare at first sign of dampness or fungal stress.",
          mechanism: "Cinnamaldehyde and chamomile bisabolol compounds exhibit potent natural fungistatic properties that inhibit spore division."
        }
      ];

  const chemicalTreatments = result.treatment.chemical_treatments && result.treatment.chemical_treatments.length > 0
    ? result.treatment.chemical_treatments
    : [
        "Daconil Fungicide Concentrate (Chlorothalonil 29.6%): Mix 1.5 tbsp (22ml) per gallon of water and spray foliar surfaces until runoff every 7-10 days.",
        "Bonide Liquid Copper Fungicide (Copper Octanoate 10.0%): Apply 1.5 fl oz per gallon of water at first symptom onset.",
        "Spectracide Immunox Multi-Purpose Fungicide (Myclobutanil 1.55%): Mix 1 fl oz per gallon for curative systemic vascular mycelium control.",
        "Safety Protocol: Wear protective gloves and eyewear; apply in early morning or late evening during calm wind."
      ];

  const preventionTips = result.treatment.prevention && result.treatment.prevention.length > 0
    ? result.treatment.prevention
    : [
        "Adopt Drip / Base Irrigation: Water strictly at soil level; wet leaves provide the ideal germination substrate for 90% of plant pathogens.",
        "Canopy Thinning: Prune internal crossing branches to maintain unobstructed 360° airflow and lower relative humidity around foliage.",
        "Morning Watering Rule: Always irrigate before 9:00 AM so any accidental splash dries rapidly in daytime sun.",
        "Sterilize Potting Media: Ensure pots have multiple drainage holes and use fresh, pathogen-free potting substrates."
      ];

  const recoveryPrognosis = typeof result.disease.recovery_prognosis === 'number' 
    ? result.disease.recovery_prognosis 
    : 85;

  // Generate 30-day recovery trajectory curve data for recharts
  const recoveryTrajectoryData = [
    { day: 'Day 1', health: Math.max(20, 100 - (result.disease.severity === 'Severe' ? 70 : result.disease.severity === 'Medium' ? 45 : 25)), stage: 'Triage' },
    { day: 'Day 5', health: Math.min(recoveryPrognosis, Math.max(35, 100 - (result.disease.severity === 'Severe' ? 55 : 35))), stage: 'Containment' },
    { day: 'Day 10', health: Math.min(recoveryPrognosis, Math.max(50, 100 - (result.disease.severity === 'Severe' ? 40 : 25))), stage: 'Antisepsis' },
    { day: 'Day 18', health: Math.min(recoveryPrognosis, 72), stage: 'Regeneration' },
    { day: 'Day 25', health: Math.min(recoveryPrognosis, 86), stage: 'Foliar Flush' },
    { day: 'Day 30', health: recoveryPrognosis, stage: 'Full Remission' }
  ];

  const totalSteps = immediateActions.length;
  const completedCount = Object.values(completedSteps).filter(Boolean).length;
  const progressPercent = totalSteps > 0 ? Math.round((completedCount / totalSteps) * 100) : 0;

  const toggleStep = (idx: number) => {
    setCompletedSteps(prev => ({
      ...prev,
      [idx]: !prev[idx]
    }));
  };

  const handleResetSteps = () => {
    setCompletedSteps({});
    toast.info('Step checklist reset');
  };

  // Sprayer Calculator Dosages
  const getCalculatedDosage = () => {
    let multiplier = 1.0;
    if (infestationLevel === 'mild') multiplier = 0.75;
    if (infestationLevel === 'severe') multiplier = 1.35;

    if (tankSize === '1L') {
      const ml = (5.0 * multiplier).toFixed(1);
      const tsp = (1.0 * multiplier).toFixed(1);
      return { ml: `${ml} ml`, tsp: `${tsp} tsp`, water: '1 Liter Water', coverage: '~10 Small Plants' };
    }
    if (tankSize === '1Gal') {
      const ml = (22.5 * multiplier).toFixed(1);
      const tbsp = (1.5 * multiplier).toFixed(1);
      return { ml: `${ml} ml`, tsp: `${tbsp} tbsp`, water: '1 Gallon (3.8L) Water', coverage: '~35 Garden Plants' };
    }
    // 5L
    const ml = (30.0 * multiplier).toFixed(1);
    const tbsp = (2.0 * multiplier).toFixed(1);
    return { ml: `${ml} ml`, tsp: `${tbsp} tbsp`, water: '5 Liters Water', coverage: '~50 Shrubs / Crop Bed' };
  };

  const dosageData = getCalculatedDosage();

  const handleCopyProtocol = () => {
    const text = `🌿 CLINICAL TREATMENT PROTOCOL\n` +
      `Host: ${isUnidentifiedPlant ? 'Unidentified Specimen' : result.plant} (${result.scientific_name || ''})\n` +
      `Diagnosis: ${result.disease.name} (Severity: ${result.disease.severity})\n\n` +
      `EMERGENCY STEPS:\n${immediateActions.map((a, i) => `${i + 1}. ${a}`).join('\n')}\n\n` +
      `BIO-ORGANIC REMEDIES:\n${organicRemedies.map((r, i) => `• ${r}`).join('\n')}\n\n` +
      `CHEMICAL FORMULATIONS:\n${chemicalTreatments.map((c, i) => `• ${c}`).join('\n')}\n\n` +
      `FERTILIZER:\n${result.fertilizer_recommendation?.type || 'Balanced NPK'} (${result.fertilizer_recommendation?.application || ''})`;

    navigator.clipboard.writeText(text);
    setHasCopied(true);
    toast.success('Clinical treatment protocol copied to clipboard!');
    setTimeout(() => setHasCopied(false), 2500);
  };

  return (
    <EnhancedCard glassIntensity="intense" borderGlow={true} className="overflow-hidden bg-black/55 backdrop-blur-2xl border border-white/20 rounded-3xl shadow-2xl">
      {/* Header */}
      <EnhancedCardHeader className="bg-black/75 border-b border-white/10 pb-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-[#2DD4BF]/20 border border-[#2DD4BF]/40 text-[#2DD4BF] shadow-[0_0_15px_rgba(45,212,191,0.35)]">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <div>
              <EnhancedCardTitle className="text-xl md:text-2xl text-white font-black tracking-tight">
                Clinical Treatment & Remediation Matrix
              </EnhancedCardTitle>
              <p className="text-xs text-white/75 mt-0.5 flex items-center gap-1.5 flex-wrap">
                <span>Targeted remedial protocol for <strong className="text-white">{result.disease.name}</strong></span>
                {!isUnidentifiedPlant && (
                  <span>on <strong className="text-[#5EEAD4]">{result.plant}</strong></span>
                )}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={handleCopyProtocol}
              className="text-xs h-8 px-3 rounded-xl border-white/20 text-white hover:bg-white/10 hover:text-[#5EEAD4] flex items-center gap-1.5 transition-all shadow-md"
            >
              {hasCopied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
              <span>{hasCopied ? 'Copied' : 'Copy Regimen'}</span>
            </Button>
          </div>
        </div>
      </EnhancedCardHeader>

      <EnhancedCardContent className="p-4 sm:p-6 space-y-6">
        <Tabs defaultValue="immediate" className="w-full">
          
          {/* Scrollable Tabs List */}
          <TabsList className="grid grid-cols-2 sm:grid-cols-6 w-full bg-black/60 border border-white/10 p-1 rounded-2xl h-auto gap-1">
            <TabsTrigger 
              value="immediate" 
              className="text-xs py-2.5 rounded-xl data-[state=active]:bg-red-500/25 data-[state=active]:text-red-300 data-[state=active]:border-red-500/40 border border-transparent flex items-center justify-center gap-1.5 font-bold transition-all"
            >
              <Flame className="h-3.5 w-3.5 text-red-400 shrink-0" />
              <span>1. Emergency</span>
            </TabsTrigger>

            <TabsTrigger 
              value="home" 
              className="text-xs py-2.5 rounded-xl data-[state=active]:bg-teal-500/25 data-[state=active]:text-[#5EEAD4] data-[state=active]:border-[#2DD4BF]/40 border border-transparent flex items-center justify-center gap-1.5 font-bold transition-all"
            >
              <Home className="h-3.5 w-3.5 text-[#2DD4BF] shrink-0" />
              <span>2. Home Remedies</span>
            </TabsTrigger>

            <TabsTrigger 
              value="organic" 
              className="text-xs py-2.5 rounded-xl data-[state=active]:bg-emerald-500/25 data-[state=active]:text-emerald-300 data-[state=active]:border-emerald-500/40 border border-transparent flex items-center justify-center gap-1.5 font-bold transition-all"
            >
              <Sprout className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
              <span>3. Bio-Organic</span>
            </TabsTrigger>

            <TabsTrigger 
              value="chemical" 
              className="text-xs py-2.5 rounded-xl data-[state=active]:bg-blue-500/25 data-[state=active]:text-blue-300 data-[state=active]:border-blue-500/40 border border-transparent flex items-center justify-center gap-1.5 font-bold transition-all"
            >
              <FlaskConical className="h-3.5 w-3.5 text-blue-400 shrink-0" />
              <span>4. Chemical</span>
            </TabsTrigger>

            <TabsTrigger 
              value="timeline" 
              className="text-xs py-2.5 rounded-xl data-[state=active]:bg-purple-500/25 data-[state=active]:text-purple-300 data-[state=active]:border-purple-500/40 border border-transparent flex items-center justify-center gap-1.5 font-bold transition-all"
            >
              <Calendar className="h-3.5 w-3.5 text-purple-400 shrink-0" />
              <span>5. 30-Day Curve</span>
            </TabsTrigger>

            <TabsTrigger 
              value="prevention" 
              className="text-xs py-2.5 rounded-xl data-[state=active]:bg-amber-500/25 data-[state=active]:text-amber-300 data-[state=active]:border-amber-500/40 border border-transparent flex items-center justify-center gap-1.5 font-bold transition-all col-span-2 sm:col-span-1"
            >
              <ShieldCheck className="h-3.5 w-3.5 text-amber-400 shrink-0" />
              <span>6. Cultural Shield</span>
            </TabsTrigger>
          </TabsList>

          <div className="mt-5">
            
            {/* Tab 1: Emergency Triage */}
            <TabsContent value="immediate" className="mt-0 space-y-5">
              
              {/* Progress completion bar */}
              <div className="p-4 rounded-2xl bg-black/45 border border-red-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-red-500/20 text-red-400 border border-red-500/40">
                    <Scissors className="h-4 w-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                      Immediate Quarantine & Sanitation Progress
                    </h4>
                    <p className="text-[11px] text-white/70">
                      Check off items as you perform triage to track disinfection progress.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 self-end sm:self-auto">
                  <div className="text-right">
                    <span className="text-xs font-mono font-bold text-red-400">{completedCount}/{totalSteps} Completed</span>
                  </div>
                  <div className="w-24 bg-white/10 rounded-full h-2 overflow-hidden border border-white/15">
                    <div 
                      className="bg-gradient-to-r from-red-500 to-[#2DD4BF] h-full rounded-full transition-all duration-300"
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                  {completedCount > 0 && (
                    <button 
                      onClick={handleResetSteps} 
                      className="text-white/50 hover:text-white text-[10px] flex items-center gap-0.5 font-mono underline"
                    >
                      <RotateCcw className="h-3 w-3" />
                      <span>Reset</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Action checklist */}
              <div className="space-y-3">
                {immediateActions.map((action, idx) => {
                  const isDone = !!completedSteps[idx];
                  return (
                    <div 
                      key={idx} 
                      onClick={() => toggleStep(idx)}
                      className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-start gap-3.5 select-none ${
                        isDone 
                          ? 'bg-emerald-950/25 border-emerald-500/40 opacity-80' 
                          : 'bg-black/45 border-white/10 hover:border-red-500/40'
                      }`}
                    >
                      <div className={`w-6 h-6 rounded-lg border flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
                        isDone 
                          ? 'bg-emerald-500 text-black border-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.5)]' 
                          : 'border-white/25 bg-black/40 text-transparent'
                      }`}>
                        <Check className="h-3.5 w-3.5" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-mono font-bold text-red-400 uppercase">STEP 0{idx + 1}</span>
                          {idx === 0 && (
                            <Badge className="bg-red-500/20 text-red-300 border border-red-500/40 text-[9px] px-1.5 py-0">
                              Urgent: &lt; 2h
                            </Badge>
                          )}
                        </div>
                        <p className={`text-xs mt-1 leading-relaxed ${isDone ? 'line-through text-white/60' : 'text-white/90'}`}>
                          {action}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Tool sanitation guide */}
              <div className="p-4 rounded-2xl bg-black/40 border border-white/10 flex items-start gap-3 text-xs text-white/80">
                <ShieldAlert className="h-5 w-5 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white font-semibold block">Pruning Sanitation Protocol:</strong>
                  <span>Always dip cutting blades in 70% Isopropyl Alcohol or a 1:9 bleach-water ratio between each single prune. Discard infected foliar tissue directly into a sealed garbage bag — never compost diseased plant tissue.</span>
                </div>
              </div>
            </TabsContent>

            {/* Tab 2: Home Remedies */}
            <TabsContent value="home" className="mt-0 space-y-5">
              <div className="p-4 rounded-2xl bg-[#2DD4BF]/10 border border-[#2DD4BF]/30 flex items-start gap-3 text-xs text-[#5EEAD4]">
                <Home className="h-5 w-5 text-[#2DD4BF] shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-white text-sm">Natural Household & Kitchen Botanical Remedies</h4>
                  <p className="mt-0.5 text-white/80 leading-relaxed">
                    Readily accessible household formulations with proven biocidal, antifungal, and surface pH-altering mechanisms for immediate home care.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {homeRemedies.map((remedy, idx) => (
                  <div key={idx} className="p-4 sm:p-5 rounded-2xl bg-black/45 border border-white/10 hover:border-[#2DD4BF]/40 transition-all space-y-3">
                    <div className="flex items-center justify-between gap-2 border-b border-white/10 pb-2">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg bg-[#2DD4BF]/20 text-[#2DD4BF] border border-[#2DD4BF]/30 flex items-center justify-center shrink-0">
                          <Utensils className="h-3.5 w-3.5" />
                        </div>
                        <h4 className="font-bold text-white text-xs sm:text-sm">{remedy.name}</h4>
                      </div>
                      <Badge className="bg-[#2DD4BF]/15 text-[#5EEAD4] border border-[#2DD4BF]/30 text-[10px] shrink-0">
                        Home Formula #{idx + 1}
                      </Badge>
                    </div>

                    {/* Ingredients */}
                    <div className="space-y-1">
                      <span className="text-[10px] font-mono text-white/60 uppercase tracking-wider block">Ingredients:</span>
                      <div className="flex flex-wrap gap-1.5">
                        {remedy.ingredients.map((ing, ingIdx) => (
                          <span key={ingIdx} className="px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-[11px] text-white/90 font-mono">
                            {ing}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Preparation & Application */}
                    <div className="space-y-2 text-xs">
                      <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/5 space-y-0.5">
                        <span className="text-[10px] font-mono text-[#5EEAD4] uppercase font-bold block">Preparation:</span>
                        <p className="text-white/85 text-[11px] leading-relaxed">{remedy.preparation}</p>
                      </div>

                      <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/5 space-y-0.5">
                        <span className="text-[10px] font-mono text-amber-300 uppercase font-bold block">Application Protocol:</span>
                        <p className="text-white/85 text-[11px] leading-relaxed">{remedy.application}</p>
                      </div>

                      <div className="p-2.5 rounded-xl bg-emerald-950/20 border border-emerald-500/20 space-y-0.5">
                        <span className="text-[10px] font-mono text-emerald-400 uppercase font-bold block">Mechanism of Action:</span>
                        <p className="text-emerald-200/90 text-[11px] leading-relaxed">{remedy.mechanism}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>

            {/* Tab 3: Bio-Organic Remedies */}
            <TabsContent value="organic" className="mt-0 space-y-5">
              <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/25 flex items-start gap-3 text-xs text-emerald-200">
                <Sprout className="h-5 w-5 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-emerald-300 text-sm">Targeted Bio-Organic & Botanical Remediations</h4>
                  <p className="mt-0.5 text-emerald-200/80 leading-relaxed">
                    Organic, pollinator-safe remedial sprays and antagonistic bio-fungicides formulated to restore foliar phyllosphere balance without toxic chemical residues.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                {organicRemedies.map((remedy, idx) => (
                  <div key={idx} className="p-4 rounded-2xl bg-black/40 border border-white/10 flex items-start gap-3.5 hover:border-emerald-500/40 transition-colors">
                    <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center shrink-0">
                      <Sprout className="h-4 w-4" />
                    </div>
                    <div className="space-y-1">
                      <span className="text-[10px] font-mono text-emerald-400 font-bold uppercase">REMEDY 0{idx + 1}</span>
                      <p className="text-xs text-white/90 leading-relaxed">{remedy}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Bio-Immunity Enhancers Card */}
              <div className="p-4 rounded-2xl bg-emerald-950/20 border border-emerald-500/30 space-y-2.5">
                <div className="flex items-center gap-2 text-xs font-bold text-emerald-300">
                  <Sparkles className="h-4 w-4 text-emerald-400" />
                  <span>Botanical Bio-Synergy & Systemic Resistance (SAR)</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-[11px] text-white/80 pt-1">
                  <div className="p-3 rounded-xl bg-black/40 border border-white/10 space-y-1">
                    <strong className="text-white block font-semibold flex items-center gap-1">
                      <Leaf className="h-3 w-3 text-emerald-400" />
                      Potassium Silicate:
                    </strong>
                    <span>Reinforces cellular epidermis to block fungal haustorium penetration.</span>
                  </div>
                  <div className="p-3 rounded-xl bg-black/40 border border-white/10 space-y-1">
                    <strong className="text-white block font-semibold flex items-center gap-1">
                      <Sprout className="h-3 w-3 text-emerald-400" />
                      Mycorrhizal Inoculum:
                    </strong>
                    <span>Expands root surface area by 400% for rapid nutrient uptake.</span>
                  </div>
                  <div className="p-3 rounded-xl bg-black/40 border border-white/10 space-y-1">
                    <strong className="text-white block font-semibold flex items-center gap-1">
                      <Droplets className="h-3 w-3 text-emerald-400" />
                      Aerated Compost Tea:
                    </strong>
                    <span>Colonizes phyllosphere with antagonistic beneficial bacteria.</span>
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Tab 3: Chemical Formulations & Interactive Sprayer Calculator */}
            <TabsContent value="chemical" className="mt-0 space-y-5">
              
              {/* Prescriptions */}
              <div className="p-4 rounded-2xl bg-blue-500/10 border border-blue-500/25 flex items-start gap-3 text-xs text-blue-200">
                <FlaskConical className="h-5 w-5 text-blue-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-blue-300 text-sm">Targeted Commercial Chemical Formulations</h4>
                  <p className="mt-0.5 text-blue-200/80 leading-relaxed">
                    Prescribed retail brand active ingredients with exact volumetric dilution and application intervals.
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                {chemicalTreatments.map((chem, idx) => (
                  <div key={idx} className="p-4 rounded-2xl bg-black/40 border border-white/10 flex items-start gap-3.5 hover:border-blue-500/40 transition-colors">
                    <div className="w-8 h-8 rounded-xl bg-blue-500/20 text-blue-400 border border-blue-500/40 flex items-center justify-center shrink-0">
                      <FlaskConical className="h-4 w-4" />
                    </div>
                    <p className="text-xs text-white/90 leading-relaxed">{chem}</p>
                  </div>
                ))}
              </div>

              {/* Interactive Sprayer Dosage Calculator */}
              <div className="p-4 sm:p-5 rounded-2xl bg-black/60 border border-blue-500/35 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-blue-300 font-mono">
                    <Calculator className="h-4 w-4 text-blue-400" />
                    <span>INTERACTIVE SPRAYER DILUTION CALCULATOR</span>
                  </div>
                  <span className="text-[11px] text-white/60 font-mono">Select tank volume & infestation level</span>
                </div>

                {/* Controls */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] text-white/70 font-mono block mb-1.5">Tank Capacity:</label>
                    <div className="grid grid-cols-3 gap-1.5">
                      {(['1L', '1Gal', '5L'] as const).map((size) => (
                        <button
                          key={size}
                          onClick={() => setTankSize(size)}
                          className={`py-1.5 px-2 rounded-xl text-xs font-mono font-bold border transition-all ${
                            tankSize === size 
                              ? 'bg-blue-500 text-white border-blue-400 shadow-[0_0_12px_rgba(59,130,246,0.5)]' 
                              : 'bg-black/40 text-white/70 border-white/10 hover:bg-white/5'
                          }`}
                        >
                          {size === '1L' ? '1-Liter Bottle' : size === '1Gal' ? '1-Gallon Tank' : '5-Liter Knapsack'}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] text-white/70 font-mono block mb-1.5">Infestation Severity:</label>
                    <div className="grid grid-cols-3 gap-1.5">
                      {(['mild', 'moderate', 'severe'] as const).map((lvl) => (
                        <button
                          key={lvl}
                          onClick={() => setInfestationLevel(lvl)}
                          className={`py-1.5 px-2 rounded-xl text-xs font-mono font-bold border capitalize transition-all ${
                            infestationLevel === lvl 
                              ? 'bg-[#2DD4BF] text-black border-[#5EEAD4] shadow-[0_0_12px_rgba(45,212,191,0.5)]' 
                              : 'bg-black/40 text-white/70 border-white/10 hover:bg-white/5'
                          }`}
                        >
                          {lvl}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Calculated Result Readout */}
                <div className="p-3.5 rounded-xl bg-blue-950/30 border border-blue-500/30 grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                  <div className="p-2 rounded-lg bg-black/40 border border-white/5">
                    <span className="text-[10px] text-white/60 font-mono block">CONCENTRATE DOSE</span>
                    <strong className="text-sm sm:text-base font-mono font-black text-blue-300">{dosageData.ml}</strong>
                  </div>
                  <div className="p-2 rounded-lg bg-black/40 border border-white/5">
                    <span className="text-[10px] text-white/60 font-mono block">SPOON MEASURE</span>
                    <strong className="text-sm sm:text-base font-mono font-black text-white">{dosageData.tsp}</strong>
                  </div>
                  <div className="p-2 rounded-lg bg-black/40 border border-white/5">
                    <span className="text-[10px] text-white/60 font-mono block">WATER VOLUME</span>
                    <strong className="text-xs sm:text-sm font-mono font-bold text-[#5EEAD4]">{dosageData.water}</strong>
                  </div>
                  <div className="p-2 rounded-lg bg-black/40 border border-white/5">
                    <span className="text-[10px] text-white/60 font-mono block">EST. COVERAGE</span>
                    <strong className="text-xs sm:text-sm font-mono font-bold text-amber-300">{dosageData.coverage}</strong>
                  </div>
                </div>
              </div>

              {/* Weather & Safety Guidelines */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
                {/* Weather Advisory */}
                <div className="p-4 rounded-2xl bg-black/45 border border-[#2DD4BF]/30 space-y-2.5">
                  <div className="text-xs font-bold text-[#5EEAD4] font-mono flex items-center gap-1.5">
                    <Sun className="h-3.5 w-3.5 text-[#2DD4BF]" />
                    <span>OPTIMAL APPLICATION CONDITIONS</span>
                  </div>
                  <ul className="space-y-2 text-[11px] text-white/80">
                    <li className="flex items-center gap-2">
                      <Clock className="h-3.5 w-3.5 text-[#2DD4BF] shrink-0" />
                      <span><strong>Dawn (6–8 AM) or Dusk (6–8 PM):</strong> Prevents solar leaf scorch.</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <ThermometerSun className="h-3.5 w-3.5 text-amber-400 shrink-0" />
                      <span><strong>Max Temperature &lt; 85°F (29°C):</strong> Avoids acute phytotoxicity.</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CloudRain className="h-3.5 w-3.5 text-blue-400 shrink-0" />
                      <span><strong>Rainfast Window:</strong> Require at least 4–6h dry weather after spraying.</span>
                    </li>
                  </ul>
                </div>

                {/* PPE Protocol */}
                <div className="p-4 rounded-2xl bg-black/45 border border-red-500/30 space-y-2.5">
                  <div className="text-xs font-bold text-red-300 font-mono flex items-center gap-1.5">
                    <ShieldCheck className="h-3.5 w-3.5 text-red-400" />
                    <span>MANDATORY PPE & SAFETY INTERVALS</span>
                  </div>
                  <ul className="text-[11px] text-white/80 space-y-1.5 list-disc list-inside">
                    <li>Nitrile chemical-resistant gloves & splash goggles</li>
                    <li>N95 particulate respirator mask during application</li>
                    <li>Restricted Entry Interval (REI): <strong>4 Hours</strong></li>
                    <li>Pre-Harvest Interval (PHI): <strong>7 Days for edibles</strong></li>
                  </ul>
                </div>
              </div>
            </TabsContent>

            {/* Tab 4: 30-Day Recovery Timeline with Recharts Graphical Trajectory */}
            <TabsContent value="timeline" className="mt-0 space-y-6">
              
              {/* Prognosis Chart Card */}
              <div className="p-4 sm:p-5 rounded-2xl bg-black/50 border border-purple-500/30 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-purple-300">
                    <TrendingUp className="h-4 w-4 text-purple-400" />
                    <span>30-Day Foliar Recovery & Regeneration Trajectory</span>
                  </div>
                  <span className="text-[11px] font-mono text-emerald-400 font-bold bg-emerald-950/40 px-2.5 py-1 rounded-full border border-emerald-500/30">
                    Target Prognosis: {recoveryPrognosis}% Remission
                  </span>
                </div>

                {/* Recharts Area Chart */}
                <div className="h-48 w-full pt-2">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={recoveryTrajectoryData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorHealth" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#A855F7" stopOpacity={0.8}/>
                          <stop offset="95%" stopColor="#2DD4BF" stopOpacity={0.1}/>
                        </linearGradient>
                      </defs>
                      <XAxis 
                        dataKey="day" 
                        stroke="#888888" 
                        fontSize={10} 
                        tickLine={false} 
                        axisLine={{ stroke: 'rgba(255,255,255,0.1)' }} 
                      />
                      <YAxis 
                        domain={[0, 100]} 
                        stroke="#888888" 
                        fontSize={10} 
                        tickLine={false} 
                        axisLine={{ stroke: 'rgba(255,255,255,0.1)' }} 
                        unit="%"
                      />
                      <RechartsTooltip 
                        contentStyle={{ 
                          backgroundColor: 'rgba(5,8,6,0.95)', 
                          borderColor: '#A855F7', 
                          borderRadius: '12px',
                          fontSize: '11px',
                          color: '#fff'
                        }} 
                      />
                      <Area 
                        type="monotone" 
                        dataKey="health" 
                        stroke="#A855F7" 
                        strokeWidth={2.5} 
                        fillOpacity={1} 
                        fill="url(#colorHealth)" 
                        name="Foliar Health"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Timeline Steps */}
              <div className="relative border-l-2 border-[#2DD4BF]/40 ml-4 pl-6 space-y-6">
                {[
                  {
                    period: "Days 1–3: Emergency Triage & Pruning",
                    task: result.treatment.timeline?.day_1_3 || "Sanitize shears, prune heavily infected foliage, isolate specimen, and apply initial contact spray.",
                    icon: <Scissors className="h-4 w-4 text-red-400" />
                  },
                  {
                    period: "Days 4–14: Active Containment & Base Watering",
                    task: result.treatment.timeline?.week_1_2 || "Inspect daily for new halo lesions. Apply second bio-fungicide or neem oil booster spray on Day 8. Convert to base drip irrigation.",
                    icon: <Droplets className="h-4 w-4 text-blue-400" />
                  },
                  {
                    period: "Day 15–30: Cellular Regeneration & Micronutrient Flush",
                    task: result.treatment.timeline?.month_1 || "Observe healthy new bud growth. Apply diluted organic fertilizer to replenish depleted potassium and strengthen cell walls.",
                    icon: <Sparkles className="h-4 w-4 text-emerald-400" />
                  }
                ].map((item, idx) => (
                  <div key={idx} className="relative group">
                    <div className="absolute -left-[33px] top-1 w-5 h-5 rounded-full bg-black border-2 border-[#2DD4BF] flex items-center justify-center">
                      <div className="w-2 h-2 rounded-full bg-[#2DD4BF]" />
                    </div>
                    <div className="p-4 rounded-2xl bg-black/40 border border-white/10 group-hover:border-[#2DD4BF]/40 transition-colors">
                      <div className="flex items-center gap-2 text-xs font-bold text-[#5EEAD4] mb-1">
                        {item.icon}
                        <span>{item.period}</span>
                      </div>
                      <p className="text-xs text-white/85 leading-relaxed">{item.task}</p>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>

            {/* Tab 5: Long-Term Shield Prevention & NPK Macronutrients */}
            <TabsContent value="prevention" className="mt-0 space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {preventionTips.map((tip, idx) => (
                  <div key={idx} className="p-4 rounded-2xl bg-black/40 border border-white/10 flex items-start gap-3 hover:border-amber-500/40 transition-colors">
                    <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center shrink-0">
                      <ShieldCheck className="h-4 w-4" />
                    </div>
                    <p className="text-xs text-white/90 leading-relaxed">{tip}</p>
                  </div>
                ))}
              </div>

              {/* Fertilizer & NPK Recovery Formulation */}
              {result.fertilizer_recommendation && (
                <div className="p-4 sm:p-5 rounded-2xl bg-black/45 border border-[#2DD4BF]/30 space-y-3">
                  <div className="flex items-center gap-2 text-xs font-bold text-[#5EEAD4]">
                    <Gauge className="h-4 w-4 text-[#2DD4BF]" />
                    <span>Prescribed Nutritional Replenishment: {result.fertilizer_recommendation.type}</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-mono">
                    <div className="p-3 rounded-xl bg-white/5 border border-white/10 space-y-1">
                      <span className="text-white/70 text-[10px] block">NITROGEN (N)</span>
                      <strong className="text-white text-sm">Vegetative Regrowth</strong>
                    </div>
                    <div className="p-3 rounded-xl bg-white/5 border border-white/10 space-y-1">
                      <span className="text-white/70 text-[10px] block">PHOSPHORUS (P)</span>
                      <strong className="text-white text-sm">Root Fortification</strong>
                    </div>
                    <div className="p-3 rounded-xl bg-white/5 border border-white/10 space-y-1">
                      <span className="text-white/70 text-[10px] block">POTASSIUM (K)</span>
                      <strong className="text-emerald-400 text-sm">Immune Thickening</strong>
                    </div>
                  </div>
                  <p className="text-xs text-white/80 italic">
                    Application Guideline: {result.fertilizer_recommendation.application}
                  </p>
                </div>
              )}
            </TabsContent>
          </div>
        </Tabs>
      </EnhancedCardContent>
    </EnhancedCard>
  );
};

export default React.memo(ClinicalTreatmentProtocol);
