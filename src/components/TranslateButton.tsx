
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Globe } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useTranslation } from '@/hooks/useTranslation';

const TranslateButton = () => {
  const { currentLanguage, setLanguage } = useTranslation();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="outline" 
          size="icon" 
          className="relative overflow-hidden transition-all duration-300 backdrop-blur-lg bg-black/20 border-white/10 hover:bg-black/40 hover:border-white/20"
        >
          <motion.div
            whileHover={{ rotate: 20 }}
            transition={{ duration: 0.2 }}
          >
            <Globe className="h-4 w-4" />
          </motion.div>
          <span className="sr-only">Toggle language</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="min-w-32 glass-card border-white/10 backdrop-blur-xl">
        <DropdownMenuItem 
          onClick={() => setLanguage('en')}
          className={`transition-colors duration-300 ${currentLanguage === 'en' ? 'text-plantDoc-primary' : ''}`}
        >
          English
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => setLanguage('hi')}
          className={`transition-colors duration-300 ${currentLanguage === 'hi' ? 'text-plantDoc-primary' : ''}`}
        >
          हिन्दी (Hindi)
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default TranslateButton;
