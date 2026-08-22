import React, { useRef, useState, useCallback } from 'react';
import { cn } from '@/lib/utils';

interface SpotlightCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  spotlightColor?: string;
}

export const SpotlightCard: React.FC<SpotlightCardProps> = React.memo(({
  children,
  className = '',
  spotlightColor = 'rgba(45, 212, 191, 0.15)',
  ...props
}) => {
  const divRef = useRef<HTMLDivElement>(null);
  const [opacity, setOpacity] = useState(0);

  // High-performance DOM-level CSS variable update: 0 React re-renders during mouse tracking
  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!divRef.current) return;
    const rect = divRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    divRef.current.style.setProperty('--spotlight-x', `${x}px`);
    divRef.current.style.setProperty('--spotlight-y', `${y}px`);
  }, []);

  const handleMouseEnter = useCallback(() => {
    setOpacity(1);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setOpacity(0);
  }, []);

  return (
    <div
      ref={divRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={cn(
        'relative rounded-3xl border border-white/15 bg-black/45 backdrop-blur-2xl overflow-hidden transition-all duration-300 transform-gpu hover:-translate-y-1.5 shadow-[0_8px_32px_rgba(0,0,0,0.5),inset_0_1px_0_0_rgba(255,255,255,0.12)] will-change-transform',
        className
      )}
      style={{
        '--spotlight-x': '50%',
        '--spotlight-y': '50%',
      } as React.CSSProperties}
      {...props}
    >
      {/* 💡 Dynamic Cursor Spotlight Glow (GPU Accelerated) */}
      <div
        className="pointer-events-none absolute -inset-px opacity-0 transition-opacity duration-300 transform-gpu"
        style={{
          opacity,
          background: `radial-gradient(550px circle at var(--spotlight-x) var(--spotlight-y), ${spotlightColor}, transparent 70%)`,
        }}
      />

      {/* 🌟 Specular Inset Border Highlight */}
      <div
        className="pointer-events-none absolute -inset-px rounded-3xl opacity-0 transition-opacity duration-300 transform-gpu"
        style={{
          opacity,
          background: `radial-gradient(350px circle at var(--spotlight-x) var(--spotlight-y), rgba(45, 212, 191, 0.45), transparent 60%)`,
          maskImage: 'linear-gradient(black, black) content-box, linear-gradient(black, black)',
          WebkitMaskImage: 'linear-gradient(black, black) content-box, linear-gradient(black, black)',
          maskComposite: 'exclude',
          WebkitMaskComposite: 'xor',
          padding: '1.2px',
        }}
      />

      <div className="relative z-10">{children}</div>
    </div>
  );
});

SpotlightCard.displayName = 'SpotlightCard';

export default SpotlightCard;
