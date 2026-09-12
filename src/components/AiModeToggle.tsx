import React from "react";
import { Sparkles, Zap } from "lucide-react";
import { motion } from "framer-motion";

export type AiProcessingMode = "smart" | "fast";

interface AiModeToggleProps {
  mode: AiProcessingMode;
  onChange: (mode: AiProcessingMode) => void;
  page: "diagnose" | "recommend";
  className?: string;
}

export const AiModeToggle: React.FC<AiModeToggleProps> = ({
  mode,
  onChange,
  page,
  className = ""
}) => {
  const isSmart = mode === "smart";
  const isFast = mode === "fast";

  return (
    <div
      className={`relative inline-flex items-center p-1 rounded-2xl bg-black/55 backdrop-blur-2xl border border-white/15 shadow-[0_4px_24px_rgba(0,0,0,0.5)] ${className}`}
    >
      {/* Smart Mode Button */}
      <button
        type="button"
        onClick={() => onChange("smart")}
        className={`relative px-3 sm:px-4 py-2 rounded-xl text-xs font-semibold transition-all duration-200 flex items-center gap-2 z-10 select-none ${
          isSmart
            ? "text-black font-extrabold"
            : "text-white/70 hover:text-white hover:bg-white/5"
        }`}
        title={
          page === "diagnose"
            ? "Smart Mode: Phytopathology & Clinical Vision Diagnostics"
            : "Smart Mode: Botanical taxonomy & climate adaptation"
        }
      >
        {isSmart && (
          <motion.div
            layoutId={`aiModeActive-${page}`}
            className="absolute inset-0 bg-gradient-to-r from-[#2DD4BF] via-[#10B981] to-[#059669] rounded-xl shadow-[0_0_16px_rgba(45,212,191,0.5)] -z-10"
            transition={{ type: "spring", stiffness: 450, damping: 32 }}
          />
        )}
        <Sparkles className={`h-3.5 w-3.5 ${isSmart ? "text-black" : "text-[#2DD4BF]"}`} />
        <span>Smart Mode</span>
      </button>

      {/* Fast Mode Button */}
      <button
        type="button"
        onClick={() => onChange("fast")}
        className={`relative px-3 sm:px-4 py-2 rounded-xl text-xs font-semibold transition-all duration-200 flex items-center gap-2 z-10 select-none ${
          isFast
            ? "text-black font-extrabold"
            : "text-white/70 hover:text-white hover:bg-white/5"
        }`}
        title={
          page === "diagnose"
            ? "Fast Mode: High-speed clinical vision diagnostics"
            : "Fast Mode: High-speed botanical recommendations"
        }
      >
        {isFast && (
          <motion.div
            layoutId={`aiModeActive-${page}`}
            className="absolute inset-0 bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500 rounded-xl shadow-[0_0_16px_rgba(251,191,36,0.55)] -z-10"
            transition={{ type: "spring", stiffness: 450, damping: 32 }}
          />
        )}
        <Zap className={`h-3.5 w-3.5 ${isFast ? "text-black" : "text-amber-400"}`} />
        <span>Fast Mode</span>
      </button>
    </div>
  );
};
