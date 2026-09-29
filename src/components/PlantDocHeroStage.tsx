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
const REVEAL_RELEASE_DELAY_MS = 110;
const FLOWER_ALPHA_THRESHOLD = 18;

export const PlantDocHeroStage: React.FC = () => {
  const stageRef = useRef<HTMLDivElement>(null);
  const flowerContainerRef = useRef<HTMLDivElement>(null);
  const maskCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const baseLayerRef = useRef<HTMLDivElement>(null);
  const cutoutLayerRef = useRef<HTMLDivElement>(null);
  const topLayerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const maskCanvas = document.createElement('canvas');
    const invCanvas = document.createElement('canvas');
    maskCanvasRef.current = maskCanvas;
    const ctx = maskCanvas.getContext('2d');
    const invCtx = invCanvas.getContext('2d');
    if (!ctx) return;

    const isMobileDevice = window.matchMedia('(pointer: coarse)').matches || window.innerWidth < 768;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const useCssReveal = isMobileDevice || prefersReducedMotion;
    let lastMaskUpload = 0;
    const points: TrailPoint[] = [];
    let headRadius = 0;
    let time = 0;
    let previousFrameTime = performance.now();
    let animFrameId: number;
    let hovering = false;
    let lastX = -9999;
    let lastY = -9999;
    let mousePos = { x: -9999, y: -9999 };
    let smoothX = -9999;
    let smoothY = -9999;
    let layerWidth = 1;
    let releaseAt = 0;
    let releaseScheduled = false;
    let lastCssMaskUpdate = -Infinity;
    let flowerAlphaData: Uint8ClampedArray | null = null;
    let flowerAlphaWidth = 0;
    let flowerAlphaHeight = 0;

    // Size internal canvas with adaptive downscale (3x on mobile, 2x on desktop) for 900% faster frame serialization
    const updateCanvasSize = () => {
      if (!topLayerRef.current) return;
      const rect = topLayerRef.current.getBoundingClientRect();
      layerWidth = Math.max(1, rect.width);
      const scaleFactor = isMobileDevice ? 3 : 2;
      const w = Math.max(50, Math.round(rect.width / scaleFactor));
      const h = Math.max(50, Math.round(rect.height / scaleFactor));
      maskCanvas.width = w;
      maskCanvas.height = h;
      invCanvas.width = w;
      invCanvas.height = h;
    };

    updateCanvasSize();

    // Use the healthy flower's alpha channel as a cheap hit test. The image
    // has transparent padding, so bounding-box checks alone can start a red
    // reveal while the pointer is over empty space around the flower.
    const alphaCanvas = document.createElement('canvas');
    const alphaContext = alphaCanvas.getContext('2d', { willReadFrequently: true });
    const flowerImage = baseLayerRef.current?.querySelector('img');
    const refreshFlowerAlpha = () => {
      if (!alphaContext || !flowerImage?.complete || !flowerImage.naturalWidth || !flowerImage.naturalHeight) return;
      try {
        alphaCanvas.width = flowerImage.naturalWidth;
        alphaCanvas.height = flowerImage.naturalHeight;
        alphaContext.clearRect(0, 0, alphaCanvas.width, alphaCanvas.height);
        alphaContext.drawImage(flowerImage, 0, 0, alphaCanvas.width, alphaCanvas.height);
        flowerAlphaData = alphaContext.getImageData(0, 0, alphaCanvas.width, alphaCanvas.height).data;
        flowerAlphaWidth = alphaCanvas.width;
        flowerAlphaHeight = alphaCanvas.height;
      } catch {
        // If a browser blocks pixel reads, fail closed rather than revealing
        // the entire disease layer outside the visible flower.
        flowerAlphaData = null;
      }
    };
    refreshFlowerAlpha();
    flowerImage?.addEventListener('load', refreshFlowerAlpha);

    let resizeTimer: any;
    const debouncedResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(updateCanvasSize, 100);
    };
    window.addEventListener('resize', debouncedResize, { passive: true });

    const isMobile = window.innerWidth < 768;
    const blobVertexCount = isMobile ? 10 : TRAIL_BLOB_PTS;
    const polyPtsX = new Float32Array(32);
    const polyPtsY = new Float32Array(32);

    const drawMorphBlob = (
      context: CanvasRenderingContext2D,
      cx: number,
      cy: number,
      r: number,
      t: number,
      seed: number,
      alpha: number = 1.0
    ) => {
      if (r < 1.5) return;
      const count = blobVertexCount;

      for (let i = 0; i < count; i++) {
        const angle = (i / count) * Math.PI * 2;
        const n1 = Math.sin(angle * 3 + t * 1.5 + seed) * 0.38;
        const n2 = Math.sin(angle * 5 - t * 1.0 + seed * 2.3) * 0.24;
        const noise = (n1 + n2) * (TRAIL_NOISE_AMP * 0.38) * (r / 32);
        const currentR = Math.max(0, r + noise);
        polyPtsX[i] = cx + Math.cos(angle) * currentR;
        polyPtsY[i] = cy + Math.sin(angle) * currentR;
      }

      if (count > 2) {
        context.beginPath();
        const firstMidX = (polyPtsX[0] + polyPtsX[1]) / 2;
        const firstMidY = (polyPtsY[0] + polyPtsY[1]) / 2;
        context.moveTo(firstMidX, firstMidY);

        for (let i = 1; i < count; i++) {
          const nextIdx = (i + 1) % count;
          const midX = (polyPtsX[i] + polyPtsX[nextIdx]) / 2;
          const midY = (polyPtsY[i] + polyPtsY[nextIdx]) / 2;
          context.quadraticCurveTo(polyPtsX[i], polyPtsY[i], midX, midY);
        }
        context.quadraticCurveTo(polyPtsX[0], polyPtsY[0], firstMidX, firstMidY);
        context.closePath();

        // Soft, feathered transparent perimeter falloff (only soft circle edges, full reveal clarity inside)
        const grad = context.createRadialGradient(cx, cy, 0, cx, cy, Math.max(2, r * 1.10));
        grad.addColorStop(0, `rgba(255, 255, 255, ${alpha})`);
        grad.addColorStop(0.70, `rgba(255, 255, 255, ${alpha * 0.88})`);
        grad.addColorStop(0.92, `rgba(255, 255, 255, ${alpha * 0.35})`);
        grad.addColorStop(1, 'rgba(255, 255, 255, 0)');
        context.fillStyle = grad;
        context.fill();
      }
    };

    const getFlowerPoint = (clientX: number, clientY: number): { x: number; y: number } | null => {
      const layer = topLayerRef.current;
      const image = flowerImage;
      if (!layer || !image || !flowerAlphaData || !flowerAlphaWidth || !flowerAlphaHeight) return null;

      const layerRect = layer.getBoundingClientRect();
      const imageRect = image.getBoundingClientRect();
      const boxX = clientX - imageRect.left;
      const boxY = clientY - imageRect.top;
      if (boxX < 0 || boxY < 0 || boxX > imageRect.width || boxY > imageRect.height) return null;

      // The image uses object-contain/object-top. Recreate that mapping before
      // sampling the source alpha bitmap, including letterboxed side padding.
      const scale = Math.min(imageRect.width / flowerAlphaWidth, imageRect.height / flowerAlphaHeight);
      const drawnWidth = flowerAlphaWidth * scale;
      const imageX = (imageRect.width - drawnWidth) / 2;
      const imageY = 0;
      const sourceX = Math.floor((boxX - imageX) / scale);
      const sourceY = Math.floor((boxY - imageY) / scale);
      if (sourceX < 0 || sourceY < 0 || sourceX >= flowerAlphaWidth || sourceY >= flowerAlphaHeight) return null;

      // Sample a tiny neighborhood to keep anti-aliased petal edges from
      // toggling the reveal on/off and producing a visible shimmer.
      let maxAlpha = 0;
      for (let offsetY = -2; offsetY <= 2; offsetY++) {
        for (let offsetX = -2; offsetX <= 2; offsetX++) {
          const sampleX = Math.min(flowerAlphaWidth - 1, Math.max(0, sourceX + offsetX));
          const sampleY = Math.min(flowerAlphaHeight - 1, Math.max(0, sourceY + offsetY));
          maxAlpha = Math.max(maxAlpha, flowerAlphaData[(sampleY * flowerAlphaWidth + sampleX) * 4 + 3]);
        }
      }
      if (maxAlpha < FLOWER_ALPHA_THRESHOLD) return null;

      return {
        x: ((clientX - layerRect.left) / Math.max(1, layerRect.width)) * maskCanvas.width,
        y: ((clientY - layerRect.top) / Math.max(1, layerRect.height)) * maskCanvas.height,
      };
    };

    const beginReveal = (point: { x: number; y: number }) => {
      mousePos = point;
      hovering = true;
      releaseScheduled = false;
      releaseAt = 0;
      startLoop();
    };

    const beginRelease = () => {
      const isActive = hovering || headRadius > 0.5 || points.length > 0;
      if (isActive && !releaseScheduled) {
        releaseScheduled = true;
        releaseAt = performance.now() + REVEAL_RELEASE_DELAY_MS;
      }
      hovering = false;
      mousePos = { x: -9999, y: -9999 };
      lastX = -9999;
      lastY = -9999;
      // Hide the disease layer immediately on an invalid/outside pointer. The
      // healthy layer can still ease back through its inverse mask, but a
      // stale or not-yet-uploaded mask can never flash the full red flower.
      if (topLayerRef.current) {
        topLayerRef.current.style.opacity = '0';
      }
      startLoop();
    };

    const updateMouseReveal = (clientX: number, clientY: number) => {
      const point = getFlowerPoint(clientX, clientY);
      if (point) {
        beginReveal(point);
      } else {
        beginRelease();
      }
    };

    const handleMouseMove = (e: MouseEvent) => updateMouseReveal(e.clientX, e.clientY);
    const handleMouseEnter = (e: MouseEvent) => updateMouseReveal(e.clientX, e.clientY);
    const handleMouseLeave = () => beginRelease();

    let touchStartX = 0;
    let touchStartY = 0;
    let isVerticalSwipe = false;
    let touchRevealActive = false;

    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 0) return;
      const touch = e.touches[0];
      touchStartX = touch.clientX;
      touchStartY = touch.clientY;
      isVerticalSwipe = false;
      const point = getFlowerPoint(touch.clientX, touch.clientY);
      touchRevealActive = Boolean(point);
      if (!point) {
        beginRelease();
        return; // A touch outside the flower remains a native scroll gesture.
      }
      mousePos = point;
      smoothX = point.x;
      smoothY = point.y;
      beginReveal(point);
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!touchRevealActive || e.touches.length === 0) return;
      const touch = e.touches[0];

      // Yield to native scroll for clear vertical swipes.
      const deltaX = Math.abs(touch.clientX - touchStartX);
      const deltaY = Math.abs(touch.clientY - touchStartY);
      if (deltaY > 22 && deltaY > deltaX * 1.8) {
        isVerticalSwipe = true;
        touchRevealActive = false;
        beginRelease();
        return;
      }
      if (isVerticalSwipe) return;

      const point = getFlowerPoint(touch.clientX, touch.clientY);
      if (!point) {
        touchRevealActive = false;
        beginRelease();
        return;
      }

      // Horizontal / reveal drag: prevent page scroll only after we know the
      // gesture started on the flower and is not a vertical page swipe.
      e.preventDefault();
      mousePos = point;
      if (smoothX === -9999 || smoothY === -9999) {
        smoothX = point.x;
        smoothY = point.y;
      }
      beginReveal(point);
    };

    const handleTouchEnd = () => {
      touchRevealActive = false;
      hovering = false;
      isVerticalSwipe = false;
      beginRelease();
    };

    const handleWindowScroll = () => {
      if (hovering) beginRelease();
    };
    window.addEventListener('scroll', handleWindowScroll, { passive: true });

    const stage = stageRef.current;
    if (stage) {
      stage.addEventListener('mousemove', handleMouseMove, { passive: true });
      stage.addEventListener('mouseenter', handleMouseEnter, { passive: true });
      stage.addEventListener('mouseleave', handleMouseLeave, { passive: true });
      stage.addEventListener('touchstart', handleTouchStart, { passive: true });
      stage.addEventListener('touchmove', handleTouchMove, { passive: false });
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

    const scaledHeadR = isMobileDevice ? TRAIL_HEAD_R * 0.55 : TRAIL_HEAD_R * 0.64;

    let wasIdle = false;

    const renderLoop = () => {
      if (!isPageVisible || !isIntersecting) {
        animFrameId = 0;
        return;
      }

      const now = performance.now();
      // Drive the fluid edge from elapsed time rather than a fixed frame step,
      // so it stays consistent on 30fps Android devices and 60/120fps desktop.
      time += Math.min(0.05, Math.max(0, (now - previousFrameTime) / 1000));
      previousFrameTime = now;
      const holdingRelease = !hovering && releaseScheduled && now < releaseAt;
      const targetR = hovering ? scaledHeadR : holdingRelease ? headRadius : 0;
      headRadius += (targetR - headRadius) * (hovering ? 0.32 : 0.12);

      // Ultra-smooth spring cursor interpolation
      if (hovering && mousePos.x !== -9999) {
        wasIdle = false;
        if (smoothX === -9999) {
          smoothX = mousePos.x;
          smoothY = mousePos.y;
        } else {
          smoothX += (mousePos.x - smoothX) * 0.36;
          smoothY += (mousePos.y - smoothY) * 0.36;
        }

        // Add trailing points with fluid spacing
        const dist = Math.hypot(smoothX - lastX, smoothY - lastY);
        const trailSampleDistance = useCssReveal ? (isMobileDevice ? TRAIL_SAMPLE_DIST * 3 : 6) : 3.5;
        if (dist >= trailSampleDistance && headRadius > 2) {
          points.push({
            x: smoothX,
            y: smoothY,
            r: headRadius * (useCssReveal ? 0.78 : 0.90),
            alpha: useCssReveal ? 0.78 : 0.96,
            seed: Math.random() * 100
          });
          const maxPoints = useCssReveal ? (isMobileDevice ? 7 : 12) : TRAIL_MAX_POINTS;
          if (points.length > maxPoints) {
            points.shift();
          }
          lastX = smoothX;
          lastY = smoothY;
        }
      }

      // In-place decay: 0 garbage collection allocations per frame!
      // Slightly extended linger wake on mobile touch for richer visibility; crisp decay on PC
      const fadeSpeed = isMobileDevice ? 0.962 : TRAIL_FADE_SPEED;
      const radiusDecay = isMobileDevice ? 0.996 : 0.994;

      for (let i = points.length - 1; i >= 0; i--) {
        const p = points[i];
        p.alpha *= fadeSpeed;
        p.r *= radiusDecay;
        if (p.alpha <= 0.01 || p.r <= 1) {
          points.splice(i, 1);
        }
      }

      if (maskCanvas.width > 0 && maskCanvas.height > 0) {
        if (points.length === 0 && !hovering && headRadius < 0.5) {
          if (!wasIdle) {
            wasIdle = true;
            releaseScheduled = false;
            releaseAt = 0;
            if (topLayerRef.current) {
              topLayerRef.current.style.opacity = '0';
              topLayerRef.current.style.maskImage = 'none';
              topLayerRef.current.style.webkitMaskImage = 'none';
            }
            if (cutoutLayerRef.current) {
              cutoutLayerRef.current.style.opacity = '0';
              cutoutLayerRef.current.style.maskImage = 'none';
              cutoutLayerRef.current.style.webkitMaskImage = 'none';
            }
            if (baseLayerRef.current) {
              baseLayerRef.current.style.maskImage = 'none';
              baseLayerRef.current.style.webkitMaskImage = 'none';
            }
          }
          animFrameId = 0;
          return;
        } else {
          wasIdle = false;

          // Fine pointers use the richer canvas trail. CSS reveal devices skip
          // this work entirely and build their lightweight gradient trail below.
          if (!useCssReveal) {
            ctx.clearRect(0, 0, maskCanvas.width, maskCanvas.height);

            // 1. Draw decaying trailing morph blobs with feathered transparency
            for (let i = 0; i < points.length; i++) {
              const p = points[i];
              drawMorphBlob(ctx, p.x, p.y, p.r, time, p.seed, p.alpha);
            }

            // 2. Draw persistent active head morph blob with feathered transparency
            if (hovering && headRadius > 1 && smoothX !== -9999) {
              drawMorphBlob(ctx, smoothX, smoothY, headRadius, time, 42, 1.0);
            }
          }

          // Touch devices use a native CSS radial mask. It produces the same
          // healthy-to-diseased reveal without serializing a canvas to a new
          // data URL on every frame (a particularly expensive Android path).
          if (useCssReveal && topLayerRef.current && smoothX !== -9999 && now - lastCssMaskUpdate >= 32) {
            lastCssMaskUpdate = now;
            const radiusPx = Math.max(28, headRadius * (layerWidth / maskCanvas.width));
            // Keep the Android-friendly CSS path light while making the head
            // and its short trail share one stable, fluid mask.
            const radiusX = radiusPx * (prefersReducedMotion ? 1 : 1 + Math.sin(time * 1.7 + 0.8) * 0.025);
            const radiusY = radiusPx * (prefersReducedMotion ? 1 : 1 + Math.cos(time * 1.35 - 0.3) * 0.032);
            const x = `${(smoothX / maskCanvas.width) * 100}%`;
            const y = `${(smoothY / maskCanvas.height) * 100}%`;
            const screenToCanvas = maskCanvas.width / Math.max(1, layerWidth);
            const lobeOffsetX = prefersReducedMotion ? 0 : Math.sin(time * 1.25) * radiusPx * 0.08;
            const lobeOffsetY = prefersReducedMotion ? 0 : Math.cos(time * 1.05) * radiusPx * 0.06;
            const lobeX = `${((smoothX + lobeOffsetX * screenToCanvas) / maskCanvas.width) * 100}%`;
            const lobeY = `${((smoothY + lobeOffsetY * screenToCanvas) / maskCanvas.height) * 100}%`;
            const maskLayers = [
              `radial-gradient(ellipse ${radiusX}px ${radiusY}px at ${x} ${y}, #fff 0%, #fff 62%, transparent 100%)`,
              `radial-gradient(ellipse ${radiusX * 0.46}px ${radiusY * 0.58}px at ${lobeX} ${lobeY}, rgba(255,255,255,0.72) 0%, rgba(255,255,255,0.42) 55%, transparent 100%)`
            ];

            // CSS gradients provide a low-cost mobile trail. It avoids canvas
            // serialization while still letting the diseased layer follow the
            // pointer with a soft, organic wake.
            for (let i = points.length - 1; i >= 0; i--) {
              const trail = points[i];
              const trailRadius = Math.max(10, trail.r * (layerWidth / maskCanvas.width) * 0.68);
              const trailX = `${(trail.x / maskCanvas.width) * 100}%`;
              const trailY = `${(trail.y / maskCanvas.height) * 100}%`;
              const trailAlpha = Math.max(0.12, Math.min(0.72, trail.alpha * 0.72));
              maskLayers.push(
                `radial-gradient(ellipse ${trailRadius}px ${trailRadius * 0.86}px at ${trailX} ${trailY}, rgba(255,255,255,${trailAlpha}) 0%, rgba(255,255,255,${trailAlpha * 0.68}) 58%, transparent 100%)`
              );
            }
            const cssMask = maskLayers.join(', ');
            topLayerRef.current.style.maskImage = cssMask;
            topLayerRef.current.style.webkitMaskImage = cssMask;
            topLayerRef.current.style.setProperty('mask-composite', 'add');
            topLayerRef.current.style.setProperty('-webkit-mask-composite', 'source-over');
            topLayerRef.current.style.maskSize = '100% 100%';
            topLayerRef.current.style.webkitMaskSize = '100% 100%';
            topLayerRef.current.style.maskRepeat = 'no-repeat';
            topLayerRef.current.style.webkitMaskRepeat = 'no-repeat';
            topLayerRef.current.style.opacity = hovering ? '1' : '0';

            // A dark cutout sits between the healthy and diseased flowers.
            // It hides the healthy layer under every head/trail lobe, so
            // transparent disease holes reach the site background instead of
            // revealing healthy petals underneath.
            if (cutoutLayerRef.current) {
              cutoutLayerRef.current.style.maskImage = cssMask;
              cutoutLayerRef.current.style.webkitMaskImage = cssMask;
              cutoutLayerRef.current.style.setProperty('mask-composite', 'add');
              cutoutLayerRef.current.style.setProperty('-webkit-mask-composite', 'source-over');
              cutoutLayerRef.current.style.maskSize = '100% 100%';
              cutoutLayerRef.current.style.webkitMaskSize = '100% 100%';
              cutoutLayerRef.current.style.maskRepeat = 'no-repeat';
              cutoutLayerRef.current.style.webkitMaskRepeat = 'no-repeat';
              cutoutLayerRef.current.style.opacity = '1';
            }
            if (baseLayerRef.current) {
              baseLayerRef.current.style.maskImage = 'none';
              baseLayerRef.current.style.webkitMaskImage = 'none';
            }
          } else if (!useCssReveal && performance.now() - lastMaskUpload >= 32) {
            // Desktop keeps the richer organic trail, but uploads the mask at
            // 30fps instead of paying for two toDataURL calls at 60fps.
            lastMaskUpload = performance.now();
            const dataUrl = maskCanvas.toDataURL();

            if (topLayerRef.current) {
              topLayerRef.current.style.maskImage = `url(${dataUrl})`;
              topLayerRef.current.style.webkitMaskImage = `url(${dataUrl})`;
              topLayerRef.current.style.maskSize = '100% 100%';
              topLayerRef.current.style.webkitMaskSize = '100% 100%';
              topLayerRef.current.style.maskRepeat = 'no-repeat';
              topLayerRef.current.style.webkitMaskRepeat = 'no-repeat';
              topLayerRef.current.style.opacity = hovering ? '1' : '0';
            }

            // The inverse mask keeps the healthy layer from doubling beneath
            // the pathology layer on fine-pointer desktop displays.
            if (invCtx && baseLayerRef.current) {
              invCtx.clearRect(0, 0, invCanvas.width, invCanvas.height);
              invCtx.fillStyle = '#ffffff';
              invCtx.fillRect(0, 0, invCanvas.width, invCanvas.height);
              invCtx.globalCompositeOperation = 'destination-out';
              invCtx.drawImage(maskCanvas, 0, 0);
              invCtx.globalCompositeOperation = 'source-over';

              const invDataUrl = invCanvas.toDataURL();
              baseLayerRef.current.style.maskImage = `url(${invDataUrl})`;
              baseLayerRef.current.style.webkitMaskImage = `url(${invDataUrl})`;
              baseLayerRef.current.style.maskSize = '100% 100%';
              baseLayerRef.current.style.webkitMaskSize = '100% 100%';
              baseLayerRef.current.style.maskRepeat = 'no-repeat';
              baseLayerRef.current.style.webkitMaskRepeat = 'no-repeat';
            }
          }
        }
      }

      animFrameId = requestAnimationFrame(renderLoop);
    };

    startLoop();

    return () => {
      stopLoop();
      window.removeEventListener('scroll', handleWindowScroll);
      clearTimeout(resizeTimer);
      window.removeEventListener('resize', debouncedResize);
      flowerImage?.removeEventListener('load', refreshFlowerAlpha);
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
    const target = document.getElementById('features-section');
    if (!target) return;
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <section 
      ref={stageRef}
      className="relative w-full h-[calc(100dvh-4.5rem)] md:h-[calc(100dvh-5rem)] max-h-[calc(100dvh-4.5rem)] md:max-h-[calc(100dvh-5rem)] flex flex-col justify-between overflow-hidden select-none box-border px-4 sm:px-8 pb-3 sm:pb-4 transform-gpu touch-pan-y"
    >
      {/* 1. Full-Stage Background Depth Wordmark + Lower Flower Border */}
      <div className="absolute inset-0 flex items-center justify-center overflow-hidden pointer-events-none z-10">
        
        {/* ✨ CLEAN STEADY EDITORIAL WORDMARK: PLANTDOC (Positioned higher above flower) */}
        <div className="absolute top-[12%] sm:top-[7%] md:top-[8%] left-0 w-full flex items-center justify-center select-none px-2">
          <h1 
            id="plantdoc-title"
            aria-label="PlantDoc"
            className="text-[clamp(2.2rem,13.5vw,9.5rem)] font-normal tracking-[0.03em] sm:tracking-[0.06em] uppercase leading-none text-center flex items-center justify-center whitespace-nowrap drop-shadow-2xl max-w-full"
            style={{ 
              fontFamily: "'Instrument Serif', 'Playfair Display', Georgia, serif"
            }}
          >
            <span 
              className="inline-block text-white filter drop-shadow-[0_15px_35px_rgba(255,255,255,0.25)]" 
              style={{ transform: 'scaleX(1.04)' }}
            >
              PLANT
            </span>
            <span 
              className="inline-block bg-clip-text text-transparent ml-1.5 sm:ml-3 filter drop-shadow-[0_15px_40px_rgba(45,212,191,0.5)]"
              style={{
                backgroundImage: 'linear-gradient(180deg, #A7F3D0 0%, #34D399 28%, #2DD4BF 60%, #059669 100%)'
              }}
            >
              DOC
            </span>
            <span className="sr-only"> — Instant AI Plant Disease Diagnosis & Precision Foliar Pathology</span>
          </h1>
        </div>

        {/* FLOWER: PERFECTLY CENTERED ANCHORED AT BOTTOM OF 1ST SLIDE */}
        <div 
          ref={flowerContainerRef}
          className="absolute bottom-0 inset-x-0 mx-auto z-20 w-[96vw] sm:w-[78vw] md:w-[66vw] lg:w-[54vw] max-w-[740px] h-[78vh] sm:h-[84vh] md:h-[88vh] max-h-[890px] overflow-hidden flex items-end justify-center pointer-events-auto cursor-crosshair touch-pan-y transform-gpu"
          title="Move cursor or drag finger over the flower to reveal AI pathology layer"
        >
          {/* Synchronized Transformed Image Layer Wrapper */}
          <div className="relative w-full h-full flex items-start justify-center pointer-events-none transform scale-[1.18] translate-y-[22%] sm:scale-[1.08] sm:translate-y-[15%]">
            {/* Base Layer: Front Healthy Foliage (main.webp) with dynamic inverse mask */}
            <div 
              ref={baseLayerRef}
              className="w-full h-full flex items-start justify-center will-change-[mask-image]"
            >
              <img 
                src="/main.webp" 
                alt="Healthy botanical specimen with vibrant green chlorophyll leaf structure"
                className="w-full h-full object-contain object-top filter drop-shadow-[0_25px_60px_rgba(0,0,0,0.9)] mx-auto block"
                loading="eager"
                fetchPriority="high"
                decoding="async"
              />
            </div>

            {/* Mobile/reduced-motion cutout: masks the healthy flower beneath
                the complete fluid head and trail without extra canvas uploads. */}
            <div
              ref={cutoutLayerRef}
              aria-hidden="true"
              className="absolute inset-0 pointer-events-none bg-[#020604]"
              style={{ opacity: 0 }}
            />

            {/* Reveal Top Layer: Diseased Foliage (main_disease.webp) Morph Masked (100% 1:1 Cursor Centered) */}
            <div 
              ref={topLayerRef}
              className="absolute inset-0 w-full h-full flex items-start justify-center pointer-events-none will-change-[mask-image,opacity]"
              style={{ opacity: 0 }}
            >
              <img 
                src="/main_disease.webp" 
                alt="Diseased botanical specimen displaying foliar lesions and chlorosis under AI vision inspection"
                className="w-full h-full object-contain object-top filter brightness-[1.03] contrast-[1.08] saturate-[1.14] drop-shadow-[0_25px_60px_rgba(0,0,0,0.9)] mx-auto block"
                loading="lazy"
                fetchPriority="low"
                decoding="async"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Spacer to push foreground controls to the bottom */}
      <div className="flex-1" />

      {/* A compact, readable promise for narrow screens where the corner copy is hidden. */}
      <div className="relative z-30 mx-auto mb-2 flex items-center gap-2 rounded-full border border-white/15 bg-black/50 px-3 py-1.5 text-[10px] font-medium tracking-wide text-white/75 backdrop-blur-md sm:hidden">
        <span className="h-1.5 w-1.5 rounded-full bg-[#2DD4BF] shadow-[0_0_10px_#2DD4BF]" aria-hidden="true" />
        AI leaf disease diagnosis · photo-first guidance
      </div>

      {/* Two Elevated Action Buttons (Pushed to left & right with wide central gap) */}
      <div className="relative z-30 flex flex-row items-center justify-between w-full max-w-[320px] sm:max-w-[500px] md:max-w-[560px] mx-auto mb-2 sm:mb-3 pb-0.5 px-1 pointer-events-auto">
        {/* Button 1: Diagnose Plant Photo (Turquoise-Emerald Beacon) */}
        <Button 
          asChild 
          className="relative group overflow-hidden bg-gradient-to-r from-[#2DD4BF] via-[#10B981] to-[#059669] hover:from-[#5EEAD4] hover:via-[#34D399] hover:to-[#10B981] text-black font-extrabold px-3.5 sm:px-7 md:px-8 py-2.5 sm:py-4 md:py-5 rounded-full shadow-[0_0_30px_rgba(45,212,191,0.55)] transition-all duration-300 hover:scale-105 hover:shadow-[0_0_50px_rgba(45,212,191,0.9)] text-[11px] sm:text-sm md:text-base border border-[#5EEAD4]/60 cursor-pointer shrink-0"
        >
          <Link to="/diagnose" className="flex items-center justify-center gap-1.5 sm:gap-2 whitespace-nowrap">
            <Scan className="h-3.5 sm:h-4.5 md:h-5 w-3.5 sm:w-4.5 md:w-5 transition-transform duration-300 group-hover:rotate-90 group-hover:scale-110" />
            <span className="tracking-tight sm:tracking-wide font-bold">Diagnose Plant</span>
          </Link>
        </Button>

        {/* Button 2: Plant Recommendations (Flower Accent Glassmorphism) */}
        <Button 
          asChild 
          variant="outline" 
          className="relative group overflow-hidden bg-black/60 hover:bg-black/85 text-white font-semibold px-3.5 sm:px-7 md:px-8 py-2.5 sm:py-4 md:py-5 rounded-full backdrop-blur-2xl transition-all duration-300 hover:scale-105 text-[11px] sm:text-sm md:text-base border border-white/20 hover:border-[#2DD4BF]/60 hover:text-[#5EEAD4] shadow-[0_4px_20px_rgba(0,0,0,0.5)] hover:shadow-[0_0_30px_rgba(45,212,191,0.4)] cursor-pointer shrink-0"
        >
          <Link to="/recommend" className="flex items-center justify-center gap-1.5 sm:gap-2 whitespace-nowrap">
            <Wand2 className="h-3.5 sm:h-4.5 md:h-5 w-3.5 sm:w-4.5 md:w-5 text-[#2DD4BF] transition-transform duration-300 group-hover:scale-125 group-hover:rotate-12" />
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

        {/* Center Scroll Prompt (Luxury Liquid Glassmorphism Pill - Enhanced on PC) */}
        <button 
          onClick={scrollToNextSection}
          className="pointer-events-auto mx-auto h-7 sm:h-8 md:h-9 px-4 sm:px-5 md:px-6 flex items-center gap-1.5 sm:gap-2 text-white/90 hover:text-[#5EEAD4] transition-all duration-300 bg-gradient-to-r from-black/60 via-black/40 to-black/60 hover:from-black/80 hover:to-black/80 backdrop-blur-2xl rounded-full border border-white/20 hover:border-[#2DD4BF]/60 shadow-[0_4px_20px_rgba(0,0,0,0.6),inset_0_1px_1px_rgba(255,255,255,0.25)] group cursor-pointer"
        >
          <span className="relative flex h-1.5 sm:h-2 w-1.5 sm:w-2 shrink-0">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#2DD4BF] opacity-75" />
            <span className="relative inline-flex rounded-full h-1.5 sm:h-2 w-1.5 sm:w-2 bg-[#2DD4BF]" />
          </span>
          <span className="font-sans font-medium text-[10px] sm:text-xs md:text-sm tracking-wide">Explore Platform</span>
          <ChevronDown className="h-3 sm:h-4 w-3 sm:w-4 text-[#2DD4BF] animate-bounce group-hover:translate-y-0.5 transition-transform shrink-0" />
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
