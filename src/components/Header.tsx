import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { 
  Github, 
  Home, 
  Scan, 
  Sparkles, 
  Info 
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { preloadRoute } from "@/utils/routePreloader";

const NAV_ITEMS = [
  { path: "/", label: "Home", shortLabel: "Home", icon: Home },
  { path: "/diagnose", label: "Disease Diagnosis", shortLabel: "Diagnose", icon: Scan },
  { path: "/recommend", label: "Recommendations", shortLabel: "Recommend", icon: Sparkles },
  { path: "/about", label: "About", shortLabel: "About", icon: Info },
];

interface HeaderProps {
  sticky?: boolean;
}

const Header: React.FC<HeaderProps> = ({ sticky = true }) => {
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 15;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [scrolled]);

  const isActive = (path: string) => location.pathname === path;

  return (
    <>
      {/* 💎 Seamless Frosted Glassmorphism Header Bar */}
      <header
        className={cn(
          "w-full h-14 sm:h-16 md:h-20 flex items-center justify-center transition-all duration-300 backdrop-blur-2xl px-3 sm:px-6 md:px-8",
          sticky ? "sticky top-0 z-50" : "relative z-30",
          scrolled
            ? "bg-[#060c08]/85 border-b border-white/10 shadow-[0_12px_40px_rgba(0,0,0,0.65)]"
            : "bg-black/30 border-b border-transparent shadow-[0_8px_32px_0_rgba(0,0,0,0.15)]"
        )}
      >
        <div className="container mx-auto flex h-full items-center justify-center relative">
          
          {/* 🌐 Center Frosted Glass Capsule Navigation Bar */}
          <nav 
            className="flex items-center p-1 sm:p-1.5 rounded-full bg-white/[0.07] backdrop-blur-2xl border border-white/15 shadow-[0_4px_24px_rgba(0,0,0,0.4),inset_0_1px_0_0_rgba(255,255,255,0.15)] gap-0.5 sm:gap-1 md:gap-1.5 select-none"
            aria-label="Main Navigation"
          >
            {NAV_ITEMS.map((item) => {
              const active = isActive(item.path);
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onMouseEnter={() => preloadRoute(item.path)}
                  onTouchStart={() => preloadRoute(item.path)}
                  className={cn(
                    "relative px-2.5 sm:px-4 md:px-6 py-1.5 sm:py-2 md:py-2.5 text-[11px] sm:text-xs md:text-sm font-medium rounded-full transition-all duration-200 text-center flex items-center justify-center whitespace-nowrap z-10",
                    active
                      ? "text-black font-extrabold"
                      : "text-white/75 hover:text-white hover:bg-white/10"
                  )}
                >
                  {active && (
                    <motion.div
                      layoutId="headerPill"
                      className="absolute inset-0 bg-gradient-to-r from-[#2DD4BF] to-[#10B981] rounded-full shadow-[0_0_18px_rgba(45,212,191,0.55)] -z-10"
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    />
                  )}
                  {/* Shows 'About' directly */}
                  <span className="hidden md:inline">{item.label}</span>
                  <span className="md:hidden">{item.shortLabel}</span>
                </Link>
              );
            })}

            {/* 🐙 Merged GitHub Button (Inside the header capsule for MOBILE ONLY) */}
            <a
              href="https://github.com/AadishY/plantdoc"
              target="_blank"
              rel="noopener noreferrer"
              className="md:hidden relative p-1.5 sm:p-2 text-[11px] sm:text-xs font-medium rounded-full text-white/75 hover:text-white hover:bg-white/10 transition-all flex items-center justify-center gap-1.5 shrink-0 ml-0.5"
              title="View on GitHub"
              aria-label="View on GitHub"
            >
              <Github className="h-3.5 sm:h-4 w-3.5 sm:w-4 text-white/90" />
            </a>
          </nav>

          {/* 🐙 Right-most GitHub Button (PC ONLY) */}
          <div className="hidden md:flex absolute right-0 items-center">
            <a
              href="https://github.com/AadishY/plantdoc"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 md:px-5 py-2 md:py-2.5 rounded-full bg-white/[0.06] hover:bg-white/[0.14] text-white/85 hover:text-white transition-all text-xs md:text-sm font-medium border border-white/15 hover:border-[#2DD4BF]/50 shadow-sm hover:scale-105 active:scale-95"
              title="View on GitHub"
            >
              <Github className="h-4 w-4" />
              <span>GitHub</span>
            </a>
          </div>

        </div>
      </header>
    </>
  );
};

export default React.memo(Header);
