import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, 
  HelpCircle, 
  ArrowRight, 
  AlertTriangle, 
  Droplets, 
  Sun, 
  ShieldCheck, 
  Scan,
  Compass
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import SpotlightCard from './SpotlightCard';

interface SymptomOption {
  id: string;
  label: string;
  emoji: string;
  commonCauses: string[];
  primarySuspect: string;
  urgency: 'Low' | 'Medium' | 'High' | 'Immediate';
  quickFix: string;
  prevention: string;
}

const SYMPTOMS: SymptomOption[] = [
  {
    id: 'yellowing',
    label: 'Yellowing Leaves (Chlorosis)',
    emoji: '🍂',
    primarySuspect: 'Overwatering or Nitrogen Deficiency',
    commonCauses: ['Saturated Root Zone', 'Nitrogen Depletion', 'Iron Lockout (High pH)', 'Root Nematodes'],
    urgency: 'Medium',
    quickFix: 'Let the top 2 inches of soil dry completely before watering. Check drainage holes and apply a balanced 10-10-10 or seaweed liquid feed.',
    prevention: 'Maintain soil pH between 6.0 and 6.8 and ensure containers have adequate drainage.'
  },
  {
    id: 'brown-spots',
    label: 'Brown Concentric Spots',
    emoji: '🟤',
    primarySuspect: 'Early Blight or Septoria Leaf Spot',
    commonCauses: ['Alternaria solani', 'Septoria lycopersici', 'Overhead Twilight Irrigation', 'Fungal Spore Splashing'],
    urgency: 'High',
    quickFix: 'Prune away spotted lower leaves with sterilized shears. Apply organic copper fungicide or neem oil spray to clean foliage.',
    prevention: 'Water only at the root base early in the morning and apply straw mulch to prevent soil splashing.'
  },
  {
    id: 'powdery-white',
    label: 'White Powdery Coating',
    emoji: '⚪',
    primarySuspect: 'Powdery Mildew Fungal Infection',
    commonCauses: ['Podosphaera Species', 'High Humidity with Dry Roots', 'Poor Airflow', 'Overcrowded Foliage'],
    urgency: 'Medium',
    quickFix: 'Spray with 1 tbsp baking soda + 1/2 tsp liquid soap in 1 gallon of water, or apply a diluted milk solution in bright daylight.',
    prevention: 'Space plants for ample airflow and position specimens where they receive at least 6 hours of direct sun.'
  },
  {
    id: 'leaf-curl',
    label: 'Leaf Curling & Puckering',
    emoji: '🍃',
    primarySuspect: 'Aphids, Thrips, or Heat Stress',
    commonCauses: ['Sap-Sucking Aphid Colonies', 'Broad Mites', 'Severe Heat / Moisture Fluctuations', 'Viral Mosaic'],
    urgency: 'High',
    quickFix: 'Inspect the underside of curled leaves for tiny insects. Blast foliage with a sharp water jet and apply insecticidal soap spray.',
    prevention: 'Introduce beneficial predators like ladybugs and use reflective silver mulch to deter winged pests.'
  },
  {
    id: 'sudden-wilt',
    label: 'Sudden Wilting Despite Moist Soil',
    emoji: '🥀',
    primarySuspect: 'Bacterial Wilt or Root Rot',
    commonCauses: ['Fusarium / Pythium Root Rot', 'Ralstonia solanacearum', 'Damping Off Pathogens'],
    urgency: 'Immediate',
    quickFix: 'Inspect root color: healthy roots are white; rotted roots are brown and mushy. Trim rotted roots and repot into sterile, well-draining media with mycorrhizae.',
    prevention: 'Never allow pots to sit in stagnant water trays. Incorporate perlite or coarse sand into heavy potting soil.'
  }
];

export const SymptomExplorer: React.FC = () => {
  const [selectedSymptom, setSelectedSymptom] = useState<SymptomOption>(SYMPTOMS[0]);

  return (
    <section className="py-16 md:py-24 container mx-auto px-4 relative z-10 max-w-6xl">
      <div className="text-center max-w-3xl mx-auto mb-12">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#2DD4BF]/20 border border-[#2DD4BF]/40 text-[#5EEAD4] text-xs font-mono mb-3">
          <Compass className="h-3.5 w-3.5" />
          <span>Interactive Foliar Symptom Navigator</span>
        </div>
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white mb-4">
          What is Affecting <span className="bg-gradient-to-r from-white via-emerald-100 to-[#2DD4BF] bg-clip-text text-transparent">Your Plants?</span>
        </h2>
        <p className="text-foreground/75 text-sm md:text-base leading-relaxed">
          Select what you see on your plant's foliage to inspect suspected pathogens, triage urgency, and proven remedies.
        </p>
      </div>

      {/* Symptom Selector Pills */}
      <div className="flex flex-wrap items-center justify-center gap-3 mb-10">
        {SYMPTOMS.map((symptom) => {
          const isSelected = selectedSymptom.id === symptom.id;
          return (
            <button
              key={symptom.id}
              onClick={() => setSelectedSymptom(symptom)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-xs sm:text-sm font-semibold transition-all duration-300 transform-gpu ${
                isSelected
                  ? 'bg-[#2DD4BF] text-black shadow-[0_0_25px_rgba(45,212,191,0.5)] scale-105'
                  : 'bg-white/[0.06] hover:bg-white/[0.12] text-white/90 border border-white/15 hover:border-[#2DD4BF]/50'
              }`}
            >
              <span>{symptom.emoji}</span>
              <span>{symptom.label}</span>
            </button>
          );
        })}
      </div>

      {/* Dynamic Symptom Diagnosis Card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={selectedSymptom.id}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -15 }}
          transition={{ duration: 0.25 }}
        >
          <SpotlightCard className="p-8 sm:p-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              
              {/* Left Column (7 cols): Analysis Breakdown */}
              <div className="lg:col-span-7 space-y-5">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="text-2xl">{selectedSymptom.emoji}</span>
                  <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
                    {selectedSymptom.label}
                  </h3>
                  <span className={`text-[11px] font-mono font-bold px-3 py-1 rounded-full uppercase tracking-wider ${
                    selectedSymptom.urgency === 'Immediate' || selectedSymptom.urgency === 'High'
                      ? 'bg-red-500/20 text-red-300 border border-red-500/40'
                      : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                  }`}>
                    Urgency: {selectedSymptom.urgency}
                  </span>
                </div>

                <div className="space-y-1">
                  <div className="text-xs font-mono uppercase tracking-wider text-[#5EEAD4]">Primary Clinical Suspect:</div>
                  <div className="text-lg font-bold text-white">{selectedSymptom.primarySuspect}</div>
                </div>

                {/* Common Causes Tags */}
                <div>
                  <div className="text-xs font-mono uppercase tracking-wider text-white/60 mb-2">Likely Etiological Factors:</div>
                  <div className="flex flex-wrap gap-2">
                    {selectedSymptom.commonCauses.map((cause, idx) => (
                      <span key={idx} className="px-3 py-1 rounded-xl bg-white/[0.05] border border-white/10 text-xs text-white/80">
                        • {cause}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Triage Remedy Box */}
                <div className="p-4 rounded-2xl bg-black/40 border border-white/10 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-[#5EEAD4]">
                    <Sparkles className="h-4 w-4" />
                    <span>Instant Remediation Protocol</span>
                  </div>
                  <p className="text-xs sm:text-sm text-foreground/80 leading-relaxed pl-6">
                    {selectedSymptom.quickFix}
                  </p>
                </div>
              </div>

              {/* Right Column (5 cols): Call to Action Scanner Box */}
              <div className="lg:col-span-5 p-6 rounded-2xl bg-gradient-to-br from-[#2DD4BF]/15 via-black/40 to-[#059669]/10 border border-[#2DD4BF]/30 text-center space-y-4 shadow-xl">
                <div className="w-14 h-14 mx-auto rounded-2xl bg-[#2DD4BF]/20 border border-[#2DD4BF]/40 flex items-center justify-center shadow-[0_0_20px_rgba(45,212,191,0.3)]">
                  <Scan className="h-7 w-7 text-[#2DD4BF]" />
                </div>
                <div>
                  <h4 className="text-lg font-bold text-white mb-1">Verify with Dual AI Vision</h4>
                  <p className="text-xs text-foreground/75 leading-relaxed">
                    Upload a high-resolution photo of your leaf to calculate precise lesion boundaries and receive tailored dosage tables.
                  </p>
                </div>
                <Button
                  asChild
                  className="w-full bg-gradient-to-r from-[#2DD4BF] via-[#10B981] to-[#059669] hover:from-[#5EEAD4] hover:via-[#34D399] hover:to-[#10B981] text-black font-extrabold py-5 rounded-xl shadow-[0_0_25px_rgba(45,212,191,0.45)] border border-[#5EEAD4]/60 transition-all hover:scale-105"
                >
                  <Link to="/diagnose" className="flex items-center justify-center gap-2">
                    <span>Scan This Leaf Specimen</span>
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </div>

            </div>
          </SpotlightCard>
        </motion.div>
      </AnimatePresence>
    </section>
  );
};

export default SymptomExplorer;
