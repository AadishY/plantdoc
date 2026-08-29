import React, { useState } from 'react';
import { motion } from 'framer-motion';
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
  Check
} from 'lucide-react';
import { DiagnosisResult } from '@/types/diagnosis';
import { toast } from 'sonner';

interface ClinicalTreatmentProtocolProps {
  result: DiagnosisResult;
}

export const ClinicalTreatmentProtocol: React.FC<ClinicalTreatmentProtocolProps> = ({ result }) => {
  const [completedSteps, setCompletedSteps] = useState<Record<number, boolean>>({});
  const [hasCopied, setHasCopied] = useState(false);

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

  const totalSteps = immediateActions.length;
  const completedCount = Object.values(completedSteps).filter(Boolean).length;
  const progressPercent = totalSteps > 0 ? Math.round((completedCount / totalSteps) * 100) : 0;

  const toggleStep = (idx: number) => {
    setCompletedSteps(prev => ({
      ...prev,
      [idx]: !prev[idx]
    }));
  };

  const handleCopyProtocol = () => {
    const text = `🌿 CLINICAL TREATMENT DOSSIER: ${result.plant} (${result.scientific_name || ''})\n` +
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
    <EnhancedCard glassIntensity="intense" borderGlow={true} className="overflow-hidden">
      <EnhancedCardHeader className="bg-black/40 border-b border-white/10 pb-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-xl bg-plantDoc-primary/20 border border-plantDoc-primary/40 text-plantDoc-primary">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <div>
              <EnhancedCardTitle className="text-xl md:text-2xl text-white">
                Clinical Treatment & Remediation Protocol
              </EnhancedCardTitle>
              <p className="text-xs text-foreground/75 mt-0.5">
                Targeted therapeutic matrix formulated for <strong className="text-white">{result.disease.name}</strong> on <strong className="text-plantDoc-primary">{result.plant}</strong>
              </p>
            </div>
          </div>

          <div className="flex items-center flex-wrap gap-2">
            <Badge className="bg-red-500/20 text-red-300 border border-red-500/30 text-xs px-2.5 py-1">
              {result.disease.severity} Urgency
            </Badge>
            <Badge className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs px-2.5 py-1">
              Prognosis: {result.disease.recovery_prognosis || 85}%
            </Badge>
            <Button
              size="sm"
              variant="outline"
              onClick={handleCopyProtocol}
              className="text-xs h-7 sm:h-8 px-2.5 text-white hover:text-[#5EEAD4] border-white/20 hover:bg-white/10 rounded-lg flex items-center gap-1.5"
            >
              {hasCopied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
              <span>{hasCopied ? 'Copied' : 'Copy'}</span>
            </Button>
          </div>
        </div>
      </EnhancedCardHeader>

      <EnhancedCardContent className="p-0">
        <Tabs defaultValue="emergency" className="w-full">
          <TabsList className="w-full grid grid-cols-2 md:grid-cols-5 rounded-none bg-black/50 border-b border-white/10 p-0 h-auto">
            <TabsTrigger 
              value="emergency" 
              className="py-3.5 text-xs md:text-sm data-[state=active]:bg-red-500/20 data-[state=active]:text-red-400 font-semibold gap-1.5"
            >
              <Flame className="h-4 w-4" />
              1. Emergency Triage
            </TabsTrigger>
            <TabsTrigger 
              value="organic" 
              className="py-3.5 text-xs md:text-sm data-[state=active]:bg-emerald-500/20 data-[state=active]:text-emerald-400 font-semibold gap-1.5"
            >
              <Sprout className="h-4 w-4" />
              2. Bio & Organic
            </TabsTrigger>
            <TabsTrigger 
              value="chemical" 
              className="py-3.5 text-xs md:text-sm data-[state=active]:bg-blue-500/20 data-[state=active]:text-blue-400 font-semibold gap-1.5"
            >
              <FlaskConical className="h-4 w-4" />
              3. Chemical Cure
            </TabsTrigger>
            <TabsTrigger 
              value="timeline" 
              className="py-3.5 text-xs md:text-sm data-[state=active]:bg-purple-500/20 data-[state=active]:text-purple-300 font-semibold gap-1.5"
            >
              <Calendar className="h-4 w-4" />
              4. 30-Day Schedule
            </TabsTrigger>
            <TabsTrigger 
              value="prevention" 
              className="py-3.5 text-xs md:text-sm data-[state=active]:bg-amber-500/20 data-[state=active]:text-amber-400 font-semibold gap-1.5"
            >
              <ShieldCheck className="h-4 w-4" />
              5. Long-Term Shield
            </TabsTrigger>
          </TabsList>

          <div className="p-4 sm:p-6">
            {/* Tab 1: Emergency Triage Checklist with Completion Progress Bar */}
            <TabsContent value="emergency" className="mt-0 space-y-4">
              <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/25 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-red-200">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="h-5 w-5 text-red-400 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-red-300 text-sm">Critical First 24–48 Hours Triage</h4>
                    <p className="mt-0.5 text-red-200/80 leading-relaxed">
                      Complete each sterilization and pruning task below to arrest spore propagation.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0 bg-black/40 px-3 py-1.5 rounded-xl border border-red-500/30">
                  <span className="text-[11px] font-mono text-white/80">{completedCount}/{totalSteps} Tasks</span>
                  <span className="text-xs font-mono font-bold text-emerald-400">({progressPercent}%)</span>
                </div>
              </div>

              {/* Interactive Checklist */}
              <div className="space-y-2.5">
                {immediateActions.map((action, idx) => {
                  const isChecked = !!completedSteps[idx];
                  return (
                    <div
                      key={idx}
                      onClick={() => toggleStep(idx)}
                      className={`p-4 rounded-xl border transition-all cursor-pointer flex items-start gap-3.5 ${
                        isChecked 
                          ? 'bg-emerald-500/10 border-emerald-500/40 text-foreground/70 line-through' 
                          : 'bg-black/30 border-white/10 hover:border-red-500/40 hover:bg-black/40 text-foreground/90'
                      }`}
                    >
                      <div className={`w-5 h-5 rounded-md border flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
                        isChecked ? 'bg-emerald-500 border-emerald-400 text-black' : 'border-white/30 bg-black/40'
                      }`}>
                        {isChecked && <CheckCircle2 className="h-4 w-4 text-black" />}
                      </div>
                      <div className="text-sm">
                        <span className="font-semibold mr-2 text-white">Step {idx + 1}:</span>
                        <span className={isChecked ? 'text-foreground/60' : 'text-foreground/90'}>{action}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </TabsContent>

            {/* Tab 2: Bio & Organic Remedies */}
            <TabsContent value="organic" className="mt-0 space-y-4">
              <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/25 flex items-start gap-3 text-xs text-emerald-200">
                <Sprout className="h-5 w-5 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-emerald-300 text-sm">OMRI-Listed & Bio-Organic Arsenal</h4>
                  <p className="mt-0.5 text-emerald-200/80 leading-relaxed">
                    Zero toxic synthetic residue. Safe for organic vegetables, domestic pets, and beneficial pollinators.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                {organicRemedies.map((remedy, idx) => (
                  <div key={idx} className="p-4 rounded-2xl bg-black/40 border border-white/10 flex items-start gap-3">
                    <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center shrink-0 font-bold text-xs">
                      #{idx + 1}
                    </div>
                    <p className="text-xs text-foreground/90 leading-relaxed">{remedy}</p>
                  </div>
                ))}
              </div>

              {/* Bio-Immunity Enhancers Card */}
              <div className="p-4 rounded-2xl bg-emerald-950/20 border border-emerald-500/20 space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-emerald-300">
                  <Sparkles className="h-4 w-4 text-emerald-400" />
                  <span>Botanical Bio-Synergy Recommendations</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-[11px] text-foreground/80 pt-1">
                  <div className="p-2.5 rounded-xl bg-black/30 border border-white/5">
                    <strong className="text-white block mb-0.5">Foliar Potassium Silicate:</strong>
                    Hardens leaf cell walls against spore puncture.
                  </div>
                  <div className="p-2.5 rounded-xl bg-black/30 border border-white/5">
                    <strong className="text-white block mb-0.5">Mycorrhizal Fungi:</strong>
                    Colonizes roots to increase drought & disease resistance.
                  </div>
                  <div className="p-2.5 rounded-xl bg-black/30 border border-white/5">
                    <strong className="text-white block mb-0.5">Aerated Compost Tea:</strong>
                    Supplies beneficial bacteria to outcompete foliar pathogens.
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Tab 3: Chemical Formulations */}
            <TabsContent value="chemical" className="mt-0 space-y-4">
              <div className="p-4 rounded-2xl bg-blue-500/10 border border-blue-500/25 flex items-start gap-3 text-xs text-blue-200">
                <FlaskConical className="h-5 w-5 text-blue-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-blue-300 text-sm">Targeted Commercial Chemical Formulations</h4>
                  <p className="mt-0.5 text-blue-200/80 leading-relaxed">
                    Prescribed retail brand active ingredients with precise volumetric dilution ratios.
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                {chemicalTreatments.map((chem, idx) => (
                  <div key={idx} className="p-4 rounded-2xl bg-black/40 border border-white/10 flex items-start gap-3">
                    <div className="w-8 h-8 rounded-xl bg-blue-500/20 text-blue-400 border border-blue-500/30 flex items-center justify-center shrink-0">
                      <FlaskConical className="h-4 w-4" />
                    </div>
                    <p className="text-xs text-foreground/90 leading-relaxed">{chem}</p>
                  </div>
                ))}
              </div>

              {/* Volumetric Mixing Table & PPE Guidelines */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 pt-1">
                <div className="p-4 rounded-2xl bg-black/40 border border-blue-500/20 space-y-2">
                  <div className="text-xs font-bold text-blue-300 font-mono flex items-center gap-1.5">
                    <FlaskConical className="h-3.5 w-3.5 text-blue-400" />
                    <span>VOLUMETRIC DILUTION MATRIX</span>
                  </div>
                  <div className="space-y-1.5 text-[11px] font-mono text-foreground/80">
                    <div className="flex justify-between py-1 border-b border-white/5">
                      <span>1 Liter Trigger Sprayer:</span>
                      <strong className="text-white">4.5 – 5.5 ml (1 tsp)</strong>
                    </div>
                    <div className="flex justify-between py-1 border-b border-white/5">
                      <span>1 Gallon Tank Sprayer:</span>
                      <strong className="text-white">20 – 25 ml (1.5 tbsp)</strong>
                    </div>
                    <div className="flex justify-between py-1">
                      <span>5 Liter Knapsack Sprayer:</span>
                      <strong className="text-white">28 – 35 ml (2.0 tbsp)</strong>
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-black/40 border border-red-500/20 space-y-2">
                  <div className="text-xs font-bold text-red-300 font-mono flex items-center gap-1.5">
                    <ShieldCheck className="h-3.5 w-3.5 text-red-400" />
                    <span>MANDATORY PPE SAFETY PROTOCOL</span>
                  </div>
                  <ul className="text-[11px] text-foreground/80 space-y-1 list-disc list-inside">
                    <li>Nitrile chemical-resistant protective gloves</li>
                    <li>N95 or particulate face mask during spraying</li>
                    <li>Splash-proof eye protection goggles</li>
                    <li>Observe 4-hour Restricted Entry Interval (REI)</li>
                  </ul>
                </div>
              </div>
            </TabsContent>

            {/* Tab 4: 30-Day Recovery Timeline */}
            <TabsContent value="timeline" className="mt-0 space-y-4">
              <div className="relative border-l-2 border-plantDoc-primary/40 ml-4 pl-6 space-y-6">
                {[
                  {
                    period: "Days 1–3: Emergency Triage",
                    task: result.treatment.timeline?.day_1_3 || "Sanitize shears, prune heavily infected foliage, isolate specimen, and apply initial contact spray.",
                    icon: <Scissors className="h-4 w-4 text-red-400" />
                  },
                  {
                    period: "Days 4–14: Active Containment",
                    task: result.treatment.timeline?.week_1_2 || "Inspect daily for new halo lesions. Apply second bio-fungicide or neem oil booster spray on Day 8. Convert to base irrigation.",
                    icon: <Droplets className="h-4 w-4 text-blue-400" />
                  },
                  {
                    period: "Day 15–30: Regeneration & Immunity",
                    task: result.treatment.timeline?.month_1 || "Observe healthy new bud growth. Apply diluted organic fertilizer to replenish depleted potassium and strengthen cell walls.",
                    icon: <Sparkles className="h-4 w-4 text-emerald-400" />
                  }
                ].map((item, idx) => (
                  <div key={idx} className="relative group">
                    <div className="absolute -left-[33px] top-1 w-5 h-5 rounded-full bg-black border-2 border-plantDoc-primary flex items-center justify-center">
                      <div className="w-2 h-2 rounded-full bg-plantDoc-primary" />
                    </div>
                    <div className="p-4 rounded-2xl bg-black/40 border border-white/10 group-hover:border-plantDoc-primary/40 transition-colors">
                      <div className="flex items-center gap-2 text-xs font-semibold text-plantDoc-primary mb-1">
                        {item.icon}
                        <span>{item.period}</span>
                      </div>
                      <p className="text-xs text-foreground/85 leading-relaxed">{item.task}</p>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>

            {/* Tab 5: Long-Term Shield Prevention */}
            <TabsContent value="prevention" className="mt-0 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                {preventionTips.map((tip, idx) => (
                  <div key={idx} className="p-4 rounded-2xl bg-black/40 border border-white/10 flex items-start gap-3">
                    <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center shrink-0">
                      <ShieldCheck className="h-4 w-4" />
                    </div>
                    <p className="text-xs text-foreground/90 leading-relaxed">{tip}</p>
                  </div>
                ))}
              </div>
            </TabsContent>
          </div>
        </Tabs>
      </EnhancedCardContent>
    </EnhancedCard>
  );
};

export default React.memo(ClinicalTreatmentProtocol);
