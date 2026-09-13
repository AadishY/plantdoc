import React, { useState } from 'react';
import { 
  Leaf, 
  ShieldCheck, 
  Microscope, 
  Sparkles, 
  HelpCircle, 
  AlertTriangle, 
  Bug, 
  Sun, 
  CheckCircle2, 
  Copy,
  Check,
  Printer,
  Clock
} from 'lucide-react';
import { DiagnosisResult, PrimarySuspect } from '@/types/diagnosis';
import { motion } from 'framer-motion';
import { EnhancedCard, EnhancedCardHeader, EnhancedCardTitle } from '@/components/ui/enhanced-card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import PlantSegmentationViewer from './PlantSegmentationViewer';
import DiagnosisVisualizations from './DiagnosisVisualizations';
import ClinicalTreatmentProtocol from './ClinicalTreatmentProtocol';
import InteractiveRecoveryTimeline from './InteractiveRecoveryTimeline';
import DifferentialDiagnosisCard from './DifferentialDiagnosisCard';
import { getSafeImageUrl } from '@/utils/sanitizeUrl';

interface ResultComponentProps {
  result: DiagnosisResult;
  imageUrl?: string | null;
}

const ResultComponent: React.FC<ResultComponentProps> = ({ result, imageUrl }) => {
  const [hasCopiedSummary, setHasCopiedSummary] = useState(false);
  const safeImageUrl = imageUrl && (imageUrl.startsWith('blob:') || imageUrl.startsWith('data:image/') || imageUrl.startsWith('https://') || imageUrl.startsWith('http://'))
    ? encodeURI(imageUrl.replace(/[<>"']/g, ''))
    : null;

  const isHealthy = 
    !result.disease.name ||
    result.disease.name.toLowerCase().includes('healthy') ||
    result.disease.name.toLowerCase().includes('no disease') ||
    result.disease.severity?.toLowerCase() === 'none';

  const isInvalidSpecimen =
    result.plant?.toLowerCase().includes('non-botanical') ||
    result.plant?.toLowerCase().includes('non botanical') ||
    result.disease.name?.toLowerCase().includes('no plant detected') ||
    result.disease.name?.toLowerCase().includes('invalid') ||
    result.disease.name?.toLowerCase().includes('invalid non-plant') ||
    (result.disease.confidence === 0 && result.accuracy === 0);

  const isUnidentifiedPlant = 
    !result.plant || 
    result.plant.toLowerCase().includes('cannot identify') || 
    result.plant.toLowerCase().includes('cant identify') ||
    result.plant.toLowerCase().includes('unknown') ||
    result.plant.toLowerCase().includes('unidentified');

  // ── Simple result card for healthy or invalid specimens ──────────────────
  if (isHealthy || isInvalidSpecimen) {
    const isInvalid = isInvalidSpecimen;
    const summaryText = isInvalid
      ? (result.causes?.[0] || 'The uploaded image does not appear to contain plant foliage. Please upload a clear, well-lit photo of a leaf or stem.')
      : `${isUnidentifiedPlant ? 'Your plant specimen' : result.plant} appears completely healthy with no signs of disease, pests, or nutrient deficiencies detected.`;

    return (
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className="flex flex-col items-center gap-6"
      >
        {/* Status card */}
        <div className={`w-full rounded-3xl border backdrop-blur-2xl shadow-2xl overflow-hidden ${
          isInvalid
            ? 'bg-black/60 border-amber-500/30 shadow-[0_0_40px_rgba(245,158,11,0.1)]'
            : 'bg-black/60 border-emerald-500/30 shadow-[0_0_40px_rgba(16,185,129,0.12)]'
        }`}>
          <div className="flex flex-col md:flex-row gap-0">
            {/* Uploaded image preview */}
            {safeImageUrl ? (
              <div className="md:w-64 lg:w-80 shrink-0 overflow-hidden rounded-t-3xl md:rounded-l-3xl md:rounded-tr-none">
                <img
                  src={safeImageUrl}
                  alt="Analyzed specimen"
                  className="w-full h-48 md:h-full object-cover"
                />
              </div>
            ) : null}

            {/* Message body */}
            <div className="flex-1 p-6 sm:p-8 flex flex-col justify-center gap-4">
              {/* Status badge + icon */}
              <div className="flex items-center gap-3">
                <div className={`p-3 rounded-2xl ${isInvalid ? 'bg-amber-500/20 border border-amber-500/40' : 'bg-emerald-500/20 border border-emerald-500/40'}`}>
                  {isInvalid
                    ? <AlertTriangle className="h-6 w-6 text-amber-400" />
                    : <ShieldCheck className="h-6 w-6 text-emerald-400" />
                  }
                </div>
                <div>
                  <div className={`text-xs font-mono font-bold uppercase tracking-widest mb-0.5 ${isInvalid ? 'text-amber-400' : 'text-emerald-400'}`}>
                    {isInvalid ? 'Invalid Specimen' : 'Healthy Specimen'}
                  </div>
                  <h2 className="text-xl sm:text-2xl font-black text-white leading-tight">
                    {isInvalid
                      ? 'No Plant Detected'
                      : isUnidentifiedPlant
                        ? 'Your Plant is Healthy! 🌿'
                        : `${result.plant} — Healthy! 🌿`}
                  </h2>
                </div>
              </div>

              {/* Summary message */}
              <p className="text-sm sm:text-base text-white/80 leading-relaxed">
                {summaryText}
              </p>

              {/* Tips / care advice */}
              {!isInvalid && result.care_recommendations && result.care_recommendations.length > 0 && (
                <div className="p-4 rounded-2xl bg-emerald-950/30 border border-emerald-500/20 space-y-2">
                  <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Leaf className="h-3.5 w-3.5" /> Preventive Care Tips
                  </span>
                  <ul className="space-y-1">
                    {result.care_recommendations.slice(0, 3).map((tip, i) => (
                      <li key={i} className="flex items-start gap-2 text-xs text-white/75">
                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0 mt-0.5" />
                        <span>{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Model info tag */}
              {result.diagnosedByModel && (
                <div className="flex items-center gap-1.5 text-[11px] font-mono text-white/40">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#2DD4BF] animate-pulse" />
                  <span>Analyzed by <strong className="text-[#5EEAD4]">PlantDoc AI</strong></span>
                </div>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    );
  }
  // ── End simple card ───────────────────────────────────────────────────────

  // Quarantine urgency
  const quarantineHours = result.quarantine_urgency_hours ?? (
    isHealthy ? 0 : (result.disease.severity === 'Critical' ? 6 : result.disease.severity === 'High' ? 12 : 24)
  );

  // Copy structured clinical report to clipboard
  const handleCopySummary = () => {
    const text = `🌿 PLANTDOC AI CLINICAL DOSSIER
Specimen: ${isUnidentifiedPlant ? 'Unidentified Plant' : result.plant} (${result.scientific_name || 'N/A'})
Diagnosis: ${result.disease.name}
Severity: ${result.disease.severity} | Confidence: ${(result.disease.confidence || 92).toFixed(1)}%
Pathogen Category: ${result.disease.pathogen_type || 'Biological Pathogen'}
Recovery Prognosis: ${result.disease.recovery_prognosis || 88}%

CLINICAL SUMMARY:
${result.disease.diagnosis_summary || 'Specimen analyzed for foliar lesions and cellular damage.'}

EMERGENCY PROTOCOL:
${result.treatment.immediate_actions.map((act, i) => `${i + 1}. ${act}`).join('\n')}

PRESCRIPTION TREATMENT:
• Bio-organic: ${result.treatment.organic_remedies.join(', ')}
• Chemical: ${result.treatment.chemical_treatments.join(', ')}
• Fertilizer: ${result.fertilizer_recommendation?.type || 'Balanced NPK'}`;

    navigator.clipboard.writeText(text);
    setHasCopiedSummary(true);
    toast.success('Clinical Dossier copied to clipboard!');
    setTimeout(() => setHasCopiedSummary(false), 2500);
  };

  const handlePrintDossier = () => {
    window.print();
  };

  // Determine Primary Suspect details & Category
  const suspect: PrimarySuspect = result.primary_suspect || {
    name: result.disease.name || (isHealthy ? "Healthy Specimen / No Disease Detected" : "Foliar Anomaly"),
    category: (result.disease.suspect_category || 
      (result.disease.pathogen_type?.toLowerCase().includes('pest') || result.disease.pathogen_type?.toLowerCase().includes('insect')
        ? 'Pests'
        : result.disease.pathogen_type?.toLowerCase().includes('nutrient') || result.disease.pathogen_type?.toLowerCase().includes('abiotic')
          ? 'Abiotic / Environmental Stress'
          : 'Pathogens')
    ) as 'Pests' | 'Pathogens' | 'Abiotic / Environmental Stress',
    sub_type: result.disease.pathogen_type || 'Biological Pathogen',
    description: (result.causes && result.causes[0]) || 'Observed foliar symptoms and cellular patterns on the specimen.',
    symptom_evidence: result.symptoms_breakdown ? result.symptoms_breakdown.map(s => typeof s === 'string' ? s : s.symptom).slice(0, 3) : ["Foliar lesion discoloration"],
    common_examples: result.disease.pathogen_type?.toLowerCase().includes('pest')
      ? ["Spider mites (Tetranychidae)", "Aphids (Aphidoidea)", "Fungus gnats (Sciaridae)"]
      : result.disease.pathogen_type?.toLowerCase().includes('abiotic') || result.disease.pathogen_type?.toLowerCase().includes('nutrient')
        ? ["Nutrient deficiency (Nitrogen / Iron / Magnesium)", "Overwatering & root hypoxia", "Sunburn & thermal scorch"]
        : ["Powdery mildew (Erysiphales)", "Root rot (Phytophthora / Pythium)", "Bacterial leaf spot (Xanthomonas)"]
  };

  const getSeverityColor = (severity: string) => {
    if (isHealthy) return 'bg-emerald-600 text-white';
    switch (severity.toLowerCase()) {
      case 'critical':
        return 'bg-red-600 text-white shadow-[0_0_15px_rgba(239,68,68,0.4)]';
      case 'high':
        return 'bg-rose-500 text-white shadow-[0_0_15px_rgba(244,63,94,0.4)]';
      case 'medium':
        return 'bg-amber-500 text-black shadow-[0_0_15px_rgba(245,158,11,0.4)]';
      case 'low':
        return 'bg-emerald-500 text-black shadow-[0_0_15px_rgba(16,185,129,0.4)]';
      default:
        return 'bg-sky-500 text-white';
    }
  };

  // Category specific UI Configuration
  const getCategoryConfig = (category: string) => {
    switch (category) {
      case 'Pests':
        return {
          title: 'Pests',
          icon: Bug,
          badgeBg: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40',
          accentColor: '#06B6D4',
          subLabel: 'Arthropod & Sap-Feeding Foliar Organisms',
          examples: 'e.g., spider mites, aphids, fungus gnats, thrips, mealybugs',
          cardGlow: 'shadow-[0_0_30px_rgba(6,182,212,0.15)] border-cyan-500/30'
        };
      case 'Abiotic / Environmental Stress':
        return {
          title: 'Abiotic / Environmental Stress',
          icon: Sun,
          badgeBg: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
          accentColor: '#F59E0B',
          subLabel: 'Physiological, Nutrient & Microclimate Stressors',
          examples: 'e.g., nutrient deficiency, overwatering, sunburn, heat stress',
          cardGlow: 'shadow-[0_0_30px_rgba(245,158,11,0.15)] border-amber-500/30'
        };
      case 'Pathogens':
      default:
        return {
          title: 'Pathogens',
          icon: Microscope,
          badgeBg: 'bg-rose-500/20 text-rose-300 border-rose-500/40',
          accentColor: '#F43F5E',
          subLabel: 'Microbiological Fungi, Bacteria & Plant Viruses',
          examples: 'e.g., powdery mildew, root rot, bacterial leaf spot, rust',
          cardGlow: 'shadow-[0_0_30px_rgba(244,63,94,0.15)] border-rose-500/30'
        };
    }
  };

  const categoryConf = getCategoryConfig(suspect.category);
  const CategoryIcon = categoryConf.icon;

  const itemVariants = {
    hidden: { opacity: 0, y: 8 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.2 } }
  };

  return (
    <motion.div
      className="space-y-6"
      initial="hidden"
      animate="visible"
      variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0 } } }}
    >


      {/* 1. Computer Vision Lesion Segmentation Overlay */}
      {safeImageUrl && (
        <motion.div variants={itemVariants}>
          <PlantSegmentationViewer
            imageUrl={safeImageUrl}
            segmentation={result.segmentation}
            plantName={result.plant}
            scientificName={result.scientific_name}
            plantAccuracy={result.accuracy || 94.5}
            diseaseName={result.disease.name}
            diseaseConfidence={result.disease.confidence}
            severity={result.disease.severity}
          />
        </motion.div>
      )}

      {/* 2. Primary Pathology Header & Host Specimen */}
      <motion.div variants={itemVariants}>
          <EnhancedCard glassIntensity="intense" borderGlow={true} className="bg-black/55 backdrop-blur-2xl rounded-3xl border border-white/20 overflow-hidden shadow-2xl">
            <EnhancedCardHeader className="pb-5 pt-5 border-b border-white/10">
              <div>
                <div className="flex items-center gap-2 mb-3 flex-wrap">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#2DD4BF]/20 border border-[#2DD4BF]/40 text-[#5EEAD4] text-xs font-mono font-bold">
                    <Leaf className="h-3.5 w-3.5" />
                    <span>Clinical Botanical Report</span>
                  </div>
                  <Badge className="bg-[#2DD4BF] text-black font-extrabold text-xs px-2.5 py-0.5 rounded-full flex items-center gap-1 shadow-[0_0_12px_rgba(45,212,191,0.35)]">
                    <Sparkles className="h-3 w-3" />
                    {result.accuracy ? `${result.accuracy.toFixed(1)}% Match` : 'AI Confirmed'}
                  </Badge>
                  <Badge className={`${getSeverityColor(result.disease.severity)} rounded-full text-xs px-2.5 py-0.5 font-bold flex items-center gap-1`}>
                    <AlertTriangle className="h-3 w-3" />
                    {result.disease.severity} Severity
                  </Badge>
                  <Badge className="bg-white/10 text-white text-xs border border-white/15 rounded-full px-2.5 py-0.5 flex items-center gap-1">
                    <CategoryIcon className="h-3 w-3 text-amber-400" />
                    {result.disease.pathogen_type || 'Biological Pathogen'}
                  </Badge>
                  {quarantineHours > 0 && (
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs font-mono">
                      <Clock className="h-3.5 w-3.5 text-rose-400 animate-pulse" />
                      <span>Quarantine: <strong className="text-white">Within {quarantineHours}h</strong></span>
                    </div>
                  )}
                </div>

                <EnhancedCardTitle className="text-2xl md:text-3xl font-black bg-gradient-to-r from-white via-emerald-100 to-[#2DD4BF] bg-clip-text text-transparent flex items-center gap-2 flex-wrap">
                  <span>{result.disease.name || 'Diagnosis: Foliar Pathology Identified'}</span>
                </EnhancedCardTitle>

                <div className="mt-2.5 flex items-center gap-2 flex-wrap text-sm text-foreground/85">
                  <span className="text-white/60 font-mono text-xs uppercase tracking-wider">Host Specimen:</span>
                  {isUnidentifiedPlant ? (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs font-semibold">
                      <HelpCircle className="h-3.5 w-3.5 text-amber-400" />
                      <span>Cannot identify name</span>
                      <span className="text-[10px] text-white/60 font-normal ml-1">(Pathology analyzed from foliar lesions)</span>
                    </span>
                  ) : (
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <strong className="text-white font-bold">{result.plant}</strong>
                      {result.scientific_name && (
                        <span className="italic text-foreground/75 text-xs font-mono">({result.scientific_name})</span>
                      )}
                      {result.family && result.family !== 'Plantae' && (
                        <Badge className="bg-white/5 border border-white/10 text-white/70 text-[10px] px-2 py-0.2 rounded-full">
                          Family: {result.family}
                        </Badge>
                      )}
                    </div>
                  )}
                </div>

                {(result.diagnosedByModel || result.modelShiftNotice) && (
                  <div className="mt-3 pt-3 border-t border-white/10 flex flex-wrap items-center gap-2 text-xs font-mono">
                    {result.diagnosedByModel && (
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-white/70">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#2DD4BF] animate-pulse" />
                        <span><strong className="text-[#5EEAD4]">PlantDoc AI</strong></span>
                      </div>
                    )}
                    {result.modelShiftNotice && (
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300">
                        <AlertTriangle className="h-3 w-3 text-amber-400 shrink-0" />
                        <span>{result.modelShiftNotice}</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </EnhancedCardHeader>
          </EnhancedCard>
        </motion.div>


      {/* 3. Clinical Treatment Protocol */}
      <motion.div variants={itemVariants}>
        <ClinicalTreatmentProtocol result={result} />
      </motion.div>

      {/* 4. Botanical Differential Diagnosis */}
      <motion.div variants={itemVariants}>
        <DifferentialDiagnosisCard result={result} />
      </motion.div>

      {/* 5. 30-Day Recovery Simulator */}
      <motion.div variants={itemVariants}>
        <InteractiveRecoveryTimeline result={result} />
      </motion.div>

      {/* 6. Primary Suspect & Classification Matrix */}
      <motion.div variants={itemVariants}>
          <div className={`p-5 sm:p-6 rounded-3xl bg-black/60 backdrop-blur-2xl border ${categoryConf.cardGlow} space-y-4 relative overflow-hidden transition-all duration-300`}>
            {/* Top Suspect Header & Category Tag */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
              <div className="flex items-center gap-3">
                <div className={`p-2.5 rounded-2xl ${categoryConf.badgeBg} border shrink-0 shadow-lg`}>
                  <CategoryIcon className="h-5 w-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-mono font-bold uppercase tracking-wider text-white/60">
                      Primary Suspect:
                    </span>
                    <Badge className={`${categoryConf.badgeBg} text-xs font-bold px-2.5 py-0.5 rounded-full border flex items-center gap-1`}>
                      <CategoryIcon className="h-3 w-3" />
                      <span>{categoryConf.title}</span>
                    </Badge>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight mt-0.5">
                    {suspect.name}
                  </h3>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Badge className="bg-white/10 text-white/90 border border-white/15 text-xs font-mono px-3 py-1 rounded-xl">
                  {suspect.sub_type || result.disease.pathogen_type}
                </Badge>
                <Badge className="bg-[#2DD4BF] text-black font-extrabold text-xs px-2.5 py-1 rounded-xl shadow-md">
                  {(result.disease.confidence || 92).toFixed(1)}% Confidence
                </Badge>
              </div>
            </div>

            {/* Category Explanation & Diagnostic Breakdown */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 pt-1">
              {/* Left: Category Scope & Examples */}
              <div className="md:col-span-5 p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-mono font-bold text-[#5EEAD4] uppercase tracking-wider">
                    Category Classification
                  </span>
                  <span className="text-[10px] font-mono text-white/50">Taxonomic Group</span>
                </div>
                
                <p className="text-xs text-white/90 font-medium">
                  {categoryConf.subLabel}
                </p>

                <div className="pt-2 border-t border-white/10 text-[11px] text-white/70 space-y-1">
                  <span className="text-white/50 block font-mono text-[10px] uppercase">Representative Issues:</span>
                  <p className="italic text-white/80 font-mono text-[11px] leading-relaxed">
                    {categoryConf.examples}
                  </p>
                </div>
              </div>

              {/* Right: Clinical Etiology & Symptom Evidence */}
              <div className="md:col-span-7 p-4 rounded-2xl bg-white/5 border border-white/10 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-mono font-bold text-amber-300 uppercase tracking-wider">
                    Etiology & Symptom Signatures
                  </span>
                  <span className="text-[10px] font-mono text-white/50">Clinical Verification</span>
                </div>

                <p className="text-xs text-white/85 leading-relaxed">
                  {suspect.description}
                </p>

                {/* Evidence Chips */}
                {suspect.symptom_evidence && suspect.symptom_evidence.length > 0 && (
                  <div className="pt-1 flex items-center gap-1.5 flex-wrap">
                    <span className="text-[10px] font-mono text-white/50 mr-1">Foliar Markers:</span>
                    {suspect.symptom_evidence.map((evidence, idx) => (
                      <span 
                        key={idx}
                        className="px-2 py-0.5 rounded-lg bg-black/60 border border-white/10 text-[10px] font-mono text-[#5EEAD4] flex items-center gap-1"
                      >
                        <CheckCircle2 className="h-2.5 w-2.5 text-[#2DD4BF]" />
                        <span>{evidence}</span>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </motion.div>


      {/* 7. Vital Metrics & Prognosis Visualizations */}
      <motion.div variants={itemVariants}>
        <DiagnosisVisualizations result={result} />
      </motion.div>

      {/* Bottom Action Bar: Copy Dossier + Print / Save PDF */}
      <motion.div variants={itemVariants}>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2 pb-1">
          <Button
            variant="outline"
            onClick={handleCopySummary}
            className="w-full sm:w-auto h-11 px-6 rounded-full bg-white/5 border-white/20 text-white hover:bg-[#2DD4BF]/20 hover:text-[#5EEAD4] text-sm gap-2 transition-all"
          >
            {hasCopiedSummary ? (
              <><Check className="h-4 w-4 text-emerald-400" /><span className="text-emerald-300">Copied!</span></>
            ) : (
              <><Copy className="h-4 w-4 text-[#2DD4BF]" /><span>Copy Clinical Dossier</span></>
            )}
          </Button>
          <Button
            variant="outline"
            onClick={handlePrintDossier}
            className="w-full sm:w-auto h-11 px-6 rounded-full bg-white/5 border-white/20 text-white hover:bg-white/15 text-sm gap-2 transition-all"
          >
            <Printer className="h-4 w-4 text-white/80" />
            <span>Print / Save PDF</span>
          </Button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ResultComponent;
