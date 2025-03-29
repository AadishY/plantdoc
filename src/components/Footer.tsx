
import React from 'react';
import { Leaf, Github, Instagram, Heart, Mail, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';

const Footer: React.FC = () => {
  return (
    <footer className="glass-nav border-t mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Logo and Branding */}
          <div className="flex flex-col items-center md:items-start">
            <div className="flex items-center gap-2 mb-3">
              <Leaf className="h-6 w-6 text-plantDoc-primary" />
              <span className="font-bold text-lg">Plant Doc</span>
            </div>
            <p className="text-sm text-foreground/60 text-center md:text-left">
              AI-powered plant disease diagnosis and care recommendations
            </p>
            <div className="mt-3 flex items-center gap-2">
              <Heart className="h-4 w-4 text-red-500" />
              <span className="text-xs text-foreground/60">Made with love in Lucknow, India</span>
            </div>
          </div>
          
          {/* Quick Links */}
          <div className="flex flex-col items-center">
            <h3 className="font-semibold mb-3">Quick Links</h3>
            <div className="grid grid-cols-2 gap-x-8 gap-y-2">
              <a href="/" className="text-sm text-foreground/70 hover:text-plantDoc-primary transition-colors">Home</a>
              <a href="/diagnose" className="text-sm text-foreground/70 hover:text-plantDoc-primary transition-colors">Diagnose</a>
              <a href="/recommend" className="text-sm text-foreground/70 hover:text-plantDoc-primary transition-colors">Recommend</a>
              <HoverCard>
                <HoverCardTrigger asChild>
                  <span className="text-sm text-foreground/70 hover:text-plantDoc-primary transition-colors cursor-pointer">Feedback</span>
                </HoverCardTrigger>
                <HoverCardContent className="w-80">
                  <div className="flex justify-between space-x-4">
                    <div className="space-y-1">
                      <h4 className="text-sm font-semibold">Send Feedback</h4>
                      <p className="text-sm">
                        Contact me at <a href="mailto:aadish@example.com" className="text-plantDoc-primary">aadish@example.com</a>
                      </p>
                    </div>
                  </div>
                </HoverCardContent>
              </HoverCard>
            </div>
          </div>
          
          {/* Social and Copyright */}
          <div className="flex flex-col items-center md:items-end">
            <h3 className="font-semibold mb-3">Connect</h3>
            <div className="flex gap-4 mb-4">
              <a href="https://github.com/AadishY/PlantDoc" target="_blank" rel="noopener noreferrer" 
                className="text-foreground/70 hover:text-plantDoc-primary transition-colors flex items-center gap-1">
                <Github className="h-5 w-5" />
              </a>
              <a href="https://instagram.com/aadish_yadav" target="_blank" rel="noopener noreferrer" 
                className="text-foreground/70 hover:text-plantDoc-primary transition-colors flex items-center gap-1">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="mailto:aadish@example.com" 
                className="text-foreground/70 hover:text-plantDoc-primary transition-colors flex items-center gap-1">
                <Mail className="h-5 w-5" />
              </a>
            </div>
            <span className="text-xs text-foreground/50">
              © {new Date().getFullYear()} Plant Doc by Aadish Kumar Yadav
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
