import React, { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  opacity: number;
  pulseSpeed: number;
  pulsePhase: number;
  hue: number;
}

const DynamicBackground: React.FC = React.memo(() => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);
    let isRunning = true;

    let resizeTimer: any;
    const handleResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        if (!canvas) return;
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
      }, 150);
    };

    window.addEventListener('resize', handleResize, { passive: true });

    // Adaptive bioluminescent spores (12 on mobile, 22 on desktop)
    const isMobile = window.innerWidth < 768;
    const particleCount = isMobile ? 12 : Math.min(Math.floor(window.innerWidth / 60), 22);
    const particles: Particle[] = [];

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() * 1.6 + 0.8,
        speedX: (Math.random() - 0.5) * 0.22,
        speedY: -Math.random() * 0.30 - 0.08,
        opacity: Math.random() * 0.40 + 0.2,
        pulseSpeed: Math.random() * 0.02 + 0.01,
        pulsePhase: Math.random() * Math.PI * 2,
        hue: Math.random() > 0.4 ? 165 : 150
      });
    }

    let mouseX = -9999;
    let mouseY = -9999;

    const hasHover = window.matchMedia('(hover: hover)').matches;
    const handleMouseMove = (e: MouseEvent) => {
      if (!hasHover) return;
      mouseX = e.clientX;
      mouseY = e.clientY;
    };

    if (hasHover) {
      window.addEventListener('mousemove', handleMouseMove, { passive: true });
    }

    const handleVisibility = () => {
      if (document.hidden) {
        isRunning = false;
        cancelAnimationFrame(animationFrameId);
      } else if (!isRunning) {
        isRunning = true;
        animationFrameId = requestAnimationFrame(render);
      }
    };

    document.addEventListener('visibilitychange', handleVisibility);

    const render = () => {
      if (!isRunning) return;
      ctx.clearRect(0, 0, width, height);

      // Fast single-pass draw call
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        p.x += p.speedX;
        p.y += p.speedY;
        p.pulsePhase += p.pulseSpeed;

        // Wrap boundaries
        if (p.y < -10) {
          p.y = height + 10;
          p.x = Math.random() * width;
        }
        if (p.x < -10) p.x = width + 10;
        if (p.x > width + 10) p.x = -10;

        // Subtle mouse repulsion
        if (mouseX !== -9999) {
          const dx = mouseX - p.x;
          const dy = mouseY - p.y;
          const distSq = dx * dx + dy * dy;
          if (distSq < 14400) {
            const dist = Math.sqrt(distSq);
            const force = (120 - dist) / 120;
            p.x -= (dx / dist) * force * 0.6;
            p.y -= (dy / dist) * force * 0.6;
          }
        }

        const currentOpacity = p.opacity * (0.6 + 0.4 * Math.sin(p.pulsePhase));

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${p.hue}, 85%, 65%, ${currentOpacity})`;
        ctx.fill();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      isRunning = false;
      cancelAnimationFrame(animationFrameId);
      clearTimeout(resizeTimer);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden bg-[#040805]">
      {/* 🌟 Static Low-Overhead Hardware GPU Ambient Glow Mesh */}
      <div 
        className="absolute -top-[20%] -left-[10%] w-[65vw] h-[65vw] rounded-full blur-[140px] opacity-25 pointer-events-none transform-gpu"
        style={{
          background: 'radial-gradient(circle, rgba(45, 212, 191, 0.45) 0%, rgba(16, 185, 129, 0.15) 50%, transparent 75%)',
        }}
      />
      
      <div 
        className="absolute top-[35%] -right-[15%] w-[60vw] h-[60vw] rounded-full blur-[150px] opacity-20 pointer-events-none transform-gpu"
        style={{
          background: 'radial-gradient(circle, rgba(5, 150, 105, 0.4) 0%, rgba(6, 182, 212, 0.15) 50%, transparent 75%)',
        }}
      />

      <div 
        className="absolute -bottom-[20%] left-[20%] w-[70vw] h-[60vw] rounded-full blur-[160px] opacity-25 pointer-events-none transform-gpu"
        style={{
          background: 'radial-gradient(circle, rgba(16, 185, 129, 0.35) 0%, rgba(45, 212, 191, 0.15) 50%, transparent 75%)',
        }}
      />

      {/* 🌿 Lightweight Spores Canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none"
        style={{ opacity: 0.85 }}
      />
    </div>
  );
});

DynamicBackground.displayName = 'DynamicBackground';

export default DynamicBackground;
