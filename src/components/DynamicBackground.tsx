
import React, { useEffect, useState, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useIsMobile } from '@/hooks/use-mobile';

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
  const isMobile = useIsMobile();
  const [mounted, setMounted] = useState(false);
  const backgroundRef = useRef<HTMLDivElement>(null);
  
  // Generate fewer blobs for better performance but with more vibrant colors
  const blobCount = isMobile ? 3 : 5;
  
  // Create randomized blobs with memoization
  const [blobs, setBlobs] = useState<BackgroundBlob[]>([]);
  
  useEffect(() => {
    // Only generate blobs once on component mount
    if (!mounted) {
      const newBlobs: BackgroundBlob[] = [];
      
      // Enhanced colors with moderated intensity for better visibility without overwhelming
      const colors = [
        'from-plantDoc-primary/20 to-plantDoc-secondary/15',
        'from-plantDoc-secondary/25 to-plantDoc-primary/15',
        'from-plantDoc-accent/20 to-plantDoc-primary/15',
        'from-plantDoc-primary/20 to-plantDoc-accent/15',
        'from-green-400/20 to-blue-500/15',
      ];
      
      for (let i = 0; i < blobCount; i++) {
        newBlobs.push({
          id: i,
          x: `${Math.random() * 100}%`,
          y: `${Math.random() * 100}%`,
          // Reduced size for more focused, less overwhelming glows
          size: `${isMobile ? 150 + Math.random() * 100 : 200 + Math.random() * 300}px`,
          color: colors[i % colors.length],
          delay: i * 0.3,
          duration: 25 + Math.random() * 15
        });
      }
      
      setBlobs(newBlobs);
      setMounted(true);
    }
  }, [isMobile, mounted, blobCount]);
  
  // Optimized blob rendering with more balanced size and opacity
  const renderBlobs = useCallback(() => {
    return blobs.map((blob) => (
      <motion.div 
        key={blob.id}
        className={`absolute rounded-full bg-gradient-to-r ${blob.color} blur-[100px] opacity-60`}
        style={{ 
          left: blob.x,
          top: blob.y,
          width: blob.size,
          height: blob.size,
        }}
        animate={{
          x: [0, 50, -30, 20, -15, 0],
          y: [0, -30, 20, -25, 10, 0],
          scale: [1, 1.1, 0.95, 1.05, 0.98, 1],
          opacity: [0.5, 0.6, 0.4, 0.55, 0.5, 0.5],
        }}
        transition={{
          duration: blob.duration,
          repeat: Infinity,
          repeatType: "reverse",
          delay: blob.delay,
          ease: "easeInOut",
          times: [0, 0.2, 0.4, 0.6, 0.8, 1]
        }}
      />
    ));
  }, [blobs]);
  
  // Enhanced ambient glow effects with more focused positioning and reduced size
  const renderAmbientGlows = useCallback(() => {
    return (
      <>
        {/* Left top glow */}
        <motion.div 
          className="absolute top-1/4 -left-10 w-[400px] h-[400px] bg-plantDoc-primary/20 rounded-full blur-[120px]"
          animate={{
            x: [0, 30, -20, 15, 0],
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
          className="absolute bottom-1/4 -right-10 w-[450px] h-[450px] bg-plantDoc-secondary/20 rounded-full blur-[120px]"
          animate={{
            x: [0, -40, 20, -15, 0],
            opacity: [0.2, 0.26, 0.18, 0.24, 0.2],
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
          className="absolute top-2/3 left-1/3 w-[350px] h-[350px] bg-plantDoc-accent/15 rounded-full blur-[100px]"
          animate={{
            x: [0, 20, -15, 10, 0],
            y: [0, -15, 10, -8, 0],
            opacity: [0.15, 0.2, 0.12, 0.18, 0.15],
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
          className="absolute -top-20 -right-20 w-[300px] h-[300px] bg-blue-500/10 rounded-full blur-[100px]"
          animate={{
            opacity: [0.1, 0.15, 0.08, 0.12, 0.1],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut"
          }}
        />
        
        <motion.div 
          className="absolute -bottom-20 left-1/4 w-[250px] h-[250px] bg-green-400/10 rounded-full blur-[100px]"
          animate={{
            opacity: [0.1, 0.14, 0.08, 0.12, 0.1],
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
  }, []);
  
  // Only render if component is mounted (client-side) to prevent hydration issues
  if (!mounted) return null;
  
  return (
    <div ref={backgroundRef} className="fixed inset-0 overflow-hidden pointer-events-none z-[-1]">
      {renderBlobs()}
      {renderAmbientGlows()}
      
      {/* Enhanced glassmorphic background with subtle gradient overlay */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-md -z-10"></div>
      
      {/* Subtle grid pattern for more depth - opacity reduced */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiMxQTIwMkMiIGZpbGwtb3BhY2l0eT0iMC4wNCI+PHBhdGggZD0iTTM2IDM0aDR2MWgtNHYtMXptMC0zaC00djFoNHYtMXptMC0yaC00djFoNHYtMXptLTYgMWgtNHYxaDR2LTF6TTEyIDEyaDR2MWgtNHYtMXptMC0zaC00djFoNHYtMXptMC0yaC00djFoNHYtMXptLTYgMWgtNHYxaDR2LTF6TTM2IDEyaDR2MWgtNHYtMXptMC0zaC00djFoNHYtMXptMC0yaC00djFoNHYtMXptLTYgMWgtNHYxaDR2LTF6TTEyIDM0aDR2MWgtNHYtMXptMC0zaC00djFoNHYtMXptMC0yaC00djFoNHYtMXptLTYgMWgtNHYxaDR2LTF6Ij48L3BhdGg+PC9nPjwvZz48L3N2Zz4=')] opacity-10"></div>
      
      {/* Radial gradient overlay for depth */}
      <div className="absolute inset-0 bg-radial-gradient from-transparent via-transparent to-background/80 pointer-events-none"></div>
    </div>
  );
};

export default DynamicBackground;
