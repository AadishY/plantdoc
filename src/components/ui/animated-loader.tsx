
import React from 'react';
import { motion } from 'framer-motion';
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
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  };
  
  const colorMap = {
    primary: 'text-plantDoc-primary',
    secondary: 'text-plantDoc-secondary',
    accent: 'text-plantDoc-accent',
    white: 'text-white'
  };
  
  const textSizeMap = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base'
  };

  const spinnerVariants = {
    spin: {
      rotate: 360,
      transition: {
        duration: 1.5,
        repeat: Infinity,
        ease: "linear"
      }
    }
  };
  
  const pulseVariants = {
    pulse: {
      scale: [1, 1.1, 1],
      opacity: [0.6, 1, 0.6],
      transition: {
        duration: 1.5,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  return (
    <div className={cn("flex flex-col items-center justify-center", className)}>
      <div className="relative">
        {/* Background circle */}
        <motion.div
          variants={pulseVariants}
          animate="pulse"
          className={cn(
            "rounded-full backdrop-blur-sm",
            sizeMap[size],
            "bg-current opacity-20",
            colorMap[color]
          )}
        />
        
        {/* Spinning element */}
        <motion.div 
          className={cn(
            "absolute inset-0 flex items-center justify-center",
            colorMap[color]
          )}
          variants={spinnerVariants}
          animate="spin"
        >
          <svg 
            viewBox="0 0 24 24" 
            className={cn(sizeMap[size])}
          >
            <circle
              cx="12"
              cy="12"
              r="8"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeDasharray="32"
              strokeDashoffset="10"
              strokeLinecap="round"
            />
          </svg>
        </motion.div>
      </div>
      
      {text && (
        <motion.p 
          className={cn(
            "mt-2",
            textSizeMap[size],
            colorMap[color]
          )}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          {text}
        </motion.p>
      )}
    </div>
  );
};

export default AnimatedLoader;
