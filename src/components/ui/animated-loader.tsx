
import React from 'react';
import { motion } from 'framer-motion';
import { Leaf } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AnimatedLoaderProps {
  size?: 'sm' | 'md' | 'lg';
  color?: 'primary' | 'secondary' | 'accent' | 'white';
  className?: string;
  text?: string;
}

const AnimatedLoader: React.FC<AnimatedLoaderProps> = ({
  size = 'md',
  color = 'primary',
  className,
  text
}) => {
  const sizeMap = {
    sm: { box: 'w-8 h-8', icon: 'w-3.5 h-3.5', ring: 'inset-0' },
    md: { box: 'w-12 h-12', icon: 'w-5 h-5', ring: '-inset-1' },
    lg: { box: 'w-16 h-16', icon: 'w-7 h-7', ring: '-inset-2' }
  };
  
  const textSizeMap = {
    sm: 'text-xs',
    md: 'text-xs sm:text-sm font-mono',
    lg: 'text-sm font-mono tracking-wider'
  };

  return (
    <div className={cn("flex flex-col items-center justify-center gap-3 select-none", className)}>
      <div className={cn("relative flex items-center justify-center", sizeMap[size].box)}>
        {/* Outer Rotating Bio-Ring */}
        <motion.div 
          className={cn(
            "absolute rounded-full border border-dashed border-[#2DD4BF]/50",
            sizeMap[size].ring
          )}
          animate={{ rotate: 360 }}
          transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
        />
        
        {/* Pulsing Scanner Halo */}
        <motion.div 
          className={cn(
            "absolute rounded-full border border-[#5EEAD4]/30",
            sizeMap[size].ring
          )}
          animate={{ scale: [1, 1.25, 1], opacity: [0.7, 0.2, 0.7] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* Central Core Shield */}
        <div className="relative z-10 w-full h-full rounded-xl bg-black/80 border border-[#2DD4BF]/60 flex items-center justify-center shadow-[0_0_20px_rgba(45,212,191,0.4)] backdrop-blur-md">
          <Leaf className={cn("text-[#5EEAD4] drop-shadow-[0_0_8px_rgba(45,212,191,0.8)]", sizeMap[size].icon)} />
        </div>
      </div>
      
      {text && (
        <motion.p 
          className={cn(
            "text-[#5EEAD4] font-medium tracking-wide flex items-center gap-2",
            textSizeMap[size]
          )}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <span className="h-1.5 w-1.5 rounded-full bg-[#2DD4BF] animate-ping" />
          <span>{text}</span>
        </motion.p>
      )}
    </div>
  );
};

export default AnimatedLoader;
