
import React from 'react';
import { motion, useAnimation } from 'framer-motion';

const RotatingLeaf = () => {
  const controls1 = useAnimation();
  const controls2 = useAnimation();
  const controls3 = useAnimation();
  
  React.useEffect(() => {
    controls1.start({
      rotate: 360,
      transition: {
        repeat: Infinity,
        duration: 24,
        ease: "linear",
      }
    });
    
    controls2.start({
      rotate: -360,
      transition: {
        repeat: Infinity,
        duration: 30,
        ease: "linear",
      }
    });
    
    controls3.start({
      rotate: 360,
      transition: {
        repeat: Infinity,
        duration: 36,
        ease: "linear",
      }
    });
  }, [controls1, controls2, controls3]);

  return (
    <div className="relative w-72 h-72">
      <motion.div
        className="absolute top-0 left-0 w-full h-full flex items-center justify-center"
        initial={{ rotate: 0 }}
        animate={controls1}
      >
        <motion.img
          src="/images/leaf-1.png"
          alt="Leaf"
          className="w-48 h-48 object-contain opacity-70"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 0.7, scale: 1 }}
          transition={{
            duration: 1.5,
            ease: "easeInOut",
          }}
        />
      </motion.div>

      <motion.div
        className="absolute top-0 left-0 w-full h-full flex items-center justify-center"
        initial={{ rotate: 0 }}
        animate={controls2}
      >
        <motion.img
          src="/images/leaf-2.png"
          alt="Leaf"
          className="w-40 h-40 object-contain opacity-70"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 0.7, scale: 1 }}
          transition={{
            duration: 1.5,
            ease: "easeInOut",
          }}
        />
      </motion.div>

      <motion.div
        className="absolute top-0 left-0 w-full h-full flex items-center justify-center"
        initial={{ rotate: 0 }}
        animate={controls3}
      >
        <motion.img
          src="/images/leaf-3.png"
          alt="Leaf"
          className="w-32 h-32 object-contain opacity-70"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 0.7, scale: 1 }}
          transition={{
            duration: 1.5,
            ease: "easeInOut",
          }}
        />
      </motion.div>
    </div>
  );
};

export default RotatingLeaf;
