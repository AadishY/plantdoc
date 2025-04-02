import React, { useEffect, useState, useRef, lazy, Suspense } from 'react';
import { Link } from 'react-router-dom';
import { Leaf, ArrowUp, Droplet, Thermometer, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { motion } from 'framer-motion';
import DynamicBackground from '@/components/DynamicBackground';
import AnimatedLoader from '@/components/ui/animated-loader';

const ParallaxSection = lazy(() => import('@/components/ParallaxSection'));
const RotatingLeaf = lazy(() => import('@/components/RotatingLeaf'));
const Accordion = lazy(() => import('@/components/ui/accordion').then(module => ({ 
  default: module.Accordion 
})));
const AccordionContent = lazy(() => import('@/components/ui/accordion').then(module => ({ 
  default: module.AccordionContent 
})));
const AccordionItem = lazy(() => import('@/components/ui/accordion').then(module => ({ 
  default: module.AccordionItem 
})));
const AccordionTrigger = lazy(() => import('@/components/ui/accordion').then(module => ({ 
  default: module.AccordionTrigger 
})));

const ComponentLoader = () => (
  <div className="w-full h-64 flex items-center justify-center">
    <AnimatedLoader size="md" color="primary" />
  </div>
);

const Index = () => {
  const [scrollY, setScrollY] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    const handleScroll = () => {
      requestAnimationFrame(() => {
        setScrollY(window.scrollY);
        setIsVisible(window.scrollY > 500);
      });
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-background to-muted/50 relative overflow-hidden">
      <DynamicBackground />
      
      <Header />
      
      <main className="flex-1 relative z-10">
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row items-center gap-8 md:gap-16">
              <motion.div 
                className="flex-1 text-center md:text-left"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <motion.div 
                  className="inline-flex items-center justify-center p-2 bg-plantDoc-primary/20 rounded-full mb-4"
                  whileHover={{ 
                    scale: 1.1, 
                    backgroundColor: 'rgba(76, 175, 80, 0.3)',
                    boxShadow: '0 0 15px rgba(76, 175, 80, 0.5)'
                  }}
                  transition={{ duration: 0.3 }}
                >
                  <Leaf className="h-6 w-6 text-plantDoc-primary" />
                </motion.div>
                <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gradient relative">
                  AI-Powered Plant Disease Diagnosis
                  <div className="absolute -bottom-2 left-0 md:w-1/3 h-0.5 bg-gradient-to-r from-plantDoc-primary to-transparent"></div>
                </h1>
                <p className="text-lg text-foreground/70 mb-8 md:max-w-xl">
                  Upload a photo of your plant and get instant diagnosis, treatment recommendations, 
                  and care tips to help your plants thrive.
                </p>
                <Link to="/diagnose">
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
                    <Button className="bg-gradient-to-r from-plantDoc-primary to-plantDoc-secondary text-white font-medium px-8 py-6 text-lg rounded-full hover:shadow-xl transition-all duration-300 hover:shadow-plantDoc-primary/30 group">
                      <span className="mr-2">Diagnose Your Plant</span>
                      <span className="relative">
                        <span className="absolute -right-6 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 group-hover:right-0 transition-all duration-300">
                          <ArrowUp className="h-4 w-4 rotate-45" />
                        </span>
                      </span>
                    </Button>
                  </motion.div>
                </Link>
              </motion.div>
              <motion.div 
                className="flex-1 flex justify-center md:justify-end"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <Suspense fallback={<ComponentLoader />}>
                  <RotatingLeaf />
                </Suspense>
              </motion.div>
            </div>
          </div>
        </section>

        <Suspense fallback={<ComponentLoader />}>
          <ParallaxSection />
        </Suspense>

        <section className="py-16">
          <div className="container mx-auto px-4">
            <motion.div 
              className="text-center mb-12"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl font-bold mb-4 text-gradient relative inline-block">
                How Plant Doc Works
                <div className="absolute -bottom-2 left-1/4 right-1/4 h-0.5 bg-gradient-to-r from-transparent via-plantDoc-primary to-transparent"></div>
              </h2>
              <p className="text-foreground/70 max-w-2xl mx-auto">
                Our advanced AI technology helps you identify and treat plant diseases with just a photo.
              </p>
            </motion.div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <motion.div
                whileHover={{ scale: 1.05, backgroundColor: 'rgba(0, 0, 0, 0.4)' }}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="glass-card rounded-xl p-6 text-center group"
              >
                <motion.div 
                  className="bg-plantDoc-primary/20 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 group-hover:shadow-lg group-hover:shadow-plantDoc-primary/20"
                  whileHover={{ scale: 1.1, backgroundColor: 'rgba(76, 175, 80, 0.4)' }}
                >
                  <ArrowUp className="text-plantDoc-primary h-8 w-8 group-hover:animate-bounce" />
                </motion.div>
                <h3 className="text-xl font-semibold mb-2 text-gradient">Upload a Photo</h3>
                <p className="text-foreground/70">
                  Take a clear picture of your plant showing the affected areas and upload it.
                </p>
              </motion.div>
              
              <motion.div
                whileHover={{ scale: 1.05, backgroundColor: 'rgba(0, 0, 0, 0.4)' }}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="glass-card rounded-xl p-6 text-center group"
              >
                <motion.div 
                  className="bg-plantDoc-primary/20 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 group-hover:shadow-lg group-hover:shadow-plantDoc-primary/20"
                  whileHover={{ scale: 1.1, backgroundColor: 'rgba(76, 175, 80, 0.4)' }}
                >
                  <Leaf className="text-plantDoc-primary h-8 w-8 group-hover:rotate-12 transition-transform duration-300" />
                </motion.div>
                <h3 className="text-xl font-semibold mb-2 text-gradient">Get Diagnosis</h3>
                <p className="text-foreground/70">
                  Our AI analyzes your plant's condition and identifies any diseases or issues.
                </p>
              </motion.div>
              
              <motion.div
                whileHover={{ scale: 1.05, backgroundColor: 'rgba(0, 0, 0, 0.4)' }}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="glass-card rounded-xl p-6 text-center group"
              >
                <motion.div 
                  className="bg-plantDoc-primary/20 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 group-hover:shadow-lg group-hover:shadow-plantDoc-primary/20"
                  whileHover={{ scale: 1.1, backgroundColor: 'rgba(76, 175, 80, 0.4)' }}
                >
                  <Thermometer className="text-plantDoc-primary h-8 w-8 group-hover:animate-pulse" />
                </motion.div>
                <h3 className="text-xl font-semibold mb-2 text-gradient">Receive Treatment Plan</h3>
                <p className="text-foreground/70">
                  Get personalized recommendations for treatment, prevention, and care.
                </p>
              </motion.div>
            </div>
          </div>
        </section>
        
        <section className="py-16 relative">
          <div className="container mx-auto px-4">
            <motion.div 
              className="text-center mb-12"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl font-bold mb-4 text-gradient relative inline-block">
                Frequently Asked Questions
                <div className="absolute -bottom-2 left-1/4 right-1/4 h-0.5 bg-gradient-to-r from-transparent via-plantDoc-primary to-transparent"></div>
              </h2>
              <p className="text-foreground/70 max-w-2xl mx-auto">
                Common questions about Plant Doc and how it can help your plants thrive.
              </p>
            </motion.div>
            
            <motion.div 
              className="max-w-3xl mx-auto glass-card rounded-xl p-6 md:p-8"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6 }}
              whileHover={{ 
                boxShadow: '0 0 30px rgba(76, 175, 80, 0.2)',
                backgroundColor: 'rgba(0, 0, 0, 0.4)'
              }}
            >
              <Suspense fallback={<ComponentLoader />}>
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="item-1" className="border-b border-white/10 group">
                    <AccordionTrigger className="text-lg font-medium py-4 hover:text-plantDoc-primary transition-colors group-hover:bg-black/20 px-4 rounded-md -mx-4">
                      <motion.span
                        className="group-hover:translate-x-1 transition-transform duration-300"
                        whileHover={{ x: 5 }}
                      >
                        How accurate is the plant disease diagnosis?
                      </motion.span>
                    </AccordionTrigger>
                    <AccordionContent className="text-foreground/80 pb-4">
                      <motion.div 
                        className="bg-black/20 p-4 rounded-lg"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        Plant Doc uses advanced AI technology powered by Google's Gemini model to analyze plant images. While accuracy is high, it depends on image quality and clear visibility of symptoms. For best results, take well-lit photos that clearly show the affected parts of your plant.
                      </motion.div>
                    </AccordionContent>
                  </AccordionItem>
                  
                  <AccordionItem value="item-2" className="border-b border-white/10 group">
                    <AccordionTrigger className="text-lg font-medium py-4 hover:text-plantDoc-primary transition-colors group-hover:bg-black/20 px-4 rounded-md -mx-4">
                      <motion.span
                        className="group-hover:translate-x-1 transition-transform duration-300"
                        whileHover={{ x: 5 }}
                      >
                        Do I need to create an account to use Plant Doc?
                      </motion.span>
                    </AccordionTrigger>
                    <AccordionContent className="text-foreground/80 pb-4">
                      <motion.div 
                        className="bg-black/20 p-4 rounded-lg"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        No, Plant Doc is completely free to use and doesn't require account creation. Simply upload your plant photo and get instant results without signing up or providing personal information.
                      </motion.div>
                    </AccordionContent>
                  </AccordionItem>
                  
                  <AccordionItem value="item-3" className="border-b border-white/10 group">
                    <AccordionTrigger className="text-lg font-medium py-4 hover:text-plantDoc-primary transition-colors group-hover:bg-black/20 px-4 rounded-md -mx-4">
                      <motion.span
                        className="group-hover:translate-x-1 transition-transform duration-300"
                        whileHover={{ x: 5 }}
                      >
                        What information does Plant Doc provide in its diagnosis?
                      </motion.span>
                    </AccordionTrigger>
                    <AccordionContent className="text-foreground/80 pb-4">
                      <motion.div 
                        className="bg-black/20 p-4 rounded-lg"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        Plant Doc provides comprehensive information including plant identification, disease detection, cause analysis, treatment recommendations, prevention tips, fertilizer advice, and general care instructions to help your plants recover and thrive.
                      </motion.div>
                    </AccordionContent>
                  </AccordionItem>
                  
                  <AccordionItem value="item-4" className="border-b border-white/10 group">
                    <AccordionTrigger className="text-lg font-medium py-4 hover:text-plantDoc-primary transition-colors group-hover:bg-black/20 px-4 rounded-md -mx-4">
                      <motion.span
                        className="group-hover:translate-x-1 transition-transform duration-300"
                        whileHover={{ x: 5 }}
                      >
                        How does the plant recommendation feature work?
                      </motion.span>
                    </AccordionTrigger>
                    <AccordionContent className="text-foreground/80 pb-4">
                      <motion.div 
                        className="bg-black/20 p-4 rounded-lg"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        The plant recommendation feature analyzes your local climate conditions, soil characteristics, and growing environment to suggest plants that would thrive in your specific location. It provides detailed information about each recommended plant including care instructions and growing tips.
                      </motion.div>
                    </AccordionContent>
                  </AccordionItem>
                  
                  <AccordionItem value="item-5" className="border-b border-white/10 group">
                    <AccordionTrigger className="text-lg font-medium py-4 hover:text-plantDoc-primary transition-colors group-hover:bg-black/20 px-4 rounded-md -mx-4">
                      <motion.span
                        className="group-hover:translate-x-1 transition-transform duration-300"
                        whileHover={{ x: 5 }}
                      >
                        Can Plant Doc identify all types of plants?
                      </motion.span>
                    </AccordionTrigger>
                    <AccordionContent className="text-foreground/80 pb-4">
                      <motion.div 
                        className="bg-black/20 p-4 rounded-lg"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        Plant Doc can identify a wide variety of common houseplants, garden plants, and agricultural crops. However, very rare species or newly discovered varieties might be more challenging to identify with complete accuracy. The system is continuously improving its plant recognition capabilities.
                      </motion.div>
                    </AccordionContent>
                  </AccordionItem>
                  
                  <AccordionItem value="item-6" className="group">
                    <AccordionTrigger className="text-lg font-medium py-4 hover:text-plantDoc-primary transition-colors group-hover:bg-black/20 px-4 rounded-md -mx-4">
                      <motion.span
                        className="group-hover:translate-x-1 transition-transform duration-300"
                        whileHover={{ x: 5 }}
                      >
                        Is my data private when I use Plant Doc?
                      </motion.span>
                    </AccordionTrigger>
                    <AccordionContent className="text-foreground/80 pb-4">
                      <motion.div 
                        className="bg-black/20 p-4 rounded-lg"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        Yes, your privacy is important to us. Plant Doc processes your plant images temporarily for analysis purposes only. We don't store your images permanently or use them for purposes other than providing you with diagnosis results. Your data remains private and secure.
                      </motion.div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </Suspense>
            </motion.div>
          </div>
        </section>
      </main>
      
      <div className="fixed bottom-8 right-8 z-50">
        <Link to="/diagnose">
          <motion.div
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button className="bg-gradient-to-r from-plantDoc-primary to-plantDoc-secondary text-white font-bold px-6 py-6 rounded-full shadow-xl hover:shadow-2xl hover:shadow-plantDoc-primary/30 group animate-pulse-glow">
              <Leaf className="h-6 w-6 mr-2 group-hover:rotate-12 transition-transform" />
              <span className="text-lg">Diagnose Your Plant</span>
            </Button>
          </motion.div>
        </Link>
      </div>
      
      <motion.button 
        onClick={scrollToTop} 
        className={`fixed bottom-8 left-8 z-50 p-3 rounded-full glass-card ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'
        }`}
        whileHover={{ 
          scale: 1.1, 
          backgroundColor: 'rgba(0, 0, 0, 0.6)'
        }}
        whileTap={{ scale: 0.95 }}
      >
        <ChevronUp className="h-6 w-6 text-white" />
      </motion.button>
      
      <Footer />
    </div>
  );
};

export default Index;
