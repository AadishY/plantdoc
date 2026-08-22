import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, Github, ChevronRight } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import ScrollProgressBar from "./ScrollProgressBar";

const Header = () => {
  const [open, setOpen] = useState(false);
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
            ? "bg-[#060c08]/75 shadow-[0_12px_40px_rgba(0,0,0,0.7)]" 
            : "bg-black/25 shadow-[0_8px_32px_0_rgba(0,0,0,0.3)]"
        )}
      >
        <div className="container mx-auto flex h-full items-center justify-between px-4 sm:px-8">
          
          {/* Left spacing balance on desktop */}
          <div className="hidden md:flex w-24" />

          {/* 🌐 Center Frosted Glass Capsule Navigation Bar */}
          <nav className="hidden md:flex items-center p-1.5 rounded-full bg-white/[0.06] backdrop-blur-2xl border border-white/15 shadow-[0_4px_24px_rgba(0,0,0,0.35),inset_0_1px_0_0_rgba(255,255,255,0.15)]">
            <NavLink to="/" label="Home" isActive={isActive('/')} />
            <NavLink to="/diagnose" label="Disease Diagnosis" isActive={isActive('/diagnose')} />
            <NavLink to="/recommend" label="Recommendations" isActive={isActive('/recommend')} />
            <NavLink to="/about" label="About" isActive={isActive('/about')} />
          </nav>
          
          {/* ⚡ Right Side Actions */}
          <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end">
            <div className="md:hidden" />
            
            {/* GitHub Link */}
            <a 
              href="https://github.com/AadishY/plantdoc" 
              target="_blank" 
              rel="noopener noreferrer"
              className="group hidden sm:flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/[0.06] hover:bg-white/[0.14] text-white/90 hover:text-white transition-all text-xs font-medium border border-white/15 hover:border-[#2DD4BF]/50 shadow-[0_2px_12px_rgba(0,0,0,0.2),inset_0_1px_0_0_rgba(255,255,255,0.1)]"
              title="View PlantDoc repository on GitHub"
            >
              <Github className="h-3.5 w-3.5 group-hover:rotate-12 transition-transform duration-300" />
              <span>GitHub</span>
            </a>

            {/* Mobile Navigation Trigger */}
            <div className="md:hidden">
              <Sheet open={open} onOpenChange={setOpen}>
                <SheetTrigger asChild>
                  <Button 
                    variant="outline" 
                    size="icon" 
                    className="h-9 w-9 rounded-xl bg-white/[0.06] backdrop-blur-xl border-white/15 text-white hover:bg-white/15 shadow-md"
                    aria-label="Open menu"
                  >
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="bg-[#08100a]/90 backdrop-blur-3xl border-l border-white/15 sm:max-w-sm shadow-[0_0_50px_rgba(0,0,0,0.8)]">
                  <div className="flex flex-col gap-6 mt-6">
                    <nav className="flex flex-col gap-2">
                      <MobileNavLink 
                        to="/" 
                        label="Home" 
                        isActive={isActive('/')} 
                        onClick={() => setOpen(false)} 
                      />
                      <MobileNavLink 
                        to="/diagnose" 
                        label="Plant Disease Diagnosis" 
                        isActive={isActive('/diagnose')} 
                        onClick={() => setOpen(false)} 
                      />
                      <MobileNavLink 
                        to="/recommend" 
                        label="Plant Recommendations" 
                        isActive={isActive('/recommend')} 
                        onClick={() => setOpen(false)} 
                      />
                      <MobileNavLink 
                        to="/about" 
                        label="About Engine & Architecture" 
                        isActive={isActive('/about')} 
                        onClick={() => setOpen(false)} 
                      />
                    </nav>

                    <div className="pt-4 border-t border-white/10 flex flex-col gap-3">
                      <a 
                        href="https://github.com/AadishY/plantdoc" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-semibold text-white border border-white/15 transition-colors"
                      >
                        <Github className="h-4 w-4" />
                        <span>View on GitHub</span>
                      </a>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
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

const NavLink: React.FC<NavLinkProps> = ({ to, label, isActive }) => {
  return (
    <Link 
      to={to} 
      className={cn(
        "relative px-4 py-1.5 rounded-full text-xs lg:text-sm font-medium transition-all duration-300",
        isActive 
          ? "bg-gradient-to-r from-[#2DD4BF]/30 to-[#10B981]/25 text-[#5EEAD4] border border-[#2DD4BF]/50 shadow-[0_0_15px_rgba(45,212,191,0.3)] font-semibold" 
          : "text-foreground/75 hover:text-white hover:bg-white/10"
      )}
    >
      {label}
    </Link>
  );
};

interface MobileNavLinkProps extends NavLinkProps {
  onClick: () => void;
}

const MobileNavLink: React.FC<MobileNavLinkProps> = ({ to, label, isActive, onClick }) => {
  return (
    <Link 
      to={to} 
      onClick={onClick}
      className={cn(
        "flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-colors",
        isActive 
          ? "bg-[#2DD4BF]/20 text-[#5EEAD4] border border-[#2DD4BF]/40 font-bold" 
          : "text-foreground/80 hover:text-white hover:bg-white/5"
      )}
    >
      <span>{label}</span>
      <ChevronRight className="h-4 w-4 opacity-50" />
    </Link>
  );
};

export default React.memo(Header);
