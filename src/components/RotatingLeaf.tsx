
import React, { useRef, useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';

const RotatingLeaf: React.FC = () => {
  const leafRef = useRef<HTMLDivElement>(null);
  const controls = useAnimation();
  
  useEffect(() => {
    let mouseX = 0;
    let mouseY = 0;
    
    const handleMouseMove = (e: MouseEvent) => {
      if (!leafRef.current) return;
      
      const rect = leafRef.current.getBoundingClientRect();
      const leafCenterX = rect.left + rect.width / 2;
      const leafCenterY = rect.top + rect.height / 2;
      
      // Calculate mouse position relative to leaf center
      mouseX = (e.clientX - leafCenterX) / 25;
      mouseY = (e.clientY - leafCenterY) / 25;
      
      controls.start({
        rotateY: mouseX,
        rotateX: -mouseY,
        transition: {
          type: "spring",
          damping: 20,
          stiffness: 100
        }
      });
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [controls]);
  
  // Create the animation sequence
  useEffect(() => {
    const sequence = async () => {
      await controls.start({
        rotateY: 0,
        rotateX: 0,
        scale: 1,
        transition: { duration: 1 }
      });
      
      // Add a gentle hover animation when not interacting
      controls.start({
        y: [0, -5, 0],
        transition: {
          duration: 2,
          repeat: Infinity,
          repeatType: "reverse",
          ease: "easeInOut"
        }
      });
    };
    
    sequence();
  }, [controls]);
  
  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <motion.div
        ref={leafRef}
        animate={controls}
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="w-80 h-80 perspective-1000"
        style={{
          transformStyle: "preserve-3d",
          transformOrigin: "center center"
        }}
      >
        <div className="w-full h-full relative">
          {/* Leaf background with glow */}
          <div className="absolute inset-0 bg-plantDoc-primary/20 rounded-full blur-3xl animate-pulse-glow"></div>
          
          {/* Leaf image */}
          <div className="absolute inset-0 flex items-center justify-center">
            <img
              src="https://cdn.jsdelivr.net/gh/AadishY/plantdoc@main/public/live.gif"
              alt="Plant leaf"
              className="object-cover rounded-full w-64 h-64 glass-card shadow-xl border-2 border-plantDoc-primary/30"
            />
          </div>
          
          {/* Particle effects */}
          <div className="absolute inset-0">
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-3 h-3 bg-plantDoc-primary/60 rounded-full"
                style={{
                  top: `${Math.random() * 100}%`,
                  left: `${Math.random() * 100}%`,
                  transformStyle: "preserve-3d",
                  transform: `translateZ(${Math.random() * 20 + 10}px)`
                }}
                animate={{
                  y: [0, -20, 0],
                  opacity: [0, 1, 0],
                  scale: [0, 1.5, 0]
                }}
                transition={{
                  duration: 2 + Math.random() * 2,
                  repeat: Infinity,
                  delay: Math.random() * 2
                }}
              />
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default RotatingLeaf;
