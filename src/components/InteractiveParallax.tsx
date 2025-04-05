
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
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const ref = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();
  
  // Performance optimization - throttle mouse move events
  const throttleRef = useRef<number | null>(null);
  
  // Don't apply effects on mobile for better performance
  if (isMobile) {
    return <div className={className}>{children}</div>;
  }
  
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current || throttleRef.current) return;
    
    // Add throttling for better performance
    throttleRef.current = window.setTimeout(() => {
      throttleRef.current = null;
      
      const rect = ref.current!.getBoundingClientRect();
      
      // Calculate position from center of element (in percentages)
      const x = (e.clientX - rect.left - rect.width / 2) / (rect.width / 2);
      const y = (e.clientY - rect.top - rect.height / 2) / (rect.height / 2);
      
      // Apply rotation based on mouse position and intensity
      setRotateX(-y * intensity);
      setRotateY(x * intensity);
      
      // Track mouse position for glow effect
      setMousePosition({ 
        x: e.clientX - rect.left, 
        y: e.clientY - rect.top 
      });
    }, 16); // 16ms throttle (matches 60fps)
  };
  
  const handleMouseLeave = () => {
    // Reset position when mouse leaves with a smooth transition
    setRotateX(0);
    setRotateY(0);
  };
  
  // Clean up any pending timeouts
  useEffect(() => {
    return () => {
      if (throttleRef.current) {
        clearTimeout(throttleRef.current);
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
        {/* Fixed position subtle glow effect - not mouse following */}
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
