
import React, { forwardRef, HTMLAttributes } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './card';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import InteractiveParallax from '@/components/InteractiveParallax';

interface EnhancedCardProps extends HTMLAttributes<HTMLDivElement> {
  className?: string;
  isHoverable?: boolean;
  isRaised?: boolean;
  isInteractive?: boolean;
  isFrosted?: boolean;
  intensity?: number;
  hoverEffect?: "scale" | "lift" | "glow" | "both" | "fancy" | "pulse" | "smooth" | string;
  glassIntensity?: "light" | "medium" | "intense" | "neo" | "crystal" | "frost" | string;
  borderGlow?: boolean;
  accentColor?: string;
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
  accentColor = "plantDoc-primary",
  children,
  ...props
}, ref) => {
  const getHoverClass = () => {
    switch (hoverEffect) {
      case "scale":
        return "transition-transform duration-300 hover:scale-[1.02]";
      case "lift":
        return "transition-all duration-300 hover:-translate-y-1";
      case "glow":
        return "transition-all duration-300 hover:shadow-lg hover:shadow-plantDoc-primary/20";
      case "both":
        return "transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-plantDoc-primary/20";
      case "fancy":
        return "transition-all duration-300 hover:-translate-y-1 hover:scale-[1.02] hover:shadow-lg hover:shadow-plantDoc-primary/30 hover:border-plantDoc-primary/30";
      case "pulse":
        return "hover:animate-pulse transition-all duration-300";
      case "smooth":
        return "transition-all duration-300 ease-in-out hover:-translate-y-1 hover:shadow-lg hover:shadow-plantDoc-secondary/20";
      default:
        return isHoverable ? "transition-all duration-300 hover:scale-[1.01] hover:shadow-md" : "";
    }
  };

  const getGlassClass = () => {
    if (!isFrosted && !glassIntensity) return "";
    
    switch (glassIntensity) {
      case "light":
        return "bg-white/5 backdrop-blur-md border border-white/10";
      case "medium":
        return "bg-white/10 backdrop-blur-md border border-white/20";
      case "intense":
        return "bg-black/40 backdrop-blur-xl border border-white/10";
      case "neo":
        return "bg-black/30 backdrop-blur-xl border border-white/5 shadow-inner shadow-white/5";
      case "crystal":
        return "bg-gradient-to-br from-white/10 to-black/20 backdrop-blur-xl border border-white/10";
      case "frost":
        return "bg-white/15 backdrop-blur-xl border border-white/30 shadow-inner shadow-white/5";
      default:
        return isFrosted ? "bg-white/10 backdrop-blur-md border border-white/20" : "";
    }
  };

  const getBorderGlowClass = () => {
    if (!borderGlow) return "";
    return `ring-1 ring-${accentColor}/20 hover:ring-${accentColor}/30 hover:ring-2`;
  };
  
  const cardContent = (
    <motion.div
      whileHover={
        hoverEffect === "fancy" 
          ? { 
              scale: 1.02, 
              y: -5, 
              transition: { duration: 0.3 } 
            } 
          : undefined
      }
      className="w-full h-full"
    >
      <Card
        ref={ref}
        className={cn(
          getHoverClass(),
          getGlassClass(),
          getBorderGlowClass(),
          isRaised && "shadow-lg",
          className
        )}
        {...props}
      >
        {/* Static glow overlay for better performance */}
        {hoverEffect === "glow" && (
          <div 
            className="absolute inset-0 opacity-0 group-hover:opacity-100 pointer-events-none bg-gradient-to-tr from-plantDoc-primary/10 to-transparent rounded-xl transition-opacity duration-300"
            style={{
              mixBlendMode: 'overlay',
            }}
          />
        )}
        
        {children}
      </Card>
    </motion.div>
  );
  
  if (isInteractive) {
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
