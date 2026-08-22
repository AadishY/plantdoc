import React from 'react';
import { CardDescription } from '@/components/ui/card';
import { Leaf } from 'lucide-react';
import { DiagnosisResult } from '@/types/diagnosis';
import { motion } from 'framer-motion';
import { EnhancedCard, EnhancedCardHeader, EnhancedCardTitle } from '@/components/ui/enhanced-card';
import { Badge } from '@/components/ui/badge';
import PlantSegmentationViewer from './PlantSegmentationViewer';
import DiagnosisVisualizations from './DiagnosisVisualizations';
import ClinicalTreatmentProtocol from './ClinicalTreatmentProtocol';

interface ResultComponentProps {
  result: DiagnosisResult;
  imageUrl?: string | null;
}

const ResultComponent: React.FC<ResultComponentProps> = ({ result, imageUrl }) => {
  const isHealthy = 
    !result.disease.name ||
    result.disease.name.toLowerCase().includes('healthy') ||
    result.disease.name.toLowerCase().includes('no disease') ||
    result.disease.severity?.toLowerCase() === 'none';

  const getSeverityColor = (severity: string) => {
    if (isHealthy) return 'bg-emerald-600 text-white';
    switch (severity.toLowerCase()) {
      case 'critical':
        return 'bg-red-600 text-white';
      case 'high':
        return 'bg-rose-500 text-white';
      case 'medium':
        return 'bg-amber-500 text-black';
      case 'low':
        return 'bg-emerald-500 text-black';
      default:
        return 'bg-sky-500 text-white';
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.25 } }
  };

  return (
    <motion.div 
      className="space-y-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* 1. Computer Vision Lesion Segmentation Overlay */}
      {imageUrl && (
        <motion.div variants={itemVariants}>
          <PlantSegmentationViewer
            imageUrl={imageUrl}
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

      {/* 2. Primary Pathology Header */}
      <motion.div variants={itemVariants}>
        <EnhancedCard glassIntensity="intense" borderGlow={true} className="bg-black/45 backdrop-blur-2xl rounded-3xl border border-white/20 overflow-hidden">
          <EnhancedCardHeader className="pb-5 pt-5 border-b border-white/10">
            <div>
              <div className="flex items-center gap-2 mb-2.5 flex-wrap">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#2DD4BF]/20 border border-[#2DD4BF]/40 text-[#5EEAD4] text-xs font-mono font-bold">
                  <Leaf className="h-3.5 w-3.5" />
                  <span>Plant Disease Diagnosis</span>
                </div>
                <Badge className="bg-[#2DD4BF] text-black font-extrabold text-xs px-2.5 py-0.5 rounded-full">
                  {result.accuracy ? `${result.accuracy.toFixed(1)}% Match` : 'AI Confirmed'}
                </Badge>
                <Badge className={`${getSeverityColor(result.disease.severity)} rounded-full text-xs px-2.5 py-0.5 font-semibold`}>
                  {result.disease.severity} Severity
                </Badge>
                <Badge className="bg-white/10 text-white text-xs border border-white/15 rounded-full px-2.5 py-0.5">
                  {result.disease.pathogen_type || 'Biological Pathogen'}
                </Badge>
              </div>
              <EnhancedCardTitle className="text-2xl md:text-3xl font-extrabold bg-gradient-to-r from-white via-emerald-100 to-[#2DD4BF] bg-clip-text text-transparent">
                {result.disease.name || 'Diagnosis: Foliar Pathology Identified'}
              </EnhancedCardTitle>
              <CardDescription className="text-sm text-foreground/80 mt-1">
                Specimen: <strong className="text-white">{result.plant}</strong> {result.scientific_name && <span className="italic text-foreground/70">({result.scientific_name})</span>}
              </CardDescription>
            </div>
          </EnhancedCardHeader>
        </EnhancedCard>
      </motion.div>

      {/* 3. Clinical Treatment Protocol */}
      <motion.div variants={itemVariants}>
        <ClinicalTreatmentProtocol result={result} />
      </motion.div>

      {/* 4. Vital Metrics & Prognosis Visualizations */}
      <motion.div variants={itemVariants}>
        <DiagnosisVisualizations result={result} />
      </motion.div>
    </motion.div>
  );
};

export default ResultComponent;
