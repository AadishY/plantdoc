
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
  
  // Generate fewer blobs on mobile to improve performance
  const blobCount = isMobile ? 4 : 8;
  
  // Create randomized blobs with memoization
  const [blobs, setBlobs] = useState<BackgroundBlob[]>([]);
  
  useEffect(() => {
    // Only generate blobs once on component mount
    if (!mounted) {
      const newBlobs: BackgroundBlob[] = [];
      
      for (let i = 0; i < blobCount; i++) {
        newBlobs.push({
          id: i,
          x: `${Math.random() * 100}%`,
          y: `${Math.random() * 100}%`,
          size: `${isMobile ? 150 + Math.random() * 150 : 200 + Math.random() * 300}px`,
          color: i % 3 === 0 
            ? 'from-plantDoc-primary/30 to-plantDoc-secondary/20' 
            : i % 3 === 1 
              ? 'from-plantDoc-secondary/20 to-plantDoc-primary/10'
              : 'from-accent/20 to-plantDoc-primary/10',
          delay: i * 0.5,
          duration: 15 + Math.random() * 10
        });
      }
      
      setBlobs(newBlobs);
      setMounted(true);
    }
  }, [isMobile, mounted]);
  
  // Optimize rendering with useCallback
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
          opacity: 0.3
        }}
        animate={{
          x: [0, 30, -20, 10, 0],
          y: [0, -20, 10, -5, 0],
          scale: [1, 1.05, 0.98, 1.02, 1],
        }}
        transition={{
          duration: blob.duration,
          repeat: Infinity,
          repeatType: "reverse",
          delay: blob.delay,
        }}
      />
    ));
  };
  
  // Only render if component is mounted (client-side) to prevent hydration issues
  if (!mounted) return null;
  
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {renderBlobs()}
      
      {/* Enhanced background with darker overlay */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm -z-10"></div>
      
      {/* Grid pattern for more modern look */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiMxQTIwMkMiIGZpbGwtb3BhY2l0eT0iMC4wNCI+PHBhdGggZD0iTTM2IDM0aDR2MWgtNHYtMXptMC0zaC00djFoNHYtMXptMC0yaC00djFoNHYtMXptLTYgMWgtNHYxaDR2LTF6TTEyIDEyaDR2MWgtNHYtMXptMC0zaC00djFoNHYtMXptMC0yaC00djFoNHYtMXptLTYgMWgtNHYxaDR2LTF6TTM2IDEyaDR2MWgtNHYtMXptMC0zaC00djFoNHYtMXptMC0yaC00djFoNHYtMXptLTYgMWgtNHYxaDR2LTF6TTEyIDM0aDR2MWgtNHYtMXptMC0zaC00djFoNHYtMXptMC0yaC00djFoNHYtMXptLTYgMWgtNHYxaDR2LTF6Ij48L3BhdGg+PC9nPjwvZz48L3N2Zz4=')] opacity-20"></div>
      
      {/* Radial gradient overlay for depth */}
      <div className="absolute inset-0 bg-radial-gradient from-transparent via-transparent to-background/80 pointer-events-none"></div>
    </div>
  );
};

export default DynamicBackground;
