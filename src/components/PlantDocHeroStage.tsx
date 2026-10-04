import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown, Scan, Wand2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface TrailPoint {
  x: number;
  y: number;
  radius: number;
  alpha: number;
  angle: number;
  stretch: number;
  birthTime: number;
}

const FLOWER_ALPHA_THRESHOLD = 16;
const FLOWER_ALPHA_THRESHOLD_HYSTERESIS = 8;
const MAX_TRAIL_POINTS_DESKTOP = 24;
const MAX_TRAIL_POINTS_MOBILE = 16;

/**
 * The landing-stage reveal is an ultra-fluid, GPU-accelerated CSS-mask engine.
 * It simulates an organic fluid droplet / living cellular membrane that morphs
 * with multi-harmonic undulations, stretches dynamically along its velocity vector
 * (conservation of area squash & stretch), and casts an undulating metaball morph
 * trail with continuous sub-segment fluid bridging and viscous neck connectors.
 *
 * Mouse/touch leave immediately dissipates the droplet with smooth exponential
 * decay and inertial drift — zero artificial freeze delay.
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
    const maskUpdateInterval = 16; // 60fps+ cadence for both desktop and mobile
    const trails: TrailPoint[] = [];

    let animationFrame = 0;
    let lastFrame = performance.now();
    let lastMaskUpdate = -Infinity;
    let isPageVisible = !document.hidden;
    let isIntersecting = true;
    let hovering = false;
    let pointerX = -1;
    let pointerY = -1;
    let smoothX = -1;
    let smoothY = -1;
    let prevSmoothX = -1;
    let prevSmoothY = -1;
    let velocityX = 0;
    let velocityY = 0;
    let currentSpeed = 0;
    let motionAngle = 0;
    let lastTrailX = -1;
    let lastTrailY = -1;
    let headRadius = 0;
    let headAlpha = 0;
    let touchStartX = 0;
    let touchStartY = 0;
    let touchStartTime = 0;
    let touchLockDirection: 'none' | 'reveal' | 'scroll' = 'none';
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
      // excluded so the reveal starts only on visible foliage.
      // Hysteresis is applied when already active to eliminate border jitter.
      if (flowerAlpha && flowerWidth && flowerHeight) {
        const scale = Math.min(imageRect.width / flowerWidth, imageRect.height / flowerHeight);
        const drawnWidth = flowerWidth * scale;
        const imageX = (imageRect.width - drawnWidth) / 2;
        const sourceX = Math.floor((boxX - imageX) / scale);
        const sourceY = Math.floor(boxY / scale);
        if (sourceX < 0 || sourceY < 0 || sourceX >= flowerWidth || sourceY >= flowerHeight) return null;

        const isInteracting = hovering || draggingReveal;
        const threshold = isInteracting ? FLOWER_ALPHA_THRESHOLD_HYSTERESIS : (isMobile ? 12 : FLOWER_ALPHA_THRESHOLD);
        const sampleRadius = isMobile ? 4 : 2;

        let maxAlpha = 0;
        for (let offsetY = -sampleRadius; offsetY <= sampleRadius; offsetY += 1) {
          for (let offsetX = -sampleRadius; offsetX <= sampleRadius; offsetX += 1) {
            const sampleX = Math.min(flowerWidth - 1, Math.max(0, sourceX + offsetX));
            const sampleY = Math.min(flowerHeight - 1, Math.max(0, sourceY + offsetY));
            maxAlpha = Math.max(maxAlpha, flowerAlpha[(sampleY * flowerWidth + sampleX) * 4 + 3]);
          }
        }
        if (maxAlpha < threshold) return null;
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
      startLoop();
    };

    // Instant smooth dissipation — never freeze the circle when pointer leaves
    const beginRelease = () => {
      hovering = false;
      startLoop();
    };

    const releaseMasks = () => {
      topLayer.style.opacity = '0';
      topLayer.style.maskImage = 'none';
      topLayer.style.webkitMaskImage = 'none';
      baseLayer.style.maskImage = 'none';
      baseLayer.style.webkitMaskImage = 'none';
      smoothX = -1;
      smoothY = -1;
      prevSmoothX = -1;
      prevSmoothY = -1;
      pointerX = -1;
      pointerY = -1;
      lastTrailX = -1;
      lastTrailY = -1;
      headRadius = 0;
      headAlpha = 0;
      currentSpeed = 0;
      velocityX = 0;
      velocityY = 0;
      trails.length = 0;
    };

    const updateFromPointer = (clientX: number, clientY: number) => {
      const point = getFlowerPoint(clientX, clientY);
      if (point) beginReveal(point);
      else beginRelease();
    };

    const writeMasks = (time: number) => {
      if (!layerRect || smoothX < 0 || smoothY < 0 || headRadius < 0.5 || headAlpha < 0.02) return;

      // 1. Dynamic Fluid Velocity Squash & Stretch (Physics conservation of area)
      const maxStretch = isMobile ? 0.38 : 0.48;
      const stretch = reducedMotion ? 0 : Math.min(maxStretch, currentSpeed * (isMobile ? 0.075 : 0.095));
      const elongation = 1 + stretch;
      const compression = 1 / Math.sqrt(elongation);

      const cosA = Math.cos(motionAngle);
      const sinA = Math.sin(motionAngle);
      const stretchX = elongation * Math.abs(cosA) + compression * Math.abs(sinA);
      const stretchY = elongation * Math.abs(sinA) + compression * Math.abs(cosA);

      // 2. Multi-Harmonic Organic Fluid Membrane Wobble
      const t = time * 0.0022;
      const harmonic1 = Math.sin(t * 1.6) * 0.065;
      const harmonic2 = Math.cos(t * 2.4 + 0.8) * 0.042;
      const harmonic3 = Math.sin(t * 3.3 - 1.2) * 0.024;
      const fluidWobble = reducedMotion ? 0 : (harmonic1 + harmonic2 + harmonic3);

      const radiusX = headRadius * stretchX * (1 + fluidWobble);
      const radiusY = headRadius * stretchY * (1 - fluidWobble * 0.84);

      // 3. Ultra-Smooth Liquid Core with Feathered Cellular Corona (scaled by headAlpha)
      const c1 = (headAlpha * 1.0).toFixed(2);
      const c2 = (headAlpha * 0.96).toFixed(2);
      const c3 = (headAlpha * 0.62).toFixed(2);
      const c4 = (headAlpha * 0.18).toFixed(2);
      const core = `radial-gradient(ellipse ${radiusX.toFixed(1)}px ${radiusY.toFixed(1)}px at ${smoothX.toFixed(2)}% ${smoothY.toFixed(2)}%, rgba(255,255,255,${c1}) 0%, rgba(255,255,255,${c1}) 48%, rgba(255,255,255,${c2}) 66%, rgba(255,255,255,${c3}) 83%, rgba(255,255,255,${c4}) 95%, transparent 100%)`;
      const maskLayers = [core];

      // 4. Fluid Metaball Neck Bridge (connecting head to trail wake seamlessly)
      if (!reducedMotion && trails.length > 0 && currentSpeed > 0.08 && headRadius > 6) {
        const latestTrail = trails[trails.length - 1];
        const bridgeX = (smoothX + latestTrail.x) / 2;
        const bridgeY = (smoothY + latestTrail.y) / 2;
        const bridgeDist = Math.hypot(
          ((smoothX - latestTrail.x) / 100) * (layerRect?.width || 1),
          ((smoothY - latestTrail.y) / 100) * (layerRect?.height || 1)
        );

        // Fluid neck stretches along vector and thins based on velocity
        const neckLength = Math.max(radiusX * 0.7, bridgeDist * 0.85);
        const neckWidth = Math.max(radiusY * 0.45, headRadius * 0.52 * (1 - Math.min(0.4, currentSpeed * 0.08)));
        const bridgeRx = neckLength * Math.abs(cosA) + neckWidth * Math.abs(sinA);
        const bridgeRy = neckLength * Math.abs(sinA) + neckWidth * Math.abs(cosA);
        const bridgeAlpha = Math.min(0.85, (headAlpha * 0.5 + latestTrail.alpha * 0.5) * 0.92);

        maskLayers.push(
          `radial-gradient(ellipse ${bridgeRx.toFixed(1)}px ${bridgeRy.toFixed(1)}px at ${bridgeX.toFixed(2)}% ${bridgeY.toFixed(2)}%, rgba(255,255,255,${bridgeAlpha.toFixed(2)}) 0%, rgba(255,255,255,${(bridgeAlpha * 0.72).toFixed(2)}) 45%, rgba(255,255,255,${(bridgeAlpha * 0.32).toFixed(2)}) 75%, transparent 100%)`
        );
      }

      // 5. Dynamic Satellite Droplets / Organic Morph Lobes
      if (!reducedMotion && headAlpha > 0.15) {
        // Leading drop projection along velocity vector
        if (currentSpeed > 0.12) {
          const leadDist = Math.min(radiusX * 0.42, currentSpeed * 2.5);
          const leadPctX = smoothX + ((cosA * leadDist) / Math.max(1, layerRect.width)) * 100;
          const leadPctY = smoothY + ((sinA * leadDist) / Math.max(1, layerRect.height)) * 100;
          const leadRx = radiusX * (0.42 + Math.min(0.2, currentSpeed * 0.05));
          const leadRy = radiusY * (0.36 + Math.min(0.16, currentSpeed * 0.04));
          const leadA = (0.85 * headAlpha).toFixed(2);
          const leadA2 = (0.48 * headAlpha).toFixed(2);
          maskLayers.push(
            `radial-gradient(ellipse ${leadRx.toFixed(1)}px ${leadRy.toFixed(1)}px at ${leadPctX.toFixed(2)}% ${leadPctY.toFixed(2)}%, rgba(255,255,255,${leadA}) 0%, rgba(255,255,255,${leadA2}) 55%, transparent 100%)`
          );
        }

        // Two lateral undulating breathing lobes
        const lobePhase = t * 1.35;
        const lobe1Angle = motionAngle + Math.PI * 0.52 + Math.sin(lobePhase * 0.9) * 0.4;
        const lobe1Dist = headRadius * (0.34 + Math.sin(t * 2.1) * 0.09);
        const lobe1X = smoothX + ((Math.cos(lobe1Angle) * lobe1Dist) / Math.max(1, layerRect.width)) * 100;
        const lobe1Y = smoothY + ((Math.sin(lobe1Angle) * lobe1Dist) / Math.max(1, layerRect.height)) * 100;
        const lobe1Rx = radiusX * (0.52 + Math.sin(t * 1.8) * 0.07);
        const lobe1Ry = radiusY * (0.44 + Math.cos(t * 1.6) * 0.07);

        const lobe2Angle = motionAngle - Math.PI * 0.52 + Math.cos(lobePhase * 0.85) * 0.4;
        const lobe2Dist = headRadius * (0.32 + Math.cos(t * 1.9) * 0.08);
        const lobe2X = smoothX + ((Math.cos(lobe2Angle) * lobe2Dist) / Math.max(1, layerRect.width)) * 100;
        const lobe2Y = smoothY + ((Math.sin(lobe2Angle) * lobe2Dist) / Math.max(1, layerRect.height)) * 100;
        const lobe2Rx = radiusX * (0.44 + Math.cos(t * 2.0) * 0.06);
        const lobe2Ry = radiusY * (0.50 + Math.sin(t * 1.7) * 0.06);

        const l1A = (0.72 * headAlpha).toFixed(2);
        const l1A2 = (0.42 * headAlpha).toFixed(2);
        const l2A = (0.58 * headAlpha).toFixed(2);
        const l2A2 = (0.30 * headAlpha).toFixed(2);

        maskLayers.push(
          `radial-gradient(ellipse ${lobe1Rx.toFixed(1)}px ${lobe1Ry.toFixed(1)}px at ${lobe1X.toFixed(2)}% ${lobe1Y.toFixed(2)}%, rgba(255,255,255,${l1A}) 0%, rgba(255,255,255,${l1A2}) 58%, transparent 100%)`,
          `radial-gradient(ellipse ${lobe2Rx.toFixed(1)}px ${lobe2Ry.toFixed(1)}px at ${lobe2X.toFixed(2)}% ${lobe2Y.toFixed(2)}%, rgba(255,255,255,${l2A}) 0%, rgba(255,255,255,${l2A2}) 56%, transparent 100%)`
        );
      }

      // 6. Morphing Wake Ripple Trail with Hydrodynamic Taper
      const trailCount = trails.length;
      for (let index = trailCount - 1; index >= 0; index -= 1) {
        const trail = trails[index];
        const age = time - trail.birthTime;
        const ripple = Math.sin(age * 0.009 + index * 0.48) * 0.12 + Math.cos(age * 0.016 + index * 0.3) * 0.06;
        
        // Dynamic taper: latest points near head retain width, older trailing points taper down gracefully
        const taper = Math.pow((index + 1) / trailCount, 0.72);
        const trailElongation = 1 + trail.stretch * 0.7;
        const trailCompression = 1 / Math.sqrt(trailElongation);
        const tCos = Math.cos(trail.angle);
        const tSin = Math.sin(trail.angle);
        const effectiveRadius = trail.radius * (0.7 + 0.3 * taper);
        const trailRx = effectiveRadius * (trailElongation * Math.abs(tCos) + trailCompression * Math.abs(tSin)) * (1 + ripple);
        const trailRy = effectiveRadius * (trailElongation * Math.abs(tSin) + trailCompression * Math.abs(tCos)) * (1 - ripple * 0.75);
        const alpha = Math.max(0.04, trail.alpha * (0.45 + 0.55 * taper));

        const a1 = alpha.toFixed(2);
        const a2 = (alpha * 0.88).toFixed(2);
        const a3 = (alpha * 0.42).toFixed(2);

        maskLayers.push(
          `radial-gradient(ellipse ${trailRx.toFixed(1)}px ${trailRy.toFixed(1)}px at ${trail.x.toFixed(2)}% ${trail.y.toFixed(2)}%, rgba(255,255,255,${a1}) 0%, rgba(255,255,255,${a2}) 38%, rgba(255,255,255,${a3}) 72%, transparent 100%)`
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

      // Synchronized inverse core to prevent healthy tissue from bleeding
      // through transparent eaten-away sections of the pathology specimen
      if (headAlpha < 0.02) {
        baseLayer.style.maskImage = 'none';
        baseLayer.style.webkitMaskImage = 'none';
      } else {
        const invInner = (58 * headAlpha).toFixed(1);
        const invOuter = (90 * headAlpha + 10 * (1 - headAlpha)).toFixed(1);
        const invMidAlpha = (0.85 * headAlpha + (1 - headAlpha)).toFixed(2);
        const inverseMask = `radial-gradient(ellipse ${radiusX.toFixed(1)}px ${radiusY.toFixed(1)}px at ${smoothX.toFixed(2)}% ${smoothY.toFixed(2)}%, transparent 0%, transparent ${invInner}%, rgba(255,255,255,${invMidAlpha}) ${invOuter}%, #fff 100%)`;
        baseLayer.style.maskImage = inverseMask;
        baseLayer.style.webkitMaskImage = inverseMask;
        baseLayer.style.maskSize = '100% 100%';
        baseLayer.style.webkitMaskSize = '100% 100%';
        baseLayer.style.maskRepeat = 'no-repeat';
        baseLayer.style.webkitMaskRepeat = 'no-repeat';
      }
    };

    const renderLoop = (time: number) => {
      animationFrame = 0;
      if (!isPageVisible || !isIntersecting) return;

      const frameScale = Math.min(3, Math.max(0.5, (time - lastFrame) / 16.67));
      lastFrame = time;

      // Generous, clear inspection radius across desktop and mobile screens
      const minDimension = Math.min(layerRect?.width || 0, layerRect?.height || 0);
      const normalRadius = isMobile
        ? Math.max(54, Math.min(88, minDimension * 0.16))
        : Math.max(68, Math.min(115, minDimension * 0.13));

      if (hovering) {
        // Active pointer tracking on the leaf
        const headEase = 1 - Math.pow(0.72, frameScale);
        headRadius += (normalRadius - headRadius) * headEase;
        headAlpha += (1 - headAlpha) * (1 - Math.pow(0.65, frameScale));

        if (pointerX >= 0 && pointerY >= 0) {
          if (smoothX < 0 || smoothY < 0) {
            smoothX = pointerX;
            smoothY = pointerY;
            prevSmoothX = pointerX;
            prevSmoothY = pointerY;
          } else {
            prevSmoothX = smoothX;
            prevSmoothY = smoothY;
            const pointerEase = 1 - Math.pow(isMobile ? 0.44 : 0.48, frameScale);
            smoothX += (pointerX - smoothX) * pointerEase;
            smoothY += (pointerY - smoothY) * pointerEase;

            // Track instantaneous directional velocity vector
            const dx = smoothX - prevSmoothX;
            const dy = smoothY - prevSmoothY;
            velocityX = velocityX * 0.65 + dx * 0.35;
            velocityY = velocityY * 0.65 + dy * 0.35;
            currentSpeed = Math.hypot(velocityX, velocityY);
            if (currentSpeed > 0.06) {
              motionAngle = Math.atan2(velocityY, velocityX);
            }
          }

          // Sub-segment densified fluid bridging for seamless continuous trails
          const distance = Math.hypot(smoothX - lastTrailX, smoothY - lastTrailY);
          const minStep = isMobile ? 0.75 : 0.55;
          const maxStep = 2.4;

          if (distance >= minStep && headRadius > 3 && !reducedMotion) {
            const steps = Math.min(4, Math.max(1, Math.floor(distance / maxStep)));
            const maxStretch = isMobile ? 0.38 : 0.48;
            const stretch = Math.min(maxStretch, currentSpeed * (isMobile ? 0.075 : 0.095));

            for (let s = 1; s <= steps; s++) {
              const ratio = s / steps;
              const interX = lastTrailX + (smoothX - lastTrailX) * ratio;
              const interY = lastTrailY + (smoothY - lastTrailY) * ratio;
              trails.push({
                x: interX,
                y: interY,
                radius: headRadius * (0.94 - (1 - ratio) * 0.08),
                alpha: 0.84,
                angle: motionAngle,
                stretch,
                birthTime: time
              });
            }

            const maxPoints = isMobile ? MAX_TRAIL_POINTS_MOBILE : MAX_TRAIL_POINTS_DESKTOP;
            while (trails.length > maxPoints) trails.shift();
            lastTrailX = smoothX;
            lastTrailY = smoothY;
          }
        }
      } else {
        // Mouse left the plant: IMMEDIATE fluid evaporation with NO freeze!
        headRadius *= Math.pow(0.79, frameScale);
        headAlpha *= Math.pow(0.80, frameScale);

        // Inertial fluid glide: let the dissolving droplet gently coast along motion vector
        if (currentSpeed > 0.04 && layerRect) {
          currentSpeed *= Math.pow(0.86, frameScale);
          smoothX += ((Math.cos(motionAngle) * currentSpeed * 0.3) / Math.max(1, layerRect.width)) * 100;
          smoothY += ((Math.sin(motionAngle) * currentSpeed * 0.3) / Math.max(1, layerRect.height)) * 100;
        }

        if (headRadius < 0.8 || headAlpha < 0.02) {
          headRadius = 0;
          headAlpha = 0;
        }
      }

      // Smooth frame-scaled trail dissipation
      const fade = Math.pow(isMobile ? 0.91 : 0.88, frameScale);
      for (let index = trails.length - 1; index >= 0; index -= 1) {
        const trail = trails[index];
        trail.alpha *= fade;
        trail.radius *= Math.pow(0.99, frameScale);
        trail.stretch *= Math.pow(0.92, frameScale);
        if (trail.alpha < 0.02 || trail.radius < 2) trails.splice(index, 1);
      }

      const hasReveal = (headRadius > 0.5 && headAlpha > 0.02) || trails.length > 0;
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

    // High-precision, zero-jank mobile touch interaction
    const handleTouchStart = (event: TouchEvent) => {
      const touch = event.touches[0];
      if (!touch) return;
      touchStartX = touch.clientX;
      touchStartY = touch.clientY;
      touchStartTime = performance.now();
      touchLockDirection = 'none';

      const point = getFlowerPoint(touch.clientX, touch.clientY);
      if (point) {
        draggingReveal = true;
        touchLockDirection = 'reveal';
        beginReveal(point);
      } else {
        draggingReveal = false;
      }
    };

    const handleTouchMove = (event: TouchEvent) => {
      const touch = event.touches[0];
      if (!touch) return;

      const deltaX = Math.abs(touch.clientX - touchStartX);
      const deltaY = Math.abs(touch.clientY - touchStartY);

      // Determine initial intent in early movement:
      if (touchLockDirection === 'none') {
        const elapsed = performance.now() - touchStartTime;
        // Predominant quick vertical flick right at the start yields cleanly to page scroll
        if (elapsed < 140 && deltaY > 24 && deltaY > deltaX * 2.0) {
          touchLockDirection = 'scroll';
          draggingReveal = false;
          beginRelease();
          return;
        } else if (deltaX > 8 || deltaY > 8) {
          touchLockDirection = 'reveal';
        }
      }

      if (touchLockDirection === 'scroll') return;

      if (draggingReveal || touchLockDirection === 'reveal') {
        // Prevent scroll fighting while tracing the botanical specimen
        if (event.cancelable) event.preventDefault();
        updateFromPointer(touch.clientX, touch.clientY);
      }
    };

    const handleTouchEnd = () => {
      draggingReveal = false;
      touchLockDirection = 'none';
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
              className="pointer-events-none absolute inset-0 flex h-full w-full items-start justify-center will-change-[opacity]"
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

      <div className="relative z-30 mx-auto mb-2 flex items-center gap-2 rounded-full border border-white/15 bg-black/60 px-3.5 py-1.5 text-[10px] font-medium tracking-wide text-white/80 shadow-[0_4px_16px_rgba(0,0,0,0.5)] backdrop-blur-md sm:hidden">
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#2DD4BF] opacity-75" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-[#2DD4BF] shadow-[0_0_8px_#2DD4BF]" />
        </span>
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
