
import React from 'react';
import { motion } from 'framer-motion';

const RotatingLeaf = () => {
  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <div className="w-64 h-64 md:w-72 md:h-72 relative rounded-full overflow-hidden">
        <img 
          src="https://cdn.jsdelivr.net/gh/AadishY/plantdoc@main/public/live.gif"
          alt="Plant Growth"
          className="w-full h-full object-cover rounded-full"
        />
      </div>
    </div>
  );
};

export default RotatingLeaf;
