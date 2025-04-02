
import React, { useEffect } from 'react';
import { Leaf, Copy, ExternalLink } from 'lucide-react';
import { motion } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';

const TextHighlighter: React.FC = () => {
  const { toast } = useToast();
  
  useEffect(() => {
    const handleSelection = () => {
      const selection = window.getSelection();
      
      if (!selection || selection.isCollapsed) {
        // Remove any existing popover when selection is cleared
        const existingPopovers = document.querySelectorAll('.text-selection-popover');
        existingPopovers.forEach(el => el.remove());
        return;
      }
      
      const selectedText = selection.toString().trim();
      
      if (selectedText) {
        // Remove any existing popovers first
        const existingPopovers = document.querySelectorAll('.text-selection-popover');
        existingPopovers.forEach(el => el.remove());
        
        // Create new popover for the selection
        const range = selection.getRangeAt(0);
        const rect = range.getBoundingClientRect();
        
        if (rect.width > 0) {
          createSelectionPopover(rect, selectedText);
        }
      }
    };
    
    const createSelectionPopover = (rect: DOMRect, text: string) => {
      const popover = document.createElement('div');
      popover.className = 'text-selection-popover glass-card fixed z-50 flex items-center gap-2 py-2 px-3 rounded-full shadow-lg animate-fade-in';
      popover.style.left = `${window.scrollX + rect.left + rect.width / 2}px`;
      popover.style.top = `${window.scrollY + rect.top - 45}px`;
      popover.style.transform = 'translateX(-50%)';
      
      // Copy button
      const copyButton = document.createElement('button');
      copyButton.className = 'p-2 hover:bg-white/10 rounded-full transition-colors flex items-center justify-center';
      copyButton.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>';
      copyButton.title = 'Copy';
      copyButton.onclick = (e) => {
        e.stopPropagation();
        navigator.clipboard.writeText(text);
        toast({
          title: "Copied!",
          description: "Text copied to clipboard.",
          duration: 2000,
        });
        popover.remove();
      };
      
      // Search button
      const searchButton = document.createElement('button');
      searchButton.className = 'p-2 hover:bg-white/10 rounded-full transition-colors flex items-center justify-center';
      searchButton.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12h-8"/><path d="M21 6h-8"/><path d="M21 18h-8"/><circle cx="3" cy="12" r="1"/><circle cx="3" cy="6" r="1"/><circle cx="3" cy="18" r="1"/></svg>';
      searchButton.title = 'Learn Plant Info';
      searchButton.onclick = (e) => {
        e.stopPropagation();
        window.open(`https://www.google.com/search?q=${encodeURIComponent(`${text} plant care`)}`, '_blank');
        popover.remove();
      };
      
      // Plant doc diagnose button
      const diagnoseButton = document.createElement('button');
      diagnoseButton.className = 'p-2 hover:bg-white/10 rounded-full transition-colors flex items-center justify-center text-plantDoc-primary';
      diagnoseButton.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 5H2v7l6.29 6.29c.94.94 2.48.94 3.42 0l3.58-3.58c.94-.94.94-2.48 0-3.42L9 5Z"/><path d="M6 9.01V9"/><path d="m15 5 6.3 6.3a2.4 2.4 0 0 1 0 3.4L17 19"/></svg>';
      diagnoseButton.title = 'Diagnose Plant';
      diagnoseButton.onclick = (e) => {
        e.stopPropagation();
        window.location.href = `/diagnose?plant=${encodeURIComponent(text)}`;
        popover.remove();
      };
      
      popover.appendChild(copyButton);
      popover.appendChild(searchButton);
      popover.appendChild(diagnoseButton);
      
      document.body.appendChild(popover);
      
      // Auto-remove after some time of inactivity
      const removeTimeout = setTimeout(() => {
        if (document.body.contains(popover)) {
          popover.remove();
        }
      }, 3000);
      
      // Reset timeout on hover
      popover.addEventListener('mouseenter', () => {
        clearTimeout(removeTimeout);
      });
      
      // Set new timeout on mouse leave
      popover.addEventListener('mouseleave', () => {
        setTimeout(() => {
          if (document.body.contains(popover)) {
            popover.remove();
          }
        }, 1000);
      });
      
      // Remove popover when clicking outside
      const handleClickOutside = (e: MouseEvent) => {
        if (!popover.contains(e.target as Node)) {
          popover.remove();
          document.removeEventListener('mousedown', handleClickOutside);
        }
      };
      
      document.addEventListener('mousedown', handleClickOutside);
    };
    
    // Listen for selection changes
    document.addEventListener('selectionchange', handleSelection);
    
    return () => {
      document.removeEventListener('selectionchange', handleSelection);
    };
  }, [toast]);
  
  return null; // This component doesn't render anything visually
};

export default TextHighlighter;
