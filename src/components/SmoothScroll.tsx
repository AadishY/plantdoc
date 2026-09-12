import React, { useEffect } from 'react';

interface SmoothScrollProps {
  children: React.ReactNode;
}

export const SmoothScroll: React.FC<SmoothScrollProps> = ({ children }) => {
  useEffect(() => {
    // Ensure clean native scrolling without kinetic or inertial delay
    if (typeof window !== 'undefined') {
      delete (window as unknown as { __lenis?: unknown }).__lenis;
      document.documentElement.classList.remove('lenis', 'lenis-smooth', 'lenis-stopped', 'lenis-scrolling');
      document.body.classList.remove('lenis', 'lenis-smooth', 'lenis-stopped', 'lenis-scrolling');
    }
  }, []);

  return <>{children}</>;
};

export default SmoothScroll;

