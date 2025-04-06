
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useDeviceOptimizer } from '@/hooks/use-mobile';

interface InteractiveParallaxProps {
  children: React.ReactNode;
  className?: string;
  intensity?: number;
}

const InteractiveParallax: React.FC<InteractiveParallaxProps> = ({ 
  children, 
  className = "", 
  intensity = 3 // Reduced default intensity for better performance
}) => {
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const ref = useRef<HTMLDivElement>(null);
  const { shouldUseEffects } = useDeviceOptimizer();
  const rafRef = useRef<number | null>(null);
  const lastMoveTime = useRef<number>(0);
  
  // Don't apply effects on mobile for better performance
  if (!shouldUseEffects) {
    return <div className={className}>{children}</div>;
  }
  
  // Optimized handler using requestAnimationFrame and throttling
  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current || rafRef.current) return;
    
    // Throttle updates to once per 16ms (approx 60fps) for performance
    const now = Date.now();
    if (now - lastMoveTime.current < 16) return;
    lastMoveTime.current = now;
    
    rafRef.current = requestAnimationFrame(() => {
      rafRef.current = null;
      
      const rect = ref.current!.getBoundingClientRect();
      
      // Calculate position from center of element (in percentages)
      const x = (e.clientX - rect.left - rect.width / 2) / (rect.width / 2);
      const y = (e.clientY - rect.top - rect.height / 2) / (rect.height / 2);
      
      // Apply rotation based on mouse position and intensity - limited for better performance
      setRotateX(-y * intensity);
      setRotateY(x * intensity);
      
      // Track mouse position for glow effect
      setMousePosition({ 
        x: Math.min(Math.max(0, e.clientX - rect.left), rect.width), 
        y: Math.min(Math.max(0, e.clientY - rect.top), rect.height)
      });
    });
  }, [intensity]);
  
  const handleMouseLeave = useCallback(() => {
    // Reset position when mouse leaves with a smooth transition
    setRotateX(0);
    setRotateY(0);
  }, []);
  
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
      className={`perspective-container relative will-change-auto ${className}`}
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
          transition: { duration: 0.15 }
        }}
      >
        {/* Enhanced glow effect - more performance friendly */}
        <div
          className="absolute pointer-events-none inset-0 rounded-xl bg-plantDoc-primary/12 blur-[35px] opacity-60 gpu-accelerate"
        />
        
        {children}
      </motion.div>
    </motion.div>
  );
};

export default InteractiveParallax;
