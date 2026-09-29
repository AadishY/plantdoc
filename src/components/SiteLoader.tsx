import React, { useEffect, useState } from 'react';
import { Activity, Leaf, Scan, ShieldCheck, Sparkles } from 'lucide-react';

const STATUS_MESSAGES = [
  { text: 'Waking the plant health workspace', icon: Leaf },
  { text: 'Preparing photo analysis', icon: Scan },
  { text: 'Organizing practical care guidance', icon: Activity },
  { text: 'Ready to inspect a plant', icon: ShieldCheck },
];

/**
 * A short, CSS-only first-visit hand-off. It deliberately avoids an animation
 * runtime and large image assets so the first mobile frame stays inexpensive.
 */
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
    }, 140);
    const timer = window.setTimeout(() => setLoading(false), 560);

    return () => {
      window.clearInterval(statusInterval);
      window.clearTimeout(timer);
    };
  }, [loading]);

  if (!loading) return null;

  const CurrentIcon = STATUS_MESSAGES[statusIdx].icon;

  return (
    <div
      className="fixed inset-0 z-[9999] flex select-none flex-col items-center justify-center overflow-hidden bg-[#030604] px-6 animate-site-loader-in"
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-20"
        style={{
          backgroundImage: 'radial-gradient(rgba(45, 212, 191, 0.45) 1px, transparent 1px)',
          backgroundSize: '28px 28px',
        }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#059669]/20 blur-[72px]"
      />

      <div className="relative z-10 flex w-full max-w-sm flex-col items-center gap-7 text-center">
        <div className="relative flex h-24 w-24 items-center justify-center" aria-hidden="true">
          <div className="absolute inset-0 rounded-full border border-[#2DD4BF]/35 border-dashed motion-safe:animate-spin" style={{ animationDuration: '14s' }} />
          <div className="absolute inset-2 rounded-full border border-[#5EEAD4]/15 motion-safe:animate-pulse" />
          <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl border border-[#2DD4BF]/60 bg-black/85 shadow-[0_0_35px_rgba(45,212,191,0.4)]">
            <Leaf className="h-8 w-8 text-[#5EEAD4] drop-shadow-[0_0_10px_rgba(45,212,191,0.75)]" />
            <span className="absolute -right-1.5 -top-1.5 h-3 w-3 rounded-full bg-[#2DD4BF]" />
          </div>
        </div>

        <div className="flex flex-col items-center gap-2">
          <h1 className="flex items-center gap-2 text-3xl font-black tracking-tight text-white sm:text-4xl">
            <span>PLANT</span>
            <span className="bg-gradient-to-r from-[#A7F3D0] via-[#2DD4BF] to-[#059669] bg-clip-text text-transparent">DOC</span>
            <span className="rounded-full border border-[#2DD4BF]/40 bg-[#2DD4BF]/15 px-2.5 py-0.5 font-mono text-[10px] font-bold tracking-widest text-[#5EEAD4]">AI</span>
          </h1>
          <p className="flex h-6 items-center gap-2 font-mono text-[11px] uppercase tracking-[0.12em] text-white/70 sm:text-xs">
            <CurrentIcon className="h-4 w-4 text-[#2DD4BF] motion-safe:animate-pulse" aria-hidden="true" />
            <span>{STATUS_MESSAGES[statusIdx].text}</span>
          </p>
        </div>

        <div className="relative h-1.5 w-full max-w-xs overflow-hidden rounded-full border border-white/10 bg-white/10 p-px" aria-hidden="true">
          <div className="h-full w-full origin-left rounded-full bg-gradient-to-r from-[#2DD4BF] via-[#10B981] to-[#5EEAD4] shadow-[0_0_14px_rgba(45,212,191,0.8)] animate-loader-progress" />
        </div>
        <div className="flex items-center gap-2 text-[11px] text-white/50">
          <Sparkles className="h-3.5 w-3.5 text-[#2DD4BF]" aria-hidden="true" />
          <span>Photo-first plant health guidance</span>
        </div>
      </div>
    </div>
  );
};

export default SiteLoader;
