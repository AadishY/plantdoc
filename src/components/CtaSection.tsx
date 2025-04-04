
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { CircleCheck, ArrowRight } from 'lucide-react';

const CtaSection: React.FC = () => {
  return (
    <section className="py-16 relative overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto glass-card p-8 rounded-xl relative">
          {/* Background glow effect */}
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-plantDoc-primary/20 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-20 -left-10 w-60 h-60 bg-plantDoc-secondary/10 rounded-full blur-3xl"></div>
          
          <div className="relative z-10">
            <motion.div 
              className="text-center mb-8"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Start Your Plant Care Journey Today</h2>
              <p className="text-xl text-foreground/80 max-w-2xl mx-auto">
                Join thousands of plant lovers who've revolutionized their gardening experience with Plant Doc's AI-powered insights.
              </p>
            </motion.div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                viewport={{ once: true }}
              >
                <ul className="space-y-3">
                  {[
                    "Instant disease diagnosis with 95% accuracy",
                    "Personalized treatment plans for your plants",
                    "Regular care reminders and seasonal tips",
                    "Expert recommendations for your growing environment"
                  ].map((item, index) => (
                    <li key={index} className="flex items-center">
                      <CircleCheck className="h-5 w-5 text-plantDoc-primary mr-2 shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
              
              <motion.div 
                className="flex flex-col items-center justify-center"
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                viewport={{ once: true }}
              >
                <div className="space-y-4 w-full max-w-sm">
                  <Link to="/diagnose" className="w-full block">
                    <Button className="w-full py-6 text-lg rounded-full bg-plantDoc-primary hover:bg-plantDoc-primary/90 text-black font-medium">
                      Diagnose Your Plant
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </Link>
                  
                  <Link to="/recommend" className="w-full block">
                    <Button variant="outline" className="w-full py-6 text-lg rounded-full border-plantDoc-primary text-plantDoc-primary hover:bg-plantDoc-primary/10">
                      Get Plant Recommendations
                    </Button>
                  </Link>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CtaSection;
