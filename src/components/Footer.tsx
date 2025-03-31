
import React from "react";
import { Link } from "react-router-dom";
import { Leaf, Heart, Github, Instagram } from "lucide-react";
import { motion } from "framer-motion";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative z-10 border-t border-white/10 backdrop-blur-xl bg-black/40">
      <div className="container mx-auto py-8 px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="space-y-4">
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
              <span className="font-bold text-xl bg-gradient-to-r from-plantDoc-primary to-plantDoc-secondary bg-clip-text text-transparent">PlantDoc</span>
            </Link>
            <motion.p 
              className="text-foreground/70 text-sm max-w-xs"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              AI-powered plant disease diagnosis and treatment recommendations to help your plants thrive.
            </motion.p>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-medium uppercase tracking-wider text-foreground/80">Quick Links</h3>
            <ul className="space-y-2">
              <motion.li
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: 0.1 }}
              >
                <Link to="/" className="text-foreground/70 hover:text-plantDoc-primary transition-colors duration-200 flex items-center gap-1 group">
                  <motion.span 
                    className="h-0.5 w-0 bg-plantDoc-primary group-hover:w-2 transition-all duration-300"
                    whileHover={{ width: 8 }}
                  />
                  <span>Home</span>
                </Link>
              </motion.li>
              <motion.li
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: 0.2 }}
              >
                <Link to="/diagnose" className="text-foreground/70 hover:text-plantDoc-primary transition-colors duration-200 flex items-center gap-1 group">
                  <motion.span 
                    className="h-0.5 w-0 bg-plantDoc-primary group-hover:w-2 transition-all duration-300"
                    whileHover={{ width: 8 }}
                  />
                  <span>Diagnose</span>
                </Link>
              </motion.li>
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-medium uppercase tracking-wider text-foreground/80">Connect</h3>
            <div className="flex space-x-4">
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
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between">
          <p className="text-foreground/60 text-sm">
            &copy; {currentYear} Plant Doc. All rights reserved.
          </p>
          <motion.p 
            className="text-foreground/60 text-sm mt-2 md:mt-0 flex items-center"
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
          opacity: [0.7, 0.9, 0.7],
        }}
        transition={{ 
          duration: 8,
          repeat: Infinity,
          repeatType: "reverse"
        }}
      />
      <motion.div 
        className="absolute -bottom-10 -right-10 w-40 h-40 bg-accent/10 rounded-full blur-3xl"
        animate={{ 
          scale: [1, 1.2, 1],
          opacity: [0.6, 0.8, 0.6],
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
