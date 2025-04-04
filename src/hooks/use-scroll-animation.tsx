
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
    
    // Use requestIdleCallback if available for better performance
    const createObserver = () => {
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
      return observer;
    };
    
    let observer: IntersectionObserver;
    
    if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
      const id = requestIdleCallback(() => {
        observer = createObserver();
      });
      
      return () => {
        if (observer) observer.unobserve(element);
        cancelIdleCallback(id);
      };
    } else {
      observer = createObserver();
      return () => observer.unobserve(element);
    }
  }, [threshold, once, rootMargin]);
  
  return [ref, isVisible];
};

export const useParallaxScroll = (speed: number = 0.2): [RefObject<HTMLElement>, { y: number }] => {
  const ref = useRef<HTMLElement>(null);
  const [offset, setOffset] = useState(0);
  
  useEffect(() => {
    let rafId: number;
    let lastScrollY = window.scrollY;
    
    const handleScroll = () => {
      // Cancel any pending animation frame to avoid redundant calculations
      if (rafId) {
        cancelAnimationFrame(rafId);
      }
      
      // Use requestAnimationFrame for smoother scrolling
      rafId = requestAnimationFrame(() => {
        if (!ref.current) return;
        
        const { top } = ref.current.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        
        // Calculate how far into view the element is
        const viewportOffset = top - windowHeight;
        const scrollOffset = Math.max(0, -viewportOffset * speed);
        
        // Only update state if there's a significant change to reduce renders
        if (Math.abs(scrollOffset - offset) > 1) {
          setOffset(scrollOffset);
        }
      });
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initialize
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (rafId) {
        cancelAnimationFrame(rafId);
      }
    };
  }, [speed, offset]);
  
  return [ref, { y: offset }];
};

export const useActiveSection = (sections: string[], offset: number = 100): string | null => {
  const [activeSection, setActiveSection] = useState<string | null>(null);
  
  useEffect(() => {
    let rafId: number;
    let throttleTimeout: number | null = null;
    
    const handleScroll = () => {
      // Throttle scroll events
      if (!throttleTimeout) {
        throttleTimeout = window.setTimeout(() => {
          throttleTimeout = null;
          
          // Use requestAnimationFrame for smoother updates
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
          });
        }, 100); // Throttle to 100ms
      }
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initialize
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (throttleTimeout) {
        window.clearTimeout(throttleTimeout);
      }
      if (rafId) {
        cancelAnimationFrame(rafId);
      }
    };
  }, [sections, offset, activeSection]);
  
  return activeSection;
};
