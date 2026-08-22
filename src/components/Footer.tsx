import React from "react";
import { Link } from "react-router-dom";
import { Leaf, Heart, Github, Instagram, Scan, Wand2, BookOpen } from "lucide-react";

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative z-10 w-full px-4 sm:px-8 md:px-12 pb-10 pt-6 mt-16 pointer-events-auto">
      {/* 💧 Floating Liquid Glass Container */}
      <div className="relative mx-auto max-w-7xl rounded-3xl p-8 sm:p-12 md:p-14 overflow-hidden bg-gradient-to-b from-white/[0.08] via-black/45 to-black/75 backdrop-blur-3xl border border-white/20 shadow-[0_25px_60px_rgba(0,0,0,0.8),inset_0_1px_1.5px_rgba(255,255,255,0.3),inset_0_-1px_1.5px_rgba(0,0,0,0.7)] transition-all duration-500 hover:border-white/30">
        
        {/* 🌊 Liquid Glass Refraction & Ambient Fluid Mesh Glow */}
        <div className="absolute -top-32 -left-32 w-80 h-80 rounded-full bg-[#2DD4BF]/15 blur-3xl pointer-events-none animate-pulse" />
        <div className="absolute -bottom-32 -right-32 w-80 h-80 rounded-full bg-[#059669]/15 blur-3xl pointer-events-none" />
        <div className="absolute top-1/2 left-1/3 w-64 h-64 rounded-full bg-emerald-400/10 blur-3xl pointer-events-none" />
        
        {/* Subtle Liquid Surface Sheen */}
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/[0.02] to-white/[0.06] pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          
          {/* Brand Col */}
          <div className="md:col-span-2 space-y-4">
            <Link to="/" className="flex items-center space-x-3 group w-fit cursor-pointer">
              <div className="relative flex h-10 w-10 items-center justify-center">
                <span className="absolute inline-flex h-full w-full rounded-2xl bg-[#2DD4BF]/25 animate-ping opacity-40" />
                <div className="w-10 h-10 rounded-2xl bg-white/[0.08] backdrop-blur-xl border border-[#2DD4BF]/50 group-hover:border-[#5EEAD4] flex items-center justify-center shadow-[0_0_20px_rgba(45,212,191,0.35),inset_0_1px_1px_rgba(255,255,255,0.3)] group-hover:shadow-[0_0_30px_rgba(45,212,191,0.6)] transition-all duration-300">
                  <Leaf className="h-5 w-5 text-[#2DD4BF] group-hover:rotate-12 transition-transform duration-300" />
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-2xl tracking-tight bg-gradient-to-r from-white via-emerald-100 to-[#2DD4BF] bg-clip-text text-transparent">
                  PlantDoc
                </span>
                <span className="text-[10px] px-1.5 py-0.2 rounded-md bg-[#2DD4BF]/20 text-[#5EEAD4] font-mono font-bold tracking-wider border border-[#2DD4BF]/40">
                  AI
                </span>
              </div>
            </Link>
            
            <p className="text-foreground/75 text-xs sm:text-sm max-w-md leading-relaxed">
              Clinical-grade foliar disease identification, spatial lesion segmentation, and climate-matched botanical recommendation engine powered by dual-model vision transformers.
            </p>

            {/* Live Operational Status Pill */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-black/40 border border-white/15 text-xs font-mono text-foreground/90 backdrop-blur-2xl shadow-[inset_0_1px_0_0_rgba(255,255,255,0.1)]">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#2DD4BF] opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#2DD4BF]" />
              </span>
              <span className="text-[#5EEAD4]">Vision Intelligence Core 100% Online</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-1.5">
              <Scan className="h-3.5 w-3.5 text-[#2DD4BF]" />
              Platform
            </h3>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link to="/" className="text-foreground/70 hover:text-[#5EEAD4] transition-colors flex items-center gap-1.5 group">
                  <span className="w-1 h-1 rounded-full bg-[#2DD4BF] opacity-0 group-hover:opacity-100 transition-opacity" />
                  Home Overview
                </Link>
              </li>
              <li>
                <Link to="/diagnose" className="text-foreground/70 hover:text-[#5EEAD4] transition-colors flex items-center gap-1.5 group">
                  <span className="w-1 h-1 rounded-full bg-[#2DD4BF] opacity-0 group-hover:opacity-100 transition-opacity" />
                  Disease Scanner
                </Link>
              </li>
              <li>
                <Link to="/recommend" className="text-foreground/70 hover:text-[#5EEAD4] transition-colors flex items-center gap-1.5 group">
                  <span className="w-1 h-1 rounded-full bg-[#2DD4BF] opacity-0 group-hover:opacity-100 transition-opacity" />
                  Plant Recommendations
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-foreground/70 hover:text-[#5EEAD4] transition-colors flex items-center gap-1.5 group">
                  <span className="w-1 h-1 rounded-full bg-[#2DD4BF] opacity-0 group-hover:opacity-100 transition-opacity" />
                  Creator & Architecture
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Creator & Socials */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-1.5">
              <Wand2 className="h-3.5 w-3.5 text-[#2DD4BF]" />
              Connect & Source
            </h3>
            <div className="flex space-x-3">
              <a
                href="https://github.com/AadishY/plantdoc"
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 rounded-2xl bg-white/[0.06] hover:bg-white/[0.15] text-white border border-white/15 transition-all hover:scale-105 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.1)]"
                title="GitHub Repository"
              >
                <Github className="h-4 w-4" />
              </a>
              <a
                href="https://instagram.com/yo.akatsuki"
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 rounded-2xl bg-[#2DD4BF]/15 hover:bg-[#2DD4BF]/30 text-[#5EEAD4] border border-[#2DD4BF]/40 transition-all hover:scale-105 shadow-[0_0_15px_rgba(45,212,191,0.2)]"
                title="Instagram Profile"
              >
                <Instagram className="h-4 w-4" />
              </a>
            </div>
            
            <p className="text-foreground/60 text-xs flex items-center pt-2 font-medium">
              Crafted with <Heart className="h-3.5 w-3.5 text-red-400 mx-1.5 animate-pulse" /> by Aadish Kumar Yadav
            </p>
          </div>
        </div>

        {/* Bottom copyright line */}
        <div className="relative z-10 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-foreground/60">
          <p>&copy; {currentYear} PlantDoc AI. Open botanical intelligence for sustainable cultivation.</p>
          <p className="font-mono text-[#5EEAD4]/90 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#2DD4BF]" />
            Zero Mock Data • Verified Wikimedia REST API
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
