
import React from 'react';
import { Leaf, Github, Instagram, Heart, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Footer: React.FC = () => {
  return (
    <footer className="glass-nav border-t mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center gap-2 mb-4 md:mb-0">
            <Leaf className="h-5 w-5 text-plantDoc-primary" />
            <span className="font-bold text-lg">Plant Doc</span>
          </div>
          
          <div className="flex items-center gap-4 flex-wrap justify-center">
            <a href="https://github.com/AadishY/PlantDoc" target="_blank" rel="noopener noreferrer" 
              className="text-foreground/70 hover:text-plantDoc-primary transition-colors flex items-center gap-2 rounded-lg hover:bg-black/20 px-3 py-1">
              <Github className="h-4 w-4" />
              <span className="text-sm">GitHub</span>
            </a>
            
            <a href="https://instagram.com/aadish_yadav" target="_blank" rel="noopener noreferrer" 
              className="text-foreground/70 hover:text-plantDoc-primary transition-colors flex items-center gap-2 rounded-lg hover:bg-black/20 px-3 py-1">
              <Instagram className="h-4 w-4" />
              <span className="text-sm">Instagram</span>
            </a>
            
            <a href="mailto:contact@plantdoc.com" target="_blank" rel="noopener noreferrer" 
              className="text-foreground/70 hover:text-plantDoc-primary transition-colors flex items-center gap-2 rounded-lg hover:bg-black/20 px-3 py-1">
              <Mail className="h-4 w-4" />
              <span className="text-sm">Contact</span>
            </a>
          </div>
        </div>
        
        <div className="mt-6 pt-4 border-t border-white/10 flex flex-col items-center text-center">
          <div className="flex items-center gap-2 text-sm text-foreground/50 mb-2">
            <span>© {new Date().getFullYear()} Plant Doc by Aadish Kumar Yadav</span>
          </div>
          <div className="flex items-center gap-1 text-sm text-foreground/50 animate-pulse-slow">
            <span>Made with</span>
            <Heart className="h-4 w-4 text-plantDoc-accent fill-plantDoc-accent" />
            <span>in India</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
