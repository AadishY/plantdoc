
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
    }, 10); // 10ms throttle
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
          transition: "transform 0.15s ease-out", // Faster for more responsive feel
        }}
        initial={{ scale: 1 }}
        whileHover={{ 
          scale: 1.01, // Subtler scale effect
          transition: { duration: 0.2 }
        }}
      >
        {/* Mouse-following subtle glow effect */}
        <motion.div
          className="absolute pointer-events-none w-[150px] h-[150px] rounded-full bg-plantDoc-primary/15 blur-[80px] opacity-70 gpu-accelerate"
          animate={{
            x: mousePosition.x - 75,
            y: mousePosition.y - 75
          }}
          transition={{ type: 'tween', ease: 'easeOut', duration: 0.1 }} // Faster for more responsive feel
        />
        
        {children}
      </motion.div>
    </motion.div>
  );
};

export default InteractiveParallax;
