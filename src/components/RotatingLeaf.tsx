
import React from 'react';
import { motion } from 'framer-motion';

const RotatingLeaf = () => {
  return (
    <div className="relative w-72 h-72 flex items-center justify-center">
      <motion.div
        className="rounded-full overflow-hidden bg-plantDoc-primary/10 p-2"
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{
          duration: 1,
          ease: "easeInOut",
        }}
      >
        <img 
          src="https://cdn.jsdelivr.net/gh/AadishY/plantdoc@main/public/live.gif"
          alt="Plant Growth"
          className="w-64 h-64 object-contain"
        />
      </motion.div>
    </div>
  );
};

export default RotatingLeaf;
