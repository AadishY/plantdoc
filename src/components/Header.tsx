
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, Github, Leaf } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

const Header = () => {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <div className="mr-4 hidden md:flex">
          <Link to="/" className="mr-6 flex items-center space-x-2">
            <Leaf className="h-6 w-6 text-plantDoc-primary" />
            <span className="hidden font-bold text-xl sm:inline-block bg-gradient-to-r from-plantDoc-primary to-plantDoc-secondary bg-clip-text text-transparent">PlantDoc</span>
          </Link>
          <nav className="flex items-center space-x-8 text-sm font-medium">
            <Link
              to="/diagnose"
              className="transition-colors hover:text-plantDoc-primary text-foreground relative group"
            >
              <span>Diagnose</span>
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-plantDoc-primary transition-all duration-300 group-hover:w-full"></span>
            </Link>
            <Link
              to="/recommend"
              className="transition-colors hover:text-plantDoc-primary text-foreground relative group"
            >
              <span>Plant Recommendations</span>
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-plantDoc-primary transition-all duration-300 group-hover:w-full"></span>
            </Link>
          </nav>
        </div>
        
        {/* Mobile menu */}
        <div className="md:hidden flex items-center">
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="mr-2">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[240px] sm:w-[300px]">
              <div className="flex flex-col gap-6 mt-6">
                <Link 
                  to="/" 
                  className="text-lg font-bold flex items-center"
                  onClick={() => setOpen(false)}
                >
                  <Leaf className="h-5 w-5 text-plantDoc-primary mr-2" />
                  <span className="bg-gradient-to-r from-plantDoc-primary to-plantDoc-secondary bg-clip-text text-transparent">PlantDoc</span>
                </Link>
                <nav className="flex flex-col gap-4">
                  <Link
                    to="/diagnose"
                    className="text-foreground hover:text-plantDoc-primary transition-colors flex items-center p-2 hover:bg-black/10 rounded-md"
                    onClick={() => setOpen(false)}
                  >
                    <span>Diagnose</span>
                  </Link>
                  <Link
                    to="/recommend"
                    className="text-foreground hover:text-plantDoc-primary transition-colors flex items-center p-2 hover:bg-black/10 rounded-md"
                    onClick={() => setOpen(false)}
                  >
                    <span>Plant Recommendations</span>
                  </Link>
                </nav>
              </div>
            </SheetContent>
          </Sheet>
          
          <Link to="/" className="flex items-center space-x-2">
            <Leaf className="h-5 w-5 text-plantDoc-primary" />
            <span className="font-bold bg-gradient-to-r from-plantDoc-primary to-plantDoc-secondary bg-clip-text text-transparent">PlantDoc</span>
          </Link>
        </div>
        
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <div className="w-full flex-1 md:w-auto md:flex-none">
            {/* Any additional controls can go here */}
          </div>
          <a 
            href="https://github.com/AadishY/plantdoc" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-foreground hover:text-plantDoc-primary transition-colors duration-200 flex items-center"
          >
            <Github className="h-5 w-5" />
            <span className="ml-2 hidden md:inline">GitHub</span>
          </a>
        </div>
      </div>
    </header>
  );
};

export default Header;
