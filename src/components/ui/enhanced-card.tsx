
import React from 'react';
import { cn } from '@/lib/utils';
import { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent } from '@/components/ui/card';

// Glass effect intensities for the cards
type GlassIntensity = 'low' | 'medium' | 'high';

interface EnhancedCardProps extends React.HTMLAttributes<HTMLDivElement> {
  glassIntensity?: GlassIntensity;
  borderGlow?: boolean;
}

const getGlassClasses = (intensity: GlassIntensity = 'medium') => {
  switch (intensity) {
    case 'low':
      return 'bg-black/10 backdrop-blur-sm';
    case 'high':
      return 'bg-black/40 backdrop-blur-xl';
    case 'medium':
    default:
      return 'bg-black/30 backdrop-blur-md';
  }
};

export const EnhancedCard = React.forwardRef<
  HTMLDivElement,
  EnhancedCardProps
>(({ className, glassIntensity = 'medium', borderGlow = false, ...props }, ref) => (
  <Card
    ref={ref}
    className={cn(
      'border border-white/10 text-white shadow-sm',
      getGlassClasses(glassIntensity),
      borderGlow && 'shadow-[0_0_15px_rgba(76,175,80,0.15)]',
      className
    )}
    {...props}
  />
));
EnhancedCard.displayName = 'EnhancedCard';

export const EnhancedCardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <CardHeader
    ref={ref}
    className={cn('flex flex-col space-y-1.5 p-6', className)}
    {...props}
  />
));
EnhancedCardHeader.displayName = 'EnhancedCardHeader';

export const EnhancedCardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <CardTitle
    ref={ref}
    className={cn(
      'text-2xl font-semibold leading-none tracking-tight text-white',
      className
    )}
    {...props}
  />
));
EnhancedCardTitle.displayName = 'EnhancedCardTitle';

export const EnhancedCardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <CardDescription
    ref={ref}
    className={cn('text-sm text-white/70', className)}
    {...props}
  />
));
EnhancedCardDescription.displayName = 'EnhancedCardDescription';

export const EnhancedCardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <CardContent ref={ref} className={cn('p-6 pt-0 text-white', className)} {...props} />
));
EnhancedCardContent.displayName = 'EnhancedCardContent';

export const EnhancedCardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <CardFooter
    ref={ref}
    className={cn('flex items-center p-6 pt-0', className)}
    {...props}
  />
));
EnhancedCardFooter.displayName = 'EnhancedCardFooter';
