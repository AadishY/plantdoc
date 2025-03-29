
import React from 'react';
import { Link } from 'react-router-dom';
import { Leaf, Github, Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/components/ThemeProvider';

const Header: React.FC = () => {
  const { theme, setTheme } = useTheme();
  
  return (
    <header className="glass-nav sticky top-0 z-10">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2">
          <Leaf className="h-6 w-6 text-plantDoc-primary" />
          <span className="font-bold text-xl">Plant Doc</span>
        </Link>
        
        <nav className="hidden md:flex items-center gap-6">
          <Link to="/" className="text-foreground/80 hover:text-plantDoc-primary transition-colors">
            Home
          </Link>
          <Link to="/diagnose" className="text-foreground/80 hover:text-plantDoc-primary transition-colors">
            Diagnose
          </Link>
          <Link to="/about" className="text-foreground/80 hover:text-plantDoc-primary transition-colors">
            About
          </Link>
        </nav>

        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            aria-label="Toggle theme"
          >
            {theme === "dark" ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
          </Button>
          
          <a href="https://github.com/AadishY/PlantDoc" target="_blank" rel="noopener noreferrer">
            <Button variant="ghost" size="icon" aria-label="GitHub repository">
              <Github className="h-5 w-5" />
            </Button>
          </a>
        </div>
      </div>
    </header>
  );
};

export default Header;
