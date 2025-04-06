
import * as React from "react"
import * as HoverCardPrimitive from "@radix-ui/react-hover-card"
import { cn } from "@/lib/utils"
import { useDeviceOptimizer } from '@/hooks/use-mobile'

const HoverCardRoot = React.forwardRef<
  React.ElementRef<typeof HoverCardPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof HoverCardPrimitive.Root>
>(({ open, ...props }, ref) => {
  const { shouldUseHover } = useDeviceOptimizer();
  
  // For mobile devices, we'll make hover cards open on click instead of hover
  // by passing open=false to the Root component, effectively disabling hover behavior
  return (
    <HoverCardPrimitive.Root 
      {...props}
      open={shouldUseHover ? open : false}
    />
  );
});
HoverCardRoot.displayName = HoverCardPrimitive.Root.displayName;

const HoverCard = HoverCardRoot;
const HoverCardTrigger = HoverCardPrimitive.Trigger;

const HoverCardContent = React.forwardRef<
  React.ElementRef<typeof HoverCardPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof HoverCardPrimitive.Content>
>(({ className, align = "center", sideOffset = 4, ...props }, ref) => {
  const { shouldUseEffects } = useDeviceOptimizer();
  
  return (
    <HoverCardPrimitive.Content
      ref={ref}
      align={align}
      sideOffset={sideOffset}
      className={cn(
        "z-50 w-64 rounded-md border",
        // Enhanced styling for desktop
        shouldUseEffects 
          ? "bg-black/60 p-4 text-white backdrop-blur-xl border-white/15 shadow-lg" 
          : "bg-background/95 p-3 text-foreground border-white/10 shadow-lg",
        "outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
        className
      )}
      {...props}
    />
  );
})
HoverCardContent.displayName = HoverCardPrimitive.Content.displayName

export { HoverCard, HoverCardTrigger, HoverCardContent }
