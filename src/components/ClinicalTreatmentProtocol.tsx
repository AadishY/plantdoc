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
  Sun,
  Wind
} from 'lucide-react';
import { DiagnosisResult } from '@/types/diagnosis';

interface ClinicalTreatmentProtocolProps {
  result: DiagnosisResult;
}

export const ClinicalTreatmentProtocol: React.FC<ClinicalTreatmentProtocolProps> = ({ result }) => {
  const [completedSteps, setCompletedSteps] = useState<Record<number, boolean>>({});

  const toggleStep = (idx: number) => {
    setCompletedSteps(prev => ({
      ...prev,
      [idx]: !prev[idx]
    }));
  };

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
        "Cold-Pressed Pure Neem Oil Spray: Mix 5ml pure neem oil + 2ml mild liquid soap per 1 liter of lukewarm water. Spray top and undersides of leaves every 7 days.",
        "Biological Bio-Fungicide: Spray Bacillus subtilis or Trichoderma harzianum bio-agent in early morning to colonize leaf surfaces and outcompete pathogens.",
        "Potassium Bicarbonate Foliar Wash: Dissolve 3g potassium bicarbonate in 1L water to alter foliar pH and inhibit fungal spore germination.",
        "Organic Mulching Barrier: Apply 5cm of straw or bark mulch around base to prevent fungal spores in soil from splashing onto lower leaves."
      ];

  const chemicalTreatments = result.treatment.chemical_treatments && result.treatment.chemical_treatments.length > 0
    ? result.treatment.chemical_treatments
    : [
        "Copper Hydroxide / Copper Octanoate: Apply 2.5g/L broad-spectrum bio-compatible copper fungicide at first sign of lesions; repeat every 10-14 days.",
        "Chlorothalonil (Protective Contact): Apply at labeled dosage (2ml/L) to coat uninfected healthy leaves and prevent spore penetration.",
        "Systemic Triazole / Strobilurin (Curative): For severe systemic infections, apply Azoxystrobin or Difenoconazole to cure internal vascular mycelium.",
        "Safety Protocol: Wear protective gloves and eyewear; apply in early morning or late evening during calm wind to protect pollinators."
      ];

  const preventionTips = result.treatment.prevention && result.treatment.prevention.length > 0
    ? result.treatment.prevention
    : [
        "Adopt Drip / Base Irrigation: Water strictly at soil level; wet leaves provide the ideal germination substrate for 90% of plant pathogens.",
        "Canopy Thinning: Prune internal crossing branches to maintain unobstructed 360° airflow and lower relative humidity around foliage.",
        "Morning Watering Rule: Always irrigate before 9:00 AM so any accidental splash dries rapidly in daytime sun.",
        "Sterilize Potting Media: Ensure pots have multiple drainage holes and use fresh, pathogen-free potting substrates."
      ];

  return (
    <EnhancedCard glassIntensity="intense" borderGlow={true} className="overflow-hidden">
      <EnhancedCardHeader className="bg-black/30 border-b border-white/10 pb-4">
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
                Multi-tier botanical intervention tailored for <strong className="text-white">{result.disease.name}</strong> on <strong className="text-plantDoc-primary">{result.plant}</strong>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Badge className="bg-red-500/20 text-red-300 border border-red-500/30 text-xs px-2.5 py-1">
              {result.disease.severity} Urgency
            </Badge>
            <Badge className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs px-2.5 py-1">
              Prognosis: {result.disease.recovery_prognosis || 85}%
            </Badge>
          </div>
        </div>
      </EnhancedCardHeader>

      <EnhancedCardContent className="p-0">
        <Tabs defaultValue="emergency" className="w-full">
          <TabsList className="w-full grid grid-cols-2 md:grid-cols-5 rounded-none bg-black/40 border-b border-white/10 p-0 h-auto">
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

          <div className="p-6">
            {/* Tab 1: Emergency Triage Checklist */}
            <TabsContent value="emergency" className="mt-0 space-y-4">
              <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/25 flex items-start gap-3 text-xs text-red-200">
                <AlertTriangle className="h-5 w-5 text-red-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-red-300 text-sm">Critical First 24-48 Hours</h4>
                  <p className="mt-0.5 text-red-200/80 leading-relaxed">
                    Check off each action step below as you execute emergency sanitation to arrest localized sporulation.
                  </p>
                </div>
              </div>

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
              <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/25 flex items-start gap-3 text-xs text-emerald-200">
                <Sprout className="h-5 w-5 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-emerald-300 text-sm">Eco-Friendly & Biological Arsenal</h4>
                  <p className="mt-0.5 text-emerald-200/80 leading-relaxed">
                    Safe for home gardeners, edible vegetable crops, children, and domestic pets.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                {organicRemedies.map((remedy, idx) => (
                  <div key={idx} className="p-4 rounded-xl bg-black/30 border border-white/10 flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 font-bold text-xs">
                      #{idx + 1}
                    </div>
                    <p className="text-xs text-foreground/90 leading-relaxed">{remedy}</p>
                  </div>
                ))}
              </div>
            </TabsContent>

            {/* Tab 3: Chemical Formulations */}
            <TabsContent value="chemical" className="mt-0 space-y-4">
              <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/25 flex items-start gap-3 text-xs text-blue-200">
                <FlaskConical className="h-5 w-5 text-blue-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-blue-300 text-sm">Targeted Active Chemical Ingredients</h4>
                  <p className="mt-0.5 text-blue-200/80 leading-relaxed">
                    Professional curative and systemic formulations for stubborn or rapidly spreading infections.
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                {chemicalTreatments.map((chem, idx) => (
                  <div key={idx} className="p-4 rounded-xl bg-black/30 border border-white/10 flex items-start gap-3">
                    <FlaskConical className="h-5 w-5 text-blue-400 shrink-0 mt-0.5" />
                    <p className="text-xs text-foreground/90 leading-relaxed">{chem}</p>
                  </div>
                ))}
              </div>
            </TabsContent>

            {/* Tab 4: 30-Day Recovery Timeline */}
            <TabsContent value="timeline" className="mt-0 space-y-4">
              <div className="relative border-l-2 border-plantDoc-primary/40 ml-4 pl-6 space-y-6">
                {[
                  {
                    period: "Days 1–3: Emergency Phase",
                    task: result.treatment.timeline?.day_1_3 || "Sanitize shears, prune heavily infected foliage, isolate specimen, and apply initial contact fungicide spray.",
                    icon: <Scissors className="h-4 w-4 text-red-400" />
                  },
                  {
                    period: "Days 4–14: Active Containment",
                    task: result.treatment.timeline?.week_1_2 || "Inspect daily for new halo lesions. Apply second bio-fungicide or neem oil booster spray on Day 8. Convert to drip irrigation.",
                    icon: <Droplets className="h-4 w-4 text-blue-400" />
                  },
                  {
                    period: "Day 15–30: Regeneration & Immunity",
                    task: result.treatment.timeline?.month_1 || "Observe healthy new bud growth. Apply diluted 10-10-10 organic fertilizer to replenish depleted potassium and strengthen cell walls.",
                    icon: <Sparkles className="h-4 w-4 text-emerald-400" />
                  }
                ].map((item, idx) => (
                  <div key={idx} className="relative group">
                    <div className="absolute -left-[33px] top-1 w-5 h-5 rounded-full bg-black border-2 border-plantDoc-primary flex items-center justify-center">
                      <div className="w-2 h-2 rounded-full bg-plantDoc-primary" />
                    </div>
                    <div className="p-4 rounded-xl bg-black/30 border border-white/10 group-hover:border-plantDoc-primary/40 transition-colors">
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
                  <div key={idx} className="p-4 rounded-xl bg-black/30 border border-white/10 flex items-start gap-3">
                    <ShieldCheck className="h-5 w-5 text-amber-400 shrink-0 mt-0.5" />
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

export default ClinicalTreatmentProtocol;
