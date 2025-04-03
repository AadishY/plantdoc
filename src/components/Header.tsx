
import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, Github, Leaf, ExternalLink, Sun, Moon } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { motion, AnimatePresence } from "framer-motion";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

const Header = () => {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const isMobile = useIsMobile();

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [scrolled]);

  const isActive = (path: string) => location.pathname === path;

  return (
    <header 
      className={cn(
        "sticky top-0 z-50 w-full backdrop-blur-xl transition-all duration-300",
        scrolled 
          ? "bg-black/60 border-b border-white/10 shadow-lg" 
          : "bg-transparent"
      )}
    >
      <div className="container flex h-16 items-center justify-between px-4 sm:px-6">
        {/* Logo - shown always */}
        <Link to="/" className="flex items-center space-x-2 group">
          <div className="relative flex h-8 w-8 items-center justify-center">
            <motion.span 
              className="absolute inline-flex h-full w-full rounded-full bg-plantDoc-primary/20"
              animate={{ 
                scale: [1, 1.2, 1],
                opacity: [0.7, 0.5, 0.7]
              }}
              transition={{ 
                duration: 3,
                repeat: Infinity,
                repeatType: "reverse"
              }}
            />
            <Leaf className="h-6 w-6 text-plantDoc-primary relative transform transition-transform duration-300 group-hover:rotate-12" />
          </div>
          <motion.span 
            initial={{ opacity: 0, x: -5 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="hidden font-bold text-xl sm:inline-block text-gradient group-hover:opacity-80 transition-opacity"
          >
            PlantDoc
          </motion.span>
        </Link>

        {/* Desktop navigation - hidden on mobile */}
        <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
          <NavLink to="/" label="Home" isActive={isActive('/')} />
          <NavLink to="/diagnose" label="Diagnose" isActive={isActive('/diagnose')} />
          <NavLink to="/recommend" label="Plant Recommendations" isActive={isActive('/recommend')} />
          <NavLink to="/about" label="About" isActive={isActive('/about')} />
        </nav>
        
        {/* Right side elements */}
        <div className="flex items-center gap-3">
          {/* GitHub link */}
          <a 
            href="https://github.com/AadishY/plantdoc" 
            target="_blank" 
            rel="noopener noreferrer"
            className="hidden sm:flex group text-foreground hover:text-plantDoc-primary transition-all duration-200 items-center glass-card p-2 rounded-full hover:scale-105"
          >
            <Github className="h-5 w-5 group-hover:rotate-12 transition-transform duration-300" />
            <span className="ml-2 hidden lg:inline group-hover:underline">GitHub</span>
            <ExternalLink className="ml-1 h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity hidden lg:inline" />
          </a>

          {/* Mobile menu button - only on mobile */}
          <div className="md:hidden">
            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger asChild>
                <Button 
                  variant="outline" 
                  size="icon-sm" 
                  className="glass-button"
                >
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="glass-card-intense border-l border-white/10 sm:max-w-sm">
                <div className="flex flex-col gap-8 mt-8">
                  <Link 
                    to="/" 
                    className="text-lg font-bold flex items-center hover-scale"
                    onClick={() => setOpen(false)}
                  >
                    <span className="relative flex h-8 w-8 items-center justify-center mr-2">
                      <span className="absolute inline-flex h-full w-full rounded-full bg-plantDoc-primary/20 animate-ping opacity-75"></span>
                      <Leaf className="h-5 w-5 text-plantDoc-primary relative" />
                    </span>
                    <span className="text-gradient">PlantDoc</span>
                  </Link>
                  
                  <nav className="flex flex-col gap-1">
                    <MobileNavLink 
                      to="/" 
                      label="Home" 
                      isActive={isActive('/')} 
                      onClick={() => setOpen(false)} 
                    />
                    <MobileNavLink 
                      to="/diagnose" 
                      label="Diagnose" 
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
                      label="About" 
                      isActive={isActive('/about')} 
                      onClick={() => setOpen(false)} 
                    />
                  </nav>
                  
                  <div className="mt-auto">
                    <a 
                      href="https://github.com/AadishY/plantdoc" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 p-3 rounded-md glass-card hover:bg-black/40 transition-colors"
                    >
                      <Github className="h-5 w-5" />
                      <span>GitHub Repository</span>
                      <ExternalLink className="h-3 w-3 ml-auto" />
                    </a>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
};

interface NavLinkProps {
  to: string;
  label: string;
  isActive: boolean;
}

const NavLink = ({ to, label, isActive }: NavLinkProps) => (
  <Link
    to={to}
    className={`transition-all hover:text-plantDoc-primary text-foreground relative group ${
      isActive ? 'text-plantDoc-primary' : ''
    }`}
  >
    <motion.span 
      className="py-1"
      whileHover={{ x: 2 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      {label}
    </motion.span>
    <span className={`absolute -bottom-1 left-0 h-0.5 bg-plantDoc-primary transition-all duration-300 ${
      isActive ? 'w-full' : 'w-0 group-hover:w-full'
    }`}></span>
  </Link>
);

interface MobileNavLinkProps extends NavLinkProps {
  onClick: () => void;
}

const MobileNavLink = ({ to, label, isActive, onClick }: MobileNavLinkProps) => (
  <Link
    to={to}
    className={cn(
      "text-foreground hover:text-plantDoc-primary transition-all flex items-center p-3 hover:bg-black/40 rounded-md group",
      isActive ? 'bg-black/30 text-plantDoc-primary' : ''
    )}
    onClick={onClick}
  >
    <motion.span 
      whileHover={{ x: 3 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      {label}
    </motion.span>
    {isActive && <motion.span 
      className="h-1 w-1 rounded-full bg-plantDoc-primary ml-2"
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    />}
  </Link>
);

export default Header;
