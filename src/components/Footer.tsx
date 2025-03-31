
import React from "react";
import { Link } from "react-router-dom";
import { Leaf, Heart, Github, Instagram } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative z-10 border-t border-white/10 backdrop-blur-xl bg-black/40">
      <div className="container mx-auto py-8 px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="space-y-4">
            <Link to="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity group">
              <div className="relative">
                <div className="absolute inset-0 bg-plantDoc-primary/20 rounded-full blur-md opacity-70 group-hover:opacity-100 transition-opacity"></div>
                <Leaf className="h-5 w-5 text-plantDoc-primary relative group-hover:rotate-12 transition-transform duration-300" />
              </div>
              <span className="font-bold text-xl bg-gradient-to-r from-plantDoc-primary to-plantDoc-secondary bg-clip-text text-transparent">PlantDoc</span>
            </Link>
            <p className="text-foreground/70 text-sm max-w-xs">
              AI-powered plant disease diagnosis and treatment recommendations to help your plants thrive.
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-medium uppercase tracking-wider text-foreground/80">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-foreground/70 hover:text-plantDoc-primary transition-colors duration-200 flex items-center gap-1 group">
                  <span className="h-0.5 w-0 bg-plantDoc-primary group-hover:w-2 transition-all duration-300"></span>
                  <span>Home</span>
                </Link>
              </li>
              <li>
                <Link to="/diagnose" className="text-foreground/70 hover:text-plantDoc-primary transition-colors duration-200 flex items-center gap-1 group">
                  <span className="h-0.5 w-0 bg-plantDoc-primary group-hover:w-2 transition-all duration-300"></span>
                  <span>Diagnose</span>
                </Link>
              </li>
              <li>
                <Link to="/recommend" className="text-foreground/70 hover:text-plantDoc-primary transition-colors duration-200 flex items-center gap-1 group">
                  <span className="h-0.5 w-0 bg-plantDoc-primary group-hover:w-2 transition-all duration-300"></span>
                  <span>Plant Recommendations</span>
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-medium uppercase tracking-wider text-foreground/80">Connect</h3>
            <div className="flex space-x-4">
              <a
                href="https://github.com/AadishY/plantdoc"
                target="_blank"
                rel="noopener noreferrer"
                className="text-foreground/70 hover:text-plantDoc-primary transition-colors duration-200 group"
              >
                <span className="glass-card p-2 rounded-full inline-flex hover:bg-black/40 transition-all duration-300">
                  <Github className="h-5 w-5 group-hover:rotate-12 transition-transform duration-300" />
                </span>
              </a>
              <a
                href="https://instagram.com/yo.akatsuki"
                target="_blank"
                rel="noopener noreferrer"
                className="text-foreground/70 hover:text-plantDoc-primary transition-colors duration-200 group"
              >
                <span className="glass-card p-2 rounded-full inline-flex hover:bg-black/40 transition-all duration-300">
                  <Instagram className="h-5 w-5 group-hover:rotate-12 transition-transform duration-300" />
                </span>
              </a>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between">
          <p className="text-foreground/60 text-sm">
            &copy; {currentYear} Plant Doc. All rights reserved.
          </p>
          <p className="text-foreground/60 text-sm mt-2 md:mt-0 flex items-center">
            Made with <Heart className="h-3 w-3 text-plantDoc-danger mx-1 animate-pulse" /> by Aadish Kumar Yadav
          </p>
        </div>
      </div>
      
      {/* Decorative elements */}
      <div className="absolute bottom-0 left-0 w-full h-16 bg-gradient-to-t from-background to-transparent opacity-30"></div>
      <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-plantDoc-primary/10 rounded-full blur-3xl"></div>
      <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-accent/10 rounded-full blur-3xl"></div>
    </footer>
  );
};

export default Footer;
