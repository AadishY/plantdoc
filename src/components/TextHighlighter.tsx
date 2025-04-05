
import React, { useEffect, useRef } from 'react';

interface TextHighlighterProps {
  selector?: string;
  highlightColor?: string;
  animationSpeed?: number;
}

const TextHighlighter: React.FC<TextHighlighterProps> = ({ 
  selector = '.highlight-text', 
  highlightColor = 'rgba(76, 175, 80, 0.2)',
  animationSpeed = 2000 
}) => {
  const animationRef = useRef<number | null>(null);
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;
    
    // Collect all highlighted elements for performance
    const elements = document.querySelectorAll(selector);
    if (elements.length === 0) return;

    // Create a scoped style element for the highlight animation
    const style = document.createElement('style');
    style.innerHTML = `
      @keyframes textHighlight {
        0% { background-position: -100% 0; }
        100% { background-position: 200% 0; }
      }
      ${selector} {
        background: linear-gradient(90deg, 
          transparent 0%, 
          ${highlightColor} 50%, 
          transparent 100%
        );
        background-size: 200% 100%;
        background-clip: text;
        -webkit-background-clip: text;
        background-repeat: no-repeat;
        animation: textHighlight ${animationSpeed}ms infinite linear;
      }
    `;
    document.head.appendChild(style);
    
    return () => {
      document.head.removeChild(style);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [selector, highlightColor, animationSpeed]);

  return null;
};

export default TextHighlighter;
