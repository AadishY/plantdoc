
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface EnhancedCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  hoverEffect?: 'lift' | 'glow' | 'both' | 'none';
  glassEffect?: boolean;
}

export const EnhancedCard = ({ 
  children, 
  className, 
  hoverEffect = 'both',
  glassEffect = true,
  ...props 
}: EnhancedCardProps) => {
  // Define the hover animations based on hoverEffect prop
  const getHoverAnimations = () => {
    switch (hoverEffect) {
      case 'lift':
        return { y: -10 };
      case 'glow':
        return { boxShadow: '0 0 20px rgba(76, 175, 80, 0.4)' };
      case 'both':
        return { 
          y: -8,
          boxShadow: '0 0 20px rgba(76, 175, 80, 0.4)' 
        };
      case 'none':
      default:
        return {};
    }
  };

  return (
    <motion.div
      className={cn(
        glassEffect ? 'glass-card rounded-xl overflow-hidden border-none shadow-lg' : '',
        className
      )}
      whileHover={getHoverAnimations()}
      transition={{ duration: 0.3 }}
      {...props}
    >
      {children}
    </motion.div>
  );
};

export const EnhancedCardHeader = ({ className, ...props }: React.ComponentProps<typeof CardHeader>) => (
  <CardHeader className={cn("bg-gradient-to-r from-plantDoc-primary/20 to-transparent", className)} {...props} />
);

export const EnhancedCardTitle = ({ className, ...props }: React.ComponentProps<typeof CardTitle>) => (
  <CardTitle className={cn("text-gradient", className)} {...props} />
);

export const EnhancedCardContent = CardContent;
export const EnhancedCardFooter = CardFooter;
export const EnhancedCardDescription = CardDescription;
