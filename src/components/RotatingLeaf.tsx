
import React from 'react';
import { motion } from 'framer-motion';

const RotatingLeaf = () => {
  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <motion.div 
        className="relative w-64 h-64 md:w-72 md:h-72 flex items-center justify-center"
        animate={{ 
          rotate: [0, 5, -5, 0],
          scale: [1, 1.05, 0.98, 1]
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        <svg 
          viewBox="0 0 200 200" 
          className="w-full h-full"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Main leaf circle */}
          <circle cx="100" cy="100" r="90" fill="rgba(20, 83, 45, 0.05)" />
          <circle cx="100" cy="100" r="90" stroke="#4CAF50" strokeWidth="2" strokeOpacity="0.3" />
          
          {/* Leaf structure */}
          <motion.path
            d="M100,40 Q130,70 130,100 T100,160 T70,100 T100,40"
            fill="#4CAF50"
            fillOpacity="0.4"
            stroke="#4CAF50"
            strokeWidth="2"
            animate={{
              d: [
                "M100,40 Q130,70 130,100 T100,160 T70,100 T100,40",
                "M100,38 Q135,72 132,102 T98,162 T68,98 T100,38",
                "M100,42 Q125,68 128,98 T102,158 T72,102 T100,42",
                "M100,40 Q130,70 130,100 T100,160 T70,100 T100,40"
              ]
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          
          {/* Leaf veins */}
          <motion.path
            d="M100,40 L100,160 M70,100 L130,100"
            stroke="#4CAF50"
            strokeWidth="1"
            strokeOpacity="0.7"
            animate={{
              strokeOpacity: [0.7, 0.9, 0.7]
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          
          {/* Decorative elements */}
          <motion.circle 
            cx="100" cy="100" r="10" 
            fill="#8BC34A"
            fillOpacity="0.8"
            animate={{
              r: [10, 12, 9, 10],
              fillOpacity: [0.8, 0.9, 0.7, 0.8]
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          
          {/* Small decorative circles */}
          {[0, 60, 120, 180, 240, 300].map((angle, i) => (
            <motion.circle
              key={i}
              cx={100 + 60 * Math.cos(angle * Math.PI / 180)}
              cy={100 + 60 * Math.sin(angle * Math.PI / 180)}
              r="4"
              fill="#8BC34A"
              fillOpacity="0.5"
              animate={{
                r: [4, 5, 3, 4],
                fillOpacity: [0.5, 0.7, 0.4, 0.5]
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
                delay: i * 0.5
              }}
            />
          ))}
        </svg>
        
        {/* Glow effect */}
        <div className="absolute inset-0 rounded-full bg-plantDoc-primary/10 blur-xl -z-10"></div>
        
        {/* Pulse effect */}
        <motion.div
          className="absolute inset-0 rounded-full border-2 border-plantDoc-primary/20"
          animate={{
            scale: [1, 1.05, 1],
            opacity: [0.2, 0.5, 0.2]
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </motion.div>
      
      {/* Text overlay */}
      <motion.div 
        className="absolute bottom-0 left-0 right-0 text-center bg-black/30 backdrop-blur-sm py-2 rounded-b-full"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.5 }}
      >
        <p className="text-sm font-medium text-plantDoc-primary">Plant Vitality Monitor</p>
      </motion.div>
    </div>
  );
};

export default RotatingLeaf;
