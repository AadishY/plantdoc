
import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface InteractiveParallaxProps {
  children: React.ReactNode;
  className?: string;
  intensity?: number;
}

const InteractiveParallax: React.FC<InteractiveParallaxProps> = ({ 
  children, 
  className = "", 
  intensity = 5 // Reduced intensity for better performance
}) => {
  const [isHovering, setIsHovering] = useState(false);
  
  return (
    <motion.div
      className={`perspective-container ${className}`}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      style={{
        perspective: 1000,
        transformStyle: "preserve-3d",
      }}
    >
      <motion.div
        style={{
          transformStyle: "preserve-3d",
        }}
        whileHover={{
          scale: 1.02,
          transition: { duration: 0.2 }
        }}
      >
        {children}
      </motion.div>
    </motion.div>
  );
};

export default InteractiveParallax;
