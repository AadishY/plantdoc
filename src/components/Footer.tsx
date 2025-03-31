
import React from 'react';
import { Github, HeartPulse, Leaf } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-gradient-to-t from-muted/30 to-transparent py-8 border-t border-border/30">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center mb-4 md:mb-0">
            <Link to="/" className="flex items-center">
              <Leaf className="h-5 w-5 text-plantDoc-primary mr-2" />
              <span className="font-semibold text-lg bg-gradient-to-r from-plantDoc-primary to-plantDoc-secondary bg-clip-text text-transparent">PlantDoc</span>
            </Link>
            <span className="ml-4 text-foreground/60 text-sm">© 2025 PlantDoc. All rights reserved.</span>
          </div>
          
          <div className="flex flex-col md:flex-row items-center gap-4 md:gap-8">
            <div className="text-foreground/80 flex items-center group">
              <span className="mr-2">Made with</span>
              <HeartPulse className="h-5 w-5 text-red-500 group-hover:animate-ping transition-all duration-300" />
              <span className="ml-2 bg-gradient-to-r from-plantDoc-primary to-plantDoc-secondary bg-clip-text text-transparent font-semibold">in India</span>
            </div>
            
            <div className="flex items-center gap-6">
              <a 
                href="https://github.com/AadishY/plantdoc" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-foreground/80 hover:text-plantDoc-primary transition-colors duration-200 flex items-center"
              >
                <Github className="h-5 w-5 mr-2" />
                <span>GitHub</span>
              </a>
              
              <Link to="/diagnose" className="text-foreground/80 hover:text-plantDoc-primary transition-colors duration-200">Diagnose</Link>
              <Link to="/recommend" className="text-foreground/80 hover:text-plantDoc-primary transition-colors duration-200">Recommendations</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
