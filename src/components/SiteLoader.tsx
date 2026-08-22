import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Leaf, Sparkles } from 'lucide-react';

export const SiteLoader: React.FC = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 550);

    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {loading && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] } }}
          className="fixed inset-0 z-[9999] bg-[#040805] flex flex-col items-center justify-center pointer-events-none select-none overflow-hidden"
        >
          {/* Ambient Emerald Aura */}
          <div 
            className="absolute w-80 h-80 rounded-full blur-[100px] opacity-25 pointer-events-none transform-gpu"
            style={{
              background: 'radial-gradient(circle, rgba(45, 212, 191, 0.6) 0%, rgba(16, 185, 129, 0.2) 50%, transparent 70%)',
            }}
          />

          <div className="relative flex flex-col items-center gap-5 z-10">
            {/* Glowing Icon */}
            <div className="relative flex h-16 w-16 items-center justify-center">
              <motion.div 
                className="absolute inset-0 rounded-2xl bg-[#2DD4BF]/20 border border-[#2DD4BF]/40 blur-sm"
                animate={{ scale: [1, 1.15, 1], opacity: [0.5, 0.9, 0.5] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
              />
              <div className="relative z-10 w-14 h-14 rounded-2xl bg-black/60 border border-[#2DD4BF]/50 flex items-center justify-center shadow-[0_0_25px_rgba(45,212,191,0.35)]">
                <Leaf className="h-7 w-7 text-[#2DD4BF]" />
              </div>
            </div>

            {/* Wordmark */}
            <div className="flex flex-col items-center text-center">
              <h2 className="text-3xl font-extrabold tracking-tight text-white flex items-center gap-1">
                <span>PLANT</span>
                <span className="bg-gradient-to-r from-[#A7F3D0] via-[#2DD4BF] to-[#059669] bg-clip-text text-transparent">DOC</span>
                <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-[#2DD4BF]/20 text-[#5EEAD4] border border-[#2DD4BF]/40 ml-1.5">AI</span>
              </h2>
              <p className="text-[11px] font-mono text-foreground/70 tracking-widest uppercase mt-1 flex items-center gap-1.5">
                <Sparkles className="h-3 w-3 text-[#2DD4BF] animate-spin" style={{ animationDuration: '3s' }} />
                <span>Initializing Diagnostics</span>
              </p>
            </div>

            {/* Slim Laser Progress Bar */}
            <div className="w-48 h-[2.5px] bg-white/10 rounded-full overflow-hidden relative">
              <motion.div 
                className="h-full bg-gradient-to-r from-[#2DD4BF] via-[#10B981] to-[#5EEAD4] rounded-full"
                initial={{ x: '-100%' }}
                animate={{ x: '100%' }}
                transition={{ duration: 0.8, repeat: Infinity, ease: "easeInOut" }}
              />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SiteLoader;
