
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
  // Add the missing props that are used in various components
  hoverEffect?: string;
  glassIntensity?: string;
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
  const cardContent = (
    <Card
      ref={ref}
      className={cn(
        "bg-black/40 backdrop-blur-md border border-white/10", // Base glass effect
        isHoverable && "transition-all duration-300 hover:-translate-y-1 hover:shadow-lg",
        isRaised && "shadow-lg",
        isFrosted && "glass-card",
        glassIntensity === 'intense' && "bg-black/60 backdrop-blur-lg",
        glassIntensity === 'medium' && "bg-black/50 backdrop-blur-md",
        glassIntensity === 'light' && "bg-black/30 backdrop-blur-sm",
        borderGlow && "hover:border-plantDoc-primary/50 hover:shadow-plantDoc-primary/20 hover:shadow-md",
        hoverEffect,
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
