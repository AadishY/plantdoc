
import React from "react";
import { Link } from "react-router-dom";
import { Leaf, Heart, Github, Instagram, ExternalLink } from "lucide-react";
import { motion } from "framer-motion";
import { useIsMobile } from "@/hooks/use-mobile";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const isMobile = useIsMobile();

  const staggerChildren = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  return (
    <footer className="relative z-10 border-t border-white/10 backdrop-blur-xl bg-black/40 pb-safe">
      <div className="container mx-auto py-4 px-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {/* Logo and description */}
          <motion.div 
            className="space-y-3"
            initial="hidden"
            whileInView="show"
            variants={staggerChildren}
            viewport={{ once: true, margin: "-100px" }}
          >
            <motion.div variants={item}>
              <Link to="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity group w-fit">
                <div className="relative">
                  <motion.div 
                    className="absolute inset-0 bg-plantDoc-primary/20 rounded-full blur-md"
                    animate={{ 
                      opacity: [0.7, 1, 0.7],
                      scale: [1, 1.1, 1]
                    }}
                    transition={{ 
                      duration: 3,
                      repeat: Infinity,
                      repeatType: "reverse"
                    }}
                  />
                  <Leaf className="h-5 w-5 text-plantDoc-primary relative group-hover:rotate-12 transition-transform duration-300" />
                </div>
                <span className="font-bold text-lg bg-gradient-to-r from-plantDoc-primary to-plantDoc-secondary bg-clip-text text-transparent">PlantDoc</span>
              </Link>
            </motion.div>
            
            <motion.div variants={item} className="flex space-x-3">
              <motion.a
                whileHover={{ y: -3 }}
                href="https://github.com/AadishY/plantdoc"
                target="_blank"
                rel="noopener noreferrer"
                className="text-foreground/70 hover:text-plantDoc-primary transition-colors duration-200 group"
              >
                <motion.span 
                  className="glass-card p-1.5 rounded-full inline-flex"
                  whileHover={{ 
                    backgroundColor: 'rgba(0, 0, 0, 0.6)',
                    boxShadow: '0 0 10px rgba(76, 175, 80, 0.3)'
                  }}
                >
                  <Github className="h-4 w-4 group-hover:rotate-12 transition-transform duration-300" />
                </motion.span>
              </motion.a>
              <motion.a
                whileHover={{ y: -3 }}
                href="https://instagram.com/yo.akatsuki"
                target="_blank"
                rel="noopener noreferrer"
                className="text-foreground/70 hover:text-plantDoc-primary transition-colors duration-200 group"
              >
                <motion.span 
                  className="glass-card p-1.5 rounded-full inline-flex"
                  whileHover={{ 
                    backgroundColor: 'rgba(0, 0, 0, 0.6)',
                    boxShadow: '0 0 10px rgba(76, 175, 80, 0.3)'
                  }}
                >
                  <Instagram className="h-4 w-4 group-hover:rotate-12 transition-transform duration-300" />
                </motion.span>
              </motion.a>
            </motion.div>
          </motion.div>

          {/* Quick Links */}
          <motion.div 
            className="space-y-3"
            initial="hidden"
            whileInView="show"
            variants={staggerChildren}
            viewport={{ once: true, margin: "-100px" }}
          >
            <motion.h3 variants={item} className="text-xs font-medium uppercase tracking-wider text-foreground/80">Quick Links</motion.h3>
            <motion.ul variants={staggerChildren} className="grid grid-cols-2 gap-2">
              <motion.li variants={item}>
                <Link to="/" className="text-foreground/70 text-sm hover:text-plantDoc-primary transition-colors duration-200 flex items-center gap-1 group">
                  <motion.span 
                    className="h-0.5 w-0 bg-plantDoc-primary group-hover:w-2 transition-all duration-300"
                    whileHover={{ width: 8 }}
                  />
                  <span>Home</span>
                </Link>
              </motion.li>
              <motion.li variants={item}>
                <Link to="/diagnose" className="text-foreground/70 text-sm hover:text-plantDoc-primary transition-colors duration-200 flex items-center gap-1 group">
                  <motion.span 
                    className="h-0.5 w-0 bg-plantDoc-primary group-hover:w-2 transition-all duration-300"
                    whileHover={{ width: 8 }}
                  />
                  <span>Diagnose</span>
                </Link>
              </motion.li>
              <motion.li variants={item}>
                <Link to="/recommend" className="text-foreground/70 text-sm hover:text-plantDoc-primary transition-colors duration-200 flex items-center gap-1 group">
                  <motion.span 
                    className="h-0.5 w-0 bg-plantDoc-primary group-hover:w-2 transition-all duration-300"
                    whileHover={{ width: 8 }}
                  />
                  <span>Plants</span>
                </Link>
              </motion.li>
              <motion.li variants={item}>
                <Link to="/about" className="text-foreground/70 text-sm hover:text-plantDoc-primary transition-colors duration-200 flex items-center gap-1 group">
                  <motion.span 
                    className="h-0.5 w-0 bg-plantDoc-primary group-hover:w-2 transition-all duration-300"
                    whileHover={{ width: 8 }}
                  />
                  <span>About</span>
                </Link>
              </motion.li>
            </motion.ul>
          </motion.div>

          {/* Additional info */}
          <motion.div 
            className="space-y-3"
            initial="hidden"
            whileInView="show"
            variants={staggerChildren}
            viewport={{ once: true, margin: "-100px" }}
          >
            <motion.h3 variants={item} className="text-xs font-medium uppercase tracking-wider text-foreground/80">About PlantDoc</motion.h3>
            <motion.p variants={item} className="text-foreground/70 text-sm">
              AI-powered plant disease diagnosis and treatment recommendations to help your plants thrive.
            </motion.p>
          </motion.div>
        </div>

        {/* Copyright and signature */}
        <div className="mt-4 pt-4 border-t border-white/10 flex flex-col md:flex-row items-center justify-between">
          <p className="text-foreground/60 text-xs">
            &copy; {currentYear} Plant Doc. All rights reserved.
          </p>
          <motion.p 
            className="text-foreground/60 text-xs mt-2 md:mt-0 flex items-center"
            whileHover={{ color: 'rgba(255, 255, 255, 0.8)' }}
          >
            Made with <Heart className="h-3 w-3 text-plantDoc-danger mx-1 animate-pulse" /> by Aadish Kumar Yadav
          </motion.p>
        </div>
      </div>
      
      {/* Decorative elements */}
      <div className="absolute bottom-0 left-0 w-full h-16 bg-gradient-to-t from-background to-transparent opacity-30"></div>
      <motion.div 
        className="absolute -bottom-10 -left-10 w-40 h-40 bg-plantDoc-primary/10 rounded-full blur-3xl"
        animate={{ 
          scale: [1, 1.2, 1],
          opacity: [0.5, 0.7, 0.5],
        }}
        transition={{ 
          duration: 8,
          repeat: Infinity,
          repeatType: "reverse"
        }}
      />
      <motion.div 
        className="absolute -bottom-20 -right-10 w-60 h-60 bg-accent/10 rounded-full blur-3xl"
        animate={{ 
          scale: [1, 1.1, 1],
          opacity: [0.4, 0.6, 0.4],
        }}
        transition={{ 
          duration: 10,
          repeat: Infinity,
          repeatType: "reverse",
          delay: 2
        }}
      />
    </footer>
  );
};

export default Footer;
