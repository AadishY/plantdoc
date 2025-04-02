
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Leaf, Info, FlaskConical } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

const FixedMobileNav: React.FC = () => {
  const location = useLocation();
  
  const isActive = (path: string) => location.pathname === path;
  
  return (
    <div className="md:hidden bottom-nav">
      <NavItem 
        to="/" 
        icon={<Home size={20} />} 
        label="Home" 
        isActive={isActive('/')} 
      />
      <NavItem 
        to="/diagnose" 
        icon={<Leaf size={20} />} 
        label="Diagnose" 
        isActive={isActive('/diagnose')} 
      />
      <NavItem 
        to="/recommend" 
        icon={<FlaskConical size={20} />} 
        label="Plants" 
        isActive={isActive('/recommend')} 
      />
      <NavItem 
        to="/about" 
        icon={<Info size={20} />} 
        label="About" 
        isActive={isActive('/about')} 
      />
    </div>
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
      "bottom-nav-item",
      isActive ? "text-plantDoc-primary" : "text-white/80"
    )}
  >
    {isActive ? (
      <motion.div
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        className="relative"
      >
        <span className="absolute -inset-1 bg-white/10 rounded-full blur-sm" />
        {icon}
      </motion.div>
    ) : (
      icon
    )}
    <span className="text-xs">{label}</span>
    {isActive && (
      <motion.span 
        className="absolute -top-1 w-1 h-1 bg-plantDoc-primary rounded-full"
        layoutId="navIndicator"
        transition={{ type: "spring", duration: 0.3 }}
      />
    )}
  </Link>
);

export default FixedMobileNav;
