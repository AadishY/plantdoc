import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown, Scan, Wand2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface TrailPoint {
  x: number;
  y: number;
  radius: number;
  alpha: number;
  age: number;
}

const FLOWER_ALPHA_THRESHOLD = 18;
const MAX_TRAIL_POINTS = 12;
const RELEASE_DELAY_MS = 160;

/**
 * The landing-stage reveal is entirely CSS-mask driven. Earlier iterations
 * serialized two canvases to base64 several times a second; this version keeps
 * the healthy and pathology layers synchronized with small native gradients.
 * That removes large per-frame allocations and is especially kinder to mobile
 * GPUs while retaining an organic, multi-lobed reveal.
 */
export const PlantDocHeroStage: React.FC = () => {
  const stageRef = useRef<HTMLElement>(null);
  const baseLayerRef = useRef<HTMLDivElement>(null);
  const topLayerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const stage = stageRef.current;
    const baseLayer = baseLayerRef.current;
    const topLayer = topLayerRef.current;
    const flowerImage = baseLayer?.querySelector('img');
    if (!stage || !baseLayer || !topLayer || !flowerImage) return;

    const isMobile = window.matchMedia('(pointer: coarse)').matches || window.innerWidth < 768;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const maskUpdateInterval = isMobile ? 32 : 16;
    const trails: TrailPoint[] = [];

    let animationFrame = 0;
    let lastFrame = performance.now();
    let lastMaskUpdate = -Infinity;
    let isPageVisible = !document.hidden;
    let isIntersecting = true;
    let hovering = false;
    let releaseAt = 0;
    let pointerX = -1;
    let pointerY = -1;
    let smoothX = -1;
    let smoothY = -1;
    let lastTrailX = -1;
    let lastTrailY = -1;
    let headRadius = 0;
    let touchStartX = 0;
    let touchStartY = 0;
    let draggingReveal = false;
    let geometryDirty = true;
    let layerRect: DOMRect | null = null;
    let imageRect: DOMRect | null = null;
    let flowerAlpha: Uint8ClampedArray | null = null;
    let flowerWidth = 0;
    let flowerHeight = 0;

    const alphaCanvas = document.createElement('canvas');
    const alphaContext = alphaCanvas.getContext('2d', { willReadFrequently: true });

    const measure = () => {
      layerRect = topLayer.getBoundingClientRect();
      imageRect = flowerImage.getBoundingClientRect();
      geometryDirty = false;
    };

    const refreshFlowerAlpha = () => {
      if (!alphaContext || !flowerImage.complete || !flowerImage.naturalWidth || !flowerImage.naturalHeight) return;
      try {
        alphaCanvas.width = flowerImage.naturalWidth;
        alphaCanvas.height = flowerImage.naturalHeight;
        alphaContext.clearRect(0, 0, alphaCanvas.width, alphaCanvas.height);
        alphaContext.drawImage(flowerImage, 0, 0, alphaCanvas.width, alphaCanvas.height);
        flowerAlpha = alphaContext.getImageData(0, 0, alphaCanvas.width, alphaCanvas.height).data;
        flowerWidth = alphaCanvas.width;
        flowerHeight = alphaCanvas.height;
      } catch {
        // Pixel reads can be disabled by a browser privacy setting. The reveal
        // still works safely within the image bounds in that case.
        flowerAlpha = null;
      }
    };

    const getFlowerPoint = (clientX: number, clientY: number): { x: number; y: number } | null => {
      if (geometryDirty || !layerRect || !imageRect) measure();
      if (!layerRect || !imageRect) return null;

      const boxX = clientX - imageRect.left;
      const boxY = clientY - imageRect.top;
      if (boxX < 0 || boxY < 0 || boxX > imageRect.width || boxY > imageRect.height) return null;

      // Before the alpha bitmap is decoded, image-bounds interaction gives the
      // first touch a responsive result. Once decoded, transparent padding is
      // precisely excluded so the reveal starts only on visible foliage.
      if (flowerAlpha && flowerWidth && flowerHeight) {
        const scale = Math.min(imageRect.width / flowerWidth, imageRect.height / flowerHeight);
        const drawnWidth = flowerWidth * scale;
        const imageX = (imageRect.width - drawnWidth) / 2;
        const sourceX = Math.floor((boxX - imageX) / scale);
        const sourceY = Math.floor(boxY / scale);
        if (sourceX < 0 || sourceY < 0 || sourceX >= flowerWidth || sourceY >= flowerHeight) return null;

        let maxAlpha = 0;
        for (let offsetY = -2; offsetY <= 2; offsetY += 1) {
          for (let offsetX = -2; offsetX <= 2; offsetX += 1) {
            const sampleX = Math.min(flowerWidth - 1, Math.max(0, sourceX + offsetX));
            const sampleY = Math.min(flowerHeight - 1, Math.max(0, sourceY + offsetY));
            maxAlpha = Math.max(maxAlpha, flowerAlpha[(sampleY * flowerWidth + sampleX) * 4 + 3]);
          }
        }
        if (maxAlpha < FLOWER_ALPHA_THRESHOLD) return null;
      }

      return {
        x: ((clientX - layerRect.left) / Math.max(1, layerRect.width)) * 100,
        y: ((clientY - layerRect.top) / Math.max(1, layerRect.height)) * 100,
      };
    };

    const startLoop = () => {
      if (!animationFrame && isPageVisible && isIntersecting) {
        animationFrame = window.requestAnimationFrame(renderLoop);
      }
    };

    const beginReveal = (point: { x: number; y: number }) => {
      pointerX = point.x;
      pointerY = point.y;
      hovering = true;
      releaseAt = 0;
      startLoop();
    };

    const beginRelease = () => {
      if (!hovering && headRadius < 0.5 && trails.length === 0) return;
      hovering = false;
      releaseAt = performance.now() + (reducedMotion ? 0 : RELEASE_DELAY_MS);
      startLoop();
    };

    const releaseMasks = () => {
      topLayer.style.opacity = '0';
      topLayer.style.maskImage = 'none';
      topLayer.style.webkitMaskImage = 'none';
      baseLayer.style.maskImage = 'none';
      baseLayer.style.webkitMaskImage = 'none';
    };

    const updateFromPointer = (clientX: number, clientY: number) => {
      const point = getFlowerPoint(clientX, clientY);
      if (point) beginReveal(point);
      else beginRelease();
    };

    const writeMasks = (time: number) => {
      if (!layerRect || smoothX < 0 || smoothY < 0 || headRadius < 0.5) return;

      const wobble = reducedMotion ? 0 : Math.sin(time * 0.0022) * 0.045;
      const radiusX = headRadius * (1 + wobble);
      const radiusY = headRadius * (1 - wobble * 0.72);
      const core = `radial-gradient(ellipse ${radiusX.toFixed(1)}px ${radiusY.toFixed(1)}px at ${smoothX.toFixed(2)}% ${smoothY.toFixed(2)}%, #fff 0%, #fff 53%, rgba(255,255,255,0.92) 68%, rgba(255,255,255,0.36) 86%, transparent 100%)`;
      const maskLayers = [core];

      // Two offset lobes keep the reveal biologically irregular rather than a
      // perfect inspection circle. The short, fading wake joins them smoothly.
      if (!reducedMotion) {
        const phase = time * 0.002;
        const lobeOneX = smoothX + Math.sin(phase * 1.3) * 0.9;
        const lobeOneY = smoothY + Math.cos(phase * 1.1) * 0.7;
        const lobeTwoX = smoothX - Math.cos(phase * 0.9) * 0.7;
        const lobeTwoY = smoothY + Math.sin(phase * 1.45) * 0.8;
        maskLayers.push(
          `radial-gradient(ellipse ${(radiusX * 0.62).toFixed(1)}px ${(radiusY * 0.48).toFixed(1)}px at ${lobeOneX.toFixed(2)}% ${lobeOneY.toFixed(2)}%, rgba(255,255,255,0.7) 0%, rgba(255,255,255,0.45) 58%, transparent 100%)`,
          `radial-gradient(ellipse ${(radiusX * 0.38).toFixed(1)}px ${(radiusY * 0.58).toFixed(1)}px at ${lobeTwoX.toFixed(2)}% ${lobeTwoY.toFixed(2)}%, rgba(255,255,255,0.46) 0%, rgba(255,255,255,0.22) 56%, transparent 100%)`
        );
      }

      for (let index = trails.length - 1; index >= 0; index -= 1) {
        const trail = trails[index];
        const alpha = Math.max(0.08, trail.alpha * 0.72);
        maskLayers.push(
          `radial-gradient(ellipse ${(trail.radius * 0.78).toFixed(1)}px ${(trail.radius * 0.62).toFixed(1)}px at ${trail.x.toFixed(2)}% ${trail.y.toFixed(2)}%, rgba(255,255,255,${alpha.toFixed(2)}) 0%, rgba(255,255,255,${(alpha * 0.64).toFixed(2)}) 58%, transparent 100%)`
        );
      }

      const topMask = maskLayers.join(', ');
      topLayer.style.maskImage = topMask;
      topLayer.style.webkitMaskImage = topMask;
      topLayer.style.maskSize = '100% 100%';
      topLayer.style.webkitMaskSize = '100% 100%';
      topLayer.style.maskRepeat = 'no-repeat';
      topLayer.style.webkitMaskRepeat = 'no-repeat';
      topLayer.style.opacity = '1';

      // A synchronized inverse core prevents the healthy layer from bleeding
      // through the main pathology window, including transparent eaten-away
      // tissue. Trail edges intentionally feather into the healthy layer.
      const inverseMask = `radial-gradient(ellipse ${radiusX.toFixed(1)}px ${radiusY.toFixed(1)}px at ${smoothX.toFixed(2)}% ${smoothY.toFixed(2)}%, transparent 0%, transparent 61%, #fff 100%)`;
      baseLayer.style.maskImage = inverseMask;
      baseLayer.style.webkitMaskImage = inverseMask;
      baseLayer.style.maskSize = '100% 100%';
      baseLayer.style.webkitMaskSize = '100% 100%';
      baseLayer.style.maskRepeat = 'no-repeat';
      baseLayer.style.webkitMaskRepeat = 'no-repeat';
    };

    const renderLoop = (time: number) => {
      animationFrame = 0;
      if (!isPageVisible || !isIntersecting) return;

      const frameScale = Math.min(3, Math.max(0.5, (time - lastFrame) / 16.67));
      lastFrame = time;
      const holdingRelease = !hovering && releaseAt > time;
      const targetRadius = hovering
        ? Math.max(isMobile ? 38 : 60, Math.min(isMobile ? 64 : 106, Math.min(layerRect?.width || 0, layerRect?.height || 0) * (isMobile ? 0.105 : 0.12)))
        : holdingRelease
          ? headRadius
          : 0;
      const headEase = 1 - Math.pow(hovering ? 0.72 : 0.86, frameScale);
      headRadius += (targetRadius - headRadius) * headEase;

      if (hovering && pointerX >= 0 && pointerY >= 0) {
        if (smoothX < 0 || smoothY < 0) {
          smoothX = pointerX;
          smoothY = pointerY;
        } else {
          const pointerEase = 1 - Math.pow(isMobile ? 0.57 : 0.51, frameScale);
          smoothX += (pointerX - smoothX) * pointerEase;
          smoothY += (pointerY - smoothY) * pointerEase;
        }

        const distance = Math.hypot(smoothX - lastTrailX, smoothY - lastTrailY);
        const trailThreshold = isMobile ? 1.25 : 0.85;
        if (distance >= trailThreshold && headRadius > 3 && !reducedMotion) {
          trails.push({ x: smoothX, y: smoothY, radius: headRadius, alpha: 0.78, age: 0 });
          if (trails.length > (isMobile ? 7 : MAX_TRAIL_POINTS)) trails.shift();
          lastTrailX = smoothX;
          lastTrailY = smoothY;
        }
      }

      const fade = Math.pow(isMobile ? 0.93 : 0.9, frameScale);
      for (let index = trails.length - 1; index >= 0; index -= 1) {
        const trail = trails[index];
        trail.alpha *= fade;
        trail.radius *= Math.pow(0.993, frameScale);
        trail.age += frameScale;
        if (trail.alpha < 0.025 || trail.radius < 2) trails.splice(index, 1);
      }

      const hasReveal = hovering || holdingRelease || headRadius > 0.5 || trails.length > 0;
      if (!hasReveal) {
        releaseMasks();
        return;
      }

      if (time - lastMaskUpdate >= maskUpdateInterval) {
        lastMaskUpdate = time;
        writeMasks(time);
      }
      animationFrame = window.requestAnimationFrame(renderLoop);
    };

    const handleMouseMove = (event: MouseEvent) => updateFromPointer(event.clientX, event.clientY);
    const handleMouseLeave = () => beginRelease();
    const handleTouchStart = (event: TouchEvent) => {
      const touch = event.touches[0];
      if (!touch) return;
      touchStartX = touch.clientX;
      touchStartY = touch.clientY;
      draggingReveal = Boolean(getFlowerPoint(touch.clientX, touch.clientY));
      if (draggingReveal) updateFromPointer(touch.clientX, touch.clientY);
      else beginRelease();
    };
    const handleTouchMove = (event: TouchEvent) => {
      const touch = event.touches[0];
      if (!touch || !draggingReveal) return;

      const deltaX = Math.abs(touch.clientX - touchStartX);
      const deltaY = Math.abs(touch.clientY - touchStartY);
      // Native vertical scrolling always wins. A deliberate horizontal trace
      // over the leaf stays interactive without fighting the browser.
      if (deltaY > 18 && deltaY > deltaX * 1.45) {
        draggingReveal = false;
        beginRelease();
        return;
      }
      event.preventDefault();
      updateFromPointer(touch.clientX, touch.clientY);
    };
    const handleTouchEnd = () => {
      draggingReveal = false;
      beginRelease();
    };
    const handleScroll = () => {
      geometryDirty = true;
      if (hovering) beginRelease();
    };
    const handleResize = () => {
      geometryDirty = true;
    };
    const handleVisibility = () => {
      isPageVisible = !document.hidden;
      if (isPageVisible) {
        lastFrame = performance.now();
        startLoop();
      } else if (animationFrame) {
        window.cancelAnimationFrame(animationFrame);
        animationFrame = 0;
      }
    };

    const resizeObserver = 'ResizeObserver' in window ? new ResizeObserver(handleResize) : null;
    resizeObserver?.observe(topLayer);
    resizeObserver?.observe(flowerImage);
    const intersectionObserver = 'IntersectionObserver' in window
      ? new IntersectionObserver(([entry]) => {
          isIntersecting = entry.isIntersecting;
          if (isIntersecting) {
            lastFrame = performance.now();
            startLoop();
          } else if (animationFrame) {
            window.cancelAnimationFrame(animationFrame);
            animationFrame = 0;
          }
        }, { threshold: 0.05 })
      : null;
    intersectionObserver?.observe(stage);

    refreshFlowerAlpha();
    flowerImage.addEventListener('load', refreshFlowerAlpha, { once: true });
    stage.addEventListener('mousemove', handleMouseMove, { passive: true });
    stage.addEventListener('mouseleave', handleMouseLeave, { passive: true });
    stage.addEventListener('touchstart', handleTouchStart, { passive: true });
    stage.addEventListener('touchmove', handleTouchMove, { passive: false });
    stage.addEventListener('touchend', handleTouchEnd, { passive: true });
    stage.addEventListener('touchcancel', handleTouchEnd, { passive: true });
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleResize, { passive: true });
    document.addEventListener('visibilitychange', handleVisibility);

    return () => {
      if (animationFrame) window.cancelAnimationFrame(animationFrame);
      releaseMasks();
      resizeObserver?.disconnect();
      intersectionObserver?.disconnect();
      flowerImage.removeEventListener('load', refreshFlowerAlpha);
      stage.removeEventListener('mousemove', handleMouseMove);
      stage.removeEventListener('mouseleave', handleMouseLeave);
      stage.removeEventListener('touchstart', handleTouchStart);
      stage.removeEventListener('touchmove', handleTouchMove);
      stage.removeEventListener('touchend', handleTouchEnd);
      stage.removeEventListener('touchcancel', handleTouchEnd);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, []);

  const scrollToNextSection = () => {
    document.getElementById('features-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <section
      ref={stageRef}
      className="relative box-border flex h-[calc(100dvh-4.5rem)] max-h-[calc(100dvh-4.5rem)] w-full touch-pan-y select-none flex-col justify-between overflow-hidden px-4 pb-3 sm:px-8 sm:pb-4 md:h-[calc(100dvh-5rem)] md:max-h-[calc(100dvh-5rem)]"
      aria-labelledby="plantdoc-title"
    >
      <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center overflow-hidden">
        <div className="absolute left-0 top-[12%] flex w-full select-none items-center justify-center px-2 sm:top-[7%] md:top-[8%]">
          <h1
            id="plantdoc-title"
            aria-label="PlantDoc"
            className="flex max-w-full items-center justify-center whitespace-nowrap text-center text-[clamp(2.2rem,13.5vw,9.5rem)] font-normal uppercase leading-none tracking-[0.03em] drop-shadow-2xl sm:tracking-[0.06em]"
            style={{ fontFamily: "'Instrument Serif', 'Playfair Display', Georgia, serif" }}
          >
            <span className="inline-block text-white drop-shadow-[0_15px_35px_rgba(255,255,255,0.25)]" style={{ transform: 'scaleX(1.04)' }}>PLANT</span>
            <span
              className="ml-1.5 inline-block bg-clip-text text-transparent drop-shadow-[0_15px_40px_rgba(45,212,191,0.5)] sm:ml-3"
              style={{ backgroundImage: 'linear-gradient(180deg, #A7F3D0 0%, #34D399 28%, #2DD4BF 60%, #059669 100%)' }}
            >
              DOC
            </span>
            <span className="sr-only"> — Instant AI Plant Disease Diagnosis &amp; Precision Foliar Pathology</span>
          </h1>
        </div>

        <div
          className="pointer-events-auto absolute inset-x-0 bottom-0 z-20 mx-auto flex h-[78vh] max-h-[890px] w-[96vw] cursor-crosshair touch-pan-y items-end justify-center overflow-hidden sm:h-[84vh] sm:w-[78vw] md:h-[88vh] md:w-[66vw] lg:w-[54vw] lg:max-w-[740px]"
          title="Move over or trace the leaf to reveal the pathology layer"
        >
          <div className="pointer-events-none relative flex h-full w-full translate-y-[22%] scale-[1.18] items-start justify-center sm:translate-y-[15%] sm:scale-[1.08]">
            <div ref={baseLayerRef} className="flex h-full w-full items-start justify-center">
              <img
                src="/main.webp"
                alt="Healthy botanical specimen with vibrant green chlorophyll leaf structure"
                className="mx-auto block h-full w-full object-contain object-top drop-shadow-[0_25px_60px_rgba(0,0,0,0.9)]"
                loading="eager"
                decoding="async"
              />
            </div>

            <div
              ref={topLayerRef}
              className="pointer-events-none absolute inset-0 flex h-full w-full items-start justify-center will-change-opacity"
              style={{ opacity: 0 }}
              aria-hidden="true"
            >
              <img
                src="/main_disease.webp"
                alt=""
                className="mx-auto block h-full w-full object-contain object-top brightness-[1.03] contrast-[1.08] saturate-[1.14] drop-shadow-[0_25px_60px_rgba(0,0,0,0.9)]"
                loading="eager"
                decoding="async"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1" />

      <div className="relative z-30 mx-auto mb-2 flex items-center gap-2 rounded-full border border-white/15 bg-black/50 px-3 py-1.5 text-[10px] font-medium tracking-wide text-white/75 backdrop-blur-md sm:hidden">
        <span className="h-1.5 w-1.5 rounded-full bg-[#2DD4BF] shadow-[0_0_10px_#2DD4BF]" aria-hidden="true" />
        <span>Trace the leaf to reveal pathology</span>
      </div>

      <div className="pointer-events-auto relative z-30 mx-auto mb-2 flex w-full max-w-[320px] flex-row items-center justify-between px-1 pb-0.5 sm:mb-3 sm:max-w-[500px] md:max-w-[560px]">
        <Button asChild className="group relative shrink-0 overflow-hidden rounded-full border border-[#5EEAD4]/60 bg-gradient-to-r from-[#2DD4BF] via-[#10B981] to-[#059669] px-3.5 py-2.5 text-[11px] font-extrabold text-black shadow-[0_0_30px_rgba(45,212,191,0.55)] transition-all duration-300 hover:scale-105 hover:from-[#5EEAD4] hover:via-[#34D399] hover:to-[#10B981] hover:shadow-[0_0_50px_rgba(45,212,191,0.9)] sm:px-7 sm:py-4 sm:text-sm md:px-8 md:py-5 md:text-base">
          <Link to="/diagnose" className="flex items-center justify-center gap-1.5 whitespace-nowrap sm:gap-2">
            <Scan className="h-3.5 w-3.5 transition-transform duration-300 group-hover:rotate-90 group-hover:scale-110 sm:h-4.5 sm:w-4.5 md:h-5 md:w-5" />
            <span className="font-bold tracking-tight sm:tracking-wide">Diagnose Plant</span>
          </Link>
        </Button>

        <Button asChild variant="outline" className="group relative shrink-0 overflow-hidden rounded-full border border-white/20 bg-black/60 px-3.5 py-2.5 text-[11px] font-semibold text-white shadow-[0_4px_20px_rgba(0,0,0,0.5)] backdrop-blur-2xl transition-all duration-300 hover:scale-105 hover:border-[#2DD4BF]/60 hover:bg-black/85 hover:text-[#5EEAD4] hover:shadow-[0_0_30px_rgba(45,212,191,0.4)] sm:px-7 sm:py-4 sm:text-sm md:px-8 md:py-5 md:text-base">
          <Link to="/recommend" className="flex items-center justify-center gap-1.5 whitespace-nowrap sm:gap-2">
            <Wand2 className="h-3.5 w-3.5 text-[#2DD4BF] transition-transform duration-300 group-hover:rotate-12 group-hover:scale-125 sm:h-4.5 sm:w-4.5 md:h-5 md:w-5" />
            <span className="tracking-tight transition-colors group-hover:text-[#5EEAD4] sm:tracking-wide">Recommendations</span>
          </Link>
        </Button>
      </div>

      <div className="pointer-events-none relative z-30 flex w-full shrink-0 items-center justify-between font-mono text-xs text-foreground/80">
        <div className="hidden text-left leading-relaxed sm:block">
          <div>Foliar pathology,</div>
          <div className="font-medium text-white">intelligently localized.</div>
        </div>

        <button
          type="button"
          onClick={scrollToNextSection}
          className="pointer-events-auto group mx-auto flex h-7 items-center gap-1.5 rounded-full border border-white/20 bg-gradient-to-r from-black/60 via-black/40 to-black/60 px-4 text-white/90 shadow-[0_4px_20px_rgba(0,0,0,0.6),inset_0_1px_1px_rgba(255,255,255,0.25)] backdrop-blur-2xl transition-all duration-300 hover:border-[#2DD4BF]/60 hover:from-black/80 hover:to-black/80 hover:text-[#5EEAD4] sm:h-8 sm:gap-2 sm:px-5 md:h-9 md:px-6"
        >
          <span className="relative flex h-1.5 w-1.5 shrink-0 sm:h-2 sm:w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#2DD4BF] opacity-75" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[#2DD4BF] sm:h-2 sm:w-2" />
          </span>
          <span className="font-sans text-[10px] font-medium tracking-wide sm:text-xs md:text-sm">Explore Platform</span>
          <ChevronDown className="h-3 w-3 shrink-0 animate-bounce text-[#2DD4BF] transition-transform group-hover:translate-y-0.5 sm:h-4 sm:w-4" />
        </button>

        <div className="hidden text-right leading-relaxed sm:block">
          <div>Zero manual guesswork.</div>
          <div className="font-medium text-white">Clinical botanical accuracy.</div>
        </div>
      </div>
    </section>
  );
};

export default PlantDocHeroStage;
