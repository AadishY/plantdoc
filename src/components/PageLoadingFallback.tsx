import React from 'react';
import { motion } from 'framer-motion';
import { Leaf, Sparkles } from 'lucide-react';

interface PageLoadingFallbackProps {
  title?: string;
  subtitle?: string;
}

export const PageLoadingFallback: React.FC<PageLoadingFallbackProps> = ({
  title = "Initializing Clinical View",
  subtitle = "Preparing neural models & foliar diagnostics..."
}) => {
  return (
    <div className="relative min-h-[80vh] w-full flex flex-col items-center justify-center px-4 py-16 overflow-hidden select-none">
      
      {/* 🌟 Ultra-Fast Glowing Laser Top Progress Bar */}
      <div className="fixed top-0 left-0 right-0 h-[3px] z-[99999] overflow-hidden pointer-events-none">
        <motion.div
          className="h-full bg-gradient-to-r from-[#2DD4BF] via-[#10B981] to-[#5EEAD4] shadow-[0_0_15px_rgba(45,212,191,0.9),0_0_25px_rgba(16,185,129,0.7)]"
          initial={{ x: "-100%" }}
          animate={{ x: "0%" }}
          transition={{
            duration: 0.6,
            ease: [0.22, 1, 0.36, 1],
            repeat: Infinity,
            repeatType: "reverse"
          }}
        />
      </div>

      {/* Ambient Radial Foliar Glow */}
      <div 
        className="absolute w-96 h-96 rounded-full blur-[100px] opacity-25 pointer-events-none transform-gpu animate-pulse"
        style={{
          background: 'radial-gradient(circle, rgba(45, 212, 191, 0.6) 0%, rgba(16, 185, 129, 0.3) 50%, transparent 75%)',
        }}
      />

      {/* Centered Glassmorphic Hologram Card */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.96, y: 8 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 flex flex-col items-center p-8 sm:p-10 rounded-3xl bg-black/55 border border-white/10 backdrop-blur-2xl shadow-[0_8px_32px_rgba(0,0,0,0.6),inset_0_1px_0_0_rgba(255,255,255,0.1)] max-w-sm w-full text-center gap-6"
      >
        {/* Holographic Diagnostic Centerpiece */}
        <div className="relative flex h-20 w-20 items-center justify-center">
          {/* Outer Rotating Bio-Ring */}
          <motion.div 
            className="absolute inset-0 rounded-full border border-dashed border-[#2DD4BF]/40"
            animate={{ rotate: 360 }}
            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
          />
          
          {/* Pulse Scanner Halo */}
          <motion.div 
            className="absolute -inset-2 rounded-full border border-[#5EEAD4]/30"
            animate={{ scale: [1, 1.2, 1], opacity: [0.7, 0.15, 0.7] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          />

          {/* Central Shield */}
          <div className="relative z-10 w-13 h-13 rounded-2xl bg-black/85 border border-[#2DD4BF]/60 flex items-center justify-center shadow-[0_0_30px_rgba(45,212,191,0.4)] backdrop-blur-xl p-3">
            <Leaf className="h-7 w-7 text-[#5EEAD4] drop-shadow-[0_0_10px_rgba(45,212,191,0.8)] animate-pulse" />
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#2DD4BF] opacity-75" />
              <span className="relative inline-flex rounded-full h-3 w-3 bg-[#2DD4BF]" />
            </span>
          </div>
        </div>

        {/* Status Text & Message */}
        <div className="flex flex-col items-center space-y-1.5">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#2DD4BF]/15 border border-[#2DD4BF]/30 text-[#5EEAD4] text-[11px] font-mono font-semibold tracking-wider uppercase">
            <Sparkles className="h-3 w-3 text-[#2DD4BF]" />
            <span>{title}</span>
          </div>
          <p className="text-xs text-white/60 tracking-normal max-w-xs pt-1">
            {subtitle}
          </p>
        </div>

        {/* Animated Laser Micro-Progress Track */}
        <div className="w-48 bg-white/10 rounded-full h-1 overflow-hidden relative border border-white/10">
          <motion.div 
            className="h-full bg-gradient-to-r from-[#2DD4BF] via-[#10B981] to-[#5EEAD4] rounded-full shadow-[0_0_12px_rgba(45,212,191,0.9)]"
            initial={{ x: "-100%" }}
            animate={{ x: "100%" }}
            transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>
      </motion.div>
    </div>
  );
};

export default PageLoadingFallback;
