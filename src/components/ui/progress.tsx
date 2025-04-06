
import * as React from "react"
import * as ProgressPrimitive from "@radix-ui/react-progress"
import { cn } from "@/lib/utils"
import { useDeviceOptimizer } from '@/hooks/use-mobile'

const Progress = React.forwardRef<
  React.ElementRef<typeof ProgressPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root> & {
    indicatorClassName?: string;
  }
>(({ className, value, indicatorClassName, ...props }, ref) => {
  const { shouldUseEffects } = useDeviceOptimizer();
  
  return (
    <ProgressPrimitive.Root
      ref={ref}
      className={cn(
        "relative h-4 w-full overflow-hidden rounded-full bg-secondary/30 backdrop-blur-sm",
        className
      )}
      {...props}
    >
      <ProgressPrimitive.Indicator
        className={cn(
          "h-full w-full flex-1 bg-gradient-to-r from-plantDoc-primary to-plantDoc-secondary transition-all",
          indicatorClassName
        )}
        style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
      />
      
      {/* Add subtle animated glow effect only on desktop */}
      {shouldUseEffects && (
        <div 
          className="absolute inset-y-0 left-0 w-full scale-x-110 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-50 will-change-auto"
          style={{
            animation: shouldUseEffects ? 'shimmer 2s infinite' : 'none',
            transform: `translateX(-100%) translateX(${value || 0}%)`,
          }}
        />
      )}
      
      {/* Add animation style only when needed */}
      {shouldUseEffects && (
        <style dangerouslySetInnerHTML={{ __html: `
          @keyframes shimmer {
            100% {
              transform: translateX(100%) translateX(${value || 0}%);
            }
          }
        `}} />
      )}
    </ProgressPrimitive.Root>
  );
})
Progress.displayName = ProgressPrimitive.Root.displayName

export { Progress }
