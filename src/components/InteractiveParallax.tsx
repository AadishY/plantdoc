
import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useIsMobile } from '@/hooks/use-mobile';

interface InteractiveParallaxProps {
  children: React.ReactNode;
  className?: string;
  intensity?: number;
}

const InteractiveParallax: React.FC<InteractiveParallaxProps> = ({ 
  children, 
  className = "", 
  intensity = 4  // Reduced default intensity for subtlety
}) => {
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();
  
  // Performance optimization - use requestAnimationFrame for better performance
  const rafRef = useRef<number | null>(null);
  const lastMoveTime = useRef<number>(0);
  const FPS_LIMIT = 30; // Limit to 30 FPS for better performance
  const FRAME_MIN_TIME = 1000 / FPS_LIMIT;
  
  // Don't apply effects on mobile for better performance
  if (isMobile) {
    return <div className={className}>{children}</div>;
  }
  
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    
    const now = performance.now();
    const elapsed = now - lastMoveTime.current;
    
    // Throttle based on requestAnimationFrame and FPS limit
    if (elapsed > FRAME_MIN_TIME) {
      lastMoveTime.current = now;
      
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
      
      rafRef.current = requestAnimationFrame(() => {
        const rect = ref.current!.getBoundingClientRect();
        
        // Calculate position from center of element (in percentages)
        const x = (e.clientX - rect.left - rect.width / 2) / (rect.width / 2);
        const y = (e.clientY - rect.top - rect.height / 2) / (rect.height / 2);
        
        // Apply rotation based on mouse position and intensity
        setRotateX(-y * intensity);
        setRotateY(x * intensity);
      });
    }
  };
  
  const handleMouseLeave = () => {
    // Reset position when mouse leaves with a smooth transition
    setRotateX(0);
    setRotateY(0);
  };
  
  // Clean up any pending animation frames
  useEffect(() => {
    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, []);
  
  return (
    <motion.div
      ref={ref}
      className={`perspective-container relative ${className}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        perspective: 1000,
        transformStyle: "preserve-3d",
      }}
    >
      <motion.div
        style={{
          transformStyle: "preserve-3d",
          rotateX: rotateX,
          rotateY: rotateY,
          transition: "transform 0.2s ease-out", 
        }}
        initial={{ scale: 1 }}
        whileHover={{ 
          scale: 1.01, 
          transition: { duration: 0.2 }
        }}
      >
        {/* Fixed position subtle glow effect - optimized */}
        <div
          className="absolute pointer-events-none inset-0 rounded-xl bg-plantDoc-primary/10 blur-[60px] opacity-60"
          style={{
            transform: `translate3d(0, 0, 0)`, // Force GPU acceleration
          }}
        />
        
        {children}
      </motion.div>
    </motion.div>
  );
};

export default InteractiveParallax;
