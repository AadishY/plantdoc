import React, { useEffect, useState } from 'react';
import { Leaf, Sparkles, Scan, ShieldCheck, Activity, Dna } from 'lucide-react';

const STATUS_MESSAGES = [
  { text: 'Loading vision models', icon: Dna },
  { text: 'Calibrating leaf analysis', icon: Scan },
  { text: 'Preparing plant-care guidance', icon: Activity },
  { text: 'Ready to inspect a plant', icon: ShieldCheck },
];

/** A short, CSS-only first-visit hand-off. Avoiding an animation runtime here
 * keeps the initial mobile bundle and first interactive frame smaller. */
export const SiteLoader: React.FC = () => {
  const [loading, setLoading] = useState(() => {
    try {
      if (typeof window !== 'undefined' && sessionStorage.getItem('plantdoc_session_loaded')) {
        return false;
      }
    } catch {
      // Storage can be disabled in private browsing; the loader still works.
    }
    return true;
  });
  const [statusIdx, setStatusIdx] = useState(0);

  useEffect(() => {
    if (!loading) return;

    try {
      sessionStorage.setItem('plantdoc_session_loaded', '1');
    } catch {
      // Non-blocking: do not prevent the app from loading.
    }

    const statusInterval = window.setInterval(() => {
      setStatusIdx((previous) => Math.min(previous + 1, STATUS_MESSAGES.length - 1));
    }, 80);
    const timer = window.setTimeout(() => setLoading(false), 260);

    return () => {
      window.clearInterval(statusInterval);
      window.clearTimeout(timer);
    };
  }, [loading]);

  if (!loading) return null;

  const CurrentIcon = STATUS_MESSAGES[statusIdx].icon;
  return (
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center overflow-hidden bg-[#030604] px-6 select-none animate-site-loader-in">
      <div
        aria-hidden="true"
        className="absolute h-[500px] w-[500px] rounded-full blur-[120px] opacity-30 pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(45, 212, 191, 0.7) 0%, rgba(16, 185, 129, 0.35) 40%, transparent 80%)' }}
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-10 pointer-events-none"
        style={{ backgroundImage: 'radial-gradient(rgba(45, 212, 191, 0.5) 1px, transparent 1px)', backgroundSize: '24px 24px' }}
      />

      <div className="relative z-10 flex w-full max-w-md flex-col items-center gap-7 text-center">
        <div className="relative flex h-28 w-28 items-center justify-center">
          <div className="absolute inset-0 rounded-full border border-dashed border-[#2DD4BF]/40 animate-spin" style={{ animationDuration: '12s' }} />
          <div className="absolute -inset-3 rounded-full border border-[#5EEAD4]/25 animate-pulse" />
          <div className="relative z-10 flex h-16 w-16 items-center justify-center rounded-2xl border border-[#2DD4BF]/60 bg-black/85 shadow-[0_0_40px_rgba(45,212,191,0.45)]">
            <Leaf className="h-8 w-8 text-[#5EEAD4] drop-shadow-[0_0_12px_rgba(45,212,191,0.85)]" />
            <span className="absolute -right-1.5 -top-1.5 h-3.5 w-3.5 rounded-full bg-[#2DD4BF]" />
          </div>
        </div>

        <div className="flex flex-col items-center space-y-2">
          <h2 className="flex items-center gap-2 text-3xl font-black tracking-tight text-white sm:text-4xl">
            <span>PLANT</span>
            <span className="bg-gradient-to-r from-[#A7F3D0] via-[#2DD4BF] to-[#059669] bg-clip-text text-transparent">DOC</span>
            <span className="rounded-full border border-[#2DD4BF]/40 bg-[#2DD4BF]/15 px-2.5 py-0.5 text-[10px] font-mono font-bold tracking-widest text-[#5EEAD4]">AI</span>
          </h2>
          <p className="flex h-6 items-center gap-2 text-xs font-mono uppercase tracking-widest text-white/75">
            <CurrentIcon className="h-4 w-4 animate-pulse text-[#2DD4BF]" />
            <span>{STATUS_MESSAGES[statusIdx].text}</span>
          </p>
        </div>

        <div className="relative h-1.5 w-full max-w-xs overflow-hidden rounded-full border border-white/10 bg-white/10 p-px">
          <div className="h-full w-full origin-left rounded-full bg-gradient-to-r from-[#2DD4BF] via-[#10B981] to-[#5EEAD4] shadow-[0_0_15px_rgba(45,212,191,0.9)] animate-loader-progress" />
        </div>
        <div className="flex items-center gap-2 text-[11px] font-mono text-white/50">
          <Sparkles className="h-3.5 w-3.5 text-[#2DD4BF]" />
          <span>Photo-first plant health guidance</span>
        </div>
      </div>
    </div>
  );
};

export default SiteLoader;
