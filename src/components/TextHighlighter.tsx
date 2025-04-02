
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Copy, X, Search } from 'lucide-react';
import { toast } from '../hooks/use-toast';

/**
 * TextHighlighter - A component that shows an action menu when text is selected
 */
const TextHighlighter: React.FC = () => {
  const [selectedText, setSelectedText] = useState('');
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [visible, setVisible] = useState(false);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(selectedText);
      toast({
        title: "Copied to clipboard",
        description: "Text copied successfully",
      });
      clearSelection();
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Copy failed",
        description: "Failed to copy text to clipboard",
      });
    }
  };

  const searchWeb = () => {
    window.open(`https://www.google.com/search?q=${encodeURIComponent(selectedText)}`, '_blank');
    clearSelection();
  };

  const clearSelection = () => {
    if (window.getSelection) {
      window.getSelection()?.removeAllRanges();
    }
    setVisible(false);
  };

  useEffect(() => {
    const checkSelectedText = () => {
      const selection = window.getSelection();
      const text = selection?.toString().trim();
      
      if (text && text.length > 0) {
        // Get position for popup
        const range = selection?.getRangeAt(0);
        const rect = range?.getBoundingClientRect();
        
        if (rect) {
          // Position above the selection
          const x = rect.left + (rect.width / 2);
          const y = rect.top - 10 + window.scrollY;
          
          setSelectedText(text);
          setPosition({ x, y });
          setVisible(true);
        }
      } else {
        setVisible(false);
      }
    };

    // Check for text selection
    document.addEventListener('mouseup', checkSelectedText);
    document.addEventListener('touchend', checkSelectedText);
    
    // Handle clicks outside of the popup to dismiss it
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('.text-highlighter-popup') && visible) {
        setVisible(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mouseup', checkSelectedText);
      document.removeEventListener('touchend', checkSelectedText);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [visible]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          transition={{ duration: 0.2 }}
          className="fixed z-[100] text-selection-popover glass-tooltip rounded-lg shadow-xl flex"
          style={{ 
            left: `${position.x}px`, 
            top: `${position.y}px`,
            transform: 'translateX(-50%) translateY(-100%)',
          }}
        >
          <div className="text-highlighter-popup flex items-center divide-x divide-white/10">
            <button 
              onClick={copyToClipboard}
              className="px-3 py-2 flex items-center gap-1.5 text-sm hover:bg-white/10 transition-colors rounded-l-lg"
              aria-label="Copy text"
            >
              <Copy className="h-4 w-4" />
              <span className="hidden sm:inline">Copy</span>
            </button>
            
            <button 
              onClick={searchWeb}
              className="px-3 py-2 flex items-center gap-1.5 text-sm hover:bg-white/10 transition-colors rounded-r-lg"
              aria-label="Search on web"
            >
              <Search className="h-4 w-4" />
              <span className="hidden sm:inline">Search</span>
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default TextHighlighter;
