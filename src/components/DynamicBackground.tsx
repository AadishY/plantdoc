import React, { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  opacity: number;
  phase: number;
  hue: 150 | 165;
}

/**
 * Adaptive ambient canvas.
 *
 * The canvas stays enabled on Android and other touch devices. Instead of
 * removing the effect, it adapts its particle count, backing-store density,
 * and frame cadence to the device so it does not compete with scrolling.
 */
const DynamicBackground: React.FC = React.memo(() => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const isMobile = window.matchMedia('(pointer: coarse)').matches || window.innerWidth < 768;
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const connection = (navigator as Navigator & {
      connection?: { saveData?: boolean };
    }).connection;
    const saveData = connection?.saveData === true;
    const deviceMemory = (navigator as Navigator & { deviceMemory?: number }).deviceMemory;
    const lowPower = (navigator.hardwareConcurrency || 8) <= 4;
    const lowMemory = typeof deviceMemory === 'number' && deviceMemory <= 2;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let animationFrameId = 0;
    let resizeTimer = 0;
    let scrollTimer = 0;
    let width = 0;
    let height = 0;
    let dpr = 1;
    let lastFrame = 0;
    let isPageVisible = !document.hidden;
    let isScrolling = false;
    let mouseX = -9999;
    let mouseY = -9999;

    // Fewer particles and a smaller backing store are much cheaper than
    // removing the visual entirely. Save-Data and low-power devices still get
    // a living canvas, just at the lowest quality tier.
    const constrainedDevice = saveData || lowPower || lowMemory;
    const qualityScale = constrainedDevice ? 0.62 : 1;
    const particleCount = isMobile
      ? Math.max(4, Math.min(8, Math.round((window.innerWidth / 72) * qualityScale)))
      : Math.min(16, Math.max(8, Math.floor(window.innerWidth / 110)));
    const frameInterval = isMobile ? (constrainedDevice ? 66 : 50) : 32; // 15–20fps mobile, 30fps desktop
    const particles: Particle[] = [];

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      // Android keeps the animation but avoids a multi-megapixel backing store.
      dpr = isMobile
        ? Math.min(window.devicePixelRatio || 1, constrainedDevice ? 1 : 1.15)
        : Math.min(window.devicePixelRatio || 1, 1.5);
      canvas.width = Math.max(1, Math.round(width * dpr));
      canvas.height = Math.max(1, Math.round(height * dpr));
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    resize();
    for (let i = 0; i < particleCount; i += 1) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: isMobile ? Math.random() * 1.15 + 0.55 : Math.random() * 1.25 + 0.65,
        speedX: (Math.random() - 0.5) * (isMobile ? 0.11 : 0.14),
        speedY: -Math.random() * (isMobile ? 0.15 : 0.18) - 0.04,
        opacity: Math.random() * (isMobile ? 0.2 : 0.24) + 0.12,
        phase: Math.random() * Math.PI * 2,
        hue: Math.random() > 0.45 ? 165 : 150,
      });
    }

    const hasHover = !isMobile && !reduceMotion && window.matchMedia('(hover: hover)').matches;
    const handleMouseMove = (event: MouseEvent) => {
      mouseX = event.clientX;
      mouseY = event.clientY;
    };
    if (hasHover) window.addEventListener('mousemove', handleMouseMove, { passive: true });

    const handleResize = () => {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(resize, 120);
    };
    window.addEventListener('resize', handleResize, { passive: true });

    const handleScroll = () => {
      if (!isMobile) return;
      isScrolling = true;
      window.clearTimeout(scrollTimer);
      scrollTimer = window.setTimeout(() => {
        isScrolling = false;
      }, 140);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });

    const draw = (time: number) => {
      const elapsed = lastFrame ? Math.min(3, (time - lastFrame) / 16.67) : 1;
      lastFrame = time;
      ctx.clearRect(0, 0, width, height);

      particles.forEach((particle) => {
        if (!reduceMotion) {
          particle.x += particle.speedX * elapsed;
          particle.y += particle.speedY * elapsed;
          particle.phase += 0.012 * elapsed;

          if (particle.y < -8) {
            particle.y = height + 8;
            particle.x = Math.random() * width;
          }
          if (particle.x < -8) particle.x = width + 8;
          if (particle.x > width + 8) particle.x = -8;
        }

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
        ctx.fillStyle = particle.hue === 165 ? '#5EEAD4' : '#34D399';
        ctx.globalAlpha = particle.opacity * (0.7 + Math.sin(particle.phase) * 0.3);
        ctx.fill();
      });
      ctx.globalAlpha = 1;
    };

    const render = (time: number) => {
      animationFrameId = 0;
      if (!isPageVisible) return;

      // During an active finger scroll, continue the canvas at a lighter
      // cadence rather than freezing it or competing with the scroll thread.
      const interval = isScrolling
        ? (isMobile ? (constrainedDevice ? 150 : 110) : 66)
        : frameInterval;
      if (time - lastFrame >= interval) draw(time);
      animationFrameId = window.requestAnimationFrame(render);
    };

    const startLoop = () => {
      if (!animationFrameId && isPageVisible) {
        animationFrameId = window.requestAnimationFrame(render);
      }
    };

    const handleVisibility = () => {
      isPageVisible = !document.hidden;
      if (!isPageVisible) {
        if (animationFrameId) window.cancelAnimationFrame(animationFrameId);
        animationFrameId = 0;
        ctx.clearRect(0, 0, width, height);
      } else {
        lastFrame = 0;
        if (reduceMotion) draw(performance.now());
        else startLoop();
      }
    };

    document.addEventListener('visibilitychange', handleVisibility);
    if (reduceMotion) {
      // Honor the user's preference without creating a permanent RAF loop.
      draw(performance.now());
    } else {
      startLoop();
    }

    return () => {
      if (animationFrameId) window.cancelAnimationFrame(animationFrameId);
      window.clearTimeout(resizeTimer);
      window.clearTimeout(scrollTimer);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', handleScroll);
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
