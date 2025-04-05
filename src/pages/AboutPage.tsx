
import React, { lazy, Suspense } from 'react';
import { Github, Mail, Leaf, User, School, MapPin, Instagram } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import AnimatedLoader from '@/components/ui/animated-loader';
import DynamicBackground from '@/components/DynamicBackground';
import { motion } from 'framer-motion';

const ComponentLoader = () => (
  <div className="flex items-center justify-center h-32">
    <AnimatedLoader size="md" color="primary" />
  </div>
);

const AboutPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <DynamicBackground />
      <Header />
      
      <main className="flex-1 py-12 container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div 
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <motion.div 
              className="inline-flex items-center justify-center p-3 bg-plantDoc-primary/30 rounded-full mb-4"
              whileHover={{ scale: 1.05, backgroundColor: 'rgba(76, 175, 80, 0.4)' }}
              transition={{ duration: 0.3 }}
            >
              <User className="h-6 w-6 text-plantDoc-primary" />
            </motion.div>
            <h1 className="text-3xl md:text-4xl font-bold mb-3 bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text text-transparent">
              About the Creator
            </h1>
            <p className="text-foreground/70 max-w-md mx-auto">
              Learn more about the person behind Plant Doc
            </p>
          </motion.div>
          
          <motion.div 
            className="frost-panel-dark rounded-xl overflow-hidden border border-white/10 shadow-2xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            whileHover={{ boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)" }}
          >
            <div className="md:flex">
              <motion.div 
                className="md:w-1/3 bg-gradient-to-br from-plantDoc-primary/40 to-plantDoc-secondary/40 p-8 flex flex-col items-center justify-center backdrop-blur-xl"
                whileHover={{ backgroundColor: 'rgba(76, 175, 80, 0.2)' }}
              >
                <motion.div 
                  className="w-32 h-32 rounded-full bg-gradient-to-br from-plantDoc-primary/30 to-plantDoc-primary/10 flex items-center justify-center mb-4 border border-white/20 shadow-lg"
                  whileHover={{ scale: 1.05, boxShadow: "0 0 30px rgba(76, 175, 80, 0.3)" }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <Leaf className="h-16 w-16 text-plantDoc-primary" />
                </motion.div>
                <h2 className="text-xl font-bold">Aadish Kumar Yadav</h2>
                <p className="text-foreground/70 text-center mt-2">Student Developer</p>
                
                <div className="mt-6 flex gap-3">
                  <motion.a 
                    href="https://github.com/AadishY/PlantDoc" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button variant="outline" size="icon" className="rounded-full bg-black/20 border-white/20 hover:bg-black/40 hover:border-white/30">
                      <Github className="h-4 w-4" />
                    </Button>
                  </motion.a>
                  <motion.a 
                    href="https://instagram.com/yo.akatsuki" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button variant="outline" size="icon" className="rounded-full bg-black/20 border-white/20 hover:bg-black/40 hover:border-white/30">
                      <Instagram className="h-4 w-4" />
                    </Button>
                  </motion.a>
                </div>
              </motion.div>
              
              <div className="md:w-2/3 p-8">
                <h3 className="text-xl font-semibold mb-4 text-gradient">About Me</h3>
                <motion.p 
                  className="text-foreground/90 mb-6 backdrop-blur-sm bg-black/10 p-4 rounded-lg border border-white/5"
                  whileHover={{ backgroundColor: 'rgba(0, 0, 0, 0.2)', x: 5 }}
                  transition={{ duration: 0.2 }}
                >
                  I am Aadish Kumar Yadav, a 17-year-old student from Red Rose Public School in Lucknow, India. 
                  Currently in 11th grade, I'm passionate about technology and how it can be used to solve 
                  real-world problems, especially in the field of agriculture and plant care.
                </motion.p>
                
                <div className="space-y-4">
                  <motion.div 
                    className="flex items-center gap-3 backdrop-blur-sm bg-black/10 p-3 rounded-lg border border-white/5"
                    whileHover={{ backgroundColor: 'rgba(0, 0, 0, 0.2)', x: 5 }}
                    transition={{ duration: 0.2 }}
                  >
                    <School className="h-5 w-5 text-plantDoc-primary" />
                    <div>
                      <p className="font-medium">Red Rose Public School</p>
                      <p className="text-sm text-foreground/60">Class 11th</p>
                    </div>
                  </motion.div>
                  
                  <motion.div 
                    className="flex items-center gap-3 backdrop-blur-sm bg-black/10 p-3 rounded-lg border border-white/5"
                    whileHover={{ backgroundColor: 'rgba(0, 0, 0, 0.2)', x: 5 }}
                    transition={{ duration: 0.2 }}
                  >
                    <MapPin className="h-5 w-5 text-plantDoc-primary" />
                    <p>Lucknow, India</p>
                  </motion.div>

                  <motion.div 
                    className="flex items-center gap-3 backdrop-blur-sm bg-black/10 p-3 rounded-lg border border-white/5"
                    whileHover={{ backgroundColor: 'rgba(0, 0, 0, 0.2)', x: 5 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Instagram className="h-5 w-5 text-plantDoc-primary" />
                    <p>
                      <a 
                        href="https://instagram.com/yo.akatsuki" 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="text-foreground/80 hover:text-plantDoc-primary transition-colors"
                      >
                        @yo.akatsuki
                      </a>
                    </p>
                  </motion.div>
                </div>
                
                <Separator className="my-6 bg-white/10" />
                
                <h3 className="text-xl font-semibold mb-4 text-gradient">About Plant Doc</h3>
                <motion.p 
                  className="text-foreground/90 backdrop-blur-sm bg-black/10 p-4 rounded-lg border border-white/5"
                  whileHover={{ backgroundColor: 'rgba(0, 0, 0, 0.2)', x: 5 }}
                  transition={{ duration: 0.2 }}
                >
                  Plant Doc is an AI-powered plant disease diagnosis tool that I created to help people 
                  identify and treat plant diseases. The application uses advanced image recognition 
                  technology to analyze plant images and provide accurate diagnoses along with 
                  treatment recommendations.
                </motion.p>
              </div>
            </div>
          </motion.div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default AboutPage;
