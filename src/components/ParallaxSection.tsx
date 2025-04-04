
import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Zap, Leaf, Shield, Heart, Cloud } from 'lucide-react';

const ParallaxSection: React.FC = () => {
  return (
    <section 
      className="relative py-20 overflow-hidden bg-black/70 backdrop-blur-sm"
    >
      {/* Background elements */}
      <motion.div 
        className="absolute top-20 left-[20%] w-40 h-40 bg-plantDoc-primary/20 rounded-full blur-3xl"
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
        animate={{ 
          scale: [1, 1.1, 1],
          opacity: [0.4, 0.6, 0.4],
        }}
        transition={{ 
          duration: 10,
          repeat: Infinity,
          repeatType: "reverse",
          delay: 1
        }}
      />
      
      {/* Content */}
      <div className="container mx-auto text-center z-10 px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.5 }}
          className="inline-flex items-center justify-center p-3 bg-plantDoc-primary/20 rounded-full mb-6"
        >
          <Sparkles className="h-8 w-8 text-plantDoc-primary" />
        </motion.div>
        
        <motion.h2 
          className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-gradient"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.5 }}
        >
          Plant Care Reimagined
        </motion.h2>
        
        <motion.p 
          className="text-xl md:text-2xl text-foreground/80 max-w-2xl mx-auto mb-8"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          Experience the future of plant health with our cutting-edge AI technology
        </motion.p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <motion.div 
            className="glass-card p-6 rounded-xl text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25, duration: 0.5 }}
          >
            <div className="w-16 h-16 mx-auto mb-4 bg-plantDoc-primary/20 rounded-full flex items-center justify-center">
              <Leaf className="h-8 w-8 text-plantDoc-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Smart Diagnosis</h3>
            <p className="text-foreground/70">Instantly identify plant diseases with a simple photo upload</p>
          </motion.div>
          
          <motion.div 
            className="glass-card p-6 rounded-xl text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <div className="w-16 h-16 mx-auto mb-4 bg-plantDoc-primary/20 rounded-full flex items-center justify-center">
              <Zap className="h-8 w-8 text-plantDoc-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Personalized Care</h3>
            <p className="text-foreground/70">Get tailored treatment plans specific to your plant's needs</p>
          </motion.div>
          
          <motion.div 
            className="glass-card p-6 rounded-xl text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.5 }}
          >
            <div className="w-16 h-16 mx-auto mb-4 bg-plantDoc-primary/20 rounded-full flex items-center justify-center">
              <Sparkles className="h-8 w-8 text-plantDoc-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Expert Recommendations</h3>
            <p className="text-foreground/70">Discover the perfect plants for your living space and environment</p>
          </motion.div>
        </div>
        
        {/* Added more features section */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
          <motion.div 
            className="glass-card p-6 rounded-xl flex items-start"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            <div className="w-12 h-12 mr-4 bg-plantDoc-primary/20 rounded-full flex items-center justify-center shrink-0">
              <Shield className="h-6 w-6 text-plantDoc-primary" />
            </div>
            <div className="text-left">
              <h3 className="text-lg font-semibold mb-2">Disease Prevention</h3>
              <p className="text-foreground/70">Learn proactive strategies to keep your plants healthy and prevent common diseases before they start.</p>
            </div>
          </motion.div>
          
          <motion.div 
            className="glass-card p-6 rounded-xl flex items-start"
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ delay: 0.45, duration: 0.5 }}
          >
            <div className="w-12 h-12 mr-4 bg-plantDoc-primary/20 rounded-full flex items-center justify-center shrink-0">
              <Heart className="h-6 w-6 text-plantDoc-primary" />
            </div>
            <div className="text-left">
              <h3 className="text-lg font-semibold mb-2">Plant Health Monitoring</h3>
              <p className="text-foreground/70">Track your plant's health over time with our intelligent monitoring system, helping you detect issues early.</p>
            </div>
          </motion.div>
          
          <motion.div 
            className="glass-card p-6 rounded-xl flex items-start"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            <div className="w-12 h-12 mr-4 bg-plantDoc-primary/20 rounded-full flex items-center justify-center shrink-0">
              <Cloud className="h-6 w-6 text-plantDoc-primary" />
            </div>
            <div className="text-left">
              <h3 className="text-lg font-semibold mb-2">Climate-Specific Advice</h3>
              <p className="text-foreground/70">Get customized care instructions based on your local climate and growing conditions for optimal plant growth.</p>
            </div>
          </motion.div>
          
          <motion.div 
            className="glass-card p-6 rounded-xl flex items-start"
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ delay: 0.55, duration: 0.5 }}
          >
            <div className="w-12 h-12 mr-4 bg-plantDoc-primary/20 rounded-full flex items-center justify-center shrink-0">
              <Sparkles className="h-6 w-6 text-plantDoc-primary" />
            </div>
            <div className="text-left">
              <h3 className="text-lg font-semibold mb-2">Seasonal Care Calendar</h3>
              <p className="text-foreground/70">Follow our seasonal care guidelines to ensure your plants receive the right attention at the right time throughout the year.</p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ParallaxSection;
