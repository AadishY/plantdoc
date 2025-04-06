
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
  const blobCount = shouldUseComplexBG ? 4 : 2;
  
  // Create randomized blobs with memoization
  const [blobs, setBlobs] = useState<BackgroundBlob[]>([]);
  
  useEffect(() => {
    // Only generate blobs once on component mount
    if (!mounted) {
      const newBlobs: BackgroundBlob[] = [];
      
      // Enhanced colors with moderated intensity for better visibility
      const colors = [
        'from-plantDoc-primary/30 to-plantDoc-secondary/20',
        'from-plantDoc-secondary/35 to-plantDoc-primary/25',
        'from-plantDoc-accent/30 to-plantDoc-primary/20',
        'from-plantDoc-primary/30 to-plantDoc-accent/25',
        'from-green-400/30 to-blue-500/25',
      ];
      
      for (let i = 0; i < blobCount; i++) {
        newBlobs.push({
          id: i,
          x: `${Math.random() * 100}%`,
          y: `${Math.random() * 100}%`,
          // Different size strategy for mobile vs desktop
          size: shouldUseComplexBG
            ? `${180 + Math.random() * 200}px`
            : `${120 + Math.random() * 80}px`,
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
        className={`absolute rounded-full bg-gradient-to-r ${blob.color} blur-[80px] opacity-70`}
        style={{ 
          left: blob.x,
          top: blob.y,
          width: blob.size,
          height: blob.size,
        }}
        animate={shouldUseComplexBG ? {
          x: [0, 40, -25, 15, -10, 0],
          y: [0, -25, 15, -20, 8, 0],
          scale: [1, 1.08, 0.97, 1.04, 0.99, 1],
          opacity: [0.6, 0.7, 0.5, 0.65, 0.6, 0.6],
        } : {
          // Simplified animation for mobile
          opacity: [0.5, 0.6, 0.5],
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
            className="absolute inset-0 bg-gradient-radial from-plantDoc-primary/10 via-transparent to-transparent opacity-40"
          />
        </>
      );
    }
    
    // Full effect on desktop
    return (
      <>
        {/* Left top glow */}
        <motion.div 
          className="absolute top-1/4 -left-10 w-[350px] h-[350px] bg-plantDoc-primary/25 rounded-full blur-[100px]"
          animate={{
            x: [0, 25, -18, 12, 0],
            opacity: [0.25, 0.3, 0.2, 0.28, 0.25],
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
          className="absolute bottom-1/4 -right-10 w-[380px] h-[380px] bg-plantDoc-secondary/25 rounded-full blur-[100px]"
          animate={{
            x: [0, -30, 15, -12, 0],
            opacity: [0.25, 0.32, 0.22, 0.28, 0.25],
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
          className="absolute top-2/3 left-1/3 w-[300px] h-[300px] bg-plantDoc-accent/20 rounded-full blur-[90px]"
          animate={{
            x: [0, 15, -12, 8, 0],
            y: [0, -12, 8, -6, 0],
            opacity: [0.2, 0.25, 0.15, 0.22, 0.2],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut",
            delay: 5
          }}
        />
        
        {/* Additional subtle corner glows */}
        <motion.div 
          className="absolute -top-20 -right-20 w-[250px] h-[250px] bg-blue-500/15 rounded-full blur-[80px]"
          animate={{
            opacity: [0.15, 0.2, 0.12, 0.18, 0.15],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut"
          }}
        />
        
        <motion.div 
          className="absolute -bottom-20 left-1/4 w-[220px] h-[220px] bg-green-400/15 rounded-full blur-[80px]"
          animate={{
            opacity: [0.15, 0.2, 0.12, 0.18, 0.15],
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
      <div className="absolute inset-0 bg-black/60 backdrop-blur-md -z-10"></div>
      
      {/* Conditional grid pattern for more depth - only on desktop */}
      {shouldUseComplexBG && (
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiMxQTIwMkMiIGZpbGwtb3BhY2l0eT0iMC4wNCI+PHBhdGggZD0iTTM2IDM0aDR2MWgtNHYtMXptMC0zaC00djFoNHYtMXptMC0yaC00djFoNHYtMXptLTYgMWgtNHYxaDR2LTF6TTEyIDEyaDR2MWgtNHYtMXptMC0zaC00djFoNHYtMXptMC0yaC00djFoNHYtMXptLTYgMWgtNHYxaDR2LTF6TTM2IDEyaDR2MWgtNHYtMXptMC0zaC00djFoNHYtMXptMC0yaC00djFoNHYtMXptLTYgMWgtNHYxaDR2LTF6TTEyIDM0aDR2MWgtNHYtMXptMC0zaC00djFoNHYtMXptMC0yaC00djFoNHYtMXptLTYgMWgtNHYxaDR2LTF6Ij48L3BhdGg+PC9nPjwvZz48L3N2Zz4=')] opacity-10"></div>
      )}
      
      {/* Improved radial gradient overlay with glass effect - simplified on mobile */}
      <div className={`absolute inset-0 bg-gradient-radial from-transparent via-transparent to-background/${shouldUseComplexBG ? '90' : '70'} opacity-${shouldUseComplexBG ? '80' : '60'} pointer-events-none`}></div>
      
      {/* Subtle glassmorphism layer - only on desktop */}
      {shouldUseComplexBG && (
        <div className="absolute inset-0 backdrop-blur-[2px] bg-black/5 pointer-events-none"></div>
      )}
    </div>
  );
};

export default DynamicBackground;
