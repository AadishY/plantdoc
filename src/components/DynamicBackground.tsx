
import React from 'react';
import { motion } from 'framer-motion';

const DynamicBackground = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {/* Large animated gradient blobs */}
      <motion.div 
        className="absolute -top-[300px] -right-[300px] w-[600px] h-[600px] rounded-full bg-gradient-to-r from-plantDoc-primary/30 to-plantDoc-secondary/20 blur-3xl"
        animate={{
          x: [0, 30, 0],
          y: [0, -20, 0],
          scale: [1, 1.05, 1],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          repeatType: "reverse",
        }}
      />
      
      <motion.div 
        className="absolute top-[30%] -left-[200px] w-[400px] h-[400px] rounded-full bg-gradient-to-r from-plantDoc-secondary/20 to-plantDoc-primary/10 blur-3xl"
        animate={{
          x: [0, -20, 0],
          y: [0, 30, 0],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          repeatType: "reverse",
          delay: 2,
        }}
      />
      
      <motion.div 
        className="absolute bottom-[10%] right-[5%] w-[300px] h-[300px] rounded-full bg-gradient-to-r from-accent/20 to-plantDoc-primary/10 blur-3xl"
        animate={{
          x: [0, 30, 0],
          y: [0, 20, 0],
          scale: [1, 1.08, 1],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          repeatType: "reverse",
          delay: 5,
        }}
      />
      
      {/* Smaller floating elements */}
      <motion.div 
        className="absolute top-[15%] left-[10%] w-[150px] h-[150px] rounded-full bg-plantDoc-primary/20 blur-2xl"
        animate={{
          x: [0, 20, 0],
          y: [0, -15, 0],
          opacity: [0.7, 0.9, 0.7],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          repeatType: "reverse",
          delay: 1,
        }}
      />
      
      <motion.div 
        className="absolute top-[45%] right-[15%] w-[100px] h-[100px] rounded-full bg-accent/20 blur-2xl"
        animate={{
          x: [0, -15, 0],
          y: [0, 15, 0],
          opacity: [0.5, 0.8, 0.5],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          repeatType: "reverse",
          delay: 3,
        }}
      />
      
      <motion.div 
        className="absolute bottom-[25%] left-[20%] w-[120px] h-[120px] rounded-full bg-plantDoc-secondary/20 blur-2xl"
        animate={{
          x: [0, 25, 0],
          y: [0, 10, 0],
          opacity: [0.6, 0.9, 0.6],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          repeatType: "reverse",
          delay: 6,
        }}
      />
      
      {/* Radial gradient overlay */}
      <div className="absolute inset-0 bg-radial-gradient from-transparent via-transparent to-background/80 pointer-events-none"></div>
      
      {/* Grid pattern */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiMxQTIwMkMiIGZpbGwtb3BhY2l0eT0iMC4wNCI+PHBhdGggZD0iTTM2IDM0aDR2MWgtNHYtMXptMC0zaC00djFoNHYtMXptMC0yaC00djFoNHYtMXptLTYgMWgtNHYxaDR2LTF6TTEyIDEyaDR2MWgtNHYtMXptMC0zaC00djFoNHYtMXptMC0yaC00djFoNHYtMXptLTYgMWgtNHYxaDR2LTF6TTM2IDEyaDR2MWgtNHYtMXptMC0zaC00djFoNHYtMXptMC0yaC00djFoNHYtMXptLTYgMWgtNHYxaDR2LTF6TTEyIDM0aDR2MWgtNHYtMXptMC0zaC00djFoNHYtMXptMC0yaC00djFoNHYtMXptLTYgMWgtNHYxaDR2LTF6Ij48L3BhdGg+PC9nPjwvZz48L3N2Zz4=')] opacity-30"></div>
    </div>
  );
};

export default DynamicBackground;
