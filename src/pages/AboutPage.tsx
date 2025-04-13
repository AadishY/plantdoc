
import React, { lazy, Suspense } from 'react';
import { Github, Mail, Leaf, User, School, MapPin, Instagram, Code, Sparkles, ExternalLink } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import AnimatedLoader from '@/components/ui/animated-loader';
import DynamicBackground from '@/components/DynamicBackground';
import { motion } from 'framer-motion';
import { HoverCard, HoverCardTrigger, HoverCardContent } from "@/components/ui/hover-card";
import { EnhancedCard, EnhancedCardContent, EnhancedCardHeader } from '@/components/ui/enhanced-card';

const ComponentLoader = () => (
  <div className="flex items-center justify-center h-32">
    <AnimatedLoader size="md" color="primary" />
  </div>
);

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
  hidden: { y: 20, opacity: 0 },
  visible: { 
    y: 0, 
    opacity: 1,
    transition: { duration: 0.5 }
  }
};

const AboutPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <DynamicBackground />
      <Header />
      
      <main className="flex-1 py-12 container mx-auto px-4 animate-fade-in">
        <div className="max-w-4xl mx-auto">
          <motion.div 
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <motion.div 
              className="inline-flex items-center justify-center p-3 bg-plantDoc-primary/20 backdrop-blur-lg rounded-full mb-4"
              whileHover={{ scale: 1.05, backgroundColor: 'rgba(76, 175, 80, 0.3)' }}
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
            variants={containerVariants}
            initial="hidden"
            animate="visible" 
            className="frost-panel-dark rounded-xl overflow-hidden border border-white/10 shadow-2xl relative"
            whileHover={{ boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)" }}
          >
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-plantDoc-primary/5 rounded-full blur-[100px] -z-10"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-plantDoc-accent/5 rounded-full blur-[100px] -z-10"></div>
            
            <div className="md:flex">
              <motion.div 
                variants={itemVariants}
                className="md:w-1/3 bg-gradient-to-br from-plantDoc-primary/25 to-plantDoc-secondary/15 p-8 flex flex-col items-center justify-center backdrop-blur-xl"
                whileHover={{ backgroundColor: 'rgba(76, 175, 80, 0.2)' }}
              >
                <motion.div 
                  className="w-32 h-32 rounded-full bg-gradient-to-br from-plantDoc-primary/40 to-plantDoc-primary/10 flex items-center justify-center mb-4 border border-white/20 shadow-lg relative overflow-hidden"
                  whileHover={{ scale: 1.05, boxShadow: "0 0 30px rgba(76, 175, 80, 0.3)" }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  {/* Animated background */}
                  <motion.div 
                    className="absolute inset-0 bg-gradient-to-br from-plantDoc-primary/30 to-transparent"
                    animate={{ 
                      rotate: [0, 360],
                    }}
                    transition={{ 
                      repeat: Infinity, 
                      duration: 10,
                      ease: "linear"
                    }}
                  />
                  <Leaf className="h-16 w-16 text-white relative z-10" />
                </motion.div>
                
                <motion.h2 variants={itemVariants} className="text-xl font-bold">Aadish Kumar Yadav</motion.h2>
                <motion.p variants={itemVariants} className="text-foreground/70 text-center mt-2">Student Developer</motion.p>
                
                <motion.div variants={itemVariants} className="mt-6 flex gap-3">
                  <HoverCard>
                    <HoverCardTrigger asChild>
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
                    </HoverCardTrigger>
                    <HoverCardContent className="glass-tooltip w-auto">
                      <span className="text-xs">GitHub Repository</span>
                    </HoverCardContent>
                  </HoverCard>
                  
                  <HoverCard>
                    <HoverCardTrigger asChild>
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
                    </HoverCardTrigger>
                    <HoverCardContent className="glass-tooltip w-auto">
                      <span className="text-xs">Instagram Profile</span>
                    </HoverCardContent>
                  </HoverCard>
                </motion.div>
              </motion.div>
              
              <div className="md:w-2/3 p-8">
                <motion.h3 
                  variants={itemVariants} 
                  className="text-xl font-semibold mb-4 flex items-center gap-2"
                >
                  <User className="h-5 w-5 text-plantDoc-primary" />
                  <span className="bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">About Me</span>
                </motion.h3>
                
                <motion.div 
                  variants={itemVariants}
                  className="text-foreground/90 mb-6 backdrop-blur-sm bg-black/10 p-4 rounded-lg border border-white/5 transition-all duration-300"
                  whileHover={{ backgroundColor: 'rgba(0, 0, 0, 0.2)', x: 5, borderColor: 'rgba(255, 255, 255, 0.1)' }}
                >
                  <p>
                    I am Aadish Kumar Yadav, a 17-year-old student from Red Rose Public School in Lucknow, India. 
                    Currently in 11th grade, I'm passionate about technology and how it can be used to solve 
                    real-world problems, especially in the field of agriculture and plant care.
                  </p>
                </motion.div>
                
                <motion.div variants={containerVariants} className="space-y-4">
                  <motion.div 
                    variants={itemVariants}
                    className="flex items-center gap-3 backdrop-blur-sm bg-black/10 p-3 rounded-lg border border-white/5 transition-all duration-300"
                    whileHover={{ backgroundColor: 'rgba(0, 0, 0, 0.2)', x: 5, borderColor: 'rgba(255, 255, 255, 0.1)' }}
                  >
                    <School className="h-5 w-5 text-plantDoc-primary" />
                    <div>
                      <p className="font-medium">Red Rose Public School</p>
                      <p className="text-sm text-foreground/60">Class 11th</p>
                    </div>
                  </motion.div>
                  
                  <motion.div 
                    variants={itemVariants}
                    className="flex items-center gap-3 backdrop-blur-sm bg-black/10 p-3 rounded-lg border border-white/5 transition-all duration-300"
                    whileHover={{ backgroundColor: 'rgba(0, 0, 0, 0.2)', x: 5, borderColor: 'rgba(255, 255, 255, 0.1)' }}
                  >
                    <MapPin className="h-5 w-5 text-plantDoc-primary" />
                    <p>Lucknow, India</p>
                  </motion.div>

                  <motion.div 
                    variants={itemVariants}
                    className="flex items-center gap-3 backdrop-blur-sm bg-black/10 p-3 rounded-lg border border-white/5 transition-all duration-300"
                    whileHover={{ backgroundColor: 'rgba(0, 0, 0, 0.2)', x: 5, borderColor: 'rgba(255, 255, 255, 0.1)' }}
                  >
                    <Instagram className="h-5 w-5 text-plantDoc-primary" />
                    <p>
                      <a 
                        href="https://instagram.com/yo.akatsuki" 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="text-foreground/80 hover:text-plantDoc-primary transition-colors flex items-center gap-1"
                      >
                        @yo.akatsuki
                        <ExternalLink className="h-3 w-3 inline" />
                      </a>
                    </p>
                  </motion.div>
                </motion.div>
                
                <Separator className="my-6 bg-white/10" />
                
                <motion.h3 
                  variants={itemVariants}
                  className="text-xl font-semibold mb-4 flex items-center gap-2"
                >
                  <Leaf className="h-5 w-5 text-plantDoc-primary" />
                  <span className="bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">About Plant Doc</span>
                </motion.h3>
                
                <motion.div 
                  variants={itemVariants}
                  className="text-foreground/90 backdrop-blur-sm bg-black/10 p-4 rounded-lg border border-white/5 transition-all duration-300"
                  whileHover={{ backgroundColor: 'rgba(0, 0, 0, 0.2)', x: 5, borderColor: 'rgba(255, 255, 255, 0.1)' }}
                >
                  <p className="mb-4">
                    Plant Doc is an AI-powered plant disease diagnosis tool that I created to help people 
                    identify and treat plant diseases. The application uses advanced image recognition 
                    technology to analyze plant images and provide accurate diagnoses along with 
                    treatment recommendations.
                  </p>
                </motion.div>
                
                <motion.div 
                  variants={itemVariants}
                  className="mt-6"
                >
                  <EnhancedCard className="glass-card-intense" hoverEffect="fancy">
                    <EnhancedCardHeader>
                      <div className="flex items-center gap-2">
                        <Sparkles className="h-5 w-5 text-plantDoc-accent" />
                        <h3 className="text-gradient">Technology Stack</h3>
                      </div>
                    </EnhancedCardHeader>
                    <EnhancedCardContent>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        <div className="flex items-center gap-2 p-2 rounded-lg bg-white/5 border border-white/10">
                          <Code className="h-4 w-4 text-plantDoc-primary" />
                          <span className="text-sm">React</span>
                        </div>
                        <div className="flex items-center gap-2 p-2 rounded-lg bg-white/5 border border-white/10">
                          <Code className="h-4 w-4 text-plantDoc-primary" />
                          <span className="text-sm">Tailwind CSS</span>
                        </div>
                        <div className="flex items-center gap-2 p-2 rounded-lg bg-white/5 border border-white/10">
                          <Code className="h-4 w-4 text-plantDoc-primary" />
                          <span className="text-sm">TypeScript</span>
                        </div>
                      </div>
                    </EnhancedCardContent>
                  </EnhancedCard>
                </motion.div>
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
