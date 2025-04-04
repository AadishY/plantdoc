
import { useEffect, useState, useRef, RefObject } from 'react';

interface ScrollOptions {
  threshold?: number;
  once?: boolean;
  rootMargin?: string;
}

export const useScrollAnimation = <T extends HTMLElement>(options: ScrollOptions = {}): [RefObject<T>, boolean] => {
  const { 
    threshold = 0.1, 
    once = true,
    rootMargin = "0px"
  } = options;
  
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<T>(null);
  
  useEffect(() => {
    if (!ref.current) return;
    
    const element = ref.current;
    
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (once) {
            observer.unobserve(element);
          }
        } else if (!once) {
          setIsVisible(false);
        }
      },
      { threshold, rootMargin }
    );
    
    observer.observe(element);
    return () => observer.unobserve(element);
  }, [threshold, once, rootMargin]);
  
  return [ref, isVisible];
};

// Simplified parallax scroll hook for better performance
export const useParallaxScroll = (speed: number = 0.2): [RefObject<HTMLElement>, { y: number }] => {
  const ref = useRef<HTMLElement>(null);
  const [offset, setOffset] = useState(0);
  
  useEffect(() => {
    let rafId: number;
    let lastScrollY = window.scrollY;
    let ticking = false;
    
    const handleScroll = () => {
      lastScrollY = window.scrollY;
      
      if (!ticking) {
        rafId = requestAnimationFrame(() => {
          if (!ref.current) return;
          
          const { top } = ref.current.getBoundingClientRect();
          const windowHeight = window.innerHeight;
          const viewportOffset = top - windowHeight;
          const scrollOffset = Math.max(0, -viewportOffset * speed);
          
          if (Math.abs(scrollOffset - offset) > 2) {
            setOffset(scrollOffset);
          }
          
          ticking = false;
        });
        
        ticking = true;
      }
    };
    
    // Use passive event listener for better performance
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (rafId) {
        cancelAnimationFrame(rafId);
      }
    };
  }, [speed]);
  
  return [ref, { y: offset }];
};

// Optimized section tracking
export const useActiveSection = (sections: string[], offset: number = 100): string | null => {
  const [activeSection, setActiveSection] = useState<string | null>(null);
  
  useEffect(() => {
    let rafId: number;
    let ticking = false;
    
    const handleScroll = () => {
      if (!ticking) {
        rafId = requestAnimationFrame(() => {
          const scrollPosition = window.scrollY + offset;
          
          // Find the last section that's above the current scroll position
          for (let i = sections.length - 1; i >= 0; i--) {
            const section = document.getElementById(sections[i]);
            if (!section) continue;
            
            if (section.offsetTop <= scrollPosition) {
              if (activeSection !== sections[i]) {
                setActiveSection(sections[i]);
              }
              break;
            }
          }
          
          ticking = false;
        });
        
        ticking = true;
      }
    };
    
    // Use passive event listener for better performance
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initialize
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (rafId) {
        cancelAnimationFrame(rafId);
      }
    };
  }, [sections, offset, activeSection]);
  
  return activeSection;
};
