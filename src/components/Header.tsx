
import React from 'react';
import { Link } from 'react-router-dom';
import { Leaf } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Header: React.FC = () => {
  return (
    <header className="border-b bg-white sticky top-0 z-10">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2">
          <Leaf className="h-6 w-6 text-plantDoc-primary" />
          <span className="font-bold text-xl text-plantDoc-dark">Plant Doc</span>
        </Link>
        
        <nav className="hidden md:flex items-center gap-6">
          <Link to="/" className="text-gray-700 hover:text-plantDoc-primary transition-colors">
            Home
          </Link>
          <Link to="/diagnose" className="text-gray-700 hover:text-plantDoc-primary transition-colors">
            Diagnose
          </Link>
        </nav>

        <Link to="/diagnose">
          <Button className="bg-plantDoc-primary hover:bg-plantDoc-secondary text-white">
            Get Started
          </Button>
        </Link>
      </div>
    </header>
  );
};

export default Header;
