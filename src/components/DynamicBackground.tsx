
import React, { useEffect, useState } from 'react';
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
  
  // Generate more blobs for enhanced background effect
  const blobCount = isMobile ? 3 : 6;
  
  // Create randomized blobs with memoization
  const [blobs, setBlobs] = useState<BackgroundBlob[]>([]);
  
  useEffect(() => {
    // Only generate blobs once on component mount
    if (!mounted) {
      const newBlobs: BackgroundBlob[] = [];
      
      // Enhanced colors with more variety and intensity for stronger glow effect
      const colors = [
        'from-plantDoc-primary/20 to-plantDoc-secondary/10',
        'from-plantDoc-secondary/20 to-plantDoc-primary/10',
        'from-plantDoc-accent/15 to-plantDoc-primary/10',
        'from-plantDoc-primary/15 to-plantDoc-accent/10',
        'from-green-400/15 to-blue-500/5',
        'from-blue-400/15 to-green-500/5'
      ];
      
      for (let i = 0; i < blobCount; i++) {
        newBlobs.push({
          id: i,
          x: `${Math.random() * 100}%`,
          y: `${Math.random() * 100}%`,
          size: `${isMobile ? 120 + Math.random() * 120 : 200 + Math.random() * 250}px`,
          color: colors[i % colors.length],
          delay: i * 0.2,
          duration: 8 + Math.random() * 4
        });
      }
      
      setBlobs(newBlobs);
      setMounted(true);
    }
  }, [isMobile, mounted, blobCount]);
  
  // Optimize rendering
  const renderBlobs = () => {
    return blobs.map((blob) => (
      <motion.div 
        key={blob.id}
        className={`absolute rounded-full bg-gradient-to-r ${blob.color} blur-3xl`}
        style={{ 
          left: blob.x,
          top: blob.y,
          width: blob.size,
          height: blob.size,
          opacity: 0.4
        }}
        animate={{
          x: [0, 15, -5, 0],
          y: [0, -5, 2, 0],
        }}
        transition={{
          duration: blob.duration,
          repeat: Infinity,
          repeatType: "reverse",
          delay: blob.delay,
          ease: "easeInOut"
        }}
      />
    ));
  };
  
  // Only render if component is mounted (client-side) to prevent hydration issues
  if (!mounted) return null;
  
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-[-1]">
      {renderBlobs()}
      
      {/* Enhanced glassmorphic background with stronger gradient overlay */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-md -z-10"></div>
      
      {/* Subtle grid pattern for more depth */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiMxQTIwMkMiIGZpbGwtb3BhY2l0eT0iMC4wNCI+PHBhdGggZD0iTTM2IDM0aDR2MWgtNHYtMXptMC0zaC00djFoNHYtMXptMC0yaC00djFoNHYtMXptLTYgMWgtNHYxaDR2LTF6TTEyIDEyaDR2MWgtNHYtMXptMC0zaC00djFoNHYtMXptMC0yaC00djFoNHYtMXptLTYgMWgtNHYxaDR2LTF6TTM2IDEyaDR2MWgtNHYtMXptMC0zaC00djFoNHYtMXptMC0yaC00djFoNHYtMXptLTYgMWgtNHYxaDR2LTF6TTEyIDM0aDR2MWgtNHYtMXptMC0zaC00djFoNHYtMXptMC0yaC00djFoNHYtMXptLTYgMWgtNHYxaDR2LTF6Ij48L3BhdGg+PC9nPjwvZz48L3N2Zz4=')] opacity-15"></div>
      
      {/* Radial gradient overlay for depth */}
      <div className="absolute inset-0 bg-radial-gradient from-transparent via-transparent to-background/90 pointer-events-none"></div>
      
      {/* Extra glassmorphic glows */}
      <div className="absolute top-1/3 -left-10 w-80 h-80 bg-plantDoc-primary/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-1/3 -right-10 w-96 h-96 bg-plantDoc-secondary/10 rounded-full blur-3xl"></div>
      
      {/* Additional glowing orbs */}
      <div className="absolute top-2/3 left-1/4 w-60 h-60 bg-plantDoc-accent/10 rounded-full blur-3xl opacity-60"></div>
      <div className="absolute bottom-3/4 right-1/3 w-48 h-48 bg-green-400/10 rounded-full blur-3xl opacity-50"></div>
    </div>
  );
};

export default DynamicBackground;
