import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Scan, Wand2, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface TrailPoint {
  x: number;
  y: number;
  r: number;
  alpha: number;
  seed: number;
}

const TRAIL_MAX_POINTS = 45;
const TRAIL_HEAD_R = 64; // Ergonomic reveal radius
const TRAIL_NOISE_AMP = 12; // Soft organic ripple
const TRAIL_BLOB_PTS = 28; // High-precision smooth polygon
const TRAIL_FADE_SPEED = 0.94; // Gentle trailing decay
const TRAIL_SAMPLE_DIST = 4;

export const PlantDocHeroStage: React.FC = () => {
  const stageRef = useRef<HTMLDivElement>(null);
  const flowerContainerRef = useRef<HTMLDivElement>(null);
  const maskCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const topLayerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const maskCanvas = document.createElement('canvas');
    maskCanvasRef.current = maskCanvas;
    const ctx = maskCanvas.getContext('2d');
    if (!ctx) return;

    let points: TrailPoint[] = [];
    let headRadius = 0;
    let time = 0;
    let animFrameId: number;
    let hovering = false;
    let lastX = -9999;
    let lastY = -9999;
    let mousePos = { x: -9999, y: -9999 };
    let smoothX = -9999;
    let smoothY = -9999;

    // Size internal canvas with adaptive downscale (3x on mobile, 2x on desktop) for 900% faster frame serialization
    const updateCanvasSize = () => {
      if (!topLayerRef.current) return;
      const rect = topLayerRef.current.getBoundingClientRect();
      const isMobile = window.innerWidth < 768;
      const scaleFactor = isMobile ? 3 : 2;
      maskCanvas.width = Math.max(50, Math.round(rect.width / scaleFactor));
      maskCanvas.height = Math.max(50, Math.round(rect.height / scaleFactor));
    };

    updateCanvasSize();
    let resizeTimer: any;
    const debouncedResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(updateCanvasSize, 100);
    };
    window.addEventListener('resize', debouncedResize, { passive: true });

    const drawMorphBlob = (
      context: CanvasRenderingContext2D,
      cx: number,
      cy: number,
      r: number,
      t: number,
      seed: number
    ) => {
      if (r < 1.5) return;
      const pts: Array<{ x: number; y: number }> = [];

      for (let i = 0; i < TRAIL_BLOB_PTS; i++) {
        const angle = (i / TRAIL_BLOB_PTS) * Math.PI * 2;
        const n1 = Math.sin(angle * 3 + t * 1.5 + seed) * 0.45;
        const n2 = Math.sin(angle * 5 - t * 1.0 + seed * 2.3) * 0.3;
        const n3 = Math.cos(angle * 2 + t * 1.8 + seed * 0.7) * 0.25;
        const noise = (n1 + n2 + n3) * (TRAIL_NOISE_AMP * 0.5) * (r / 32);
        const currentR = Math.max(0, r + noise);
        pts.push({
          x: cx + Math.cos(angle) * currentR,
          y: cy + Math.sin(angle) * currentR,
        });
      }

      if (pts.length > 2) {
        context.beginPath();
        const firstMidX = (pts[0].x + pts[1].x) / 2;
        const firstMidY = (pts[0].y + pts[1].y) / 2;
        context.moveTo(firstMidX, firstMidY);

        for (let i = 1; i < pts.length; i++) {
          const nextPt = pts[(i + 1) % pts.length];
          const midX = (pts[i].x + nextPt.x) / 2;
          const midY = (pts[i].y + nextPt.y) / 2;
          context.quadraticCurveTo(pts[i].x, pts[i].y, midX, midY);
        }
        context.quadraticCurveTo(pts[0].x, pts[0].y, firstMidX, firstMidY);
        context.closePath();
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!topLayerRef.current) return;
      const rect = topLayerRef.current.getBoundingClientRect();
      
      const screenX = e.clientX - rect.left;
      const screenY = e.clientY - rect.top;

      if (screenX >= -20 && screenX <= rect.width + 20 && screenY >= -20 && screenY <= rect.height + 20) {
        const x = (screenX / rect.width) * maskCanvas.width;
        const y = (screenY / rect.height) * maskCanvas.height;
        mousePos = { x, y };
        if (!hovering) {
          hovering = true;
        }
      } else {
        hovering = false;
      }
    };

    const handleMouseEnter = (e: MouseEvent) => {
      if (!topLayerRef.current) return;
      const rect = topLayerRef.current.getBoundingClientRect();
      const screenX = e.clientX - rect.left;
      const screenY = e.clientY - rect.top;
      mousePos = { 
        x: (screenX / rect.width) * maskCanvas.width, 
        y: (screenY / rect.height) * maskCanvas.height 
      };
      hovering = true;
    };

    const handleMouseLeave = () => {
      hovering = false;
      lastX = -9999;
      lastY = -9999;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!topLayerRef.current || e.touches.length === 0) return;
      const touch = e.touches[0];
      const rect = topLayerRef.current.getBoundingClientRect();
      const screenX = touch.clientX - rect.left;
      const screenY = touch.clientY - rect.top;

      if (screenX >= -40 && screenX <= rect.width + 40 && screenY >= -40 && screenY <= rect.height + 40) {
        const x = (screenX / rect.width) * maskCanvas.width;
        const y = (screenY / rect.height) * maskCanvas.height;
        mousePos = { x, y };
        hovering = true;
      }
    };

    const handleTouchStart = (e: TouchEvent) => {
      if (!topLayerRef.current || e.touches.length === 0) return;
      const touch = e.touches[0];
      const rect = topLayerRef.current.getBoundingClientRect();
      const screenX = touch.clientX - rect.left;
      const screenY = touch.clientY - rect.top;
      mousePos = { 
        x: (screenX / rect.width) * maskCanvas.width, 
        y: (screenY / rect.height) * maskCanvas.height 
      };
      smoothX = mousePos.x;
      smoothY = mousePos.y;
      hovering = true;
    };

    const handleTouchEnd = () => {
      hovering = false;
      lastX = -9999;
      lastY = -9999;
    };

    const stage = stageRef.current;
    if (stage) {
      stage.addEventListener('mousemove', handleMouseMove, { passive: true });
      stage.addEventListener('mouseenter', handleMouseEnter, { passive: true });
      stage.addEventListener('mouseleave', handleMouseLeave, { passive: true });
      stage.addEventListener('touchstart', handleTouchStart, { passive: true });
      stage.addEventListener('touchmove', handleTouchMove, { passive: true });
      stage.addEventListener('touchend', handleTouchEnd, { passive: true });
      stage.addEventListener('touchcancel', handleTouchEnd, { passive: true });
    }

    let isPageVisible = true;
    let isIntersecting = true;

    const startLoop = () => {
      if (!animFrameId && isPageVisible && isIntersecting) {
        animFrameId = requestAnimationFrame(renderLoop);
      }
    };

    const stopLoop = () => {
      if (animFrameId) {
        cancelAnimationFrame(animFrameId);
        animFrameId = 0;
      }
    };

    const handleVisibility = () => {
      if (document.hidden) {
        isPageVisible = false;
        stopLoop();
      } else {
        isPageVisible = true;
        startLoop();
      }
    };
    document.addEventListener('visibilitychange', handleVisibility);

    let observer: IntersectionObserver | null = null;
    if ('IntersectionObserver' in window && stage) {
      observer = new IntersectionObserver(([entry]) => {
        isIntersecting = entry.isIntersecting;
        if (isIntersecting) {
          startLoop();
        } else {
          stopLoop();
        }
      }, { threshold: 0.05 });
      observer.observe(stage);
    }

    const isMobileDevice = typeof window !== 'undefined' && window.innerWidth < 768;
    const scaledHeadR = isMobileDevice ? TRAIL_HEAD_R * 0.32 : TRAIL_HEAD_R * 0.5;

    const renderLoop = () => {
      if (!isPageVisible || !isIntersecting) {
        animFrameId = 0;
        return;
      }

      time += 0.016;
      const targetR = hovering ? scaledHeadR : 0;
      headRadius += (targetR - headRadius) * (hovering ? 0.28 : 0.08);

      // Smooth cursor interpolation directly centered on cursor tip
      if (hovering && mousePos.x !== -9999) {
        if (smoothX === -9999) {
          smoothX = mousePos.x;
          smoothY = mousePos.y;
        } else {
          smoothX += (mousePos.x - smoothX) * 0.40;
          smoothY += (mousePos.y - smoothY) * 0.40;
        }

        // Add trailing points as the cursor moves
        const dist = Math.hypot(smoothX - lastX, smoothY - lastY);
        if (dist >= TRAIL_SAMPLE_DIST && headRadius > 2) {
          points.push({
            x: smoothX,
            y: smoothY,
            r: headRadius * 0.88,
            alpha: 0.95,
            seed: Math.random() * 100
          });
          if (points.length > TRAIL_MAX_POINTS) {
            points.shift();
          }
          lastX = smoothX;
          lastY = smoothY;
        }
      }

      // Decay previous trailing points
      points = points
        .map(p => ({
          ...p,
          alpha: p.alpha * TRAIL_FADE_SPEED,
          r: p.r * 0.994
        }))
        .filter(p => p.alpha > 0.01 && p.r > 1);

      if (maskCanvas.width > 0 && maskCanvas.height > 0) {
        if (points.length === 0 && !hovering && headRadius < 0.5) {
          if (topLayerRef.current && topLayerRef.current.style.opacity !== '0') {
            topLayerRef.current.style.opacity = '0';
          }
        } else {
          ctx.clearRect(0, 0, maskCanvas.width, maskCanvas.height);

          // 1. Draw decaying trailing morph blobs
          for (let i = 0; i < points.length; i++) {
            const p = points[i];
            drawMorphBlob(ctx, p.x, p.y, p.r, time, p.seed);
            ctx.fillStyle = `rgba(255, 255, 255, ${p.alpha})`;
            ctx.fill();
          }

          // 2. Draw persistent active head morph blob
          if (hovering && headRadius > 1 && smoothX !== -9999) {
            drawMorphBlob(ctx, smoothX, smoothY, headRadius, time, 42);
            ctx.fillStyle = "rgba(255, 255, 255, 1.0)";
            ctx.fill();
          }

          // Apply real-time canvas mask to top pathology layer
          if (topLayerRef.current) {
            const dataUrl = maskCanvas.toDataURL();
            topLayerRef.current.style.maskImage = `url(${dataUrl})`;
            topLayerRef.current.style.webkitMaskImage = `url(${dataUrl})`;
            topLayerRef.current.style.maskSize = '100% 100%';
            topLayerRef.current.style.webkitMaskSize = '100% 100%';
            topLayerRef.current.style.maskRepeat = 'no-repeat';
            topLayerRef.current.style.webkitMaskRepeat = 'no-repeat';
            topLayerRef.current.style.opacity = '1';
          }
        }
      }

      animFrameId = requestAnimationFrame(renderLoop);
    };

    startLoop();

    return () => {
      stopLoop();
      clearTimeout(resizeTimer);
      window.removeEventListener('resize', debouncedResize);
      document.removeEventListener('visibilitychange', handleVisibility);
      if (observer && stage) {
        observer.unobserve(stage);
        observer.disconnect();
      }
      if (stage) {
        stage.removeEventListener('mousemove', handleMouseMove);
        stage.removeEventListener('mouseenter', handleMouseEnter);
        stage.removeEventListener('mouseleave', handleMouseLeave);
        stage.removeEventListener('touchstart', handleTouchStart);
        stage.removeEventListener('touchmove', handleTouchMove);
        stage.removeEventListener('touchend', handleTouchEnd);
        stage.removeEventListener('touchcancel', handleTouchEnd);
      }
    };
  }, []);

  const scrollToNextSection = () => {
    const lenis = (window as any).__lenis;
    if (lenis) {
      lenis.scrollTo('#features-section', { 
        duration: 1.1, 
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        offset: 0
      });
    } else {
      const nextSection = document.getElementById('features-section');
      if (nextSection) {
        nextSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  return (
    <section 
      ref={stageRef}
      className="relative w-full h-[calc(100dvh-4rem)] max-h-[calc(100dvh-4rem)] flex flex-col justify-between overflow-hidden select-none box-border px-4 sm:px-8 pb-3 sm:pb-4 cursor-default"
    >
      {/* 1. Full-Stage Background Depth Wordmark + Lower Flower Border */}
      <div className="absolute inset-0 flex items-center justify-center overflow-hidden pointer-events-none z-10">
        
        {/* ✨ CLEAN STEADY EDITORIAL WORDMARK: PLANTDOC (Positioned higher above flower) */}
        <div className="absolute top-[13%] sm:top-[8%] md:top-[9%] left-0 w-full flex items-center justify-center select-none px-2">
          <h1 
            id="plantdoc-title"
            aria-label="PlantDoc"
            className="text-[15vw] sm:text-[16vw] md:text-[15vw] lg:text-[14vw] font-normal tracking-[0.04em] sm:tracking-[0.06em] uppercase leading-none text-center flex items-center justify-center whitespace-nowrap"
            style={{ 
              fontFamily: "'Instrument Serif', 'Playfair Display', Georgia, serif"
            }}
          >
            <span 
              className="inline-block text-white filter drop-shadow-[0_15px_35px_rgba(255,255,255,0.22)]" 
              style={{ transform: 'scaleX(1.04)' }}
            >
              PLANT
            </span>
            <span 
              className="inline-block bg-clip-text text-transparent ml-2 sm:ml-3 filter drop-shadow-[0_15px_40px_rgba(45,212,191,0.45)]"
              style={{
                backgroundImage: 'linear-gradient(180deg, #A7F3D0 0%, #34D399 28%, #2DD4BF 60%, #059669 100%)'
              }}
            >
              DOC
            </span>
          </h1>
        </div>

        {/* FLOWER: ANCHORED AT BOTTOM OF 1ST SLIDE ON BOTH MOBILE & PC */}
        <div 
          ref={flowerContainerRef}
          className="absolute bottom-0 left-1/2 transform -translate-x-1/2 z-20 w-[96vw] sm:w-[78vw] md:w-[66vw] lg:w-[54vw] max-w-[740px] h-[78vh] sm:h-[84vh] md:h-[88vh] max-h-[890px] overflow-hidden flex items-end justify-center pointer-events-auto cursor-crosshair touch-none"
          title="Move cursor or drag finger over the flower to reveal AI pathology layer"
        >
          {/* Synchronized Transformed Image Layer Wrapper */}
          <div className="relative w-full h-full flex items-start justify-center pointer-events-none transform scale-[1.18] translate-y-[22%] sm:scale-[1.08] sm:translate-y-[15%]">
            
            {/* Base Layer: Front Healthy Foliage (main.webp) */}
            <img 
              src="/main.webp" 
              alt="Healthy Foliage Specimen"
              className="w-full h-full object-contain object-top filter drop-shadow-[0_25px_60px_rgba(0,0,0,0.9)]"
              loading="eager"
              fetchPriority="high"
              decoding="async"
            />

            {/* Reveal Top Layer: Diseased Foliage (main_disease.webp) Morph Masked (100% 1:1 Cursor Centered) */}
            <div 
              ref={topLayerRef}
              className="absolute inset-0 flex items-start justify-center pointer-events-none transition-opacity duration-150 will-change-[mask-image,opacity]"
              style={{ opacity: 0 }}
            >
              {/* Dark Void Underlay (Prevents healthy flower from showing through necrotic holes) */}
              <div className="absolute inset-0 bg-[#040805] pointer-events-none" />

              <img 
                src="/main_disease.webp" 
                alt=""
                className="relative z-10 w-full h-full object-contain object-top filter drop-shadow-[0_0_40px_rgba(239,68,68,0.4)]"
                loading="eager"
                fetchPriority="high"
                decoding="async"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Spacer to push foreground controls to the bottom */}
      <div className="flex-1" />

      {/* Two Elevated Action Buttons (Pushed to left & right with wide central gap) */}
      <div className="relative z-30 flex flex-row items-center justify-between w-full max-w-[310px] sm:max-w-[420px] mx-auto mb-2 sm:mb-2.5 pb-0.5 px-1 pointer-events-auto">
        {/* Button 1: Diagnose Plant Photo (Turquoise-Emerald Beacon) */}
        <Button 
          asChild 
          className="relative group overflow-hidden bg-gradient-to-r from-[#2DD4BF] via-[#10B981] to-[#059669] hover:from-[#5EEAD4] hover:via-[#34D399] hover:to-[#10B981] text-black font-extrabold px-3 sm:px-5 py-2 sm:py-3.5 rounded-full shadow-[0_0_30px_rgba(45,212,191,0.5)] transition-all duration-300 hover:scale-105 hover:shadow-[0_0_45px_rgba(45,212,191,0.75)] text-[10px] sm:text-xs border border-[#5EEAD4]/60 cursor-pointer shrink-0"
        >
          <Link to="/diagnose" className="flex items-center justify-center gap-1 sm:gap-1.5 whitespace-nowrap">
            <Scan className="h-3 sm:h-3.5 w-3 sm:w-3.5 transition-transform duration-300 group-hover:rotate-90 group-hover:scale-110" />
            <span className="tracking-tight sm:tracking-wide font-bold">Diagnose Plant</span>
          </Link>
        </Button>

        {/* Button 2: Plant Recommendations (Flower Accent Glassmorphism) */}
        <Button 
          asChild 
          variant="outline" 
          className="relative group overflow-hidden bg-black/55 hover:bg-black/85 text-white font-semibold px-3 sm:px-5 py-2 sm:py-3.5 rounded-full backdrop-blur-2xl transition-all duration-300 hover:scale-105 text-[10px] sm:text-xs border border-white/20 hover:border-[#2DD4BF]/60 hover:text-[#5EEAD4] shadow-[0_4px_20px_rgba(0,0,0,0.5)] hover:shadow-[0_0_25px_rgba(45,212,191,0.35)] cursor-pointer shrink-0"
        >
          <Link to="/recommend" className="flex items-center justify-center gap-1 sm:gap-1.5 whitespace-nowrap">
            <Wand2 className="h-3 sm:h-3.5 w-3 sm:w-3.5 text-[#2DD4BF] transition-transform duration-300 group-hover:scale-125 group-hover:rotate-12" />
            <span className="tracking-tight sm:tracking-wide group-hover:text-[#5EEAD4] transition-colors">Recommendations</span>
          </Link>
        </Button>
      </div>

      {/* Bottom Row: Left/Right Copy & Luxury Liquid Glassmorphism Scroll Prompt */}
      <div className="relative z-30 w-full flex items-center justify-between text-xs text-foreground/80 font-mono pointer-events-none shrink-0">
        {/* Left Corner Copy */}
        <div className="text-left leading-relaxed hidden sm:block">
          <div>Foliar pathology,</div>
          <div className="text-white font-medium">intelligently localized.</div>
        </div>

        {/* Center Scroll Prompt (Luxury Liquid Glassmorphism Pill) */}
        <button 
          onClick={scrollToNextSection}
          className="pointer-events-auto mx-auto h-6 sm:h-7 px-3.5 sm:px-4.5 flex items-center gap-1.5 text-white/90 hover:text-[#5EEAD4] transition-all duration-300 bg-gradient-to-r from-black/60 via-black/40 to-black/60 hover:from-black/80 hover:to-black/80 backdrop-blur-2xl rounded-full border border-white/20 hover:border-[#2DD4BF]/60 shadow-[0_4px_20px_rgba(0,0,0,0.6),inset_0_1px_1px_rgba(255,255,255,0.25)] group cursor-pointer"
        >
          <span className="relative flex h-1.5 w-1.5 shrink-0">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#2DD4BF] opacity-75" />
            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[#2DD4BF]" />
          </span>
          <span className="font-sans font-medium text-[9.5px] sm:text-[11px] tracking-wide">Explore Platform</span>
          <ChevronDown className="h-3 w-3 text-[#2DD4BF] animate-bounce group-hover:translate-y-0.5 transition-transform shrink-0" />
        </button>

        {/* Right Corner Copy */}
        <div className="text-right leading-relaxed hidden sm:block">
          <div>Zero manual guesswork.</div>
          <div className="text-white font-medium">Clinical botanical accuracy.</div>
        </div>
      </div>
    </section>
  );
};

export default PlantDocHeroStage;
