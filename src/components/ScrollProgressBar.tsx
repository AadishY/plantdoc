import React from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';

export const ScrollProgressBar: React.FC = () => {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 140,
    damping: 30,
    restDelta: 0.001
  });

  return (
    <div className="fixed top-0 left-0 right-0 h-[3.5px] z-[100] pointer-events-none">
      <motion.div
        className="w-full h-full bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-300 origin-left shadow-[0_0_15px_#10B981,0_0_30px_#34D399]"
        style={{ scaleX }}
      />
    </div>
  );
};

export default ScrollProgressBar;
