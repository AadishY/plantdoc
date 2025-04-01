
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
    
    return () => {
      observer.unobserve(element);
    };
  }, [threshold, once, rootMargin]);
  
  return [ref, isVisible];
};

export const useParallaxScroll = (speed: number = 0.5): [RefObject<HTMLElement>, { y: number }] => {
  const ref = useRef<HTMLElement>(null);
  const [offset, setOffset] = useState(0);
  
  useEffect(() => {
    const handleScroll = () => {
      if (!ref.current) return;
      
      const { top } = ref.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      
      // Calculate how far into view the element is
      const viewportOffset = top - windowHeight;
      const scrollOffset = Math.max(0, -viewportOffset * speed);
      
      setOffset(scrollOffset);
    };
    
    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initialize
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, [speed]);
  
  return [ref, { y: offset }];
};

export const useActiveSection = (sections: string[], offset: number = 100): string | null => {
  const [activeSection, setActiveSection] = useState<string | null>(null);
  
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + offset;
      
      for (let i = sections.length - 1; i >= 0; i--) {
        const section = document.getElementById(sections[i]);
        if (!section) continue;
        
        if (section.offsetTop <= scrollPosition) {
          setActiveSection(sections[i]);
          break;
        }
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initialize
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, [sections, offset]);
  
  return activeSection;
};
