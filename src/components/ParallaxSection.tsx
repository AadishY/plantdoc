
import React, { useRef, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Sparkles, Zap, Leaf } from 'lucide-react';

const ParallaxSection: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const y1 = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, -200]);
  const y3 = useTransform(scrollYProgress, [0, 1], [0, -300]);
  const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [0, 1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.8, 1, 0.8]);
  const rotate = useTransform(scrollYProgress, [0, 0.5, 1], [0, 10, 0]);

  return (
    <section 
      ref={containerRef}
      className="relative h-[100vh] overflow-hidden flex items-center justify-center"
    >
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm -z-10"></div>
      
      {/* Background elements */}
      <motion.div 
        className="absolute top-20 left-[20%] w-40 h-40 bg-plantDoc-primary/20 rounded-full blur-3xl"
        style={{ y: y1, rotate }}
        animate={{ 
          scale: [1, 1.2, 1],
          opacity: [0.5, 0.7, 0.5],
        }}
        transition={{ 
          duration: 8,
          repeat: Infinity,
          repeatType: "reverse"
        }}
      />
      
      <motion.div 
        className="absolute bottom-40 right-[30%] w-60 h-60 bg-accent/20 rounded-full blur-3xl"
        style={{ y: y2, rotate: useTransform(rotate, val => -val) }}
        animate={{ 
          scale: [1, 1.1, 1],
          opacity: [0.4, 0.6, 0.4],
        }}
        transition={{ 
          duration: 10,
          repeat: Infinity,
          repeatType: "reverse",
          delay: 2
        }}
      />
      
      <motion.div 
        className="absolute top-[30%] right-[10%] w-32 h-32 bg-plantDoc-secondary/20 rounded-full blur-3xl"
        style={{ y: y3 }}
        animate={{ 
          scale: [1, 1.3, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{ 
          duration: 7,
          repeat: Infinity,
          repeatType: "reverse",
          delay: 1
        }}
      />
      
      {/* Content */}
      <motion.div 
        className="container mx-auto text-center z-10 px-4"
        style={{ opacity, scale }}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="inline-flex items-center justify-center p-3 bg-plantDoc-primary/20 rounded-full mb-6"
        >
          <Sparkles className="h-8 w-8 text-plantDoc-primary" />
        </motion.div>
        
        <motion.h2 
          className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-gradient"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
        >
          Plant Care Reimagined
        </motion.h2>
        
        <motion.p 
          className="text-xl md:text-2xl text-foreground/80 max-w-2xl mx-auto mb-8"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8 }}
        >
          Experience the future of plant health with our cutting-edge AI technology
        </motion.p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <motion.div 
            className="glass-card p-6 rounded-xl text-center group"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            whileHover={{ 
              y: -10,
              scale: 1.03,
              boxShadow: "0 20px 30px rgba(0,0,0,0.2)",
              backgroundColor: "rgba(0,0,0,0.45)"
            }}
          >
            <motion.div 
              className="w-16 h-16 mx-auto mb-4 bg-plantDoc-primary/20 rounded-full flex items-center justify-center"
              whileHover={{ 
                rotate: 360,
                backgroundColor: "rgba(76,175,80,0.3)",
                transition: { duration: 0.8 }
              }}
            >
              <Leaf className="h-8 w-8 text-plantDoc-primary" />
            </motion.div>
            <h3 className="text-xl font-semibold mb-2">Smart Diagnosis</h3>
            <p className="text-foreground/70">Instantly identify plant diseases with a simple photo upload</p>
          </motion.div>
          
          <motion.div 
            className="glass-card p-6 rounded-xl text-center group"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            whileHover={{ 
              y: -10,
              scale: 1.03,
              boxShadow: "0 20px 30px rgba(0,0,0,0.2)",
              backgroundColor: "rgba(0,0,0,0.45)"
            }}
          >
            <motion.div 
              className="w-16 h-16 mx-auto mb-4 bg-plantDoc-primary/20 rounded-full flex items-center justify-center"
              whileHover={{ 
                rotate: 360,
                backgroundColor: "rgba(76,175,80,0.3)",
                transition: { duration: 0.8 }
              }}
            >
              <Zap className="h-8 w-8 text-plantDoc-primary" />
            </motion.div>
            <h3 className="text-xl font-semibold mb-2">Personalized Care</h3>
            <p className="text-foreground/70">Get tailored treatment plans specific to your plant's needs</p>
          </motion.div>
          
          <motion.div 
            className="glass-card p-6 rounded-xl text-center group"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.8 }}
            whileHover={{ 
              y: -10,
              scale: 1.03,
              boxShadow: "0 20px 30px rgba(0,0,0,0.2)",
              backgroundColor: "rgba(0,0,0,0.45)"
            }}
          >
            <motion.div 
              className="w-16 h-16 mx-auto mb-4 bg-plantDoc-primary/20 rounded-full flex items-center justify-center"
              whileHover={{ 
                rotate: 360,
                backgroundColor: "rgba(76,175,80,0.3)",
                transition: { duration: 0.8 }
              }}
            >
              <Sparkles className="h-8 w-8 text-plantDoc-primary" />
            </motion.div>
            <h3 className="text-xl font-semibold mb-2">Expert Recommendations</h3>
            <p className="text-foreground/70">Discover the perfect plants for your living space and environment</p>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
};

export default ParallaxSection;
