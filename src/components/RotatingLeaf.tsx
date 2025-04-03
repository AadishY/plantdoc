import React from 'react';
import { motion } from 'framer-motion';

const RotatingLeaf = () => {
  return (
    <div className="relative">
      <motion.div
        className="absolute top-0 left-0 w-full h-full flex items-center justify-center"
        initial={{ rotate: 0 }}
        animate={{ rotate: 360 }}
        transition={{
          repeat: Infinity,
          duration: 24,
          ease: "linear",
        }}
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
        animate={{ rotate: -360 }}
        transition={{
          repeat: Infinity,
          duration: 30,
          ease: "linear",
        }}
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
        animate={{ rotate: 360 }}
        transition={{
          repeat: Infinity,
          duration: 36,
          ease: "linear",
        }}
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
