import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Scan, Info, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

const FixedMobileNav: React.FC = () => {
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;
  
  return (
    <nav 
      aria-label="Mobile Navigation"
      className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#070b08]/90 backdrop-blur-xl border-t border-white/10 px-3 py-2 flex items-center justify-around shadow-[0_-10px_30px_rgba(0,0,0,0.6)] pb-[calc(0.5rem+env(safe-area-inset-bottom,0px))]"
    >
      <NavItem 
        to="/" 
        icon={<Home size={20} />} 
        label="Home" 
        isActive={isActive('/')} 
      />
      <NavItem 
        to="/diagnose" 
        icon={<Scan size={20} />} 
        label="Diagnose" 
        isActive={isActive('/diagnose')} 
      />
      <NavItem 
        to="/recommend" 
        icon={<Sparkles size={20} />} 
        label="Recommend" 
        isActive={isActive('/recommend')} 
      />
      <NavItem 
        to="/about" 
        icon={<Info size={20} />} 
        label="About" 
        isActive={isActive('/about')} 
      />
    </nav>
  );
};

interface NavItemProps {
  to: string;
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
}

const NavItem: React.FC<NavItemProps> = ({ to, icon, label, isActive }) => (
  <Link 
    to={to} 
    className={cn(
      "relative flex flex-col items-center justify-center py-1.5 px-3 rounded-xl transition-all duration-200 min-w-[60px] min-h-[44px]",
      isActive 
        ? "text-plantDoc-primary font-semibold" 
        : "text-foreground/70 hover:text-white"
    )}
  >
    <div className="relative">
      {isActive && (
        <motion.span 
          layoutId="mobileNavPill"
          className="absolute -inset-2 rounded-xl bg-plantDoc-primary/15 border border-plantDoc-primary/30 -z-10"
          transition={{ type: "spring", stiffness: 350, damping: 30 }}
        />
      )}
      {icon}
    </div>
    <span className="text-[11px] mt-1 leading-tight">{label}</span>
  </Link>
);

export default FixedMobileNav;
