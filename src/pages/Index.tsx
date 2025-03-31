
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

// Dynamic background component
const DynamicBackground = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {/* Large blobs that move around slowly */}
      <div className="glass-blob from-plantDoc-primary/20 to-plantDoc-secondary/10 -top-[300px] -right-[300px] w-[600px] h-[600px]" 
           style={{ animationDelay: '0s' }}></div>
      <div className="glass-blob from-plantDoc-secondary/15 to-plantDoc-primary/5 top-[30%] -left-[200px] w-[400px] h-[400px]" 
           style={{ animationDelay: '-2s' }}></div>
      <div className="glass-blob from-accent/10 to-plantDoc-primary/5 bottom-[10%] right-[5%] w-[300px] h-[300px]" 
           style={{ animationDelay: '-4s' }}></div>
      
      {/* Smaller floating elements */}
      <div className="absolute top-[15%] left-[10%] w-[150px] h-[150px] rounded-full bg-plantDoc-primary/10 blur-2xl animate-float"
           style={{ animationDelay: '-1s' }}></div>
      <div className="absolute top-[45%] right-[15%] w-[100px] h-[100px] rounded-full bg-accent/10 blur-2xl animate-float"
           style={{ animationDelay: '-3s' }}></div>
      <div className="absolute bottom-[25%] left-[20%] w-[120px] h-[120px] rounded-full bg-plantDoc-secondary/10 blur-2xl animate-float"
           style={{ animationDelay: '-5s' }}></div>
           
      {/* Radial gradient overlay */}
      <div className="absolute inset-0 bg-radial-gradient from-transparent via-transparent to-background/80 pointer-events-none"></div>
      
      {/* Grid pattern */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiMxQTIwMkMiIGZpbGwtb3BhY2l0eT0iMC4wNCI+PHBhdGggZD0iTTM2IDM0aDR2MWgtNHYtMXptMC0zaC00djFoNHYtMXptMC0yaC00djFoNHYtMXptLTYgMWgtNHYxaDR2LTF6TTEyIDEyaDR2MWgtNHYtMXptMC0zaC00djFoNHYtMXptMC0yaC00djFoNHYtMXptLTYgMWgtNHYxaDR2LTF6TTM2IDEyaDR2MWgtNHYtMXptMC0zaC00djFoNHYtMXptMC0yaC00djFoNHYtMXptLTYgMWgtNHYxaDR2LTF6TTEyIDM0aDR2MWgtNHYtMXptMC0zaC00djFoNHYtMXptMC0yaC00djFoNHYtMXptLTYgMWgtNHYxaDR2LTF6Ij48L3BhdGg+PC9nPjwvZz48L3N2Zz4=')] opacity-30"></div>
    </div>
  );
};

const Index = () => {
  const [scrollY, setScrollY] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const aboutRef = useRef<HTMLDivElement>(null);
  
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
              <div className="flex-1 text-center md:text-left animate-enter">
                <div className="inline-flex items-center justify-center p-2 bg-plantDoc-primary/20 rounded-full mb-4 transition-all duration-300 hover:bg-plantDoc-primary/30 hover:scale-110 cursor-pointer animate-pulse-glow">
                  <Leaf className="h-6 w-6 text-plantDoc-primary" />
                </div>
                <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gradient relative">
                  AI-Powered Plant Disease Diagnosis
                  <div className="absolute -bottom-2 left-0 md:w-1/3 h-0.5 bg-gradient-to-r from-plantDoc-primary to-transparent"></div>
                </h1>
                <p className="text-lg text-foreground/70 mb-8 md:max-w-xl">
                  Upload a photo of your plant and get instant diagnosis, treatment recommendations, 
                  and care tips to help your plants thrive.
                </p>
                <Link to="/diagnose">
                  <Button className="bg-gradient-to-r from-plantDoc-primary to-plantDoc-secondary text-white font-medium px-8 py-6 text-lg rounded-full hover:shadow-xl transition-all duration-300 hover:scale-105 hover:shadow-plantDoc-primary/30 group">
                    <span className="mr-2">Diagnose Your Plant</span>
                    <span className="relative">
                      <span className="absolute -right-6 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 group-hover:right-0 transition-all duration-300">
                        <ArrowUp className="h-4 w-4 rotate-45" />
                      </span>
                    </span>
                  </Button>
                </Link>
              </div>
              <div className="flex-1 flex justify-center md:justify-end">
                <div className="relative w-72 h-72 md:w-96 md:h-96 animate-enter">
                  <div className="absolute inset-0 bg-plantDoc-primary/30 rounded-full opacity-30 blur-3xl animate-pulse"></div>
                  <div className="glass-card absolute inset-2 rounded-full overflow-hidden border-none shadow-2xl transition-all duration-500 hover:shadow-plantDoc-primary/40 hover:shadow-2xl hover:scale-105 group">
                    <div className="absolute inset-0 bg-gradient-to-tr from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
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
              <h2 className="text-3xl font-bold mb-4 text-gradient relative inline-block">
                How Plant Doc Works
                <div className="absolute -bottom-2 left-1/4 right-1/4 h-0.5 bg-gradient-to-r from-transparent via-plantDoc-primary to-transparent"></div>
              </h2>
              <p className="text-foreground/70 max-w-2xl mx-auto">
                Our advanced AI technology helps you identify and treat plant diseases with just a photo.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="glass-card rounded-xl p-6 text-center hover:bg-black/40 hover:translate-y-[-10px] group">
                <div className="bg-plantDoc-primary/20 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 transform transition-all duration-300 hover:bg-plantDoc-primary/40 hover:scale-110 group-hover:shadow-lg group-hover:shadow-plantDoc-primary/20">
                  <ArrowUp className="text-plantDoc-primary h-8 w-8 group-hover:animate-bounce" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-gradient">Upload a Photo</h3>
                <p className="text-foreground/70">
                  Take a clear picture of your plant showing the affected areas and upload it.
                </p>
              </div>
              
              <div className="glass-card rounded-xl p-6 text-center hover:bg-black/40 hover:translate-y-[-10px] group">
                <div className="bg-plantDoc-primary/20 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 transform transition-all duration-300 hover:bg-plantDoc-primary/40 hover:scale-110 group-hover:shadow-lg group-hover:shadow-plantDoc-primary/20">
                  <Leaf className="text-plantDoc-primary h-8 w-8 group-hover:rotate-12 transition-transform duration-300" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-gradient">Get Diagnosis</h3>
                <p className="text-foreground/70">
                  Our AI analyzes your plant's condition and identifies any diseases or issues.
                </p>
              </div>
              
              <div className="glass-card rounded-xl p-6 text-center hover:bg-black/40 hover:translate-y-[-10px] group">
                <div className="bg-plantDoc-primary/20 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 transform transition-all duration-300 hover:bg-plantDoc-primary/40 hover:scale-110 group-hover:shadow-lg group-hover:shadow-plantDoc-primary/20">
                  <Thermometer className="text-plantDoc-primary h-8 w-8 group-hover:animate-pulse" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-gradient">Receive Treatment Plan</h3>
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
              <h2 className="text-3xl font-bold mb-4 text-gradient relative inline-block">
                Frequently Asked Questions
                <div className="absolute -bottom-2 left-1/4 right-1/4 h-0.5 bg-gradient-to-r from-transparent via-plantDoc-primary to-transparent"></div>
              </h2>
              <p className="text-foreground/70 max-w-2xl mx-auto">
                Common questions about Plant Doc and how it can help your plants thrive.
              </p>
            </div>
            
            <div className="max-w-3xl mx-auto glass-card rounded-xl p-6 md:p-8 hover:shadow-xl hover:shadow-plantDoc-primary/10 transition-all duration-300">
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-1" className="border-b border-white/10 group">
                  <AccordionTrigger className="text-lg font-medium py-4 hover:text-plantDoc-primary transition-colors group-hover:bg-black/20 px-4 rounded-md -mx-4">
                    <span className="group-hover:translate-x-1 transition-transform duration-300">How accurate is the plant disease diagnosis?</span>
                  </AccordionTrigger>
                  <AccordionContent className="text-foreground/80 pb-4 animate-enter">
                    <div className="bg-black/20 p-4 rounded-lg">
                      Plant Doc uses advanced AI technology powered by Google's Gemini model to analyze plant images. While accuracy is high, it depends on image quality and clear visibility of symptoms. For best results, take well-lit photos that clearly show the affected parts of your plant.
                    </div>
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="item-2" className="border-b border-white/10 group">
                  <AccordionTrigger className="text-lg font-medium py-4 hover:text-plantDoc-primary transition-colors group-hover:bg-black/20 px-4 rounded-md -mx-4">
                    <span className="group-hover:translate-x-1 transition-transform duration-300">Do I need to create an account to use Plant Doc?</span>
                  </AccordionTrigger>
                  <AccordionContent className="text-foreground/80 pb-4 animate-enter">
                    <div className="bg-black/20 p-4 rounded-lg">
                      No, Plant Doc is completely free to use and doesn't require account creation. Simply upload your plant photo and get instant results without signing up or providing personal information.
                    </div>
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="item-3" className="border-b border-white/10 group">
                  <AccordionTrigger className="text-lg font-medium py-4 hover:text-plantDoc-primary transition-colors group-hover:bg-black/20 px-4 rounded-md -mx-4">
                    <span className="group-hover:translate-x-1 transition-transform duration-300">What information does Plant Doc provide in its diagnosis?</span>
                  </AccordionTrigger>
                  <AccordionContent className="text-foreground/80 pb-4 animate-enter">
                    <div className="bg-black/20 p-4 rounded-lg">
                      Plant Doc provides comprehensive information including plant identification, disease detection, cause analysis, treatment recommendations, prevention tips, fertilizer advice, and general care instructions to help your plants recover and thrive.
                    </div>
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="item-4" className="border-b border-white/10 group">
                  <AccordionTrigger className="text-lg font-medium py-4 hover:text-plantDoc-primary transition-colors group-hover:bg-black/20 px-4 rounded-md -mx-4">
                    <span className="group-hover:translate-x-1 transition-transform duration-300">How does the plant recommendation feature work?</span>
                  </AccordionTrigger>
                  <AccordionContent className="text-foreground/80 pb-4 animate-enter">
                    <div className="bg-black/20 p-4 rounded-lg">
                      The plant recommendation feature analyzes your local climate conditions, soil characteristics, and growing environment to suggest plants that would thrive in your specific location. It provides detailed information about each recommended plant including care instructions and growing tips.
                    </div>
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="item-5" className="border-b border-white/10 group">
                  <AccordionTrigger className="text-lg font-medium py-4 hover:text-plantDoc-primary transition-colors group-hover:bg-black/20 px-4 rounded-md -mx-4">
                    <span className="group-hover:translate-x-1 transition-transform duration-300">Can Plant Doc identify all types of plants?</span>
                  </AccordionTrigger>
                  <AccordionContent className="text-foreground/80 pb-4 animate-enter">
                    <div className="bg-black/20 p-4 rounded-lg">
                      Plant Doc can identify a wide variety of common houseplants, garden plants, and agricultural crops. However, very rare species or newly discovered varieties might be more challenging to identify with complete accuracy. The system is continuously improving its plant recognition capabilities.
                    </div>
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="item-6" className="group">
                  <AccordionTrigger className="text-lg font-medium py-4 hover:text-plantDoc-primary transition-colors group-hover:bg-black/20 px-4 rounded-md -mx-4">
                    <span className="group-hover:translate-x-1 transition-transform duration-300">Is my data private when I use Plant Doc?</span>
                  </AccordionTrigger>
                  <AccordionContent className="text-foreground/80 pb-4 animate-enter">
                    <div className="bg-black/20 p-4 rounded-lg">
                      Yes, your privacy is important to us. Plant Doc processes your plant images temporarily for analysis purposes only. We don't store your images permanently or use them for purposes other than providing you with diagnosis results. Your data remains private and secure.
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </div>
        </section>

        {/* About Me Section */}
        <section className="py-16 relative" ref={aboutRef}>
          <div className="absolute inset-0 bg-black/40 backdrop-blur-md -z-10"></div>
          <div className="container mx-auto px-4">
            <div className="glass-card rounded-2xl overflow-hidden hover:shadow-xl hover:shadow-plantDoc-primary/20 transition-all duration-500">
              <div className="flex flex-col md:flex-row">
                <div className="md:w-1/3 p-8 flex flex-col justify-center items-center backdrop-blur-lg bg-black/20">
                  <div className="rounded-full bg-gradient-to-r from-plantDoc-primary to-plantDoc-secondary p-1 mb-6 hover:scale-105 transition-all duration-300 hover:shadow-lg hover:shadow-plantDoc-primary/50 group">
                    <div className="rounded-full overflow-hidden w-32 h-32 bg-black/50 flex items-center justify-center">
                      <User className="w-28 h-28 p-6 text-white group-hover:rotate-12 transition-transform duration-300" />
                    </div>
                  </div>
                  <h3 className="text-xl font-bold mb-2 text-gradient">Aadish Kumar Yadav</h3>
                  <p className="text-foreground/70 text-center">Student at Red Rose Public School</p>
                  <p className="text-foreground/70 text-center">Class 11, Lucknow, India</p>
                  <p className="text-foreground/70 text-center">Age: 17</p>
                  <div className="mt-6 flex flex-wrap gap-3 justify-center">
                    <a 
                      href="https://github.com/AadishY" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-md glass-card hover:bg-black/50 transition-all duration-300 group"
                    >
                      <Github className="h-5 w-5 group-hover:rotate-12 transition-transform duration-300" />
                      <span>GitHub</span>
                      <ExternalLink className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </a>
                    <a 
                      href="https://instagram.com/yo.akatsuki" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-md glass-card hover:bg-black/50 transition-all duration-300 group"
                    >
                      <Instagram className="h-5 w-5 group-hover:rotate-12 transition-transform duration-300" />
                      <span>Instagram</span>
                      <ExternalLink className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </a>
                  </div>
                </div>
                <div className="md:w-2/3 p-8 bg-black/40 backdrop-blur-xl">
                  <h2 className="text-3xl font-bold mb-6 text-gradient relative inline-block">
                    About Plant Doc
                    <div className="absolute -bottom-2 left-0 w-1/3 h-0.5 bg-gradient-to-r from-plantDoc-primary to-transparent"></div>
                  </h2>
                  <p className="text-foreground/80 mb-4 backdrop-blur-lg bg-black/10 p-4 rounded-lg hover:bg-black/20 transition-all duration-300">
                    Plant Doc is an AI-powered application designed to help plant enthusiasts diagnose and treat plant diseases efficiently. 
                    Using advanced machine learning algorithms, it can identify various plant diseases from photos and provide accurate treatment recommendations.
                  </p>
                  <p className="text-foreground/80 mb-4 backdrop-blur-lg bg-black/10 p-4 rounded-lg hover:bg-black/20 transition-all duration-300">
                    This project was developed as a way to combine my passion for technology and nature. As a student interested in 
                    artificial intelligence and environmental science, I wanted to create a tool that can make plant care more accessible 
                    to everyone and help people maintain healthier plants.
                  </p>
                  <p className="text-foreground/80 backdrop-blur-lg bg-black/10 p-4 rounded-lg hover:bg-black/20 transition-all duration-300">
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
          <Button className="bg-gradient-to-r from-plantDoc-primary to-plantDoc-secondary text-white font-bold px-6 py-6 rounded-full shadow-xl hover:shadow-2xl hover:shadow-plantDoc-primary/30 hover:scale-110 transition-all duration-300 animate-pulse-glow group">
            <Leaf className="h-6 w-6 mr-2 group-hover:rotate-12 transition-transform" />
            <span className="text-lg">Diagnose Your Plant</span>
          </Button>
        </Link>
      </div>
      
      {/* Scroll to top button */}
      <button 
        onClick={scrollToTop} 
        className={`fixed bottom-8 left-8 z-50 p-3 rounded-full bg-black/40 backdrop-blur-md border border-white/10 transition-all duration-300 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'
        } hover:bg-black/60 hover:scale-110`}
      >
        <ChevronUp className="h-6 w-6 text-white" />
      </button>
      
      <Footer />
    </div>
  );
};

export default Index;
