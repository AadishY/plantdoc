
import React from 'react';
import { motion } from 'framer-motion';

const RotatingLeaf = () => {
  return (
    <div className="relative w-80 h-80 flex items-center justify-center">
      <motion.div
        className="rounded-full overflow-hidden bg-plantDoc-primary/10 p-2 flex items-center justify-center"
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{
          duration: 0.8,
          ease: "easeInOut",
        }}
      >
        <img 
          src="https://cdn.jsdelivr.net/gh/AadishY/plantdoc@main/public/live.gif"
          alt="Plant Growth"
          className="w-72 h-72 object-cover rounded-full"
        />
      </motion.div>
    </div>
  );
};

export default RotatingLeaf;
