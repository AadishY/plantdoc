
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Leaf, Github, Moon, Sun, Sprout } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/components/ThemeProvider';

const Header: React.FC = () => {
  const { theme, setTheme } = useTheme();
  const location = useLocation();
  
  return (
    <header className="glass-nav sticky top-0 z-10">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2 group">
          <Leaf className="h-6 w-6 text-plantDoc-primary group-hover:rotate-12 transition-transform duration-300" />
          <span className="font-bold text-xl">Plant Doc</span>
        </Link>
        
        <nav className="hidden md:flex items-center gap-6">
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

        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            aria-label="Toggle theme"
            className="hover:bg-black/30 transition-colors duration-300"
          >
            {theme === "dark" ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
          </Button>
          
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
