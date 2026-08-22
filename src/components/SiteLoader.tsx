import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Leaf } from 'lucide-react';

export const SiteLoader: React.FC = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Only show once per session or on initial site open
    const timer = setTimeout(() => {
      setLoading(false);
    }, 650);

    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {loading && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.4, ease: "easeInOut" } }}
          className="fixed inset-0 z-[9999] bg-[#070b08] flex flex-col items-center justify-center pointer-events-none select-none"
        >
          <div className="relative flex flex-col items-center gap-4">
            <div className="relative flex h-16 w-16 items-center justify-center">
              <motion.span 
                className="absolute inline-flex h-full w-full rounded-full bg-plantDoc-primary/20"
                animate={{ scale: [1, 1.4, 1], opacity: [0.8, 0.2, 0.8] }}
                transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
              />
              <Leaf className="h-10 w-10 text-plantDoc-primary animate-pulse" />
            </div>

            <div className="flex flex-col items-center gap-1">
              <h2 className="text-2xl font-bold text-gradient tracking-wide">
                PlantDoc AI
              </h2>
              <p className="text-xs text-foreground/60 tracking-wider uppercase">
                Initializing Botanical Neural Engine...
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SiteLoader;
