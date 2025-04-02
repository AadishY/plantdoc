
import React, { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';

// Simple 3D plant visualization using CSS transforms
const ThreeDPlant: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [rotation, setRotation] = React.useState({ x: 0, y: 0 });
  const [isInteracting, setIsInteracting] = React.useState(false);

  useEffect(() => {
    if (!containerRef.current) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current || !isInteracting) return;
      
      const rect = containerRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      
      // Calculate rotation based on mouse position relative to center
      const rotateY = ((e.clientX - centerX) / rect.width) * 25; // -25 to 25 degrees
      const rotateX = ((e.clientY - centerY) / rect.height) * -25; // 25 to -25 degrees (inverted)
      
      setRotation({ x: rotateX, y: rotateY });
    };

    const handleMouseLeave = () => {
      setIsInteracting(false);
      // Animate back to default position
      setRotation({ x: 0, y: 0 });
    };

    const handleMouseEnter = () => {
      setIsInteracting(true);
    };

    document.addEventListener('mousemove', handleMouseMove);
    containerRef.current.addEventListener('mouseleave', handleMouseLeave);
    containerRef.current.addEventListener('mouseenter', handleMouseEnter);
    
    // Touch events for mobile
    const handleTouchMove = (e: TouchEvent) => {
      if (!containerRef.current || !isInteracting || e.touches.length === 0) return;
      
      const touch = e.touches[0];
      const rect = containerRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      
      const rotateY = ((touch.clientX - centerX) / rect.width) * 25;
      const rotateX = ((touch.clientY - centerY) / rect.height) * -25;
      
      setRotation({ x: rotateX, y: rotateY });
    };

    const handleTouchStart = () => {
      setIsInteracting(true);
    };

    const handleTouchEnd = () => {
      setIsInteracting(false);
      setRotation({ x: 0, y: 0 });
    };

    containerRef.current.addEventListener('touchmove', handleTouchMove);
    containerRef.current.addEventListener('touchstart', handleTouchStart);
    containerRef.current.addEventListener('touchend', handleTouchEnd);
    
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      if (containerRef.current) {
        containerRef.current.removeEventListener('mouseleave', handleMouseLeave);
        containerRef.current.removeEventListener('mouseenter', handleMouseEnter);
        containerRef.current.removeEventListener('touchmove', handleTouchMove);
        containerRef.current.removeEventListener('touchstart', handleTouchStart);
        containerRef.current.removeEventListener('touchend', handleTouchEnd);
      }
    };
  }, [isInteracting]);

  // Gentle auto-rotation animation when not interacting
  useEffect(() => {
    if (isInteracting) return;
    
    let animationFrame: number;
    let angle = 0;
    
    const animate = () => {
      angle += 0.005;
      setRotation({
        x: Math.sin(angle) * 5,
        y: Math.cos(angle) * 5
      });
      
      animationFrame = requestAnimationFrame(animate);
    };
    
    animationFrame = requestAnimationFrame(animate);
    
    return () => {
      cancelAnimationFrame(animationFrame);
    };
  }, [isInteracting]);

  return (
    <div 
      ref={containerRef}
      className="w-full h-full flex items-center justify-center perspective-1000 bg-gradient-to-br from-black/40 to-black/10 cursor-grab active:cursor-grabbing"
    >
      <motion.div
        animate={{
          rotateX: rotation.x,
          rotateY: rotation.y,
        }}
        transition={{
          type: "spring",
          damping: 20,
          stiffness: 80
        }}
        className="plant-3d relative"
        style={{
          transformStyle: "preserve-3d",
          transformOrigin: "center center",
          width: '280px',
          height: '320px'
        }}
      >
        {/* Plant stem */}
        <div 
          className="absolute bg-plantDoc-primary/90 rounded-full"
          style={{
            width: '12px',
            height: '180px',
            top: '140px',
            left: '134px',
            transformStyle: "preserve-3d",
            transform: "translateZ(10px)"
          }}
        />
        
        {/* Leaves */}
        {[...Array(5)].map((_, index) => {
          const angle = (index * 72) + 20;
          const size = 80 + Math.random() * 30;
          const posZ = 10 + index * 5;
          
          return (
            <div 
              key={index}
              className="absolute bg-plantDoc-primary rounded-full"
              style={{
                width: `${size}px`,
                height: `${size * 1.8}px`,
                top: `${100 - index * 20}px`,
                left: `${140 - size/2}px`,
                transformStyle: "preserve-3d",
                transform: `rotateZ(${angle}deg) translateZ(${posZ}px)`,
                borderRadius: '50% 50% 50% 50% / 60% 60% 40% 40%',
                boxShadow: `0 5px 15px rgba(0,0,0,0.2), inset 0 -5px 15px rgba(0,0,0,0.1), inset 0 5px 10px rgba(255,255,255,0.2)`
              }}
            >
              {/* Leaf veins */}
              <div 
                className="absolute bg-plantDoc-primary/40"
                style={{
                  width: '2px',
                  height: '80%',
                  top: '10%',
                  left: '50%',
                  transform: "translateX(-50%)",
                  borderRadius: '2px',
                  boxShadow: '0 0 5px rgba(255,255,255,0.3)'
                }}
              />
              {[...Array(3)].map((_, veinIndex) => {
                const veinAngle = (veinIndex + 1) * 25;
                return (
                  <React.Fragment key={`vein-${veinIndex}`}>
                    <div 
                      className="absolute bg-plantDoc-primary/40"
                      style={{
                        width: '2px',
                        height: '40%',
                        top: '20%',
                        left: '50%',
                        transformOrigin: 'bottom center',
                        transform: `translateX(-50%) rotate(${veinAngle}deg)`,
                        borderRadius: '2px',
                      }}
                    />
                    <div 
                      className="absolute bg-plantDoc-primary/40"
                      style={{
                        width: '2px',
                        height: '40%',
                        top: '20%',
                        left: '50%',
                        transformOrigin: 'bottom center',
                        transform: `translateX(-50%) rotate(-${veinAngle}deg)`,
                        borderRadius: '2px',
                      }}
                    />
                  </React.Fragment>
                );
              })}
            </div>
          );
        })}
        
        {/* Flower/bloom at top */}
        <div
          className="absolute rounded-full bg-gradient-to-r from-yellow-300 to-amber-500"
          style={{
            width: '40px',
            height: '40px',
            top: '20px',
            left: '120px',
            transformStyle: "preserve-3d",
            transform: "translateZ(30px)",
            boxShadow: '0 0 20px rgba(255, 204, 0, 0.5)'
          }}
        >
          {/* Flower center */}
          <div
            className="absolute rounded-full bg-amber-700"
            style={{
              width: '20px',
              height: '20px',
              top: '10px',
              left: '10px',
              transformStyle: "preserve-3d",
              transform: "translateZ(2px)",
            }}
          />
        </div>
        
        {/* Soil/pot suggestion at bottom */}
        <div
          className="absolute rounded-2xl bg-gradient-to-r from-amber-900 to-amber-800"
          style={{
            width: '140px',
            height: '40px',
            bottom: '0',
            left: '70px',
            transformStyle: "preserve-3d",
            transform: "translateZ(5px) rotateX(70deg)",
            boxShadow: 'inset 0 5px 10px rgba(0,0,0,0.3)'
          }}
        />
        
        {/* Pot */}
        <div
          className="absolute rounded-xl bg-gradient-to-r from-plantDoc-secondary/80 to-plantDoc-primary/80"
          style={{
            width: '180px',
            height: '100px',
            bottom: '-30px',
            left: '50px',
            transformStyle: "preserve-3d",
            transform: "translateZ(0px)",
            borderRadius: '15px 15px 30px 30px',
            boxShadow: '0 10px 20px rgba(0,0,0,0.3), inset 0 5px 10px rgba(255,255,255,0.2)'
          }}
        />
      </motion.div>

      {/* Instructions */}
      <div className="absolute bottom-4 left-0 right-0 text-center text-sm text-white/50">
        {isInteracting ? 'Move to rotate the plant' : 'Click and drag to interact'}
      </div>
    </div>
  );
};

export default ThreeDPlant;
