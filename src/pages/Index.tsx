
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Leaf, ArrowUp, Droplet, Thermometer, Github, User, Instagram, ChevronDown, ChevronUp } from 'lucide-react';
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

const Index = () => {
  const [scrollY, setScrollY] = useState(0);
  
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-background to-muted/50 relative overflow-hidden">
      {/* Dynamic background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-[300px] -right-[300px] w-[600px] h-[600px] bg-plantDoc-primary/5 rounded-full blur-3xl opacity-70 animate-pulse"></div>
        <div className="absolute top-[30%] -left-[200px] w-[400px] h-[400px] bg-plantDoc-secondary/5 rounded-full blur-3xl opacity-70" style={{ transform: `translateY(${scrollY * 0.1}px)` }}></div>
        <div className="absolute bottom-[10%] right-[5%] w-[300px] h-[300px] bg-accent/5 rounded-full blur-3xl opacity-70" style={{ transform: `translateY(${-scrollY * 0.05}px)` }}></div>
      </div>
      
      <Header />
      
      <main className="flex-1 relative z-10">
        {/* Hero Section */}
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row items-center gap-8 md:gap-16">
              <div className="flex-1 text-center md:text-left animate-enter">
                <div className="inline-flex items-center justify-center p-2 bg-plantDoc-primary/20 rounded-full mb-4 transition-all duration-300 hover:bg-plantDoc-primary/30 hover:scale-105">
                  <Leaf className="h-6 w-6 text-plantDoc-primary" />
                </div>
                <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
                  AI-Powered Plant Disease Diagnosis
                </h1>
                <p className="text-lg text-foreground/70 mb-6 md:max-w-xl">
                  Upload a photo of your plant and get instant diagnosis, treatment recommendations, 
                  and care tips to help your plants thrive.
                </p>
                <Link to="/diagnose">
                  <Button className="bg-gradient-to-r from-plantDoc-primary to-plantDoc-secondary text-white font-medium px-8 py-4 text-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                    Diagnose Your Plant
                  </Button>
                </Link>
              </div>
              <div className="flex-1 flex justify-center md:justify-end">
                <div className="relative w-72 h-72 md:w-96 md:h-96 animate-enter hover:scale-105 transition-all duration-500">
                  <div className="absolute inset-0 bg-plantDoc-primary/30 rounded-full opacity-30 blur-3xl"></div>
                  <div className="glass-card absolute inset-2 rounded-full overflow-hidden border-none shadow-2xl transition-all duration-300 hover:shadow-plantDoc-primary/30 hover:shadow-2xl">
                    <img
                      src="https://cdn.jsdelivr.net/gh/AadishY/plantdoc@main/public/live.gif"
                      alt="Healthy plant"
                      className="object-cover w-full h-full"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* About Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12 animate-enter">
              <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">How Plant Doc Works</h2>
              <p className="text-foreground/70 max-w-2xl mx-auto">
                Our advanced AI technology helps you identify and treat plant diseases with just a photo.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="glass-card rounded-xl p-6 text-center hover-scale transform transition-all duration-300 hover:bg-black/40 hover:translate-y-[-10px]">
                <div className="bg-plantDoc-primary/20 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 transform transition-all duration-300 hover:bg-plantDoc-primary/40 hover:scale-110">
                  <ArrowUp className="text-plantDoc-primary h-8 w-8" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Upload a Photo</h3>
                <p className="text-foreground/70">
                  Take a clear picture of your plant showing the affected areas and upload it.
                </p>
              </div>
              
              <div className="glass-card rounded-xl p-6 text-center hover-scale transform transition-all duration-300 hover:bg-black/40 hover:translate-y-[-10px]">
                <div className="bg-plantDoc-primary/20 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 transform transition-all duration-300 hover:bg-plantDoc-primary/40 hover:scale-110">
                  <Leaf className="text-plantDoc-primary h-8 w-8" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Get Diagnosis</h3>
                <p className="text-foreground/70">
                  Our AI analyzes your plant's condition and identifies any diseases or issues.
                </p>
              </div>
              
              <div className="glass-card rounded-xl p-6 text-center hover-scale transform transition-all duration-300 hover:bg-black/40 hover:translate-y-[-10px]">
                <div className="bg-plantDoc-primary/20 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 transform transition-all duration-300 hover:bg-plantDoc-primary/40 hover:scale-110">
                  <Thermometer className="text-plantDoc-primary h-8 w-8" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Receive Treatment Plan</h3>
                <p className="text-foreground/70">
                  Get personalized recommendations for treatment, prevention, and care.
                </p>
              </div>
            </div>
          </div>
        </section>
        
        {/* FAQ Section */}
        <section className="py-16 relative">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12 animate-enter">
              <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">Frequently Asked Questions</h2>
              <p className="text-foreground/70 max-w-2xl mx-auto">
                Common questions about Plant Doc and how it can help your plants thrive.
              </p>
            </div>
            
            <div className="max-w-3xl mx-auto glass-card rounded-xl p-6 md:p-8">
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-1" className="border-b border-border/50">
                  <AccordionTrigger className="text-lg font-medium py-4 hover:text-plantDoc-primary transition-colors">
                    How accurate is the plant disease diagnosis?
                  </AccordionTrigger>
                  <AccordionContent className="text-foreground/80 pb-4">
                    Plant Doc uses advanced AI technology powered by Google's Gemini model to analyze plant images. While accuracy is high, it depends on image quality and clear visibility of symptoms. For best results, take well-lit photos that clearly show the affected parts of your plant.
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="item-2" className="border-b border-border/50">
                  <AccordionTrigger className="text-lg font-medium py-4 hover:text-plantDoc-primary transition-colors">
                    Do I need to create an account to use Plant Doc?
                  </AccordionTrigger>
                  <AccordionContent className="text-foreground/80 pb-4">
                    No, Plant Doc is completely free to use and doesn't require account creation. Simply upload your plant photo and get instant results without signing up or providing personal information.
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="item-3" className="border-b border-border/50">
                  <AccordionTrigger className="text-lg font-medium py-4 hover:text-plantDoc-primary transition-colors">
                    What information does Plant Doc provide in its diagnosis?
                  </AccordionTrigger>
                  <AccordionContent className="text-foreground/80 pb-4">
                    Plant Doc provides comprehensive information including plant identification, disease detection, cause analysis, treatment recommendations, prevention tips, fertilizer advice, and general care instructions to help your plants recover and thrive.
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="item-4" className="border-b border-border/50">
                  <AccordionTrigger className="text-lg font-medium py-4 hover:text-plantDoc-primary transition-colors">
                    How does the plant recommendation feature work?
                  </AccordionTrigger>
                  <AccordionContent className="text-foreground/80 pb-4">
                    The plant recommendation feature analyzes your local climate conditions, soil characteristics, and growing environment to suggest plants that would thrive in your specific location. It provides detailed information about each recommended plant including care instructions and growing tips.
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="item-5" className="border-b border-border/50">
                  <AccordionTrigger className="text-lg font-medium py-4 hover:text-plantDoc-primary transition-colors">
                    Can Plant Doc identify all types of plants?
                  </AccordionTrigger>
                  <AccordionContent className="text-foreground/80 pb-4">
                    Plant Doc can identify a wide variety of common houseplants, garden plants, and agricultural crops. However, very rare species or newly discovered varieties might be more challenging to identify with complete accuracy. The system is continuously improving its plant recognition capabilities.
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="item-6">
                  <AccordionTrigger className="text-lg font-medium py-4 hover:text-plantDoc-primary transition-colors">
                    Is my data private when I use Plant Doc?
                  </AccordionTrigger>
                  <AccordionContent className="text-foreground/80 pb-4">
                    Yes, your privacy is important to us. Plant Doc processes your plant images temporarily for analysis purposes only. We don't store your images permanently or use them for purposes other than providing you with diagnosis results. Your data remains private and secure.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </div>
        </section>

        {/* About Me Section */}
        <section className="py-16 bg-black/30 backdrop-blur-lg">
          <div className="container mx-auto px-4">
            <div className="glass-card rounded-2xl overflow-hidden">
              <div className="flex flex-col md:flex-row">
                <div className="md:w-1/3 p-8 flex flex-col justify-center items-center">
                  <div className="rounded-full bg-gradient-to-r from-plantDoc-primary to-plantDoc-secondary p-1 mb-6 hover:scale-105 transition-all duration-300">
                    <div className="rounded-full overflow-hidden w-32 h-32">
                      <User className="w-full h-full p-6 bg-background" />
                    </div>
                  </div>
                  <h3 className="text-xl font-bold mb-2">Aadish Kumar Yadav</h3>
                  <p className="text-foreground/70 text-center">Student at Red Rose Public School</p>
                  <p className="text-foreground/70 text-center">Class 11, Lucknow, India</p>
                  <p className="text-foreground/70 text-center">Age: 17</p>
                  <div className="mt-4 flex flex-wrap gap-3 justify-center">
                    <a 
                      href="https://github.com/AadishY" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-black/30 hover:bg-black/50 transition-all duration-300"
                    >
                      <Github className="h-5 w-5" />
                      <span>GitHub</span>
                    </a>
                    <a 
                      href="https://instagram.com/yo.akatsuki" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-black/30 hover:bg-black/50 transition-all duration-300"
                    >
                      <Instagram className="h-5 w-5" />
                      <span>Instagram</span>
                    </a>
                  </div>
                </div>
                <div className="md:w-2/3 p-8 bg-black/20">
                  <h2 className="text-3xl font-bold mb-6 bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">About Plant Doc</h2>
                  <p className="text-foreground/80 mb-4">
                    Plant Doc is an AI-powered application designed to help plant enthusiasts diagnose and treat plant diseases efficiently. 
                    Using advanced machine learning algorithms, it can identify various plant diseases from photos and provide accurate treatment recommendations.
                  </p>
                  <p className="text-foreground/80 mb-4">
                    This project was developed as a way to combine my passion for technology and nature. As a student interested in 
                    artificial intelligence and environmental science, I wanted to create a tool that can make plant care more accessible 
                    to everyone and help people maintain healthier plants.
                  </p>
                  <p className="text-foreground/80">
                    At its core, Plant Doc harnesses the power of Google Gemini AI for all aspects of its analysis, ensuring reliable
                    diagnoses and tailored treatment plans that address your plant's specific needs.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      {/* Sticky Diagnose Button - Only shown on homepage */}
      <div className="fixed bottom-8 right-8 z-50">
        <Link to="/diagnose">
          <Button className="bg-gradient-to-r from-plantDoc-primary to-plantDoc-secondary text-white font-bold px-6 py-6 rounded-full shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-300 animate-pulse group">
            <Leaf className="h-6 w-6 mr-2 group-hover:rotate-12 transition-transform" />
            <span className="text-lg">Diagnose Your Plant</span>
          </Button>
        </Link>
      </div>
      
      <Footer />
    </div>
  );
};

export default Index;
