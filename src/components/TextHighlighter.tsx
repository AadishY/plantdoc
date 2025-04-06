
import React, { useState, useEffect, useCallback, memo } from 'react';
import { motion } from 'framer-motion';
import { useDeviceOptimizer } from '@/hooks/use-mobile';

const TextHighlighter: React.FC = memo(() => {
  const [isVisible, setIsVisible] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const { shouldUseEffects } = useDeviceOptimizer();
  
  // Only run on desktop devices
  useEffect(() => {
    // Skip entirely on mobile devices
    if (!shouldUseEffects) {
      setIsVisible(false);
      return;
    }
    
    setIsVisible(true);
    
    // Throttle function to improve performance
    let lastRun = 0;
    const throttleTime = 16; // ms between updates (around 60fps)
    const rafId = { current: 0 };
    
    const handleMouseMove = (e: MouseEvent) => {
      const now = performance.now();
      if (now - lastRun < throttleTime) return;
      
      lastRun = now;
      
      if (rafId.current) {
        cancelAnimationFrame(rafId.current);
      }
      
      rafId.current = requestAnimationFrame(() => {
        setPosition({ x: e.clientX, y: e.clientY });
      });
    };
    
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (rafId.current) {
        cancelAnimationFrame(rafId.current);
      }
    };
  }, [shouldUseEffects]);
  
  if (!isVisible) return null;
  
  return (
    <motion.div
      className="pointer-events-none fixed inset-0 z-30 mix-blend-soft-light opacity-60"
      style={{ 
        background: `radial-gradient(500px circle at ${position.x}px ${position.y}px, rgba(76, 175, 80, 0.12), transparent 40%)` 
      }}
      animate={{
        background: `radial-gradient(500px circle at ${position.x}px ${position.y}px, rgba(76, 175, 80, 0.12), transparent 40%)`
      }}
      transition={{ type: "tween", ease: "easeOut", duration: 0.15 }}
    />
  );
});

TextHighlighter.displayName = 'TextHighlighter';

export default TextHighlighter;
