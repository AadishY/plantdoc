
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Leaf, Search, Menu } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface MobileNavProps {
  className?: string;
}

const MobileNav: React.FC<MobileNavProps> = ({ className }) => {
  const location = useLocation();
  
  const isActive = (path: string) => location.pathname === path;
  
  return (
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
      
      <button 
        className={cn(
          "bottom-nav-item"
        )}
      >
        <Menu size={24} />
        <span className="text-xs">Menu</span>
      </button>
    </motion.div>
  );
};

export default MobileNav;
