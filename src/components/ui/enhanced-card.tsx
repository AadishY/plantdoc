
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
  hoverEffect?: 'lift' | 'glow' | 'both' | 'scale' | 'none';
  glassEffect?: boolean;
  glassIntensity?: 'light' | 'medium' | 'heavy';
  borderGlow?: boolean;
  animate?: boolean;
  animateOnScroll?: boolean;
}

export const EnhancedCard = ({ 
  children, 
  className, 
  hoverEffect = 'both',
  glassEffect = true,
  glassIntensity = 'medium',
  borderGlow = false,
  animate = false,
  animateOnScroll = false,
  ...props 
}: EnhancedCardProps) => {
  const isMobile = useIsMobile();
  
  // Define the hover animations based on hoverEffect prop
  const getHoverAnimations = () => {
    // Reduce animation intensity on mobile
    const liftDistance = isMobile ? -3 : -8;
    const scaleAmount = isMobile ? 1.03 : 1.05;
    const glowIntensity = isMobile ? '0 0 15px rgba(76, 175, 80, 0.3)' : '0 0 20px rgba(76, 175, 80, 0.4)';
    
    switch (hoverEffect) {
      case 'lift':
        return { y: liftDistance };
      case 'glow':
        return { boxShadow: glowIntensity };
      case 'scale':
        return { scale: scaleAmount };
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

  const initialAnimation = animate ? {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 }
  } : {};

  const scrollAnimation = animateOnScroll ? {
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: "-100px" },
    transition: { duration: 0.5 }
  } : {};

  const motionProps: MotionProps = {
    whileHover: getHoverAnimations(),
    transition: { duration: 0.3 },
    ...initialAnimation,
    ...scrollAnimation
  };

  return (
    <motion.div
      className={cn(
        glassEffect ? `${getGlassStyles()} rounded-xl overflow-hidden border border-white/10 shadow-lg` : '',
        borderGlow ? 'border border-plantDoc-primary/30' : 'border-none',
        'transition-all duration-300',
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
