
import React, { useEffect, useState, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useDeviceOptimizer } from '@/hooks/use-mobile';

type BackgroundBlob = {
  id: number;
  x: string;
  y: string;
  size: string;
  color: string;
  delay: number;
  duration: number;
};

const DynamicBackground = () => {
  const { shouldUseComplexBG, deviceType } = useDeviceOptimizer();
  const [mounted, setMounted] = useState(false);
  const backgroundRef = useRef<HTMLDivElement>(null);
  
  // Generate fewer blobs and simpler effects on mobile
  const blobCount = shouldUseComplexBG ? 5 : 2;
  
  // Create randomized blobs with memoization
  const [blobs, setBlobs] = useState<BackgroundBlob[]>([]);
  
  useEffect(() => {
    // Only generate blobs once on component mount
    if (!mounted) {
      const newBlobs: BackgroundBlob[] = [];
      
      // Enhanced colors with moderated intensity for better visibility
      const colors = [
        'from-plantDoc-primary/25 to-plantDoc-secondary/15',
        'from-plantDoc-secondary/30 to-plantDoc-primary/20',
        'from-plantDoc-accent/25 to-plantDoc-primary/15',
        'from-plantDoc-primary/25 to-plantDoc-accent/20',
        'from-green-400/25 to-blue-500/20',
      ];
      
      for (let i = 0; i < blobCount; i++) {
        newBlobs.push({
          id: i,
          x: `${Math.random() * 100}%`,
          y: `${Math.random() * 100}%`,
          // Different size strategy for mobile vs desktop
          size: shouldUseComplexBG
            ? `${150 + Math.random() * 180}px`
            : `${100 + Math.random() * 60}px`,
          color: colors[i % colors.length],
          delay: i * 0.3,
          duration: shouldUseComplexBG ? 25 + Math.random() * 15 : 35 // Slower animation on mobile for less CPU usage
        });
      }
      
      setBlobs(newBlobs);
      setMounted(true);
    }
  }, [shouldUseComplexBG, mounted, blobCount]);
  
  // Optimized blob rendering with different strategies for mobile/desktop
  const renderBlobs = useCallback(() => {
    return blobs.map((blob) => (
      <motion.div 
        key={blob.id}
        className={`absolute rounded-full bg-gradient-to-r ${blob.color} blur-[80px] opacity-60`}
        style={{ 
          left: blob.x,
          top: blob.y,
          width: blob.size,
          height: blob.size,
        }}
        animate={shouldUseComplexBG ? {
          x: [0, 30, -20, 10, -5, 0],
          y: [0, -20, 10, -15, 5, 0],
          scale: [1, 1.05, 0.97, 1.02, 0.99, 1],
          opacity: [0.6, 0.65, 0.55, 0.62, 0.6, 0.6],
        } : {
          // Simplified animation for mobile
          opacity: [0.5, 0.55, 0.5],
        }}
        transition={{
          duration: blob.duration,
          repeat: Infinity,
          repeatType: "reverse",
          delay: blob.delay,
          ease: "easeInOut",
          // Simplified timing for mobile
          times: shouldUseComplexBG ? [0, 0.2, 0.4, 0.6, 0.8, 1] : [0, 0.5, 1]
        }}
      />
    ));
  }, [blobs, shouldUseComplexBG]);
  
  // Enhanced ambient glow effects with conditional rendering for mobile
  const renderAmbientGlows = useCallback(() => {
    // Simplified glows on mobile
    if (!shouldUseComplexBG) {
      return (
        <>
          {/* Single simple glow for mobile */}
          <div 
            className="absolute inset-0 bg-gradient-radial from-plantDoc-primary/8 via-transparent to-transparent opacity-40"
          />
        </>
      );
    }
    
    // Full effect on desktop
    return (
      <>
        {/* Left top glow */}
        <motion.div 
          className="absolute top-1/4 -left-10 w-[300px] h-[300px] bg-plantDoc-primary/20 rounded-full blur-[90px]"
          animate={{
            x: [0, 20, -15, 10, 0],
            opacity: [0.2, 0.25, 0.18, 0.22, 0.2],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut"
          }}
        />
        
        {/* Right bottom glow */}
        <motion.div 
          className="absolute bottom-1/4 -right-10 w-[320px] h-[320px] bg-plantDoc-secondary/20 rounded-full blur-[90px]"
          animate={{
            x: [0, -25, 12, -10, 0],
            opacity: [0.2, 0.25, 0.18, 0.22, 0.2],
          }}
          transition={{
            duration: 30,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut",
            delay: 2
          }}
        />
        
        {/* Center glow */}
        <motion.div 
          className="absolute top-2/3 left-1/3 w-[250px] h-[250px] bg-plantDoc-accent/15 rounded-full blur-[80px]"
          animate={{
            x: [0, 12, -10, 6, 0],
            y: [0, -10, 6, -4, 0],
            opacity: [0.15, 0.18, 0.12, 0.16, 0.15],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut",
            delay: 5
          }}
        />
        
        {/* Subtle corner glows */}
        <motion.div 
          className="absolute -top-20 -right-20 w-[200px] h-[200px] bg-blue-500/12 rounded-full blur-[70px]"
          animate={{
            opacity: [0.12, 0.15, 0.1, 0.14, 0.12],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut"
          }}
        />
        
        <motion.div 
          className="absolute -bottom-20 left-1/4 w-[180px] h-[180px] bg-green-400/12 rounded-full blur-[70px]"
          animate={{
            opacity: [0.12, 0.15, 0.1, 0.14, 0.12],
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut",
            delay: 3
          }}
        />
      </>
    );
  }, [shouldUseComplexBG]);
  
  // Only render if component is mounted (client-side) to prevent hydration issues
  if (!mounted) return null;
  
  return (
    <div ref={backgroundRef} className="fixed inset-0 overflow-hidden pointer-events-none z-[-1]">
      {renderBlobs()}
      {renderAmbientGlows()}
      
      {/* Enhanced glassmorphic background with subtle gradient overlay */}
      <div className="absolute inset-0 bg-black/65 backdrop-blur-md -z-10"></div>
      
      {/* Conditional grid pattern for more depth - only on desktop */}
      {shouldUseComplexBG && (
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiMxQTIwMkMiIGZpbGwtb3BhY2l0eT0iMC4wNCI+PHBhdGggZD0iTTM2IDM0aDR2MWgtNHYtMXptMC0zaC00djFoNHYtMXptMC0yaC00djFoNHYtMXptLTYgMWgtNHYxaDR2LTF6TTEyIDEyaDR2MWgtNHYtMXptMC0zaC00djFoNHYtMXptMC0yaC00djFoNHYtMXptLTYgMWgtNHYxaDR2LTF6TTM2IDEyaDR2MWgtNHYtMXptMC0zaC00djFoNHYtMXptMC0yaC00djFoNHYtMXptLTYgMWgtNHYxaDR2LTF6TTEyIDM0aDR2MWgtNHYtMXptMC0zaC00djFoNHYtMXptMC0yaC00djFoNHYtMXptLTYgMWgtNHYxaDR2LTF6Ij48L3BhdGg+PC9nPjwvZz48L3N2Zz4=')] opacity-10"></div>
      )}
      
      {/* Improved radial gradient overlay with enhanced glass effect */}
      <div className={`absolute inset-0 bg-gradient-radial from-transparent via-transparent to-background/${shouldUseComplexBG ? '90' : '80'} opacity-${shouldUseComplexBG ? '85' : '70'} pointer-events-none`}></div>
      
      {/* Enhanced glassmorphism layer - only on desktop */}
      {shouldUseComplexBG && (
        <div className="absolute inset-0 backdrop-blur-[1px] bg-black/5 pointer-events-none"></div>
      )}
    </div>
  );
};

export default DynamicBackground;
