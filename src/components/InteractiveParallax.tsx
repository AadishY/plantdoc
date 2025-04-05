
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
  intensity = 5 
}) => {
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const ref = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();
  
  // Don't apply effects on mobile for better performance
  if (isMobile) {
    return <div className={className}>{children}</div>;
  }
  
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    
    const rect = ref.current.getBoundingClientRect();
    
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
  };
  
  const handleMouseLeave = () => {
    // Reset position when mouse leaves
    setRotateX(0);
    setRotateY(0);
  };
  
  return (
    <motion.div
      ref={ref}
      className={`perspective-container relative ${className}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        perspective: 800,
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
          scale: 1.02,
          transition: { duration: 0.2 }
        }}
      >
        {/* Mouse-following subtle glow effect */}
        <motion.div
          className="absolute pointer-events-none w-[150px] h-[150px] rounded-full bg-plantDoc-primary/20 blur-[80px]"
          animate={{
            x: mousePosition.x - 75,
            y: mousePosition.y - 75
          }}
          transition={{ type: 'tween', ease: 'easeOut', duration: 0.2 }}
        />
        
        {children}
      </motion.div>
    </motion.div>
  );
};

export default InteractiveParallax;
