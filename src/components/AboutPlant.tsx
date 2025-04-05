
import React from 'react';
import { motion } from 'framer-motion';
import { EnhancedCard, EnhancedCardHeader, EnhancedCardTitle, EnhancedCardContent } from '@/components/ui/enhanced-card';
import { Leaf, Info, MapPin, Zap } from 'lucide-react';

interface AboutPlantProps {
  plantData: {
    description: string;
    origin: string;
    common_uses: string[];
    growing_conditions: string;
  };
}

const AboutPlant = ({ plantData }: AboutPlantProps) => {
  if (!plantData) return null;
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 }
  };
  
  return (
    <EnhancedCard 
      hoverEffect="both" 
      glassIntensity="medium"
      className="overflow-hidden"
    >
      <EnhancedCardHeader className="border-b border-white/10 bg-black/20">
        <EnhancedCardTitle className="text-xl text-center flex items-center justify-center gap-2">
          <Leaf className="h-5 w-5 text-plantDoc-primary" />
          About This Plant
        </EnhancedCardTitle>
      </EnhancedCardHeader>
      <EnhancedCardContent className="p-5">
        <motion.div 
          className="space-y-4"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div 
            variants={itemVariants}
            className="glassmorphic-card p-4 overflow-hidden"
          >
            <div className="flex items-center gap-2 text-md font-medium text-plantDoc-primary mb-3">
              <Info className="h-4 w-4" />
              <h3>Description</h3>
            </div>
            <motion.p 
              className="text-foreground/90 backdrop-blur-sm bg-black/10 p-3 rounded-lg border border-white/5"
              whileHover={{ backgroundColor: 'rgba(0, 0, 0, 0.3)', x: 5, borderColor: 'rgba(255, 255, 255, 0.1)' }}
              transition={{ duration: 0.2 }}
            >
              {plantData.description}
            </motion.p>
          </motion.div>
          
          <motion.div 
            variants={itemVariants}
            className="glassmorphic-card p-4 overflow-hidden"
          >
            <div className="flex items-center gap-2 text-md font-medium text-plantDoc-primary mb-3">
              <MapPin className="h-4 w-4" />
              <h3>Origin</h3>
            </div>
            <motion.p 
              className="text-foreground/90 backdrop-blur-sm bg-black/10 p-3 rounded-lg border border-white/5"
              whileHover={{ backgroundColor: 'rgba(0, 0, 0, 0.3)', x: 5, borderColor: 'rgba(255, 255, 255, 0.1)' }}
              transition={{ duration: 0.2 }}
            >
              {plantData.origin}
            </motion.p>
          </motion.div>
          
          <motion.div 
            variants={itemVariants}
            className="glassmorphic-card p-4 overflow-hidden"
          >
            <div className="flex items-center gap-2 text-md font-medium text-plantDoc-primary mb-3">
              <Zap className="h-4 w-4" />
              <h3>Common Uses</h3>
            </div>
            <ul className="space-y-2">
              {plantData.common_uses.map((use, index) => (
                <motion.li 
                  key={index} 
                  className="text-foreground/90 backdrop-blur-sm bg-black/10 p-3 rounded-lg border border-white/5"
                  whileHover={{ backgroundColor: 'rgba(0, 0, 0, 0.3)', x: 5, borderColor: 'rgba(255, 255, 255, 0.1)' }}
                  transition={{ duration: 0.2 }}
                  variants={itemVariants}
                >
                  {use}
                </motion.li>
              ))}
            </ul>
          </motion.div>
          
          <motion.div 
            variants={itemVariants}
            className="glassmorphic-card p-4 overflow-hidden"
          >
            <div className="flex items-center gap-2 text-md font-medium text-plantDoc-primary mb-3">
              <Leaf className="h-4 w-4" />
              <h3>Growing Conditions</h3>
            </div>
            <motion.p 
              className="text-foreground/90 backdrop-blur-sm bg-black/10 p-3 rounded-lg border border-white/5"
              whileHover={{ backgroundColor: 'rgba(0, 0, 0, 0.3)', x: 5, borderColor: 'rgba(255, 255, 255, 0.1)' }}
              transition={{ duration: 0.2 }}
            >
              {plantData.growing_conditions}
            </motion.p>
          </motion.div>
        </motion.div>
      </EnhancedCardContent>
    </EnhancedCard>
  );
};

export default AboutPlant;
