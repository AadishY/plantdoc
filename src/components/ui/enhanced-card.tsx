
import React, { HTMLAttributes } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { motion, MotionProps } from 'framer-motion';
import { useIsMobile } from '@/hooks/use-mobile';

// Create a type that includes all event handlers to exclude due to conflicts with Framer Motion
type ConflictingEventHandlers = 
  | 'onDrag' | 'onDragEnd' | 'onDragEnter' | 'onDragExit' | 'onDragLeave' | 'onDragOver' | 'onDragStart'
  | 'onAnimationStart' | 'onAnimationEnd' | 'onAnimationIteration';

interface EnhancedCardProps extends Omit<HTMLAttributes<HTMLDivElement>, ConflictingEventHandlers> {
  children: React.ReactNode;
  className?: string;
  hoverEffect?: 'lift' | 'glow' | 'both' | 'none';
  glassEffect?: boolean;
  glassIntensity?: 'light' | 'medium' | 'heavy';
  borderGlow?: boolean;
}

export const EnhancedCard = ({ 
  children, 
  className, 
  hoverEffect = 'both',
  glassEffect = true,
  glassIntensity = 'medium',
  borderGlow = false,
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

  const getGlassStyles = () => {
    switch (glassIntensity) {
      case 'light':
        return 'bg-black/20 backdrop-blur-md';
      case 'heavy':
        return 'bg-black/40 backdrop-blur-2xl';
      case 'medium':
      default:
        return 'bg-black/30 backdrop-blur-xl';
    }
  };

  const motionProps: MotionProps = {
    whileHover: getHoverAnimations(),
    transition: { duration: 0.3 }
  };

  return (
    <motion.div
      className={cn(
        glassEffect ? `${getGlassStyles()} rounded-xl overflow-hidden border-white/10 shadow-lg` : '',
        borderGlow ? 'border border-plantDoc-primary/30' : 'border-none',
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
  <CardHeader className={cn("bg-gradient-to-r from-plantDoc-primary/20 to-transparent backdrop-blur-sm", className)} {...props} />
);

export const EnhancedCardTitle = ({ className, ...props }: React.ComponentProps<typeof CardTitle>) => (
  <CardTitle className={cn("text-gradient", className)} {...props} />
);

export const EnhancedCardContent = ({ className, ...props }: React.ComponentProps<typeof CardContent>) => (
  <CardContent className={cn("backdrop-blur-sm", className)} {...props} />
);

export const EnhancedCardFooter = ({ className, ...props }: React.ComponentProps<typeof CardFooter>) => (
  <CardFooter className={cn("bg-gradient-to-r from-transparent to-plantDoc-primary/10 backdrop-blur-sm", className)} {...props} />
);

export const EnhancedCardDescription = CardDescription;
