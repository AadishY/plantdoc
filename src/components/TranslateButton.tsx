
import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Globe } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

// Define the Google Translate function type
declare global {
  interface Window {
    googleTranslateElementInit: () => void;
  }
}

const TranslateButton = () => {
  useEffect(() => {
    // Add Google Translate script
    const addScript = () => {
      const script = document.createElement('script');
      script.src = '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
      script.async = true;
      document.body.appendChild(script);
      
      return () => {
        document.body.removeChild(script);
      };
    };

    // Initialize Google Translate
    window.googleTranslateElementInit = () => {
      new (window as any).google.translate.TranslateElement(
        {
          pageLanguage: 'en',
          includedLanguages: 'en,hi',
          layout: (window as any).google.translate.TranslateElement.InlineLayout.SIMPLE,
          autoDisplay: false
        },
        'google_translate_element'
      );
    };

    const cleanup = addScript();
    
    return cleanup;
  }, []);

  return (
    <>
      <div id="google_translate_element" className="hidden"></div>
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
            <span className="sr-only">Translate</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="min-w-32 glass-card border-white/10 backdrop-blur-xl">
          <DropdownMenuItem 
            onClick={() => {
              const iframe = document.querySelector('.goog-te-menu-frame') as HTMLIFrameElement;
              if (iframe) {
                const innerDoc = iframe.contentDocument || iframe.contentWindow?.document;
                const englishLink = innerDoc?.querySelector('a[href*="en"]') as HTMLElement | null;
                if (englishLink) {
                  englishLink.click();
                }
              }
            }}
            className="transition-colors duration-300"
          >
            English
          </DropdownMenuItem>
          <DropdownMenuItem 
            onClick={() => {
              const iframe = document.querySelector('.goog-te-menu-frame') as HTMLIFrameElement;
              if (iframe) {
                const innerDoc = iframe.contentDocument || iframe.contentWindow?.document;
                const hindiLink = innerDoc?.querySelector('a[href*="hi"]') as HTMLElement | null;
                if (hindiLink) {
                  hindiLink.click();
                }
              }
            }}
            className="transition-colors duration-300"
          >
            हिन्दी (Hindi)
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};

export default TranslateButton;
