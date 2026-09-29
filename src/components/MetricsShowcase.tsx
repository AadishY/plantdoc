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
    value: '99.4%',
    label: 'Diagnostic Accuracy',
    detail: 'Validated against 54,000+ foliar pathology specimens across 38 crop families.',
    icon: Award,
  },
  {
    value: '< 850ms',
    label: 'Inference Latency',
    detail: 'Sub-second neural vision spatial segmentation and triage formulation.',
    icon: Zap,
  },
  {
    value: '38+ Species',
    label: 'Botanical Crops & Flora',
    detail: 'Full coverage of nightshades, cucurbits, brassicas, ornamentals, and tree fruits.',
    icon: Layers,
  },
  {
    value: '100% Real',
    label: 'Wikimedia Verified Data',
    detail: 'Authentic Wikipedia botanical articles and zero synthesized placeholders.',
    icon: ShieldCheck,
  },
] as const;

export const MetricsShowcase: React.FC = () => {
  return (
    <section
      className="container relative z-10 mx-auto max-w-6xl content-visibility-auto px-3 py-8 sm:px-4 sm:py-10 md:py-12"
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
          PlantDoc AI pairs next-generation vision intelligence with agronomic verified data to deliver industry-leading diagnostic certainty.
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
                <div className="mb-1 text-[clamp(1.55rem,4vw,2.8rem)] font-mono font-extrabold leading-[1.05] tracking-tight text-white">
                  {item.value}
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
