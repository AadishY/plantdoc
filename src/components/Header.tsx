
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ModeToggle } from "@/components/ui/mode-toggle";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

const Header = () => {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="mr-4 hidden md:flex">
          <Link to="/" className="mr-6 flex items-center space-x-2">
            <span className="hidden font-bold sm:inline-block">PlantDoc</span>
          </Link>
          <nav className="flex items-center space-x-6 text-sm font-medium">
            <Link
              to="/diagnose"
              className="transition-colors hover:text-foreground/80 text-foreground"
            >
              Diagnose
            </Link>
            <Link
              to="/recommend"
              className="transition-colors hover:text-foreground/80 text-foreground"
            >
              Plant Recommendations
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
                  className="text-lg font-bold"
                  onClick={() => setOpen(false)}
                >
                  PlantDoc
                </Link>
                <nav className="flex flex-col gap-4">
                  <Link
                    to="/diagnose"
                    className="text-foreground hover:text-foreground/80 transition-colors"
                    onClick={() => setOpen(false)}
                  >
                    Diagnose
                  </Link>
                  <Link
                    to="/recommend"
                    className="text-foreground hover:text-foreground/80 transition-colors"
                    onClick={() => setOpen(false)}
                  >
                    Plant Recommendations
                  </Link>
                </nav>
              </div>
            </SheetContent>
          </Sheet>
          
          <Link to="/" className="flex items-center space-x-2">
            <span className="font-bold">PlantDoc</span>
          </Link>
        </div>
        
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <div className="w-full flex-1 md:w-auto md:flex-none">
            {/* Any additional controls can go here */}
          </div>
          <ModeToggle />
        </div>
      </div>
    </header>
  );
};

export default Header;
