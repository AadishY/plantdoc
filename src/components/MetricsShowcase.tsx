import React from 'react';
import {
  ArrowUpRight,
  Layers,
  ScanSearch,
  Sprout,
  Upload,
} from 'lucide-react';
import SpotlightCard from './SpotlightCard';

const METRICS = [
  {
    index: '01',
    eyebrow: 'INPUT',
    value: '1',
    unit: 'photo',
    label: 'Photo-first diagnosis',
    detail: 'Upload one clear leaf, stem, or fruit photo to begin an evidence-led assessment.',
    icon: Upload,
    accent: 'text-[#5EEAD4] bg-[#2DD4BF]/15 border-[#2DD4BF]/30',
  },
  {
    index: '02',
    eyebrow: 'RESULT',
    value: '2',
    unit: 'views',
    label: 'Read and inspect',
    detail: 'Pair a plain-language result with a visual map of areas worth inspecting when available.',
    icon: ScanSearch,
    accent: 'text-blue-300 bg-blue-400/15 border-blue-300/30',
  },
  {
    index: '03',
    eyebrow: 'COVERAGE',
    value: '38+',
    unit: 'families',
    label: 'Crops & ornamentals',
    detail: 'Designed for common vegetables, fruit, herbs, flowers, houseplants, and garden crops.',
    icon: Sprout,
    accent: 'text-emerald-300 bg-emerald-400/15 border-emerald-300/30',
  },
  {
    index: '04',
    eyebrow: 'CONTEXT',
    value: 'Live',
    unit: 'reference',
    label: 'Botanical context',
    detail: 'Recommendation profiles can add current public plant summaries and authentic reference photography.',
    icon: Layers,
    accent: 'text-amber-200 bg-amber-300/15 border-amber-200/30',
  },
] as const;

export const MetricsShowcase: React.FC = () => {
  return (
    <section
      className="container mx-auto max-w-6xl px-3 py-8 sm:px-4 sm:py-10 md:py-14"
      aria-labelledby="precision-heading"
    >
      <div className="mx-auto mb-7 max-w-3xl text-center sm:mb-9">
        <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-[#2DD4BF]/35 bg-[#2DD4BF]/10 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-[#5EEAD4] sm:text-[11px]">
          <span className="h-1.5 w-1.5 rounded-full bg-[#5EEAD4] shadow-[0_0_10px_rgba(94,234,212,0.85)]" />
          Product signals
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
        <p className="mt-3 px-2 text-xs leading-relaxed text-foreground/75 sm:text-sm md:text-base">
          A clear path from plant photo to practical next steps, with visual evidence and botanical context in one place.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
        {METRICS.map((item) => {
          const Icon = item.icon;

          return (
            <SpotlightCard
              key={item.index}
              className="group flex min-h-[216px] flex-col justify-between p-4 sm:min-h-[252px] sm:p-6"
            >
              <div>
                <div className="mb-5 flex items-center justify-between gap-2 sm:mb-7">
                  <span className="font-mono text-[10px] font-bold tracking-[0.2em] text-white/40">
                    {item.index}
                  </span>
                  <div
                    className={`flex h-8 w-8 items-center justify-center rounded-xl border sm:h-10 sm:w-10 sm:rounded-2xl ${item.accent}`}
                  >
                    <Icon className="h-4 w-4 sm:h-5 sm:w-5" aria-hidden="true" />
                  </div>
                </div>

                <div className="mb-2 flex items-baseline gap-1.5 whitespace-nowrap">
                  <span className="text-[clamp(1.6rem,5vw,2.8rem)] font-mono font-extrabold leading-none tracking-tight text-white">
                    {item.value}
                  </span>
                  <span className="text-xs font-semibold text-[#5EEAD4] sm:text-sm">
                    {item.unit}
                  </span>
                </div>
                <h3 className="text-xs font-bold leading-snug text-white sm:text-sm">
                  {item.label}
                </h3>
              </div>

              <div>
                <p className="mt-3 line-clamp-3 text-[10px] leading-relaxed text-foreground/70 sm:text-xs">
                  {item.detail}
                </p>
                <div className="mt-4 flex items-center gap-1.5 border-t border-white/10 pt-3 text-[9px] font-bold uppercase tracking-[0.16em] text-white/35 transition-colors group-hover:text-[#5EEAD4]/80 sm:text-[10px]">
                  {item.eyebrow}
                  <ArrowUpRight className="h-3 w-3" aria-hidden="true" />
                </div>
              </div>
            </SpotlightCard>
          );
        })}
      </div>
    </section>
  );
};

export default React.memo(MetricsShowcase);
