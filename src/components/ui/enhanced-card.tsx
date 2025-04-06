
import React, { forwardRef, HTMLAttributes } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './card';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import InteractiveParallax from '@/components/InteractiveParallax';
import { useDeviceOptimizer } from '@/hooks/use-mobile';

interface EnhancedCardProps extends HTMLAttributes<HTMLDivElement> {
  className?: string;
  isHoverable?: boolean;
  isRaised?: boolean;
  isInteractive?: boolean;
  isFrosted?: boolean;
  intensity?: number;
  hoverEffect?: "scale" | "lift" | "glow" | "both" | "fancy" | string;
  glassIntensity?: "light" | "medium" | "intense" | "neo" | string;
  borderGlow?: boolean;
}

const EnhancedCard = forwardRef<HTMLDivElement, EnhancedCardProps>(({
  className,
  isHoverable = false,
  isRaised = false,
  isInteractive = false,
  isFrosted = false,
  intensity = 8,
  hoverEffect,
  glassIntensity,
  borderGlow,
  children,
  ...props
}, ref) => {
  const { shouldUseHover, shouldUseEffects } = useDeviceOptimizer();
  
  const getHoverClass = () => {
    // No hover effects on mobile for better performance
    if (!shouldUseHover) return "";
    
    switch (hoverEffect) {
      case "scale":
        return "hover-grow";
      case "lift":
        return "hover-float";
      case "glow":
        return "transition-all duration-300 hover:shadow-lg hover:shadow-plantDoc-primary/20";
      case "both":
        return "hover-float hover:shadow-lg hover:shadow-plantDoc-primary/20";
      case "fancy":
        return "transition-all duration-300 hover:-translate-y-1 hover:scale-[1.02] hover:shadow-lg hover:shadow-plantDoc-primary/30 hover:border-plantDoc-primary/30";
      default:
        return isHoverable ? "hover-pop hover:shadow-lg" : "";
    }
  };

  const getGlassClass = () => {
    if (!isFrosted && !glassIntensity) return "";
    
    // Simplified glass effect on mobile
    if (!shouldUseEffects) {
      return "bg-black/40 border border-white/10";
    }
    
    switch (glassIntensity) {
      case "light":
        return "bg-white/5 backdrop-blur-md border border-white/10";
      case "medium":
        return "glass-card";
      case "intense":
        return "glass-card-intense";
      case "neo":
        return "neo-glass";
      default:
        return isFrosted ? "glass-card" : "";
    }
  };
  
  const cardContent = (
    <div className="w-full h-full">
      {shouldUseHover && hoverEffect === "fancy" ? (
        <motion.div
          whileHover={{ 
            scale: 1.02, 
            y: -5, 
            transition: { duration: 0.3 } 
          }}
          className="w-full h-full"
        >
          <Card
            ref={ref}
            className={cn(
              getHoverClass(),
              getGlassClass(),
              isRaised && "shadow-lg",
              borderGlow && shouldUseHover && "hover:border-plantDoc-primary/30",
              className
            )}
            {...props}
          >
            {/* Static glow overlay - only on desktop */}
            {shouldUseEffects && hoverEffect === "glow" && (
              <div 
                className="absolute inset-0 opacity-0 pointer-events-none bg-gradient-to-tr from-plantDoc-primary/10 to-transparent rounded-xl transition-opacity duration-300 hover:opacity-100"
                style={{
                  mixBlendMode: 'overlay',
                }}
              />
            )}
            
            {children}
          </Card>
        </motion.div>
      ) : (
        <Card
          ref={ref}
          className={cn(
            getHoverClass(),
            getGlassClass(),
            isRaised && "shadow-lg",
            borderGlow && shouldUseHover && "hover:border-plantDoc-primary/30",
            className
          )}
          {...props}
        >
          {/* Static glow overlay - only on desktop */}
          {shouldUseEffects && hoverEffect === "glow" && (
            <div 
              className="absolute inset-0 opacity-0 pointer-events-none bg-gradient-to-tr from-plantDoc-primary/10 to-transparent rounded-xl transition-opacity duration-300 hover:opacity-100"
              style={{
                mixBlendMode: 'overlay',
              }}
            />
          )}
          
          {children}
        </Card>
      )}
    </div>
  );
  
  if (isInteractive && shouldUseEffects) {
    return (
      <InteractiveParallax intensity={intensity}>
        {cardContent}
      </InteractiveParallax>
    );
  }
  
  return cardContent;
});
EnhancedCard.displayName = "EnhancedCard";

const EnhancedCardHeader = forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<typeof CardHeader>
>((props, ref) => {
  return <CardHeader ref={ref} {...props} />;
});
EnhancedCardHeader.displayName = "EnhancedCardHeader";

const EnhancedCardTitle = forwardRef<
  HTMLParagraphElement,
  React.ComponentPropsWithoutRef<typeof CardTitle>
>((props, ref) => {
  return <CardTitle ref={ref} {...props} />;
});
EnhancedCardTitle.displayName = "EnhancedCardTitle";

const EnhancedCardDescription = forwardRef<
  HTMLParagraphElement,
  React.ComponentPropsWithoutRef<typeof CardDescription>
>((props, ref) => {
  return <CardDescription ref={ref} {...props} />;
});
EnhancedCardDescription.displayName = "EnhancedCardDescription";

const EnhancedCardContent = forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<typeof CardContent>
>((props, ref) => {
  return <CardContent ref={ref} {...props} />;
});
EnhancedCardContent.displayName = "EnhancedCardContent";

const EnhancedCardFooter = forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<typeof CardFooter>
>((props, ref) => {
  return <CardFooter ref={ref} {...props} />;
});
EnhancedCardFooter.displayName = "EnhancedCardFooter";

export {
  EnhancedCard,
  EnhancedCardHeader,
  EnhancedCardTitle,
  EnhancedCardDescription,
  EnhancedCardContent,
  EnhancedCardFooter,
};
