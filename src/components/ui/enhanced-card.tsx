
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
  hoverEffect?: "scale" | "lift" | "glow" | "both" | string;
  glassIntensity?: "light" | "medium" | "intense" | string;
  borderGlow?: boolean;
}

const EnhancedCard = forwardRef<HTMLDivElement, EnhancedCardProps>(({
  className,
  isHoverable = false,
  isRaised = false,
  isInteractive = false,
  isFrosted = false,
  intensity = 10,
  hoverEffect,
  glassIntensity,
  borderGlow,
  children,
  ...props
}, ref) => {
  const getHoverClass = () => {
    switch (hoverEffect) {
      case "scale":
        return "transition-all duration-300 hover:scale-[1.02]";
      case "lift":
        return "transition-all duration-300 hover:-translate-y-1";
      case "glow":
        return "transition-all duration-300 hover:shadow-lg hover:shadow-plantDoc-primary/20";
      case "both":
        return "transition-all duration-300 hover:-translate-y-1 hover:scale-[1.01] hover:shadow-lg hover:shadow-plantDoc-primary/20";
      default:
        return isHoverable ? "transition-all duration-300 hover:-translate-y-1 hover:shadow-lg" : "";
    }
  };

  const getGlassClass = () => {
    if (!isFrosted && !glassIntensity) return "";
    
    switch (glassIntensity) {
      case "light":
        return "bg-white/5 backdrop-blur-md border border-white/10";
      case "medium":
        return "glassmorphic-card";
      case "intense":
        return "glass-card-intense";
      default:
        return isFrosted ? "glass-card" : "";
    }
  };
  
  const cardContent = (
    <Card
      ref={ref}
      className={cn(
        getHoverClass(),
        getGlassClass(),
        isRaised && "shadow-lg",
        borderGlow && "hover:border-plantDoc-primary/30",
        className
      )}
      {...props}
    >
      {children}
    </Card>
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
