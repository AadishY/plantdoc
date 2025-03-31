
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { EnhancedCard, EnhancedCardHeader, EnhancedCardTitle, EnhancedCardContent } from '@/components/ui/enhanced-card';

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
    <EnhancedCard hoverEffect="both">
      <EnhancedCardHeader className="border-b border-white/10">
        <EnhancedCardTitle className="text-xl text-center">About This Plant</EnhancedCardTitle>
      </EnhancedCardHeader>
      <EnhancedCardContent className="p-5">
        <motion.div 
          className="space-y-4"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={itemVariants}>
            <h3 className="text-md font-medium text-plantDoc-primary mb-1">Description</h3>
            <motion.p 
              className="text-foreground/80 backdrop-blur-sm bg-black/10 p-3 rounded-lg"
              whileHover={{ backgroundColor: 'rgba(0, 0, 0, 0.3)', x: 5 }}
              transition={{ duration: 0.2 }}
            >
              {plantData.description}
            </motion.p>
          </motion.div>
          
          <motion.div variants={itemVariants}>
            <h3 className="text-md font-medium text-plantDoc-primary mb-1">Origin</h3>
            <motion.p 
              className="text-foreground/80 backdrop-blur-sm bg-black/10 p-3 rounded-lg"
              whileHover={{ backgroundColor: 'rgba(0, 0, 0, 0.3)', x: 5 }}
              transition={{ duration: 0.2 }}
            >
              {plantData.origin}
            </motion.p>
          </motion.div>
          
          <motion.div variants={itemVariants}>
            <h3 className="text-md font-medium text-plantDoc-primary mb-1">Common Uses</h3>
            <ul className="list-disc pl-5 space-y-2">
              {plantData.common_uses.map((use, index) => (
                <motion.li 
                  key={index} 
                  className="text-foreground/80 backdrop-blur-sm bg-black/10 p-3 rounded-lg"
                  whileHover={{ backgroundColor: 'rgba(0, 0, 0, 0.3)', x: 5 }}
                  transition={{ duration: 0.2 }}
                  variants={itemVariants}
                >
                  {use}
                </motion.li>
              ))}
            </ul>
          </motion.div>
          
          <motion.div variants={itemVariants}>
            <h3 className="text-md font-medium text-plantDoc-primary mb-1">Growing Conditions</h3>
            <motion.p 
              className="text-foreground/80 backdrop-blur-sm bg-black/10 p-3 rounded-lg"
              whileHover={{ backgroundColor: 'rgba(0, 0, 0, 0.3)', x: 5 }}
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
