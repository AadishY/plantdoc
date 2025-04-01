
import React, { HTMLAttributes } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { motion, MotionProps } from 'framer-motion';
import { useIsMobile } from '@/hooks/use-mobile';

// Create a type that includes all drag-related event handlers to exclude them
type DragEvents = 'onDrag' | 'onDragEnd' | 'onDragEnter' | 'onDragExit' | 'onDragLeave' | 'onDragOver' | 'onDragStart';

interface EnhancedCardProps extends Omit<HTMLAttributes<HTMLDivElement>, DragEvents> {
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
  const isMobile = useIsMobile();
  
  // Define the hover animations based on hoverEffect prop
  const getHoverAnimations = () => {
    // Reduce animation intensity on mobile
    const liftDistance = isMobile ? -5 : -10;
    const glowIntensity = isMobile ? '0 0 15px rgba(76, 175, 80, 0.3)' : '0 0 20px rgba(76, 175, 80, 0.4)';
    
    switch (hoverEffect) {
      case 'lift':
        return { y: liftDistance };
      case 'glow':
        return { boxShadow: glowIntensity };
      case 'both':
        return { 
          y: liftDistance,
          boxShadow: glowIntensity
        };
      case 'none':
      default:
        return {};
    }
  };

  const motionProps: MotionProps = {
    whileHover: getHoverAnimations(),
    transition: { duration: 0.3 }
  };

  return (
    <motion.div
      className={cn(
        glassEffect ? 'glass-card rounded-xl overflow-hidden border-none shadow-lg' : '',
        className
      )}
      {...motionProps}
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
