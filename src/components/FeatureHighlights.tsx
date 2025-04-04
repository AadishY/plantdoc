
import React from 'react';
import { motion } from 'framer-motion';
import { Plant, Droplet, Sun, Wind, Thermometer, Cloud, Sprout } from 'lucide-react';
import { EnhancedCard } from '@/components/ui/enhanced-card';

const featureItems = [
  {
    id: 1,
    icon: <Plant />,
    title: "Smart Diagnosis",
    description: "AI-powered analysis identifies plant issues with 95% accuracy using just a photo."
  },
  {
    id: 2,
    icon: <Droplet />,
    title: "Custom Care Plans",
    description: "Get tailored watering, light, and nutrient recommendations for your specific plants."
  },
  {
    id: 3,
    icon: <Sun />,
    title: "Light Analysis",
    description: "Optimize plant placement with our environment assessment technology."
  },
  {
    id: 4,
    icon: <Thermometer />,
    title: "Climate Adaptation",
    description: "Season-specific care tips based on your local climate conditions."
  },
  {
    id: 5,
    icon: <Sprout />,
    title: "Growth Tracking",
    description: "Monitor your plant's progress and health improvements over time."
  },
  {
    id: 6,
    icon: <Cloud />,
    title: "Weather Integration",
    description: "Care recommendations that adjust to current and forecasted weather conditions."
  }
];

const FeatureCard = ({ icon, title, description, index }: any) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4, delay: index * 0.1 }}
    viewport={{ once: true, margin: "-50px" }}
  >
    <EnhancedCard 
      isHoverable 
      isFrosted 
      className="h-full"
      glassIntensity="intense"
    >
      <div className="p-6 flex flex-col h-full">
        <motion.div 
          className="w-12 h-12 bg-plantDoc-primary/20 rounded-full flex items-center justify-center mb-4"
          whileHover={{ rotate: 15, scale: 1.1 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <span className="text-plantDoc-primary">
            {icon}
          </span>
        </motion.div>
        <h3 className="text-xl font-semibold mb-2">{title}</h3>
        <p className="text-foreground/70">{description}</p>
      </div>
    </EnhancedCard>
  </motion.div>
);

const FeatureHighlights: React.FC = () => {
  return (
    <section className="py-16 relative overflow-hidden">
      <div className="container mx-auto px-4">
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl font-bold mb-4 text-gradient relative inline-block">
            Advanced Plant Care Features
            <div className="absolute -bottom-2 left-1/4 right-1/4 h-0.5 bg-gradient-to-r from-transparent via-plantDoc-primary to-transparent"></div>
          </h2>
          <p className="text-foreground/70 max-w-2xl mx-auto">
            Cutting-edge technology to help your plants thrive in any environment
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {featureItems.map((feature, index) => (
            <FeatureCard 
              key={feature.id}
              icon={feature.icon} 
              title={feature.title} 
              description={feature.description}
              index={index}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeatureHighlights;
