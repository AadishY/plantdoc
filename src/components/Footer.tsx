
import React from 'react';
import { Leaf, Github, Instagram } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Footer: React.FC = () => {
  return (
    <footer className="glass-nav border-t mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center gap-2 mb-4 md:mb-0">
            <Leaf className="h-5 w-5 text-plantDoc-primary" />
            <span className="font-bold">Plant Doc</span>
          </div>
          
          <div className="flex items-center gap-4 flex-wrap justify-center">
            <a href="https://github.com/AadishY/PlantDoc" target="_blank" rel="noopener noreferrer" 
              className="text-foreground/70 hover:text-plantDoc-primary transition-colors flex items-center gap-2">
              <Github className="h-4 w-4" />
              <span className="text-sm">GitHub</span>
            </a>
            
            <a href="https://instagram.com/aadish_yadav" target="_blank" rel="noopener noreferrer" 
              className="text-foreground/70 hover:text-plantDoc-primary transition-colors flex items-center gap-2">
              <Instagram className="h-4 w-4" />
              <span className="text-sm">Instagram</span>
            </a>
            
            <span className="text-sm text-foreground/50">
              © {new Date().getFullYear()} Plant Doc by Aadish Kumar Yadav
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
