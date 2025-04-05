
import React, { useEffect, useState, useRef } from 'react';
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
  
  // Generate fewer blobs for better performance
  const blobCount = isMobile ? 3 : 5;
  
  // Create randomized blobs with memoization
  const [blobs, setBlobs] = useState<BackgroundBlob[]>([]);
  
  useEffect(() => {
    // Only generate blobs once on component mount
    if (!mounted) {
      const newBlobs: BackgroundBlob[] = [];
      
      // Enhanced colors with more variety but slightly lower intensity
      const colors = [
        'from-plantDoc-primary/15 to-plantDoc-secondary/10',
        'from-plantDoc-secondary/20 to-plantDoc-primary/12',
        'from-plantDoc-accent/15 to-plantDoc-primary/8',
        'from-plantDoc-primary/15 to-plantDoc-accent/8',
        'from-green-400/15 to-blue-500/8',
        'from-blue-400/15 to-green-500/8',
      ];
      
      for (let i = 0; i < blobCount; i++) {
        newBlobs.push({
          id: i,
          x: `${Math.random() * 100}%`,
          y: `${Math.random() * 100}%`,
          size: `${isMobile ? 150 + Math.random() * 150 : 250 + Math.random() * 300}px`,
          color: colors[i % colors.length],
          delay: i * 0.3,
          duration: 25 + Math.random() * 15 // Slower movement for more fluid feel
        });
      }
      
      setBlobs(newBlobs);
      setMounted(true);
    }
  }, [isMobile, mounted, blobCount]);
  
  // Enhanced blob rendering with more pronounced movement
  const renderBlobs = () => {
    return blobs.map((blob) => (
      <motion.div 
        key={blob.id}
        className={`absolute rounded-full bg-gradient-to-r ${blob.color} blur-[120px] opacity-40`}
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
          opacity: [0.4, 0.5, 0.35, 0.45, 0.4, 0.4],
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
  };
  
  // Fixed ambient glow effects that don't rely on mouse movement
  const renderAmbientGlows = () => {
    return (
      <>
        <motion.div 
          className="absolute top-1/4 -left-20 w-[500px] h-[500px] bg-plantDoc-primary/12 rounded-full blur-[150px]"
          animate={{
            x: [0, 40, -30, 20, 0],
            opacity: [0.15, 0.22, 0.12, 0.18, 0.15],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut"
          }}
        />
        <motion.div 
          className="absolute bottom-1/4 -right-20 w-[600px] h-[600px] bg-plantDoc-secondary/12 rounded-full blur-[150px]"
          animate={{
            x: [0, -50, 30, -20, 0],
            opacity: [0.15, 0.2, 0.12, 0.22, 0.15],
          }}
          transition={{
            duration: 30,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut",
            delay: 2
          }}
        />
        <motion.div 
          className="absolute top-2/3 left-1/3 w-[400px] h-[400px] bg-plantDoc-accent/10 rounded-full blur-[120px]"
          animate={{
            x: [0, 30, -20, 15, 0],
            y: [0, -20, 15, -10, 0],
            opacity: [0.12, 0.18, 0.1, 0.15, 0.12],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut",
            delay: 5
          }}
        />
      </>
    );
  };
  
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
      
      {/* Radial gradient overlay for depth - slightly reduced opacity */}
      <div className="absolute inset-0 bg-radial-gradient from-transparent via-transparent to-background/70 pointer-events-none"></div>
    </div>
  );
};

export default DynamicBackground;
