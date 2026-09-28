import React from 'react';
import { 
  Zap, 
  ShieldCheck, 
  Layers, 
  Gauge, 
  Award 
} from 'lucide-react';
import SpotlightCard from './SpotlightCard';

const METRICS = [
  {
    value: '1 photo',
    label: 'Photo-first diagnosis',
    detail: 'Start with one clear leaf, stem, or fruit photo—no specialist equipment required.',
    icon: <Award className="h-4 w-4 sm:h-6 sm:w-6 text-[#2DD4BF]" />
  },
  {
    value: '2 views',
    label: 'Disease + lesion view',
    detail: 'Pair a plain-language disease result with a visual map of areas worth inspecting.',
    icon: <Zap className="h-4 w-4 sm:h-6 sm:w-6 text-[#2DD4BF]" />
  },
  {
    value: '38+ families',
    label: 'Crops & ornamentals',
    detail: 'Built for vegetables, fruit, herbs, flowers, houseplants, and common garden crops.',
    icon: <Layers className="h-4 w-4 sm:h-6 sm:w-6 text-[#2DD4BF]" />
  },
  {
    value: 'Live source',
    label: 'Botanical references',
    detail: 'Recommendation profiles connect to Wikimedia photography and plant reference data.',
    icon: <ShieldCheck className="h-4 w-4 sm:h-6 sm:w-6 text-[#2DD4BF]" />
  }
];

export const MetricsShowcase: React.FC = () => {
  return (
    <section className="py-6 sm:py-8 md:py-12 container mx-auto px-3 sm:px-4 relative z-10 max-w-6xl">
      
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-6 sm:mb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-full bg-[#2DD4BF]/20 border border-[#2DD4BF]/40 text-[#5EEAD4] text-[11px] sm:text-xs font-mono mb-2.5 sm:mb-3">
          <Gauge className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
          <span>Clinical Telemetry & Performance</span>
        </div>
        <h2 className="text-2xl sm:text-4xl md:text-5xl font-extrabold text-white mb-2 sm:mb-3">
          Engineered for <span className="bg-gradient-to-r from-white via-emerald-100 to-[#2DD4BF] bg-clip-text text-transparent">Clinical Precision</span>
        </h2>
        <p className="text-foreground/75 text-xs sm:text-sm md:text-base leading-relaxed px-2">
          PlantDoc AI pairs next-generation vision intelligence with agronomic verified data to deliver industry-leading diagnostic certainty.
        </p>
      </div>

      {/* 4 Metric Spotlight Cards (2x2 on Mobile, 4 in a row on Desktop) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
        {METRICS.map((item, idx) => (
          <SpotlightCard key={idx} className="p-3.5 sm:p-7 text-left flex flex-col justify-between min-h-[165px] sm:min-h-[240px]">
            <div>
              <div className="w-8 h-8 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-[#2DD4BF]/15 border border-[#2DD4BF]/30 flex items-center justify-center mb-2.5 sm:mb-5 shadow-[0_0_15px_rgba(45,212,191,0.25)]">
                {item.icon}
              </div>
              <div className="text-xl sm:text-4xl font-mono font-extrabold text-white tracking-tight mb-0.5 sm:mb-1">
                {item.value}
              </div>
              <div className="text-xs sm:text-sm font-bold text-[#5EEAD4] mb-1 sm:mb-2 leading-snug">
                {item.label}
              </div>
            </div>
            <p className="text-[10px] sm:text-xs text-foreground/75 leading-relaxed line-clamp-2 sm:line-clamp-none">
              {item.detail}
            </p>
          </SpotlightCard>
        ))}
      </div>

    </section>
  );
};

export default React.memo(MetricsShowcase);
