import React, { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  opacity: number;
  phase: number;
  hue: number;
}

/**
 * A deliberately small desktop-only ambient layer.
 *
 * Mobile browsers already spend most of their frame budget on scrolling and
 * compositing translucent panels. Android gets the CSS glow, but not a
 * permanently running canvas or pointer tracking.
 */
const DynamicBackground: React.FC = React.memo(() => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const coarsePointer = window.matchMedia('(pointer: coarse)').matches;
    const connection = (navigator as Navigator & {
      connection?: { saveData?: boolean };
    }).connection;
    const saveData = connection?.saveData === true;
    const lowPower = (navigator.hardwareConcurrency || 8) <= 4;

    // The static gradient in the render tree is enough on touch/low-power
    // devices. This early return removes the RAF loop and all event listeners.
    if (reduceMotion || coarsePointer || saveData || lowPower) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let animationFrameId = 0;
    let width = 0;
    let height = 0;
    let dpr = 1;
    let lastFrame = 0;
    let isPageVisible = !document.hidden;
    let mouseX = -9999;
    let mouseY = -9999;

    const particles: Particle[] = [];
    const particleCount = Math.min(Math.max(Math.floor(window.innerWidth / 110), 8), 16);

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      // Capping the backing store avoids a large canvas allocation on QHD/4K
      // screens while keeping the ambient specks crisp enough.
      dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    resize();
    for (let i = 0; i < particleCount; i += 1) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() * 1.25 + 0.65,
        speedX: (Math.random() - 0.5) * 0.14,
        speedY: -Math.random() * 0.18 - 0.04,
        opacity: Math.random() * 0.24 + 0.12,
        phase: Math.random() * Math.PI * 2,
        hue: Math.random() > 0.45 ? 165 : 150,
      });
    }

    const hasHover = window.matchMedia('(hover: hover)').matches;
    const handleMouseMove = (event: MouseEvent) => {
      mouseX = event.clientX;
      mouseY = event.clientY;
    };
    if (hasHover) window.addEventListener('mousemove', handleMouseMove, { passive: true });

    const handleResize = () => resize();
    window.addEventListener('resize', handleResize, { passive: true });

    const render = (time: number) => {
      animationFrameId = requestAnimationFrame(render);
      // 30fps is plenty for ambient motion and cuts background work in half.
      if (!isPageVisible || time - lastFrame < 32) return;
      lastFrame = time;

      ctx.clearRect(0, 0, width, height);
      particles.forEach((particle) => {
        particle.x += particle.speedX;
        particle.y += particle.speedY;
        particle.phase += 0.012;

        if (particle.y < -8) {
          particle.y = height + 8;
          particle.x = Math.random() * width;
        }
        if (particle.x < -8) particle.x = width + 8;
        if (particle.x > width + 8) particle.x = -8;

        if (hasHover && mouseX !== -9999) {
          const dx = mouseX - particle.x;
          const dy = mouseY - particle.y;
          const distanceSquared = dx * dx + dy * dy;
          if (distanceSquared < 10000 && distanceSquared > 0) {
            const distance = Math.sqrt(distanceSquared);
            const force = (100 - distance) / 100;
            particle.x -= (dx / distance) * force * 0.35;
            particle.y -= (dy / distance) * force * 0.35;
          }
        }

        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${particle.hue}, 85%, 65%, ${particle.opacity * (0.7 + Math.sin(particle.phase) * 0.3)})`;
        ctx.fill();
      });
    };

    const handleVisibility = () => {
      isPageVisible = !document.hidden;
      if (!isPageVisible) ctx.clearRect(0, 0, width, height);
    };

    document.addEventListener('visibilitychange', handleVisibility);
    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, []);

  return (
    <div aria-hidden="true" className="fixed inset-0 pointer-events-none z-0 overflow-hidden bg-[#040805]">
      <div
        className="ambient-glow absolute -top-[20%] -left-[10%] w-[65vw] h-[65vw] rounded-full blur-[140px] opacity-25 pointer-events-none transform-gpu"
        style={{ background: 'radial-gradient(circle, rgba(45, 212, 191, 0.45) 0%, rgba(16, 185, 129, 0.15) 50%, transparent 75%)' }}
      />
      <div
        className="ambient-glow absolute top-[35%] -right-[15%] w-[60vw] h-[60vw] rounded-full blur-[150px] opacity-20 pointer-events-none transform-gpu"
        style={{ background: 'radial-gradient(circle, rgba(5, 150, 105, 0.4) 0%, rgba(6, 182, 212, 0.15) 50%, transparent 75%)' }}
      />
      <div
        className="ambient-glow absolute -bottom-[20%] left-[20%] w-[70vw] h-[60vw] rounded-full blur-[160px] opacity-25 pointer-events-none transform-gpu"
        style={{ background: 'radial-gradient(circle, rgba(16, 185, 129, 0.35) 0%, rgba(45, 212, 191, 0.15) 50%, transparent 75%)' }}
      />
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" style={{ opacity: 0.8 }} />
    </div>
  );
});

DynamicBackground.displayName = 'DynamicBackground';

export default DynamicBackground;
