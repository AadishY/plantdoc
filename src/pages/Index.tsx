import React, { useEffect, useState, lazy, Suspense } from 'react';
import { Link } from 'react-router-dom';
import { Leaf, ArrowUp, ChevronUp, Zap, ShieldCheck, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { motion } from 'framer-motion';
import AnimatedLoader from '@/components/ui/animated-loader';
import { useIsMobile } from '@/hooks/use-mobile';
import FeatureHighlights from '@/components/FeatureHighlights';
import CtaSection from '@/components/CtaSection';
import ParallaxSection from '@/components/ParallaxSection';
import { 
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent
} from '@/components/ui/accordion';

const ComponentLoader = () => (
  <div className="w-full h-32 flex items-center justify-center">
    <AnimatedLoader size="md" color="primary" />
  </div>
);

const Index = () => {
  const [scrollY, setScrollY] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const isMobile = useIsMobile();
  
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
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      <Header />
      
      <main className="flex-1 relative z-10">
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4">
            <motion.div 
              className="flex justify-center items-center text-center max-w-3xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <div>
                <motion.div 
                  className="inline-flex items-center justify-center p-2 bg-plantDoc-primary/20 rounded-full mb-4 glass-card"
                  whileHover={{ 
                    scale: 1.1, 
                    backgroundColor: 'rgba(76, 175, 80, 0.3)',
                    boxShadow: '0 0 15px rgba(76, 175, 80, 0.5)'
                  }}
                  transition={{ duration: 0.3 }}
                >
                  <Leaf className="h-6 w-6 text-plantDoc-primary" />
                </motion.div>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-gradient relative">
                  Plant Doc
                  <div className="absolute -bottom-2 left-0 right-0 mx-auto w-1/3 h-0.5 bg-gradient-to-r from-plantDoc-primary to-transparent"></div>
                </h1>
                <p className="text-lg md:text-xl text-foreground/70 mb-8 max-w-xl mx-auto">
                  Upload a photo of your plant and get instant diagnosis, treatment recommendations, 
                  and care tips to help your plants thrive.
                </p>
                <Link to="/diagnose" className="inline-block">
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
                    <Button className="glass-button bg-gradient-to-r from-plantDoc-primary to-plantDoc-secondary text-white font-medium px-8 py-6 text-lg rounded-full hover:shadow-xl transition-all duration-300 hover:shadow-plantDoc-primary/30 group">
                      <span className="mr-2">Diagnose Your Plant</span>
                      <span className="relative">
                        <span className="absolute -right-6 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 group-hover:right-0 transition-all duration-300">
                          <ArrowUp className="h-4 w-4 rotate-45" />
                        </span>
                      </span>
                    </Button>
                  </motion.div>
                </Link>
              </div>
            </motion.div>
            
            <motion.div 
              className="mt-16 flex justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.5 }}
            >
              <div className="flex space-x-2 opacity-60">
                <motion.div 
                  animate={{ y: [0, -4, 0] }}
                  transition={{ 
                    duration: 1.5, 
                    repeat: Infinity,
                    repeatType: "loop",
                    ease: "easeInOut",
                    delay: 0
                  }}
                  className="w-2 h-2 rounded-full bg-plantDoc-primary"
                />
                <motion.div 
                  animate={{ y: [0, -4, 0] }}
                  transition={{ 
                    duration: 1.5, 
                    repeat: Infinity,
                    repeatType: "loop",
                    ease: "easeInOut",
                    delay: 0.2
                  }}
                  className="w-2 h-2 rounded-full bg-plantDoc-primary"
                />
                <motion.div 
                  animate={{ y: [0, -4, 0] }}
                  transition={{ 
                    duration: 1.5, 
                    repeat: Infinity,
                    repeatType: "loop",
                    ease: "easeInOut",
                    delay: 0.4
                  }}
                  className="w-2 h-2 rounded-full bg-plantDoc-primary"
                />
              </div>
            </motion.div>
          </div>
        </section>

        <ParallaxSection />

        <section className="py-12 md:py-16 relative">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.3 }}
              className="text-center mb-10"
            >
              <h2 className="text-3xl font-bold mb-3 text-gradient">How It Works</h2>
              <p className="text-foreground/70 max-w-2xl mx-auto">Diagnose plant issues in three simple steps</p>
            </motion.div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {[
                {
                  step: 1,
                  icon: <Upload />,
                  title: "Upload Photo",
                  description: "Take a clear photo of your plant's affected parts and upload it to our system"
                },
                {
                  step: 2,
                  icon: <Zap />,
                  title: "AI Analysis",
                  description: "Our AI system analyzes the image to identify diseases and health issues"
                },
                {
                  step: 3,
                  icon: <ShieldCheck />,
                  title: "Get Results",
                  description: "Receive comprehensive diagnosis and treatment recommendations in seconds"
                }
              ].map((item, index) => (
                <motion.div
                  key={item.step}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ delay: index * 0.1, duration: 0.4 }}
                  className="glass-card-intense p-6 rounded-xl text-center relative"
                  whileHover={{ 
                    y: -5,
                    boxShadow: "0 10px 30px -15px rgba(76, 175, 80, 0.3)"
                  }}
                >
                  <div className="absolute -top-4 -left-4 w-12 h-12 bg-gradient-to-br from-plantDoc-primary to-plantDoc-secondary rounded-full flex items-center justify-center font-bold text-black shadow-lg">
                    {item.step}
                  </div>
                  <div className="pt-6">
                    <motion.div 
                      className="w-16 h-16 mx-auto mb-4 bg-plantDoc-primary/20 glass-card rounded-full flex items-center justify-center"
                      whileHover={{ rotate: 15 }}
                    >
                      <span className="text-plantDoc-primary">{item.icon}</span>
                    </motion.div>
                    <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                    <p className="text-foreground/70">{item.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <FeatureHighlights />

        <CtaSection />

        <section className="py-16 relative overflow-hidden">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.3 }}
              className="max-w-4xl mx-auto"
            >
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {[
                  { value: "5000+", label: "Plant Species" },
                  { value: "95%", label: "Accuracy Rate" },
                  { value: "2000+", label: "Disease Types" },
                  { value: "24/7", label: "Availability" }
                ].map((stat, index) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ delay: index * 0.1, duration: 0.3 }}
                    className="glass-card-intense p-6 rounded-xl text-center"
                    whileHover={{ 
                      scale: 1.05,
                      boxShadow: "0 0 20px rgba(76, 175, 80, 0.2)" 
                    }}
                  >
                    <h3 className="text-3xl md:text-4xl font-bold text-plantDoc-primary mb-2">{stat.value}</h3>
                    <p className="text-foreground/70 text-sm">{stat.label}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        <section className="py-16 relative">
          <div className="container mx-auto px-4">
            <motion.div 
              className="text-center mb-12"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.4 }}
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
              className="max-w-3xl mx-auto glass-card-intense rounded-xl p-6 md:p-8"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.4 }}
              whileHover={{ 
                boxShadow: '0 0 30px rgba(76, 175, 80, 0.2)'
              }}
            >
              <Suspense fallback={<ComponentLoader />}>
                <Accordion type="single" collapsible className="w-full">
                  {[
                    {
                      question: "How accurate is the plant disease diagnosis?",
                      answer: "Plant Doc uses advanced AI technology powered by Google's Gemini model to analyze plant images. While accuracy is high, it depends on image quality and clear visibility of symptoms. For best results, take well-lit photos that clearly show the affected parts of your plant."
                    },
                    {
                      question: "Do I need to create an account to use Plant Doc?",
                      answer: "No, Plant Doc is completely free to use and doesn't require account creation. Simply upload your plant photo and get instant results without signing up or providing personal information."
                    },
                    {
                      question: "What information does Plant Doc provide in its diagnosis?",
                      answer: "Plant Doc provides comprehensive information including plant identification, disease detection, cause analysis, treatment recommendations, prevention tips, fertilizer advice, and general care instructions to help your plants recover and thrive."
                    },
                    {
                      question: "How does the plant recommendation feature work?",
                      answer: "The plant recommendation feature analyzes your local climate conditions, soil characteristics, and growing environment to suggest plants that would thrive in your specific location. It provides detailed information about each recommended plant including care instructions and growing tips."
                    },
                    {
                      question: "Can Plant Doc identify all types of plants?",
                      answer: "Plant Doc can identify a wide variety of common houseplants, garden plants, and agricultural crops. However, very rare species or newly discovered varieties might be more challenging to identify with complete accuracy. The system is continuously improving its plant recognition capabilities."
                    },
                    {
                      question: "Is my data private when I use Plant Doc?",
                      answer: "Yes, your privacy is important to us. Plant Doc processes your plant images temporarily for analysis purposes only. We don't store your images permanently or use them for purposes other than providing you with diagnosis results. Your data remains private and secure."
                    }
                  ].map((item, index) => (
                    <AccordionItem key={index} value={`item-${index + 1}`} className="border-b border-white/10 group last:border-0">
                      <AccordionTrigger className="text-lg font-medium py-4 hover:text-plantDoc-primary transition-colors group-hover:bg-black/20 px-4 rounded-md -mx-4">
                        <motion.span
                          className="group-hover:translate-x-1 transition-transform duration-300"
                          whileHover={{ x: 5 }}
                        >
                          {item.question}
                        </motion.span>
                      </AccordionTrigger>
                      <AccordionContent className="text-foreground/80 pb-4">
                        <motion.div 
                          className="bg-black/20 p-4 rounded-lg"
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          {item.answer}
                        </motion.div>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </Suspense>
            </motion.div>
          </div>
        </section>
      </main>
      
      {!isMobile && (
        <div className="fixed bottom-6 md:bottom-28 right-4 md:right-8 z-50">
          <Link to="/diagnose">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button className="glass-button bg-gradient-to-r from-plantDoc-primary to-plantDoc-secondary text-white font-bold px-4 md:px-6 py-3 md:py-6 rounded-full shadow-xl hover:shadow-2xl hover:shadow-plantDoc-primary/30 group">
                <Leaf className="h-5 w-5 mr-2 group-hover:rotate-12 transition-transform" />
                <span className="text-sm md:text-lg">Diagnose Plant</span>
              </Button>
            </motion.div>
          </Link>
        </div>
      )}
      
      <motion.button 
        onClick={scrollToTop} 
        className={`fixed bottom-6 md:bottom-28 left-4 md:left-8 z-50 p-2 md:p-3 rounded-full glass-card ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'
        } transition-all duration-300`}
        whileHover={{ 
          scale: 1.1, 
          backgroundColor: 'rgba(0, 0, 0, 0.6)'
        }}
        whileTap={{ scale: 0.95 }}
      >
        <ChevronUp className="h-5 w-5 md:h-6 md:w-6 text-white" />
      </motion.button>
      
      <Footer />
    </div>
  );
};

export default Index;
