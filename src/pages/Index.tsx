import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Leaf, ArrowUp, Droplet, Thermometer, Github, User, Instagram, ChevronDown, ChevronUp, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Accordion, 
  AccordionContent, 
  AccordionItem, 
  AccordionTrigger 
} from '@/components/ui/accordion';
import { HoverCard, HoverCardTrigger, HoverCardContent } from '@/components/ui/hover-card';
import { EnhancedCard, EnhancedCardHeader, EnhancedCardTitle, EnhancedCardContent } from '@/components/ui/enhanced-card';
import DynamicBackground from '@/components/DynamicBackground';
import { motion } from 'framer-motion';
import { useTranslation } from '@/hooks/useTranslation';

const Index = () => {
  const [scrollY, setScrollY] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const aboutRef = useRef<HTMLDivElement>(null);
  const { translate } = useTranslation();
  
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
      
      // Show scroll to top button after scrolling down 500px
      setIsVisible(window.scrollY > 500);
    };
    
    window.addEventListener('scroll', handleScroll);
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
      {/* Dynamic background elements */}
      <DynamicBackground />
      
      <Header />
      
      <main className="flex-1 relative z-10">
        {/* Hero Section */}
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
                  {translate('heroTitle')}
                  <div className="absolute -bottom-2 left-0 md:w-1/3 h-0.5 bg-gradient-to-r from-plantDoc-primary to-transparent"></div>
                </h1>
                <p className="text-lg text-foreground/70 mb-8 md:max-w-xl">
                  {translate('heroDescription')}
                </p>
                <Link to="/diagnose">
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
                    <Button variant="gradient" size="pill" className="font-medium py-6 text-lg hover:shadow-xl group">
                      <span className="mr-2">{translate('diagnoseButton')}</span>
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
                <div className="relative w-72 h-72 md:w-96 md:h-96">
                  <motion.div 
                    className="absolute inset-0 bg-plantDoc-primary/30 rounded-full opacity-30 blur-3xl"
                    animate={{ 
                      scale: [1, 1.05, 1],
                    }}
                    transition={{ 
                      duration: 3,
                      repeat: Infinity,
                      repeatType: "reverse"
                    }}
                  />
                  <motion.div 
                    className="glass-card absolute inset-2 rounded-full overflow-hidden border-none shadow-2xl group"
                    whileHover={{ 
                      scale: 1.05,
                      boxShadow: '0 0 30px rgba(76, 175, 80, 0.4)'
                    }}
                    transition={{ duration: 0.5 }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-tr from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <img
                      src="https://cdn.jsdelivr.net/gh/AadishY/plantdoc@main/public/live.gif"
                      alt="Healthy plant"
                      className="object-cover w-full h-full"
                    />
                  </motion.div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* About Section */}
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
                {translate('howItWorks')}
                <div className="absolute -bottom-2 left-1/4 right-1/4 h-0.5 bg-gradient-to-r from-transparent via-plantDoc-primary to-transparent"></div>
              </h2>
              <p className="text-foreground/70 max-w-2xl mx-auto">
                {translate('howItWorksDescription')}
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
                <h3 className="text-xl font-semibold mb-2 text-gradient">{translate('uploadPhotoTitle')}</h3>
                <p className="text-foreground/70">
                  {translate('uploadPhotoDescription')}
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
                <h3 className="text-xl font-semibold mb-2 text-gradient">{translate('getDiagnosisTitle')}</h3>
                <p className="text-foreground/70">
                  {translate('getDiagnosisDescription')}
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
                <h3 className="text-xl font-semibold mb-2 text-gradient">{translate('treatmentPlanTitle')}</h3>
                <p className="text-foreground/70">
                  {translate('treatmentPlanDescription')}
                </p>
              </motion.div>
            </div>
          </div>
        </section>
        
        {/* FAQ Section */}
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
                {translate('faqTitle')}
                <div className="absolute -bottom-2 left-1/4 right-1/4 h-0.5 bg-gradient-to-r from-transparent via-plantDoc-primary to-transparent"></div>
              </h2>
              <p className="text-foreground/70 max-w-2xl mx-auto">
                {translate('faqDescription')}
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
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-1" className="border-b border-white/10 group">
                  <AccordionTrigger className="text-lg font-medium py-4 hover:text-plantDoc-primary transition-colors group-hover:bg-black/20 px-4 rounded-md -mx-4">
                    <motion.span
                      className="group-hover:translate-x-1 transition-transform duration-300"
                      whileHover={{ x: 5 }}
                    >
                      {translate('faqQuestion1')}
                    </motion.span>
                  </AccordionTrigger>
                  <AccordionContent className="text-foreground/80 pb-4">
                    <motion.div 
                      className="bg-black/20 p-4 rounded-lg"
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      {translate('faqAnswer1')}
                    </motion.div>
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="item-2" className="border-b border-white/10 group">
                  <AccordionTrigger className="text-lg font-medium py-4 hover:text-plantDoc-primary transition-colors group-hover:bg-black/20 px-4 rounded-md -mx-4">
                    <motion.span
                      className="group-hover:translate-x-1 transition-transform duration-300"
                      whileHover={{ x: 5 }}
                    >
                      {translate('faqQuestion2')}
                    </motion.span>
                  </AccordionTrigger>
                  <AccordionContent className="text-foreground/80 pb-4">
                    <motion.div 
                      className="bg-black/20 p-4 rounded-lg"
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      {translate('faqAnswer2')}
                    </motion.div>
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="item-3" className="border-b border-white/10 group">
                  <AccordionTrigger className="text-lg font-medium py-4 hover:text-plantDoc-primary transition-colors group-hover:bg-black/20 px-4 rounded-md -mx-4">
                    <motion.span
                      className="group-hover:translate-x-1 transition-transform duration-300"
                      whileHover={{ x: 5 }}
                    >
                      {translate('faqQuestion3')}
                    </motion.span>
                  </AccordionTrigger>
                  <AccordionContent className="text-foreground/80 pb-4">
                    <motion.div 
                      className="bg-black/20 p-4 rounded-lg"
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      {translate('faqAnswer3')}
                    </motion.div>
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="item-4" className="border-b border-white/10 group">
                  <AccordionTrigger className="text-lg font-medium py-4 hover:text-plantDoc-primary transition-colors group-hover:bg-black/20 px-4 rounded-md -mx-4">
                    <motion.span
                      className="group-hover:translate-x-1 transition-transform duration-300"
                      whileHover={{ x: 5 }}
                    >
                      {translate('faqQuestion4')}
                    </motion.span>
                  </AccordionTrigger>
                  <AccordionContent className="text-foreground/80 pb-4">
                    <motion.div 
                      className="bg-black/20 p-4 rounded-lg"
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      {translate('faqAnswer4')}
                    </motion.div>
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="item-5" className="border-b border-white/10 group">
                  <AccordionTrigger className="text-lg font-medium py-4 hover:text-plantDoc-primary transition-colors group-hover:bg-black/20 px-4 rounded-md -mx-4">
                    <motion.span
                      className="group-hover:translate-x-1 transition-transform duration-300"
                      whileHover={{ x: 5 }}
                    >
                      {translate('faqQuestion5')}
                    </motion.span>
                  </AccordionTrigger>
                  <AccordionContent className="text-foreground/80 pb-4">
                    <motion.div 
                      className="bg-black/20 p-4 rounded-lg"
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      {translate('faqAnswer5')}
                    </motion.div>
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="item-6" className="group">
                  <AccordionTrigger className="text-lg font-medium py-4 hover:text-plantDoc-primary transition-colors group-hover:bg-black/20 px-4 rounded-md -mx-4">
                    <motion.span
                      className="group-hover:translate-x-1 transition-transform duration-300"
                      whileHover={{ x: 5 }}
                    >
                      {translate('faqQuestion6')}
                    </motion.span>
                  </AccordionTrigger>
                  <AccordionContent className="text-foreground/80 pb-4">
                    <motion.div 
                      className="bg-black/20 p-4 rounded-lg"
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      {translate('faqAnswer6')}
                    </motion.div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </motion.div>
          </div>
        </section>

        {/* About Me Section */}
        <section className="py-16 relative" ref={aboutRef}>
          <div className="absolute inset-0 bg-black/40 backdrop-blur-md -z-10"></div>
          <div className="container mx-auto px-4">
            <motion.div 
              className="glass-card rounded-2xl overflow-hidden"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.7 }}
              whileHover={{ 
                boxShadow: '0 0 30px rgba(76, 175, 80, 0.3)',
              }}
            >
              <div className="flex flex-col md:flex-row">
                <div className="md:w-1/3 p-8 flex flex-col justify-center items-center backdrop-blur-lg bg-black/20">
                  <motion.div 
                    className="rounded-full bg-gradient-to-r from-plantDoc-primary to-plantDoc-secondary p-1 mb-6 group"
                    whileHover={{ 
                      scale: 1.05,
                      boxShadow: '0 0 20px rgba(76, 175, 80, 0.5)' 
                    }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="rounded-full overflow-hidden w-32 h-32 bg-black/50 flex items-center justify-center">
                      <User className="w-28 h-28 p-6 text-white group-hover:rotate-12 transition-transform duration-300" />
                    </div>
                  </motion.div>
                  <h3 className="text-xl font-bold mb-2 text-gradient">Aadish Kumar Yadav</h3>
                  <p className="text-foreground/70 text-center">Student at Red Rose Public School</p>
                  <p className="text-foreground/70 text-center">Class 11, Lucknow, India</p>
                  <p className="text-foreground/70 text-center">Age: 17</p>
                  <div className="mt-6 flex flex-wrap gap-3 justify-center">
                    <motion.a 
                      href="https://github.com/AadishY" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-md glass-card group"
                      whileHover={{ 
                        backgroundColor: 'rgba(0, 0, 0, 0.5)',
                        y: -3,
                        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.2)'
                      }}
                    >
                      <Github className="h-5 w-5 group-hover:rotate-12 transition-transform duration-300" />
                      <span>GitHub</span>
                      <ExternalLink className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </motion.a>
                    <motion.a 
                      href="https://instagram.com/yo.akatsuki" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-md glass-card group"
                      whileHover={{ 
                        backgroundColor: 'rgba(0, 0, 0, 0.5)',
                        y: -3,
                        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.2)'
                      }}
                    >
                      <Instagram className="h-5 w-5 group-hover:rotate-12 transition-transform duration-300" />
                      <span>Instagram</span>
                      <ExternalLink className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </motion.a>
                  </div>
                </div>
                <div className="md:w-2/3 p-8 bg-black/40 backdrop-blur-xl">
                  <h2 className="text-3xl font-bold mb-6 text-gradient relative inline-block">
                    {translate('aboutTitle')}
                    <div className="absolute -bottom-2 left-0 w-1/3 h-0.5 bg-gradient-to-r from-plantDoc-primary to-transparent"></div>
                  </h2>
                  
                  <motion.p 
                    className="text-foreground/80 mb-4 backdrop-blur-lg bg-black/10 p-4 rounded-lg"
                    whileHover={{ backgroundColor: 'rgba(0, 0, 0, 0.3)' }}
                    transition={{ duration: 0.3 }}
                  >
                    {translate('aboutDescription1')}
                  </motion.p>
                  
                  <motion.p 
                    className="text-foreground/80 mb-4 backdrop-blur-lg bg-black/10 p-4 rounded-lg"
                    whileHover={{ backgroundColor: 'rgba(0, 0, 0, 0.3)' }}
                    transition={{ duration: 0.3 }}
                  >
                    {translate('aboutDescription2')}
                  </motion.p>
                  
                  <motion.p 
                    className="text-foreground/80 backdrop-blur-lg bg-black/10 p-4 rounded-lg"
                    whileHover={{ backgroundColor: 'rgba(0, 0, 0, 0.3)' }}
                    transition={{ duration: 0.3 }}
                  >
                    {translate('aboutDescription3')}
                  </motion.p>
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      </main>
      
      {/* Sticky Diagnose Button */}
      <div className="fixed bottom-8 right-8 z-50">
        <Link to="/diagnose">
          <motion.div
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button variant="gradient" size="pill" className="font-bold px-6 py-6 shadow-xl hover:shadow-2xl hover:shadow-plantDoc-primary/30 group animate-pulse-glow">
              <Leaf className="h-6 w-6 mr-2 group-hover:rotate-12 transition-transform" />
              <span className="text-lg">{translate('diagnoseButton')}</span>
            </Button>
          </motion.div>
        </Link>
      </div>
      
      {/* Scroll to top button */}
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
