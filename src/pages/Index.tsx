
import React, { useEffect, useState, useRef, lazy, Suspense } from 'react';
import { Link } from 'react-router-dom';
import { Leaf, ArrowUp, Droplet, Thermometer, ChevronDown, ChevronUp, Sun, Wind, Cloud } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { motion } from 'framer-motion';
import DynamicBackground from '@/components/DynamicBackground';
import AnimatedLoader from '@/components/ui/animated-loader';

const ParallaxSection = lazy(() => import('@/components/ParallaxSection'));
const RotatingLeaf = lazy(() => import('@/components/RotatingLeaf'));
const ThreeDPlant = lazy(() => import('@/components/ThreeDPlant'));
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
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-background to-muted/50 relative overflow-hidden text-white">
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
                <h1 className="text-4xl md:text-5xl font-bold mb-4 text-white bg-gradient-to-r from-white to-white/80 bg-clip-text relative">
                  AI-Powered Plant Disease Diagnosis
                  <div className="absolute -bottom-2 left-0 md:w-1/3 h-0.5 bg-gradient-to-r from-plantDoc-primary to-transparent"></div>
                </h1>
                <p className="text-lg text-white/90 mb-8 md:max-w-xl">
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

        {/* Interactive 3D Plant Section */}
        <section className="py-16 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-black/10 via-transparent to-black/20 pointer-events-none"></div>
          <div className="container mx-auto px-4">
            <motion.div 
              className="text-center mb-12"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl font-bold mb-4 text-gradient relative inline-block">
                Explore Plants in 3D
                <div className="absolute -bottom-2 left-1/4 right-1/4 h-0.5 bg-gradient-to-r from-transparent via-plantDoc-primary to-transparent"></div>
              </h2>
              <p className="text-foreground/70 max-w-2xl mx-auto">
                Interact with our 3D plant models to learn more about plant structures and common disease symptoms.
              </p>
            </motion.div>
            
            <div className="flex flex-col md:flex-row items-center gap-8">
              <motion.div 
                className="w-full md:w-1/2 h-[400px] glass-card rounded-xl overflow-hidden"
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <Suspense fallback={<ComponentLoader />}>
                  <ThreeDPlant />
                </Suspense>
              </motion.div>
              
              <motion.div 
                className="w-full md:w-1/2 space-y-6"
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <div className="glass-card p-6 rounded-xl hover:shadow-plantDoc-primary/20 hover:shadow-lg transition-all duration-300">
                  <div className="flex items-center gap-4 mb-4">
                    <motion.div 
                      className="h-12 w-12 bg-plantDoc-primary/20 rounded-full flex items-center justify-center"
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <Sun className="h-6 w-6 text-plantDoc-primary" />
                    </motion.div>
                    <h3 className="text-xl font-semibold text-gradient">Light Requirements</h3>
                  </div>
                  <p className="text-foreground/80">
                    Plants need the right amount of light to thrive. Our AI analyzes your plant's species 
                    and condition to recommend optimal lighting conditions.
                  </p>
                </div>
                
                <div className="glass-card p-6 rounded-xl hover:shadow-plantDoc-primary/20 hover:shadow-lg transition-all duration-300">
                  <div className="flex items-center gap-4 mb-4">
                    <motion.div 
                      className="h-12 w-12 bg-plantDoc-primary/20 rounded-full flex items-center justify-center"
                      animate={{ rotate: [0, 10, 0, -10, 0] }}
                      transition={{ duration: 4, repeat: Infinity }}
                    >
                      <Wind className="h-6 w-6 text-plantDoc-primary" />
                    </motion.div>
                    <h3 className="text-xl font-semibold text-gradient">Airflow & Humidity</h3>
                  </div>
                  <p className="text-foreground/80">
                    Proper airflow and humidity levels can prevent many plant diseases. Our diagnosis includes 
                    environmental factor analysis for comprehensive plant health.
                  </p>
                </div>
                
                <div className="glass-card p-6 rounded-xl hover:shadow-plantDoc-primary/20 hover:shadow-lg transition-all duration-300">
                  <div className="flex items-center gap-4 mb-4">
                    <motion.div 
                      className="h-12 w-12 bg-plantDoc-primary/20 rounded-full flex items-center justify-center"
                      animate={{ y: [0, -5, 0] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <Droplet className="h-6 w-6 text-plantDoc-primary" />
                    </motion.div>
                    <h3 className="text-xl font-semibold text-gradient">Water & Nutrients</h3>
                  </div>
                  <p className="text-foreground/80">
                    Balance is key with watering and fertilizing. Our personalized recommendations help you 
                    provide exactly what your plant needs to flourish.
                  </p>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Plant Care Reimagined Section */}
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
                Plant Care Reimagined
                <div className="absolute -bottom-2 left-1/4 right-1/4 h-0.5 bg-gradient-to-r from-transparent via-plantDoc-primary to-transparent"></div>
              </h2>
              <p className="text-foreground/70 max-w-2xl mx-auto">
                Experience the future of plant care with our AI-powered diagnosis and recommendations.
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
                  Take a clear picture of your plant showing the affected areas and upload it to our intelligent system.
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
                  Our advanced AI analyzes your plant's condition and provides a comprehensive diagnosis of any issues.
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
                  Get personalized recommendations for treatment, prevention, and ongoing care to help your plants thrive.
                </p>
              </motion.div>
            </div>
          </div>
        </section>
        
        {/* Climate-Aware Recommendations Section */}
        <section className="py-16 relative overflow-hidden bg-black/30 backdrop-blur-sm">
          <div className="absolute inset-0 bg-gradient-to-r from-plantDoc-primary/10 to-plantDoc-secondary/10 pointer-events-none"></div>
          <motion.div 
            className="absolute -top-20 -right-20 w-60 h-60 rounded-full bg-plantDoc-primary/20 blur-3xl opacity-60"
            animate={{ scale: [1, 1.2, 1], opacity: [0.6, 0.4, 0.6] }}
            transition={{ duration: 8, repeat: Infinity }}
          />
          <motion.div 
            className="absolute -bottom-20 -left-20 w-60 h-60 rounded-full bg-plantDoc-secondary/20 blur-3xl opacity-50"
            animate={{ scale: [1, 1.3, 1], opacity: [0.5, 0.3, 0.5] }}
            transition={{ duration: 10, repeat: Infinity, delay: 1 }}
          />
        
          <div className="container mx-auto px-4">
            <motion.div 
              className="text-center mb-10"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl font-bold mb-4 text-gradient relative inline-block">
                Climate-Aware Plant Recommendations
                <div className="absolute -bottom-2 left-1/4 right-1/4 h-0.5 bg-gradient-to-r from-transparent via-plantDoc-primary to-transparent"></div>
              </h2>
              <p className="text-foreground/70 max-w-2xl mx-auto">
                Our intelligent system considers your local climate and growing conditions to suggest plants 
                that will thrive in your specific environment.
              </p>
            </motion.div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
              <motion.div 
                className="order-2 lg:order-1"
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <div className="space-y-6">
                  <motion.div 
                    className="glass-card p-5 rounded-xl hover:bg-black/40 transition-all duration-300"
                    whileHover={{ x: 5 }}
                  >
                    <div className="flex items-center gap-4">
                      <motion.div 
                        className="bg-plantDoc-primary/20 rounded-full p-3"
                        animate={{ rotate: [0, 10, 0, -10, 0] }}
                        transition={{ duration: 8, repeat: Infinity }}
                      >
                        <Cloud className="h-6 w-6 text-plantDoc-primary" />
                      </motion.div>
                      <div>
                        <h3 className="font-semibold text-xl mb-1 text-gradient">Local Climate Analysis</h3>
                        <p className="text-foreground/70">
                          We analyze temperature patterns, humidity levels, and seasonal changes in your area.
                        </p>
                      </div>
                    </div>
                  </motion.div>
                  
                  <motion.div 
                    className="glass-card p-5 rounded-xl hover:bg-black/40 transition-all duration-300"
                    whileHover={{ x: 5 }}
                  >
                    <div className="flex items-center gap-4">
                      <motion.div 
                        className="bg-plantDoc-primary/20 rounded-full p-3"
                        animate={{ scale: [1, 1.1, 1] }}
                        transition={{ duration: 3, repeat: Infinity }}
                      >
                        <Sun className="h-6 w-6 text-plantDoc-primary" />
                      </motion.div>
                      <div>
                        <h3 className="font-semibold text-xl mb-1 text-gradient">Sunlight Assessment</h3>
                        <p className="text-foreground/70">
                          Our recommendations account for your garden's sunlight exposure throughout the day.
                        </p>
                      </div>
                    </div>
                  </motion.div>
                  
                  <motion.div 
                    className="glass-card p-5 rounded-xl hover:bg-black/40 transition-all duration-300"
                    whileHover={{ x: 5 }}
                  >
                    <div className="flex items-center gap-4">
                      <motion.div 
                        className="bg-plantDoc-primary/20 rounded-full p-3"
                        animate={{ y: [0, -5, 0] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        <Droplet className="h-6 w-6 text-plantDoc-primary" />
                      </motion.div>
                      <div>
                        <h3 className="font-semibold text-xl mb-1 text-gradient">Soil & Water Insights</h3>
                        <p className="text-foreground/70">
                          We consider soil types, water availability, and drainage conditions in your area.
                        </p>
                      </div>
                    </div>
                  </motion.div>
                </div>
                
                <motion.div 
                  className="mt-8"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                >
                  <Link to="/recommend">
                    <Button className="bg-gradient-to-r from-plantDoc-primary to-plantDoc-secondary text-white font-medium px-6 py-5 rounded-full hover:shadow-xl transition-all duration-300 hover:shadow-plantDoc-primary/30">
                      Get Plant Recommendations
                      <ArrowUp className="ml-2 h-4 w-4 rotate-45" />
                    </Button>
                  </Link>
                </motion.div>
              </motion.div>
              
              <motion.div 
                className="order-1 lg:order-2 glass-card p-1 rounded-xl overflow-hidden shadow-xl"
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <img 
                  src="https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?q=80&w=2940&auto=format&fit=crop" 
                  alt="Garden with various plants" 
                  className="w-full h-full object-cover rounded-lg"
                />
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
      
      <div className="fixed bottom-16 md:bottom-8 right-8 z-50">
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
        className={`fixed bottom-16 md:bottom-8 left-8 z-50 p-3 rounded-full glass-card ${
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
