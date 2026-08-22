import React from "react";
import { Link } from "react-router-dom";
import { Leaf, Heart, Github, Instagram, Scan, Wand2 } from "lucide-react";

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative z-10 w-full px-3 sm:px-8 md:px-12 pb-6 sm:pb-10 pt-4 sm:pt-6 mt-8 sm:mt-16 pointer-events-auto">
      {/* 💧 Floating Liquid Glass Container */}
      <div className="relative mx-auto max-w-7xl rounded-2xl sm:rounded-3xl p-4 sm:p-12 md:p-14 overflow-hidden bg-gradient-to-b from-white/[0.08] via-black/45 to-black/75 backdrop-blur-3xl border border-white/20 shadow-[0_25px_60px_rgba(0,0,0,0.8),inset_0_1px_1.5px_rgba(255,255,255,0.3),inset_0_-1px_1.5px_rgba(0,0,0,0.7)] transition-all duration-500 hover:border-white/30">
        
        {/* 🌊 Ambient Fluid Mesh Glow */}
        <div className="absolute -top-32 -left-32 w-80 h-80 rounded-full bg-[#2DD4BF]/15 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-32 -right-32 w-80 h-80 rounded-full bg-[#059669]/15 blur-3xl pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 md:grid-cols-4 gap-6 sm:gap-10 mb-4 sm:mb-12">
          
          {/* Brand Col & Mobile Top Header */}
          <div className="md:col-span-2 space-y-3 sm:space-y-4">
            <div className="flex items-center justify-between">
              <Link to="/" className="flex items-center space-x-2.5 sm:space-x-3 group w-fit cursor-pointer">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl bg-white/[0.08] backdrop-blur-xl border border-[#2DD4BF]/50 group-hover:border-[#5EEAD4] flex items-center justify-center shadow-[0_0_15px_rgba(45,212,191,0.35)] transition-all duration-300">
                  <Leaf className="h-4 sm:h-5 w-4 sm:w-5 text-[#2DD4BF] group-hover:rotate-12 transition-transform duration-300" />
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="font-extrabold text-lg sm:text-2xl tracking-tight bg-gradient-to-r from-white via-emerald-100 to-[#2DD4BF] bg-clip-text text-transparent">
                    PlantDoc
                  </span>
                  <span className="text-[9px] sm:text-[10px] px-1.5 py-0.2 rounded-md bg-[#2DD4BF]/20 text-[#5EEAD4] font-mono font-bold tracking-wider border border-[#2DD4BF]/40">
                    AI
                  </span>
                </div>
              </Link>

              {/* Mobile-Only Social Icons Inline */}
              <div className="flex md:hidden items-center gap-2">
                <a
                  href="https://github.com/AadishY/plantdoc"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-xl bg-white/[0.06] hover:bg-white/[0.15] text-white border border-white/15 transition-all shadow-[inset_0_1px_0_0_rgba(255,255,255,0.1)]"
                  title="GitHub"
                >
                  <Github className="h-3.5 w-3.5" />
                </a>
                <a
                  href="https://instagram.com/yo.akatsuki"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-xl bg-[#2DD4BF]/15 text-[#5EEAD4] border border-[#2DD4BF]/40 transition-all"
                  title="Instagram"
                >
                  <Instagram className="h-3.5 w-3.5" />
                </a>
              </div>
            </div>
            
            <p className="text-foreground/75 text-xs sm:text-sm max-w-md leading-relaxed hidden sm:block">
              Clinical-grade foliar disease identification, spatial lesion segmentation, and climate-matched botanical recommendation engine powered by dual-model vision transformers.
            </p>

            {/* Live Operational Status Pill (Desktop Only) */}
            <div className="hidden sm:inline-flex items-center gap-2 px-4 py-2 rounded-full bg-black/40 border border-white/15 text-xs font-mono text-foreground/90 backdrop-blur-2xl shadow-[inset_0_1px_0_0_rgba(255,255,255,0.1)]">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#2DD4BF] opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#2DD4BF]" />
              </span>
              <span className="text-[#5EEAD4]">Vision Intelligence Core 100% Online</span>
            </div>
          </div>

          {/* Quick Links (Compact 2-col on mobile) */}
          <div className="space-y-2 sm:space-y-3">
            <h3 className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-white flex items-center gap-1.5">
              <Scan className="h-3 sm:h-3.5 w-3 sm:w-3.5 text-[#2DD4BF]" />
              Navigation
            </h3>
            <ul className="grid grid-cols-2 md:grid-cols-1 gap-1.5 sm:gap-2.5 text-[11px] sm:text-xs">
              <li>
                <Link to="/" className="text-foreground/70 hover:text-[#5EEAD4] transition-colors flex items-center gap-1">
                  <span>Home</span>
                </Link>
              </li>
              <li>
                <Link to="/diagnose" className="text-foreground/70 hover:text-[#5EEAD4] transition-colors flex items-center gap-1">
                  <span>Diagnosis</span>
                </Link>
              </li>
              <li>
                <Link to="/recommend" className="text-foreground/70 hover:text-[#5EEAD4] transition-colors flex items-center gap-1">
                  <span>Recommendations</span>
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-foreground/70 hover:text-[#5EEAD4] transition-colors flex items-center gap-1">
                  <span>About Engine</span>
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Creator & Socials (Desktop Only Column) */}
          <div className="hidden md:block space-y-3">
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
        <div className="relative z-10 pt-3 sm:pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-1.5 sm:gap-3 text-[10px] sm:text-[11px] text-foreground/60 text-center sm:text-left">
          <p>&copy; {currentYear} PlantDoc AI • By Aadish Kumar Yadav</p>
          <p className="font-mono text-[#5EEAD4]/90 flex items-center justify-center gap-1.5 text-[9px] sm:text-[11px]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#2DD4BF]" />
            Verified Wikimedia REST API
          </p>
        </div>
      </div>
    </footer>
  );
};

export default React.memo(Footer);
