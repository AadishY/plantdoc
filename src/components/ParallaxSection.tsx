import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Scan, 
  Globe, 
  Zap, 
  ShieldCheck, 
  Cloud, 
  Sparkles, 
  ArrowUpRight,
  Cpu,
  Layers,
  Leaf
} from 'lucide-react';
import SpotlightCard from './SpotlightCard';

export const ParallaxSection: React.FC = () => {
  return (
    <section className="relative py-8 md:py-12 overflow-hidden z-10">
      <div className="container mx-auto px-4 relative max-w-6xl">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#2DD4BF]/20 rounded-full mb-3 border border-[#2DD4BF]/40 shadow-[0_0_25px_rgba(45,212,191,0.35)]">
            <Sparkles className="h-4 w-4 text-[#2DD4BF] animate-spin" style={{ animationDuration: '6s' }} />
            <span className="text-xs font-mono font-bold text-[#5EEAD4]">Next-Generation Botanical AI</span>
          </div>
          
          <h2 className="text-3xl md:text-5xl lg:text-6xl font-extrabold mb-4 tracking-tight">
            Advanced Vision & <br />
            <span className="bg-gradient-to-r from-white via-emerald-100 to-[#2DD4BF] bg-clip-text text-transparent">
              Agronomic Intelligence
            </span>
          </h2>
          
          <p className="text-sm md:text-base text-foreground/80 leading-relaxed">
            Combining dual-engine computer vision segmentation with regional botanical climate modeling and verified Wikimedia taxonomies.
          </p>
        </div>
        
        {/* 3 Core Spotlight Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          
          {/* Card 1: Dual Vision Segmentation */}
          <SpotlightCard className="p-8 text-left flex flex-col justify-between min-h-[380px] group">
            <div>
              <div className="w-16 h-16 mb-6 rounded-2xl bg-[#2DD4BF]/15 border border-[#2DD4BF]/30 flex items-center justify-center shadow-[0_0_25px_rgba(45,212,191,0.25)] transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                <Scan className="h-8 w-8 text-[#2DD4BF]" />
              </div>

              <div className="inline-block px-3 py-1 rounded-md bg-[#2DD4BF]/10 text-[#5EEAD4] text-[11px] font-mono font-semibold mb-3 border border-[#2DD4BF]/30">
                Spatial Coordinates & Masks
              </div>

              <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-[#5EEAD4] transition-colors">
                Visual Lesion Segmentation
              </h3>

              <p className="text-sm text-foreground/75 leading-relaxed">
                Pixel-accurate disease bounding boxes and lesion contours highlight affected chloroplast tissue with 99.4% precision.
              </p>
            </div>

            <div className="pt-6 border-t border-white/10 flex items-center justify-between">
              <span className="text-xs font-mono text-white/60">PlantDoc AI Vision</span>
              <Link to="/diagnose" className="flex items-center gap-1 text-xs font-bold text-[#5EEAD4] group-hover:translate-x-1 transition-transform">
                <span>Explore Scanner</span>
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </div>
          </SpotlightCard>

          {/* Card 2: Wikimedia Integration */}
          <SpotlightCard className="p-8 text-left flex flex-col justify-between min-h-[380px] group">
            <div>
              <div className="w-16 h-16 mb-6 rounded-2xl bg-[#2DD4BF]/15 border border-[#2DD4BF]/30 flex items-center justify-center shadow-[0_0_25px_rgba(45,212,191,0.25)] transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                <Globe className="h-8 w-8 text-[#2DD4BF]" />
              </div>

              <div className="inline-block px-3 py-1 rounded-md bg-[#2DD4BF]/10 text-[#5EEAD4] text-[11px] font-mono font-semibold mb-3 border border-[#2DD4BF]/30">
                Zero Mock Synthetics
              </div>

              <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-[#5EEAD4] transition-colors">
                Wikimedia Verified Data
              </h3>

              <p className="text-sm text-foreground/75 leading-relaxed">
                Direct integration with Wikipedia REST APIs delivers authentic cultivation profiles, companion flora, and real photography.
              </p>
            </div>

            <div className="pt-6 border-t border-white/10 flex items-center justify-between">
              <span className="text-xs font-mono text-white/60">Live REST API</span>
              <Link to="/recommend" className="flex items-center gap-1 text-xs font-bold text-[#5EEAD4] group-hover:translate-x-1 transition-transform">
                <span>View Species</span>
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </div>
          </SpotlightCard>

          {/* Card 3: 4-Tier Clinical Matrix */}
          <SpotlightCard className="p-8 text-left flex flex-col justify-between min-h-[380px] group">
            <div>
              <div className="w-16 h-16 mb-6 rounded-2xl bg-[#2DD4BF]/15 border border-[#2DD4BF]/30 flex items-center justify-center shadow-[0_0_25px_rgba(45,212,191,0.25)] transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                <Zap className="h-8 w-8 text-[#2DD4BF]" />
              </div>

              <div className="inline-block px-3 py-1 rounded-md bg-[#2DD4BF]/10 text-[#5EEAD4] text-[11px] font-mono font-semibold mb-3 border border-[#2DD4BF]/30">
                Prescriptions & Dosages
              </div>

              <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-[#5EEAD4] transition-colors">
                Targeted 4-Tier Treatments
              </h3>

              <p className="text-sm text-foreground/75 leading-relaxed">
                Instant emergency actions, bio-organic remedies, chemical fungicide dosages, and NPK fertilizer recovery protocols.
              </p>
            </div>

            <div className="pt-6 border-t border-white/10 flex items-center justify-between">
              <span className="text-xs font-mono text-white/60">Clinical Protocols</span>
              <Link to="/diagnose" className="flex items-center gap-1 text-xs font-bold text-[#5EEAD4] group-hover:translate-x-1 transition-transform">
                <span>See Remedies</span>
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </div>
          </SpotlightCard>

        </div>
        
        {/* Additional 2 Wide Feature Spotlight Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <SpotlightCard className="p-7 flex items-start text-left group">
            <div className="w-14 h-14 mr-5 bg-[#2DD4BF]/20 border border-[#2DD4BF]/30 rounded-2xl flex items-center justify-center shrink-0 shadow-[0_0_20px_rgba(45,212,191,0.2)] group-hover:rotate-6 transition-transform">
              <ShieldCheck className="h-7 w-7 text-[#2DD4BF]" />
            </div>
            <div>
              <h4 className="text-lg font-bold text-white mb-1.5 group-hover:text-[#5EEAD4] transition-colors">
                Proactive Disease Prevention
              </h4>
              <p className="text-xs text-foreground/75 leading-relaxed">
                Learn optimal crop spacing, hygiene protocols, and early morning irrigation schedules to stop fungal spore germination before infection starts.
              </p>
            </div>
          </SpotlightCard>

          <SpotlightCard className="p-7 flex items-start text-left group">
            <div className="w-14 h-14 mr-5 bg-[#2DD4BF]/20 border border-[#2DD4BF]/30 rounded-2xl flex items-center justify-center shrink-0 shadow-[0_0_20px_rgba(45,212,191,0.2)] group-hover:rotate-6 transition-transform">
              <Cloud className="h-7 w-7 text-[#2DD4BF]" />
            </div>
            <div>
              <h4 className="text-lg font-bold text-white mb-1.5 group-hover:text-[#5EEAD4] transition-colors">
                Climate-Matched Species Selection
              </h4>
              <p className="text-xs text-foreground/75 leading-relaxed">
                PlantDoc AI analyzes your regional rainfall, temperature, and soil NPK conditions to recommend 6 thriving botanical species for your garden.
              </p>
            </div>
          </SpotlightCard>
        </div>

      </div>
    </section>
  );
};

export default ParallaxSection;
