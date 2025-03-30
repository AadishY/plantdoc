
import React from 'react';
import { Github, HeartPulse } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gradient-to-t from-muted/30 to-transparent py-6 border-t border-border/30">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center">
            <span className="text-foreground/80">© 2024 PlantDoc. All rights reserved.</span>
          </div>
          
          <div className="flex items-center mt-4 md:mt-0 space-x-6">
            <div className="text-foreground/80 flex items-center group">
              <span className="mr-2">Made with</span>
              <HeartPulse className="h-5 w-5 text-red-500 group-hover:animate-ping transition-all duration-300" />
              <span className="ml-2 bg-gradient-to-r from-plantDoc-primary to-plantDoc-secondary bg-clip-text text-transparent font-semibold">in India</span>
            </div>
            
            <a 
              href="https://github.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-foreground/80 hover:text-plantDoc-primary transition-colors duration-200 flex items-center"
            >
              <Github className="h-5 w-5 mr-2" />
              <span>GitHub</span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
