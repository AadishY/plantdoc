import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Scan, 
  Globe, 
  Zap, 
  ShieldCheck, 
  Cloud, 
  Sparkles, 
  ArrowUpRight 
} from 'lucide-react';
import SpotlightCard from './SpotlightCard';

export const ParallaxSection: React.FC = () => {
  return (
    <section className="relative py-6 sm:py-8 md:py-12 overflow-hidden z-10">
      <div className="container mx-auto px-3 sm:px-4 relative max-w-6xl">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-6 sm:mb-8">
          <div className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1 sm:py-1.5 bg-[#2DD4BF]/20 rounded-full mb-2.5 sm:mb-3 border border-[#2DD4BF]/40 shadow-[0_0_25px_rgba(45,212,191,0.35)]">
            <Sparkles className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-[#2DD4BF] animate-spin" style={{ animationDuration: '6s' }} />
            <span className="text-[11px] sm:text-xs font-mono font-bold text-[#5EEAD4]">Next-Generation Botanical AI</span>
          </div>
          
          <h2 className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-extrabold mb-2.5 sm:mb-4 tracking-tight">
            Advanced Vision & <br className="hidden sm:block" />
            <span className="bg-gradient-to-r from-white via-emerald-100 to-[#2DD4BF] bg-clip-text text-transparent">
              Agronomic Intelligence
            </span>
          </h2>
          
          <p className="text-xs sm:text-sm md:text-base text-foreground/80 leading-relaxed px-2">
            Combining dual-engine computer vision segmentation with regional botanical climate modeling and verified Wikimedia taxonomies.
          </p>
        </div>
        
        {/* 3 Core Spotlight Feature Cards (Scaled to 2-3 in a row on mobile/tablet) */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-6 mb-3 sm:mb-6">
          
          {/* Card 1: Dual Vision Segmentation */}
          <SpotlightCard className="p-4 sm:p-8 text-left flex flex-col justify-between min-h-[220px] sm:min-h-[380px] group">
            <div>
              <div className="w-9 h-9 sm:w-16 sm:h-16 mb-2.5 sm:mb-6 rounded-xl sm:rounded-2xl bg-[#2DD4BF]/15 border border-[#2DD4BF]/30 flex items-center justify-center shadow-[0_0_25px_rgba(45,212,191,0.25)] transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                <Scan className="h-5 w-5 sm:h-8 sm:w-8 text-[#2DD4BF]" />
              </div>

              <div className="inline-block px-2 py-0.5 sm:px-3 sm:py-1 rounded-md bg-[#2DD4BF]/10 text-[#5EEAD4] text-[9px] sm:text-[11px] font-mono font-semibold mb-2 sm:mb-3 border border-[#2DD4BF]/30">
                Spatial Coordinates
              </div>

              <h3 className="text-sm sm:text-2xl font-bold text-white mb-1.5 sm:mb-3 group-hover:text-[#5EEAD4] transition-colors leading-tight">
                Visual Lesion Segmentation
              </h3>

              <p className="text-[11px] sm:text-sm text-foreground/75 leading-relaxed line-clamp-3 sm:line-clamp-none">
                Pixel-accurate disease bounding boxes highlight affected chloroplast tissue with 99.4% precision.
              </p>
            </div>

            <div className="pt-2.5 sm:pt-6 border-t border-white/10 flex items-center justify-between">
              <span className="text-[10px] sm:text-xs font-mono text-white/60 hidden sm:inline">PlantDoc AI</span>
              <Link to="/diagnose" className="flex items-center gap-1 text-[11px] sm:text-xs font-bold text-[#5EEAD4] group-hover:translate-x-1 transition-transform">
                <span>Explore Scanner</span>
                <ArrowUpRight className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              </Link>
            </div>
          </SpotlightCard>

          {/* Card 2: Wikimedia Integration */}
          <SpotlightCard className="p-4 sm:p-8 text-left flex flex-col justify-between min-h-[220px] sm:min-h-[380px] group">
            <div>
              <div className="w-9 h-9 sm:w-16 sm:h-16 mb-2.5 sm:mb-6 rounded-xl sm:rounded-2xl bg-[#2DD4BF]/15 border border-[#2DD4BF]/30 flex items-center justify-center shadow-[0_0_25px_rgba(45,212,191,0.25)] transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                <Globe className="h-5 w-5 sm:h-8 sm:w-8 text-[#2DD4BF]" />
              </div>

              <div className="inline-block px-2 py-0.5 sm:px-3 sm:py-1 rounded-md bg-[#2DD4BF]/10 text-[#5EEAD4] text-[9px] sm:text-[11px] font-mono font-semibold mb-2 sm:mb-3 border border-[#2DD4BF]/30">
                Zero Mock Synthetics
              </div>

              <h3 className="text-sm sm:text-2xl font-bold text-white mb-1.5 sm:mb-3 group-hover:text-[#5EEAD4] transition-colors leading-tight">
                Wikimedia Verified Data
              </h3>

              <p className="text-[11px] sm:text-sm text-foreground/75 leading-relaxed line-clamp-3 sm:line-clamp-none">
                Direct integration with Wikipedia REST APIs delivers authentic cultivation profiles and photography.
              </p>
            </div>

            <div className="pt-2.5 sm:pt-6 border-t border-white/10 flex items-center justify-between">
              <span className="text-[10px] sm:text-xs font-mono text-white/60 hidden sm:inline">Live REST API</span>
              <Link to="/recommend" className="flex items-center gap-1 text-[11px] sm:text-xs font-bold text-[#5EEAD4] group-hover:translate-x-1 transition-transform">
                <span>View Species</span>
                <ArrowUpRight className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              </Link>
            </div>
          </SpotlightCard>

          {/* Card 3: 4-Tier Clinical Matrix */}
          <SpotlightCard className="col-span-2 sm:col-span-1 p-4 sm:p-8 text-left flex flex-col justify-between min-h-[200px] sm:min-h-[380px] group">
            <div>
              <div className="w-9 h-9 sm:w-16 sm:h-16 mb-2.5 sm:mb-6 rounded-xl sm:rounded-2xl bg-[#2DD4BF]/15 border border-[#2DD4BF]/30 flex items-center justify-center shadow-[0_0_25px_rgba(45,212,191,0.25)] transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                <Zap className="h-5 w-5 sm:h-8 sm:w-8 text-[#2DD4BF]" />
              </div>

              <div className="inline-block px-2 py-0.5 sm:px-3 sm:py-1 rounded-md bg-[#2DD4BF]/10 text-[#5EEAD4] text-[9px] sm:text-[11px] font-mono font-semibold mb-2 sm:mb-3 border border-[#2DD4BF]/30">
                Prescriptions & Dosages
              </div>

              <h3 className="text-sm sm:text-2xl font-bold text-white mb-1.5 sm:mb-3 group-hover:text-[#5EEAD4] transition-colors leading-tight">
                Targeted Treatments
              </h3>

              <p className="text-[11px] sm:text-sm text-foreground/75 leading-relaxed line-clamp-3 sm:line-clamp-none">
                Instant emergency actions, bio-organic remedies, chemical fungicide dosages, and NPK fertilizer protocols.
              </p>
            </div>

            <div className="pt-2.5 sm:pt-6 border-t border-white/10 flex items-center justify-between">
              <span className="text-[10px] sm:text-xs font-mono text-white/60 hidden sm:inline">Clinical Protocols</span>
              <Link to="/diagnose" className="flex items-center gap-1 text-[11px] sm:text-xs font-bold text-[#5EEAD4] group-hover:translate-x-1 transition-transform">
                <span>See Remedies</span>
                <ArrowUpRight className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              </Link>
            </div>
          </SpotlightCard>

        </div>
        
        {/* Additional 2 Wide Feature Spotlight Cards (2 in a row on mobile) */}
        <div className="grid grid-cols-2 gap-3 sm:gap-6">
          <SpotlightCard className="p-4 sm:p-7 flex flex-col sm:flex-row items-start text-left group min-h-[170px] sm:min-h-0 justify-between sm:justify-start">
            <div className="w-9 h-9 sm:w-14 sm:h-14 mb-2.5 sm:mb-0 sm:mr-5 bg-[#2DD4BF]/20 border border-[#2DD4BF]/30 rounded-xl sm:rounded-2xl flex items-center justify-center shrink-0 shadow-[0_0_20px_rgba(45,212,191,0.2)] group-hover:rotate-6 transition-transform">
              <ShieldCheck className="h-5 w-5 sm:h-7 sm:w-7 text-[#2DD4BF]" />
            </div>
            <div>
              <h4 className="text-xs sm:text-lg font-bold text-white mb-1 group-hover:text-[#5EEAD4] transition-colors leading-snug">
                Proactive Prevention
              </h4>
              <p className="text-[10px] sm:text-xs text-foreground/75 leading-relaxed line-clamp-3 sm:line-clamp-none">
                Optimal crop spacing and hygiene schedules to halt fungal spore germination before infection starts.
              </p>
            </div>
          </SpotlightCard>

          <SpotlightCard className="p-4 sm:p-7 flex flex-col sm:flex-row items-start text-left group min-h-[170px] sm:min-h-0 justify-between sm:justify-start">
            <div className="w-9 h-9 sm:w-14 sm:h-14 mb-2.5 sm:mb-0 sm:mr-5 bg-[#2DD4BF]/20 border border-[#2DD4BF]/30 rounded-xl sm:rounded-2xl flex items-center justify-center shrink-0 shadow-[0_0_20px_rgba(45,212,191,0.2)] group-hover:rotate-6 transition-transform">
              <Cloud className="h-5 w-5 sm:h-7 sm:w-7 text-[#2DD4BF]" />
            </div>
            <div>
              <h4 className="text-xs sm:text-lg font-bold text-white mb-1 group-hover:text-[#5EEAD4] transition-colors leading-snug">
                Climate Matching
              </h4>
              <p className="text-[10px] sm:text-xs text-foreground/75 leading-relaxed line-clamp-3 sm:line-clamp-none">
                Analyzes regional rainfall, temperature, and soil conditions to recommend 6 thriving botanical species.
              </p>
            </div>
          </SpotlightCard>
        </div>

      </div>
    </section>
  );
};

export default ParallaxSection;
