import React from 'react';
import { Link } from 'react-router-dom';
import { Leaf, ArrowUp, Droplet, Thermometer, Github, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent } from '@/components/ui/card';
import { HoverCard, HoverCardTrigger, HoverCardContent } from '@/components/ui/hover-card';

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-background to-muted/50">
      <Header />
      
      <main className="flex-1">
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
                      src="https://cdn.jsdelivr.net/gh/AadishY/plantdoc@main/public/Bg.gif"
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
                  <div className="mt-4">
                    <a 
                      href="https://github.com/AadishY/PlantDoc" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-black/30 hover:bg-black/50 transition-all duration-300"
                    >
                      <Github className="h-5 w-5" />
                      <span>GitHub Repository</span>
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
                    Plant Doc uses state-of-the-art image recognition technology to analyze plant images and the powerful Gemini AI 
                    to generate accurate diagnoses and treatment plans tailored to your specific plant's needs.
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
