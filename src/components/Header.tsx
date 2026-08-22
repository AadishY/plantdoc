import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Github } from "lucide-react";
import { cn } from "@/lib/utils";
import ScrollProgressBar from "./ScrollProgressBar";

const Header: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 20;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [scrolled]);

  const isActive = (path: string) => location.pathname === path;

  return (
    <>
      <ScrollProgressBar />
      {/* 💎 Seamless Glassmorphism Header Bar (Clean Minimal Layout) */}
      <header 
        className={cn(
          "sticky top-0 z-50 w-full h-16 flex items-center transition-all duration-300 backdrop-blur-3xl border-none",
          scrolled 
            ? "bg-[#060c08]/85 shadow-[0_12px_40px_rgba(0,0,0,0.7)]" 
            : "bg-black/30 shadow-[0_8px_32px_0_rgba(0,0,0,0.3)]"
        )}
      >
        <div className="container mx-auto flex h-full items-center justify-between px-3 sm:px-8">
          
          {/* Left spacing balance on desktop (keeps desktop layout 100% centered) */}
          <div className="hidden md:flex w-24" />

          {/* 🌐 Desktop Center Frosted Glass Capsule Navigation Bar */}
          <nav className="hidden md:flex items-center p-1.5 rounded-full bg-white/[0.06] backdrop-blur-2xl border border-white/15 shadow-[0_4px_24px_rgba(0,0,0,0.35),inset_0_1px_0_0_rgba(255,255,255,0.15)]">
            <NavLink to="/" label="Home" isActive={isActive('/')} />
            <NavLink to="/diagnose" label="Disease Diagnosis" isActive={isActive('/diagnose')} />
            <NavLink to="/recommend" label="Recommendations" isActive={isActive('/recommend')} />
            <NavLink to="/about" label="About" isActive={isActive('/about')} />
          </nav>
          
          {/* 📱 Mobile Unified Center Capsule (Navigation + GitHub in one centered bar) */}
          <div className="flex md:hidden items-center justify-center w-full">
            <nav className="flex items-center p-1 rounded-full bg-black/55 backdrop-blur-2xl border border-white/15 shadow-[0_4px_24px_rgba(0,0,0,0.6)] gap-0.5 sm:gap-1">
              <Link 
                to="/" 
                className={cn(
                  "px-2.5 sm:px-3 py-1.5 rounded-full text-[11px] font-semibold transition-all select-none",
                  isActive('/') 
                    ? "bg-gradient-to-r from-[#2DD4BF] to-[#10B981] text-black font-bold shadow-[0_0_15px_rgba(45,212,191,0.5)]" 
                    : "text-white/75 hover:text-white"
                )}
              >
                Home
              </Link>
              <Link 
                to="/diagnose" 
                className={cn(
                  "px-2.5 sm:px-3 py-1.5 rounded-full text-[11px] font-semibold transition-all select-none",
                  isActive('/diagnose') 
                    ? "bg-gradient-to-r from-[#2DD4BF] to-[#10B981] text-black font-bold shadow-[0_0_15px_rgba(45,212,191,0.5)]" 
                    : "text-white/75 hover:text-white"
                )}
              >
                Diagnose
              </Link>
              <Link 
                to="/recommend" 
                className={cn(
                  "px-2.5 sm:px-3 py-1.5 rounded-full text-[11px] font-semibold transition-all select-none",
                  isActive('/recommend') 
                    ? "bg-gradient-to-r from-[#2DD4BF] to-[#10B981] text-black font-bold shadow-[0_0_15px_rgba(45,212,191,0.5)]" 
                    : "text-white/75 hover:text-white"
                )}
              >
                Recommend
              </Link>
              <Link 
                to="/about" 
                className={cn(
                  "px-2.5 sm:px-3 py-1.5 rounded-full text-[11px] font-semibold transition-all select-none",
                  isActive('/about') 
                    ? "bg-gradient-to-r from-[#2DD4BF] to-[#10B981] text-black font-bold shadow-[0_0_15px_rgba(45,212,191,0.5)]" 
                    : "text-white/75 hover:text-white"
                )}
              >
                About
              </Link>

              {/* Integrated Centered GitHub Icon Link */}
              <div className="w-[1px] h-3.5 bg-white/15 mx-0.5" />
              <a 
                href="https://github.com/AadishY/plantdoc" 
                target="_blank" 
                rel="noopener noreferrer"
                className="p-1.5 rounded-full text-white/70 hover:text-white hover:bg-white/10 transition-colors flex items-center justify-center"
                title="View on GitHub"
              >
                <Github className="h-3.5 w-3.5" />
              </a>
            </nav>
          </div>

          {/* ⚡ Desktop Right Side Actions */}
          <div className="hidden md:flex items-center gap-3 justify-end">
            <a 
              href="https://github.com/AadishY/plantdoc" 
              target="_blank" 
              rel="noopener noreferrer"
              className="group flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/[0.06] hover:bg-white/[0.14] text-white/90 hover:text-white transition-all text-xs font-medium border border-white/15 hover:border-[#2DD4BF]/50 shadow-[0_2px_12px_rgba(0,0,0,0.2),inset_0_1px_0_0_rgba(255,255,255,0.1)]"
              title="View PlantDoc repository on GitHub"
            >
              <Github className="h-3.5 w-3.5 group-hover:rotate-12 transition-transform duration-300" />
              <span>GitHub</span>
            </a>
          </div>

        </div>
      </header>
    </>
  );
};

interface NavLinkProps {
  to: string;
  label: string;
  isActive: boolean;
}

const NavLink: React.FC<NavLinkProps> = ({ to, label, isActive }) => (
  <Link
    to={to}
    className={cn(
      "px-5 py-2 text-xs font-medium rounded-full transition-all duration-300 select-none whitespace-nowrap",
      isActive
        ? "bg-gradient-to-r from-[#2DD4BF] to-[#10B981] text-black font-bold shadow-[0_0_20px_rgba(45,212,191,0.6)]"
        : "text-white/75 hover:text-white hover:bg-white/10"
    )}
  >
    {label}
  </Link>
);

export default React.memo(Header);
