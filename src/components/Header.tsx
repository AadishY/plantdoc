
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Leaf, Github, Sprout, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

const Header: React.FC = () => {
  const location = useLocation();
  const isMobile = useIsMobile();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  return (
    <header className="glass-nav sticky top-0 z-10">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2 group">
          <Leaf className="h-6 w-6 text-plantDoc-primary group-hover:rotate-12 transition-transform duration-300" />
          <span className="font-bold text-xl">Plant Doc</span>
        </Link>
        
        {!isMobile ? (
          <nav className="flex items-center gap-6">
            <Link 
              to="/" 
              className={`relative text-foreground/80 hover:text-plantDoc-primary transition-colors duration-300 
                ${location.pathname === '/' ? 'text-plantDoc-primary' : ''}
                after:content-[''] after:absolute after:w-full after:scale-x-0 after:h-0.5 after:bottom-0 after:left-0 
                after:bg-plantDoc-primary after:origin-bottom-right after:transition-transform after:duration-300 
                hover:after:scale-x-100 hover:after:origin-bottom-left
                ${location.pathname === '/' ? 'after:scale-x-100' : ''}`}
            >
              Home
            </Link>
            <Link 
              to="/diagnose" 
              className={`relative text-foreground/80 hover:text-plantDoc-primary transition-colors duration-300 
                ${location.pathname === '/diagnose' ? 'text-plantDoc-primary' : ''}
                after:content-[''] after:absolute after:w-full after:scale-x-0 after:h-0.5 after:bottom-0 after:left-0 
                after:bg-plantDoc-primary after:origin-bottom-right after:transition-transform after:duration-300 
                hover:after:scale-x-100 hover:after:origin-bottom-left
                ${location.pathname === '/diagnose' ? 'after:scale-x-100' : ''}`}
            >
              Diagnose
            </Link>
            <Link 
              to="/recommend" 
              className={`relative text-foreground/80 hover:text-plantDoc-primary transition-colors duration-300 
                ${location.pathname === '/recommend' ? 'text-plantDoc-primary' : ''}
                after:content-[''] after:absolute after:w-full after:scale-x-0 after:h-0.5 after:bottom-0 after:left-0 
                after:bg-plantDoc-primary after:origin-bottom-right after:transition-transform after:duration-300 
                hover:after:scale-x-100 hover:after:origin-bottom-left
                ${location.pathname === '/recommend' ? 'after:scale-x-100' : ''}`}
            >
              <div className="flex items-center gap-1">
                <Sprout className="h-4 w-4" />
                Recommendations
              </div>
            </Link>
          </nav>
        ) : (
          <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="bg-background/95 backdrop-blur-sm border-plantDoc-primary/20">
              <div className="flex flex-col gap-6 pt-10">
                <Link 
                  to="/" 
                  onClick={() => setIsMenuOpen(false)}
                  className={`text-lg px-2 py-3 rounded-md flex items-center gap-2 ${location.pathname === '/' ? 'bg-plantDoc-primary/10 text-plantDoc-primary' : 'hover:bg-plantDoc-primary/5'}`}
                >
                  <Leaf className="h-5 w-5" />
                  Home
                </Link>
                <Link 
                  to="/diagnose" 
                  onClick={() => setIsMenuOpen(false)}
                  className={`text-lg px-2 py-3 rounded-md flex items-center gap-2 ${location.pathname === '/diagnose' ? 'bg-plantDoc-primary/10 text-plantDoc-primary' : 'hover:bg-plantDoc-primary/5'}`}
                >
                  <Leaf className="h-5 w-5" />
                  Diagnose Plant
                </Link>
                <Link 
                  to="/recommend" 
                  onClick={() => setIsMenuOpen(false)}
                  className={`text-lg px-2 py-3 rounded-md flex items-center gap-2 ${location.pathname === '/recommend' ? 'bg-plantDoc-primary/10 text-plantDoc-primary' : 'hover:bg-plantDoc-primary/5'}`}
                >
                  <Sprout className="h-5 w-5" />
                  Plant Recommendations
                </Link>
              </div>
            </SheetContent>
          </Sheet>
        )}

        <div className="flex items-center gap-2">
          <a href="https://github.com/AadishY/PlantDoc" target="_blank" rel="noopener noreferrer">
            <Button 
              variant="ghost" 
              size="icon" 
              aria-label="GitHub repository"
              className="hover:bg-black/30 transition-colors duration-300"
            >
              <Github className="h-5 w-5" />
            </Button>
          </a>
        </div>
      </div>
    </header>
  );
};

export default Header;
