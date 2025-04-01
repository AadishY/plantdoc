
import React from 'react';
import { motion } from 'framer-motion';
import { useIsMobile } from '@/hooks/use-mobile';

const DynamicBackground = () => {
  const isMobile = useIsMobile();
  
  // Adjust sizes for mobile devices
  const getSize = (desktopSize: number) => {
    return isMobile ? desktopSize * 0.7 : desktopSize;
  };
  
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {/* Large animated gradient blobs */}
      <motion.div 
        className="absolute -top-[300px] -right-[300px] rounded-full bg-gradient-to-r from-plantDoc-primary/30 to-plantDoc-secondary/20 blur-3xl"
        style={{ 
          width: getSize(600), 
          height: getSize(600) 
        }}
        animate={{
          x: [0, 50, 0, -30, 0],
          y: [0, -40, 20, 40, 0],
          scale: [1, 1.05, 0.98, 1.02, 1],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          repeatType: "reverse",
        }}
      />
      
      <motion.div 
        className="absolute top-[30%] -left-[200px] rounded-full bg-gradient-to-r from-plantDoc-secondary/20 to-plantDoc-primary/10 blur-3xl"
        style={{ 
          width: getSize(400), 
          height: getSize(400) 
        }}
        animate={{
          x: [0, -40, 30, -20, 0],
          y: [0, 60, -30, 15, 0],
          scale: [1, 1.1, 0.95, 1.05, 1],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          repeatType: "reverse",
          delay: 2,
        }}
      />
      
      <motion.div 
        className="absolute bottom-[10%] right-[5%] rounded-full bg-gradient-to-r from-accent/20 to-plantDoc-primary/10 blur-3xl"
        style={{ 
          width: getSize(300), 
          height: getSize(300) 
        }}
        animate={{
          x: [0, 50, -30, 20, 0],
          y: [0, 40, 20, -30, 0],
          scale: [1, 1.08, 0.97, 1.03, 1],
        }}
        transition={{
          duration: 22,
          repeat: Infinity,
          repeatType: "reverse",
          delay: 5,
        }}
      />
      
      {/* New floating elements for more dynamic movement */}
      <motion.div 
        className="absolute top-[50%] left-[50%] rounded-full bg-plantDoc-primary/15 blur-3xl"
        style={{ 
          width: getSize(250), 
          height: getSize(250) 
        }}
        animate={{
          x: [0, 100, -100, 50, 0],
          y: [0, -50, 50, -25, 0],
          opacity: [0.3, 0.6, 0.4, 0.7, 0.3],
        }}
        transition={{
          duration: 30,
          repeat: Infinity,
          repeatType: "reverse",
          delay: 3,
        }}
      />
      
      <motion.div 
        className="absolute top-[20%] right-[25%] rounded-full bg-accent/15 blur-3xl"
        style={{ 
          width: getSize(150), 
          height: getSize(150) 
        }}
        animate={{
          x: [0, -70, 70, -35, 0],
          y: [0, 30, -30, 15, 0],
          opacity: [0.2, 0.5, 0.3, 0.6, 0.2],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          repeatType: "reverse",
          delay: 7,
        }}
      />
      
      {/* Smaller floating elements */}
      <motion.div 
        className="absolute top-[15%] left-[10%] rounded-full bg-plantDoc-primary/20 blur-2xl"
        style={{ 
          width: getSize(150), 
          height: getSize(150) 
        }}
        animate={{
          x: [0, 40, -30, 15, 0],
          y: [0, -30, 20, -10, 0],
          opacity: [0.5, 0.9, 0.6, 0.8, 0.5],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          repeatType: "reverse",
          delay: 1,
        }}
      />
      
      <motion.div 
        className="absolute top-[45%] right-[15%] rounded-full bg-accent/20 blur-2xl"
        style={{ 
          width: getSize(100), 
          height: getSize(100) 
        }}
        animate={{
          x: [0, -30, 20, -10, 0],
          y: [0, 30, -20, 10, 0],
          opacity: [0.4, 0.8, 0.5, 0.7, 0.4],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          repeatType: "reverse",
          delay: 3,
        }}
      />
      
      <motion.div 
        className="absolute bottom-[25%] left-[20%] rounded-full bg-plantDoc-secondary/20 blur-2xl"
        style={{ 
          width: getSize(120), 
          height: getSize(120) 
        }}
        animate={{
          x: [0, 50, -30, 25, 0],
          y: [0, 20, -15, 10, 0],
          opacity: [0.4, 0.9, 0.5, 0.7, 0.4],
        }}
        transition={{
          duration: 17,
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
