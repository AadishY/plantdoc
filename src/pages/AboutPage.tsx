
import React from 'react';
import { Github, Mail, Leaf, User, School, MapPin } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

const AboutPage = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-background to-muted/50">
      <Header />
      
      <main className="flex-1 py-12 container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12 animate-enter">
            <div className="inline-flex items-center justify-center p-2 bg-plantDoc-primary/20 rounded-full mb-4">
              <User className="h-6 w-6 text-plantDoc-primary" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-3 bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
              About the Creator
            </h1>
            <p className="text-foreground/70 max-w-md mx-auto">
              Learn more about the person behind Plant Doc
            </p>
          </div>
          
          <div className="glass-card rounded-xl overflow-hidden border-none shadow-lg animate-enter">
            <div className="md:flex">
              <div className="md:w-1/3 bg-gradient-to-br from-plantDoc-primary/30 to-plantDoc-secondary/30 p-8 flex flex-col items-center justify-center">
                <div className="w-32 h-32 rounded-full bg-plantDoc-primary/20 flex items-center justify-center mb-4">
                  <Leaf className="h-16 w-16 text-plantDoc-primary" />
                </div>
                <h2 className="text-xl font-bold">Aadish Kumar Yadav</h2>
                <p className="text-foreground/70 text-center mt-2">Student Developer</p>
                
                <div className="mt-6 flex gap-3">
                  <a href="https://github.com/AadishY/PlantDoc" target="_blank" rel="noopener noreferrer">
                    <Button variant="outline" size="icon" className="rounded-full">
                      <Github className="h-4 w-4" />
                    </Button>
                  </a>
                </div>
              </div>
              
              <div className="md:w-2/3 p-8">
                <h3 className="text-xl font-semibold mb-4">About Me</h3>
                <p className="text-foreground/80 mb-6">
                  I am Aadish Kumar Yadav, a 17-year-old student from Red Rose Public School in Lucknow, India. 
                  Currently in 11th grade, I'm passionate about technology and how it can be used to solve 
                  real-world problems, especially in the field of agriculture and plant care.
                </p>
                
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <School className="h-5 w-5 text-plantDoc-primary" />
                    <div>
                      <p className="font-medium">Red Rose Public School</p>
                      <p className="text-sm text-foreground/60">Class 11th</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <MapPin className="h-5 w-5 text-plantDoc-primary" />
                    <p>Lucknow, India</p>
                  </div>
                </div>
                
                <Separator className="my-6" />
                
                <h3 className="text-xl font-semibold mb-4">About Plant Doc</h3>
                <p className="text-foreground/80">
                  Plant Doc is an AI-powered plant disease diagnosis tool that I created to help people 
                  identify and treat plant diseases. The application uses advanced image recognition 
                  technology to analyze plant images and provide accurate diagnoses along with 
                  treatment recommendations.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default AboutPage;
