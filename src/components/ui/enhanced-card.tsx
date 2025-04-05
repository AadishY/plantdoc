
import React, { forwardRef, HTMLAttributes, useState } from 'react';
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
  hoverEffect?: "scale" | "lift" | "glow" | "both" | "fancy" | "fluid" | string;
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
  // State for tracking mouse position for fluid effect
  const [mousePosition, setMousePosition] = useState({ x: 50, y: 50 });
  
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (hoverEffect === "fluid") {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      setMousePosition({ x, y });
      
      // Update CSS variables for the hover-glow-enhanced effect
      if (e.currentTarget) {
        e.currentTarget.style.setProperty("--x", `${x}%`);
        e.currentTarget.style.setProperty("--y", `${y}%`);
      }
    }
  };

  const getHoverClass = () => {
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
      case "fluid":
        return "hover-glow-enhanced";
      default:
        return isHoverable ? "hover-pop hover:shadow-lg" : "";
    }
  };

  const getGlassClass = () => {
    if (!isFrosted && !glassIntensity) return "";
    
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
      onMouseMove={handleMouseMove}
    >
      <Card
        ref={ref}
        className={cn(
          getHoverClass(),
          getGlassClass(),
          isRaised && "shadow-lg",
          borderGlow && "hover:border-plantDoc-primary/30",
          hoverEffect === "fluid" && "overflow-hidden",
          className
        )}
        {...props}
      >
        {/* Fluid glow effect overlay */}
        {hoverEffect === "fluid" && (
          <div 
            className="absolute inset-0 pointer-events-none opacity-0 hover:opacity-100 transition-opacity duration-300"
            style={{
              background: `radial-gradient(circle at ${mousePosition.x}% ${mousePosition.y}%, rgba(76, 175, 80, 0.15) 0%, rgba(76, 175, 80, 0) 60%)`,
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
