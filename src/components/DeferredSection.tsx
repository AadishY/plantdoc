import { useEffect, useRef, useState, type ReactNode } from 'react';

interface DeferredSectionProps {
  children: ReactNode;
  minHeight?: string;
  className?: string;
}

/**
 * Defers below-the-fold component work until it is close to view. This keeps
 * the landing hero's first mobile paint focused on the interactive stage
 * instead of parsing cards that are several screens away.
 */
export function DeferredSection({ children, minHeight = '420px', className = '' }: DeferredSectionProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const target = ref.current;
    if (!target) return;
    if (!('IntersectionObserver' in window)) {
      setIsReady(true);
      return;
    }

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsReady(true);
        observer.disconnect();
      }
    }, { rootMargin: '280px 0px' });

    observer.observe(target);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className={className} style={!isReady ? { minHeight } : undefined}>
      {isReady ? children : <div aria-hidden="true" />}
    </div>
  );
}

export default DeferredSection;
