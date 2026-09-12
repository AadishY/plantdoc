import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Leaf, Sparkles, Scan, ShieldCheck, Activity, Dna } from 'lucide-react';

const STATUS_MESSAGES = [
  { text: "Loading Vision Neural Ensembles", icon: Dna },
  { text: "Calibrating 2D Foliar Lesion Grid", icon: Scan },
  { text: "Mounting Clinical Pathology Engine", icon: Activity },
  { text: "System Online & Ready", icon: ShieldCheck }
];

export const SiteLoader: React.FC = () => {
  const [loading, setLoading] = useState(() => {
    try {
      if (typeof window !== 'undefined' && sessionStorage.getItem('plantdoc_session_loaded')) {
        return false;
      }
    } catch {}
    return true;
  });
  const [statusIdx, setStatusIdx] = useState(0);

  useEffect(() => {
    if (!loading) return;

    try {
      sessionStorage.setItem('plantdoc_session_loaded', '1');
    } catch {}

    const statusInterval = setInterval(() => {
      setStatusIdx((prev) => (prev < STATUS_MESSAGES.length - 1 ? prev + 1 : prev));
    }, 120);

    const timer = setTimeout(() => {
      setLoading(false);
    }, 500);

    return () => {
      clearInterval(statusInterval);
      clearTimeout(timer);
    };
  }, [loading]);

  const CurrentIcon = STATUS_MESSAGES[statusIdx].icon;

  return (
    <AnimatePresence>
      {loading && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.02, filter: 'blur(8px)', transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } }}
          className="fixed inset-0 z-[9999] bg-[#030604] flex flex-col items-center justify-center pointer-events-none select-none overflow-hidden"
        >
          {/* Ambient Volumetric Foliar Glow */}
          <div 
            className="absolute w-[500px] h-[500px] rounded-full blur-[120px] opacity-30 pointer-events-none transform-gpu animate-pulse"
            style={{
              background: 'radial-gradient(circle, rgba(45, 212, 191, 0.7) 0%, rgba(16, 185, 129, 0.35) 40%, rgba(5, 150, 105, 0.1) 70%, transparent 80%)',
            }}
          />

          {/* Precision Micro-Grid Gridlines */}
          <div 
            className="absolute inset-0 opacity-10 pointer-events-none"
            style={{
              backgroundImage: 'radial-gradient(rgba(45, 212, 191, 0.5) 1px, transparent 1px)',
              backgroundSize: '24px 24px'
            }}
          />

          <div className="relative flex flex-col items-center gap-7 z-10 px-6 max-w-md w-full">
            
            {/* Holographic Diagnostic Centerpiece */}
            <div className="relative flex h-28 w-28 items-center justify-center">
              {/* Outer Rotating Bio-Ring */}
              <motion.div 
                className="absolute inset-0 rounded-full border border-dashed border-[#2DD4BF]/40"
                animate={{ rotate: 360 }}
                transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
              />
              
              {/* Pulse Scanner Halo */}
              <motion.div 
                className="absolute -inset-3 rounded-full border border-[#5EEAD4]/25"
                animate={{ scale: [1, 1.25, 1], opacity: [0.6, 0.1, 0.6] }}
                transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
              />

              {/* Central Core Shield */}
              <div className="relative z-10 w-16 h-16 sm:w-18 sm:h-18 rounded-2xl bg-black/85 border border-[#2DD4BF]/60 flex items-center justify-center shadow-[0_0_40px_rgba(45,212,191,0.45)] backdrop-blur-xl">
                <Leaf className="h-8 w-8 sm:h-9 sm:w-9 text-[#5EEAD4] drop-shadow-[0_0_12px_rgba(45,212,191,0.85)]" />
                <span className="absolute -top-1.5 -right-1.5 flex h-3.5 w-3.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#2DD4BF] opacity-75" />
                  <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-[#2DD4BF]" />
                </span>
              </div>
            </div>

            {/* Wordmark */}
            <div className="flex flex-col items-center text-center space-y-2">
              <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-white flex items-center gap-2 font-sans">
                <span>PLANT</span>
                <span className="bg-gradient-to-r from-[#A7F3D0] via-[#2DD4BF] to-[#059669] bg-clip-text text-transparent">DOC</span>
                <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-[#2DD4BF]/15 text-[#5EEAD4] border border-[#2DD4BF]/40 tracking-widest uppercase">
                  AI
                </span>
              </h2>
              <p className="text-xs font-mono text-white/75 tracking-widest uppercase flex items-center gap-2 h-6">
                <CurrentIcon className="h-4 w-4 text-[#2DD4BF] animate-pulse" />
                <span>{STATUS_MESSAGES[statusIdx].text}</span>
              </p>
            </div>

            {/* High-Tech Shimmering Progress Laser */}
            <div className="w-full bg-white/10 rounded-full h-1.5 overflow-hidden relative p-[1px] border border-white/10 max-w-xs">
              <motion.div 
                className="h-full bg-gradient-to-r from-[#2DD4BF] via-[#10B981] to-[#5EEAD4] rounded-full shadow-[0_0_15px_rgba(45,212,191,0.9)]"
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              />
            </div>

            {/* Status pill */}
            <div className="flex items-center gap-2 text-[11px] font-mono text-white/50">
              <Sparkles className="h-3.5 w-3.5 text-[#2DD4BF]" />
              <span>Clinical Phytopathology Intelligence</span>
            </div>

          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SiteLoader;
