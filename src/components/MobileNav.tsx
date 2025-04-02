
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Leaf, Search, Menu, X, Info, Github, Sun, Moon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useTheme } from '@/components/ThemeProvider';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

interface MobileNavProps {
  className?: string;
}

const MobileNav: React.FC<MobileNavProps> = ({ className }) => {
  const location = useLocation();
  const { theme, setTheme } = useTheme();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  const isActive = (path: string) => location.pathname === path;
  
  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };
  
  return (
    <>
      <motion.div 
        className={cn(
          "bottom-nav shadow-xl md:hidden",
          className
        )}
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        <Link 
          to="/" 
          className={cn(
            "bottom-nav-item relative",
            isActive('/') && "text-plantDoc-primary"
          )}
        >
          {isActive('/') && (
            <motion.span 
              layoutId="navIndicator"
              className="absolute top-0 h-0.5 w-6 bg-plantDoc-primary rounded-full"
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            />
          )}
          <Home size={24} />
          <span className="text-xs">Home</span>
        </Link>
        
        <Link 
          to="/diagnose" 
          className={cn(
            "bottom-nav-item relative",
            isActive('/diagnose') && "text-plantDoc-primary"
          )}
        >
          {isActive('/diagnose') && (
            <motion.span 
              layoutId="navIndicator"
              className="absolute top-0 h-0.5 w-6 bg-plantDoc-primary rounded-full" 
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            />
          )}
          <Leaf size={24} />
          <span className="text-xs">Diagnose</span>
        </Link>
        
        <Link 
          to="/recommend" 
          className={cn(
            "bottom-nav-item relative",
            isActive('/recommend') && "text-plantDoc-primary"
          )}
        >
          {isActive('/recommend') && (
            <motion.span 
              layoutId="navIndicator"
              className="absolute top-0 h-0.5 w-6 bg-plantDoc-primary rounded-full" 
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            />
          )}
          <Search size={24} />
          <span className="text-xs">Plants</span>
        </Link>
        
        <Sheet>
          <SheetTrigger asChild>
            <button className="bottom-nav-item">
              <Menu size={24} />
              <span className="text-xs">Menu</span>
            </button>
          </SheetTrigger>
          <SheetContent side="bottom" className="md:hidden h-[70vh] rounded-t-3xl overflow-auto glass-card border-t border-white/10">
            <div className="flex flex-col space-y-4 pt-6">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-bold text-gradient">Plant Doc Menu</h3>
              </div>
              
              <div className="border-t border-white/10 my-4"></div>
              
              <Link to="/" className="mobile-menu-item group">
                <Home className="mr-2 h-5 w-5 text-plantDoc-primary group-hover:rotate-12 transition-transform" />
                <span className="group-hover:translate-x-1 transition-transform">Home</span>
              </Link>
              
              <Link to="/diagnose" className="mobile-menu-item group">
                <Leaf className="mr-2 h-5 w-5 text-plantDoc-primary group-hover:rotate-12 transition-transform" />
                <span className="group-hover:translate-x-1 transition-transform">Diagnose Your Plant</span>
              </Link>
              
              <Link to="/recommend" className="mobile-menu-item group">
                <Search className="mr-2 h-5 w-5 text-plantDoc-primary group-hover:rotate-12 transition-transform" />
                <span className="group-hover:translate-x-1 transition-transform">Plant Recommendations</span>
              </Link>
              
              <Link to="/about" className="mobile-menu-item group">
                <Info className="mr-2 h-5 w-5 text-plantDoc-primary group-hover:rotate-12 transition-transform" />
                <span className="group-hover:translate-x-1 transition-transform">About</span>
              </Link>
              
              <a href="https://github.com/AadishY" target="_blank" className="mobile-menu-item group">
                <Github className="mr-2 h-5 w-5 text-plantDoc-primary group-hover:rotate-12 transition-transform" />
                <span className="group-hover:translate-x-1 transition-transform">GitHub</span>
              </a>
              
              <button onClick={toggleTheme} className="mobile-menu-item group flex items-center">
                {theme === 'dark' ? (
                  <Sun className="mr-2 h-5 w-5 text-plantDoc-primary group-hover:rotate-12 transition-transform" />
                ) : (
                  <Moon className="mr-2 h-5 w-5 text-plantDoc-primary group-hover:rotate-12 transition-transform" />
                )}
                <span className="group-hover:translate-x-1 transition-transform">
                  {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
                </span>
              </button>
              
              <div className="border-t border-white/10 my-4"></div>
              
              <div className="text-sm text-foreground/50 px-4">
                © {new Date().getFullYear()} Plant Doc by Aadish
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </motion.div>
    </>
  );
};

export default MobileNav;
