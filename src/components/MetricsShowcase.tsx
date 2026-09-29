import React from 'react';
import {
  Award,
  Gauge,
  Layers,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import SpotlightCard from './SpotlightCard';

const METRICS = [
  {
    value: '1',
    unit: 'photo',
    label: 'Photo-first diagnosis',
    detail: 'Start with one clear leaf, stem, or fruit photo—no specialist equipment required.',
    icon: Award,
  },
  {
    value: '2',
    unit: 'views',
    label: 'Disease + lesion view',
    detail: 'Pair a plain-language assessment with a visual map of areas worth inspecting when available.',
    icon: Zap,
  },
  {
    value: '38+',
    unit: 'families',
    label: 'Crops & ornamentals',
    detail: 'Designed for common vegetables, fruit, herbs, flowers, houseplants, and garden crops.',
    icon: Layers,
  },
  {
    value: 'Live',
    unit: 'reference',
    label: 'Botanical context',
    detail: 'Recommendation profiles can add current public plant summaries and authentic reference photography.',
    icon: ShieldCheck,
  },
] as const;

export const MetricsShowcase: React.FC = () => {
  return (
    <section
      className="container relative z-10 mx-auto max-w-6xl px-3 py-8 sm:px-4 sm:py-10 md:py-12"
      aria-labelledby="precision-heading"
    >
      <div className="mx-auto mb-7 max-w-3xl text-center sm:mb-8">
        <div className="mb-3 inline-flex items-center gap-1.5 rounded-full border border-[#2DD4BF]/40 bg-[#2DD4BF]/15 px-3 py-1.5 font-mono text-[11px] text-[#5EEAD4] sm:px-3.5 sm:text-xs">
          <Gauge className="h-3 w-3 sm:h-3.5 sm:w-3.5" aria-hidden="true" />
          <span>Clinical Telemetry &amp; Performance</span>
        </div>
        <h2
          id="precision-heading"
          className="text-2xl font-extrabold tracking-tight text-white sm:text-4xl md:text-5xl"
        >
          Engineered for{' '}
          <span className="bg-gradient-to-r from-white via-emerald-100 to-[#2DD4BF] bg-clip-text text-transparent">
            Clinical Precision
          </span>
        </h2>
        <p className="px-2 text-xs leading-relaxed text-foreground/75 sm:text-sm md:text-base">
          PlantDoc AI connects photo-based vision analysis with practical, reference-backed plant-care guidance.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:gap-6 lg:grid-cols-4">
        {METRICS.map((item) => {
          const Icon = item.icon;

          return (
            <SpotlightCard
              key={item.label}
              className="flex min-h-[190px] flex-col justify-between p-4 text-left sm:min-h-[240px] sm:p-7"
            >
              <div>
                <div className="mb-5 flex h-10 w-10 items-center justify-center rounded-2xl border border-[#2DD4BF]/30 bg-[#2DD4BF]/15 text-[#2DD4BF] shadow-[0_0_15px_rgba(45,212,191,0.25)] sm:mb-7 sm:h-12 sm:w-12">
                  <Icon className="h-5 w-5 sm:h-6 sm:w-6" aria-hidden="true" />
                </div>
                <div className="mb-1 flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
                  <span className="text-[clamp(1.65rem,4vw,2.8rem)] font-mono font-extrabold leading-none tracking-tight text-white">
                    {item.value}
                  </span>
                  <span className="text-xs font-semibold text-[#5EEAD4] sm:text-sm">
                    {item.unit}
                  </span>
                </div>
                <h3 className="text-xs font-bold leading-snug text-[#5EEAD4] sm:text-sm">
                  {item.label}
                </h3>
              </div>

              <p className="mt-3 line-clamp-3 text-[10px] leading-relaxed text-foreground/75 sm:text-xs">
                {item.detail}
              </p>
            </SpotlightCard>
          );
        })}
      </div>
    </section>
  );
};

export default React.memo(MetricsShowcase);
