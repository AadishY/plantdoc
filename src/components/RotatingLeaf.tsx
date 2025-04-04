
import React from 'react';
import { motion } from 'framer-motion';

const RotatingLeaf = () => {
  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <motion.div
        className="rounded-full overflow-hidden bg-gradient-to-r from-plantDoc-primary/30 to-plantDoc-secondary/20 p-3 flex items-center justify-center glass-card"
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{
          duration: 0.8,
          ease: "easeInOut",
        }}
        whileHover={{ 
          scale: 1.05,
          boxShadow: "0 0 30px rgba(76, 175, 80, 0.3)",
        }}
      >
        <motion.div 
          className="w-72 h-72 md:w-80 md:h-80 relative rounded-full overflow-hidden border-2 border-plantDoc-primary/20"
          whileHover={{ rotate: 5 }}
          transition={{ duration: 0.5 }}
        >
          <img 
            src="https://cdn.jsdelivr.net/gh/AadishY/plantdoc@main/public/live.gif"
            alt="Plant Growth"
            className="w-full h-full object-cover rounded-full"
          />
          {/* Plain circle GIF without effects */}
        </motion.div>
      </motion.div>
    </div>
  );
};

export default RotatingLeaf;
