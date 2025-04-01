
import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, Github, Leaf, ExternalLink } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { motion } from "framer-motion";
import TranslateButton from "./TranslateButton";
import { useTranslation } from "@/hooks/useTranslation";

const Header = () => {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const { translate } = useTranslation();

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
      className={`sticky top-0 z-50 w-full backdrop-blur-xl transition-all duration-300 ${
        scrolled 
          ? "bg-black/60 border-b border-white/10 shadow-lg" 
          : "bg-transparent"
      }`}
    >
      <div className="container flex h-16 items-center">
        <div className="mr-4 hidden md:flex">
          <Link to="/" className="mr-6 flex items-center space-x-2 group">
            <span className="relative flex h-8 w-8 items-center justify-center">
              <span className="absolute inline-flex h-full w-full rounded-full bg-plantDoc-primary/20 animate-ping opacity-75 group-hover:opacity-100"></span>
              <Leaf className="h-6 w-6 text-plantDoc-primary relative transform transition-transform duration-300 group-hover:rotate-12" />
            </span>
            <span className="hidden font-bold text-xl sm:inline-block text-gradient group-hover:opacity-80 transition-opacity">
              PlantDoc
            </span>
          </Link>
          <nav className="flex items-center space-x-8 text-sm font-medium">
            <Link
              to="/diagnose"
              className={`transition-all hover:text-plantDoc-primary text-foreground relative group ${
                isActive('/diagnose') ? 'text-plantDoc-primary' : ''
              }`}
            >
              <span className="py-1">{translate('diagnose')}</span>
              <span className={`absolute -bottom-1 left-0 h-0.5 bg-plantDoc-primary transition-all duration-300 ${
                isActive('/diagnose') ? 'w-full' : 'w-0 group-hover:w-full'
              }`}></span>
            </Link>
            <Link
              to="/recommend"
              className={`transition-all hover:text-plantDoc-primary text-foreground relative group ${
                isActive('/recommend') ? 'text-plantDoc-primary' : ''
              }`}
            >
              <span className="py-1">{translate('recommend')}</span>
              <span className={`absolute -bottom-1 left-0 h-0.5 bg-plantDoc-primary transition-all duration-300 ${
                isActive('/recommend') ? 'w-full' : 'w-0 group-hover:w-full'
              }`}></span>
            </Link>
          </nav>
        </div>
        
        {/* Mobile menu */}
        <div className="md:hidden flex items-center">
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="mr-2 backdrop-blur-lg bg-black/20 border-white/10 hover:bg-black/40">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="glass-card border-r border-white/10 w-[240px] sm:w-[300px]">
              <div className="flex flex-col gap-6 mt-6">
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
                <nav className="flex flex-col gap-4">
                  <Link
                    to="/diagnose"
                    className={`text-foreground hover:text-plantDoc-primary transition-all flex items-center p-3 hover:bg-black/40 rounded-md ${
                      isActive('/diagnose') ? 'bg-black/30 text-plantDoc-primary' : ''
                    }`}
                    onClick={() => setOpen(false)}
                  >
                    <span>{translate('diagnose')}</span>
                  </Link>
                  <Link
                    to="/recommend"
                    className={`text-foreground hover:text-plantDoc-primary transition-all flex items-center p-3 hover:bg-black/40 rounded-md ${
                      isActive('/recommend') ? 'bg-black/30 text-plantDoc-primary' : ''
                    }`}
                    onClick={() => setOpen(false)}
                  >
                    <span>{translate('recommend')}</span>
                  </Link>
                </nav>
              </div>
            </SheetContent>
          </Sheet>
          
          <Link to="/" className="flex items-center space-x-2 group">
            <span className="relative flex h-7 w-7 items-center justify-center">
              <span className="absolute inline-flex h-full w-full rounded-full bg-plantDoc-primary/20 animate-ping opacity-75 group-hover:opacity-100"></span>
              <Leaf className="h-5 w-5 text-plantDoc-primary relative" />
            </span>
            <span className="font-bold text-gradient">PlantDoc</span>
          </Link>
        </div>
        
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <div className="w-full flex-1 md:w-auto md:flex-none">
            {/* Any additional controls can go here */}
          </div>
          
          {/* Translate button */}
          <div className="mr-2">
            <TranslateButton />
          </div>
          
          <a 
            href="https://github.com/AadishY/plantdoc" 
            target="_blank" 
            rel="noopener noreferrer"
            className="group text-foreground hover:text-plantDoc-primary transition-all duration-200 flex items-center glass-card p-2 rounded-full hover:scale-105"
          >
            <Github className="h-5 w-5 group-hover:rotate-12 transition-transform duration-300" />
            <span className="ml-2 hidden md:inline group-hover:underline">GitHub</span>
            <ExternalLink className="ml-1 h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
          </a>
        </div>
      </div>
    </header>
  );
};

export default Header;
