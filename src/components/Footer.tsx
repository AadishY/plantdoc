
import React from "react";
import { Link } from "react-router-dom";
import { Leaf, Heart, Github, Instagram } from "lucide-react";
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
      <div className="container mx-auto py-6 px-4">
        {/* Simplified footer content */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
          <motion.div 
            className="space-y-4"
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
                  <Leaf className="h-6 w-6 text-plantDoc-primary relative group-hover:rotate-12 transition-transform duration-300" />
                </div>
                <span className="font-bold text-xl bg-gradient-to-r from-plantDoc-primary to-plantDoc-secondary bg-clip-text text-transparent">PlantDoc</span>
              </Link>
            </motion.div>
            
            <motion.p variants={item} className="text-foreground/70 text-sm max-w-xs">
              AI-powered plant disease diagnosis and treatment recommendations to help your plants thrive.
            </motion.p>
          </motion.div>

          <motion.div 
            className="space-y-4"
            initial="hidden"
            whileInView="show"
            variants={staggerChildren}
            viewport={{ once: true, margin: "-100px" }}
          >
            <motion.h3 variants={item} className="text-sm font-medium uppercase tracking-wider text-foreground/80">Quick Links</motion.h3>
            <motion.ul variants={staggerChildren} className="space-y-3">
              <motion.li variants={item}>
                <Link to="/" className="text-foreground/70 hover:text-plantDoc-primary transition-colors duration-200 flex items-center gap-1 group">
                  <motion.span 
                    className="h-0.5 w-0 bg-plantDoc-primary group-hover:w-2 transition-all duration-300"
                    whileHover={{ width: 8 }}
                  />
                  <span>Home</span>
                </Link>
              </motion.li>
              <motion.li variants={item}>
                <Link to="/diagnose" className="text-foreground/70 hover:text-plantDoc-primary transition-colors duration-200 flex items-center gap-1 group">
                  <motion.span 
                    className="h-0.5 w-0 bg-plantDoc-primary group-hover:w-2 transition-all duration-300"
                    whileHover={{ width: 8 }}
                  />
                  <span>Diagnose</span>
                </Link>
              </motion.li>
              <motion.li variants={item}>
                <Link to="/recommend" className="text-foreground/70 hover:text-plantDoc-primary transition-colors duration-200 flex items-center gap-1 group">
                  <motion.span 
                    className="h-0.5 w-0 bg-plantDoc-primary group-hover:w-2 transition-all duration-300"
                    whileHover={{ width: 8 }}
                  />
                  <span>Plant Recommendations</span>
                </Link>
              </motion.li>
              <motion.li variants={item}>
                <Link to="/about" className="text-foreground/70 hover:text-plantDoc-primary transition-colors duration-200 flex items-center gap-1 group">
                  <motion.span 
                    className="h-0.5 w-0 bg-plantDoc-primary group-hover:w-2 transition-all duration-300"
                    whileHover={{ width: 8 }}
                  />
                  <span>About</span>
                </Link>
              </motion.li>
            </motion.ul>
          </motion.div>
          
          <motion.div 
            className="space-y-4"
            initial="hidden"
            whileInView="show"
            variants={staggerChildren}
            viewport={{ once: true, margin: "-100px" }}
          >
            <motion.h3 variants={item} className="text-sm font-medium uppercase tracking-wider text-foreground/80">Connect</motion.h3>
            <motion.div variants={item} className="flex space-x-4">
              <motion.a
                whileHover={{ y: -3 }}
                href="https://github.com/AadishY/plantdoc"
                target="_blank"
                rel="noopener noreferrer"
                className="text-foreground/70 hover:text-plantDoc-primary transition-colors duration-200 group"
              >
                <motion.span 
                  className="glass-card p-2 rounded-full inline-flex"
                  whileHover={{ 
                    backgroundColor: 'rgba(0, 0, 0, 0.6)',
                    boxShadow: '0 0 10px rgba(76, 175, 80, 0.3)'
                  }}
                >
                  <Github className="h-5 w-5 group-hover:rotate-12 transition-transform duration-300" />
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
                  className="glass-card p-2 rounded-full inline-flex"
                  whileHover={{ 
                    backgroundColor: 'rgba(0, 0, 0, 0.6)',
                    boxShadow: '0 0 10px rgba(76, 175, 80, 0.3)'
                  }}
                >
                  <Instagram className="h-5 w-5 group-hover:rotate-12 transition-transform duration-300" />
                </motion.span>
              </motion.a>
            </motion.div>
            
            <motion.p 
              variants={item}
              className="text-foreground/60 text-sm flex items-center mt-8"
              whileHover={{ color: 'rgba(255, 255, 255, 0.8)' }}
            >
              Made with <Heart className="h-3 w-3 text-plantDoc-danger mx-1 animate-pulse" /> by Aadish Kumar Yadav
            </motion.p>
            
            <motion.p variants={item} className="text-foreground/60 text-sm">
              &copy; {currentYear} Plant Doc. All rights reserved.
            </motion.p>
          </motion.div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
