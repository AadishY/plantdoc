import React, { useEffect, useState, useRef, useCallback } from 'react';

/**
 * Custom in-DOM GPU-accelerated scrollbar for PlantDoc AI.
 * Replaces the browser's native Win32/macOS scrollbar to guarantee
 * 100% custom animated cursor coverage across the entire viewport,
 * eliminating the OS default arrow cursor leak on the right edge.
 *
 * Engineered for 120fps hardware-feel responsiveness:
 * - Direct DOM transform updates bypassing React state latency on drag
 * - Zero rubber-band lag with direct 1:1 cursor-to-thumb pinning
 * - Instant track-jump with seamless click-and-drag continuation
 * - Global `.is-dragging-scrollbar` disabling smooth-scroll and text selection
 * - RAF-batched window scroll synchronization
 * - Dynamic ResizeObserver tracking page content size changes
 */
export const CustomScrollbar: React.FC = () => {
  const [canScroll, setCanScroll] = useState(false);
  const [thumbHeight, setThumbHeight] = useState(48);
  const [isHovered, setIsHovered] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const trackRef = useRef<HTMLDivElement>(null);
  const thumbRef = useRef<HTMLDivElement>(null);
  const isDraggingRef = useRef(false);
  const dragStartPointerOffsetYRef = useRef(0);
  const thumbHeightRef = useRef(48);
  const rafIdRef = useRef<number | null>(null);

  // Keep thumbHeightRef in sync with state
  useEffect(() => {
    thumbHeightRef.current = thumbHeight;
  }, [thumbHeight]);

  const getMetrics = useCallback(() => {
    if (typeof window === 'undefined') {
      return { clientHeight: 0, scrollHeight: 0, scrollable: 0, calculatedThumbHeight: 48, maxThumbTop: 0 };
    }
    const doc = document.documentElement;
    const clientHeight = window.innerHeight || doc.clientHeight;
    const scrollHeight = Math.max(
      doc.scrollHeight,
      document.body.scrollHeight,
      doc.offsetHeight,
      document.body.offsetHeight,
      clientHeight
    );
    const scrollable = scrollHeight - clientHeight;
    const minThumbHeight = 44;
    const calculatedThumbHeight = scrollable <= 10
      ? 0
      : Math.max(minThumbHeight, Math.round((clientHeight / scrollHeight) * clientHeight));
    const maxThumbTop = Math.max(0, clientHeight - calculatedThumbHeight);

    return {
      clientHeight,
      scrollHeight,
      scrollable,
      calculatedThumbHeight,
      maxThumbTop,
    };
  }, []);

  // Update thumb position directly in DOM from current window scroll position
  const updateThumbFromScroll = useCallback(() => {
    if (isDraggingRef.current || !thumbRef.current) return;
    const { scrollable, maxThumbTop } = getMetrics();
    if (scrollable <= 10 || maxThumbTop <= 0) return;

    const currentScrollY = window.scrollY || document.documentElement.scrollTop || 0;
    const progress = Math.min(1, Math.max(0, currentScrollY / scrollable));
    const thumbTop = Math.round(progress * maxThumbTop);

    thumbRef.current.style.transform = `translate3d(0, ${thumbTop}px, 0)`;
  }, [getMetrics]);

  // Recalculate dimensions when page or window resizes
  const recalculateMetrics = useCallback(() => {
    const { scrollable, calculatedThumbHeight } = getMetrics();
    const hasScroll = scrollable > 10;
    setCanScroll(hasScroll);
    if (hasScroll) {
      setThumbHeight(calculatedThumbHeight);
      updateThumbFromScroll();
    }
  }, [getMetrics, updateThumbFromScroll]);

  // Sync scrollbar on scroll & resize
  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia('(pointer: fine)').matches) {
      return;
    }

    recalculateMetrics();

    const onWindowScroll = () => {
      if (isDraggingRef.current) return;
      if (rafIdRef.current !== null) return;
      rafIdRef.current = requestAnimationFrame(() => {
        rafIdRef.current = null;
        updateThumbFromScroll();
      });
    };

    const onWindowResize = () => {
      recalculateMetrics();
    };

    window.addEventListener('scroll', onWindowScroll, { passive: true });
    window.addEventListener('resize', onWindowResize, { passive: true });

    // Observe document mutations / resizing (e.g. accordion open, image upload, recommendations loaded)
    let resizeObserver: ResizeObserver | null = null;
    if (typeof ResizeObserver !== 'undefined') {
      resizeObserver = new ResizeObserver(() => {
        recalculateMetrics();
      });
      if (document.body) resizeObserver.observe(document.body);
      if (document.documentElement) resizeObserver.observe(document.documentElement);
    }

    return () => {
      window.removeEventListener('scroll', onWindowScroll);
      window.removeEventListener('resize', onWindowResize);
      if (resizeObserver) resizeObserver.disconnect();
      if (rafIdRef.current !== null) {
        cancelAnimationFrame(rafIdRef.current);
        rafIdRef.current = null;
      }
    };
  }, [recalculateMetrics, updateThumbFromScroll]);

  // Drag move logic: instantaneous 120fps direct transform & scrollTo
  const handleDragMove = useCallback((clientY: number) => {
    const { scrollable, maxThumbTop } = getMetrics();
    if (scrollable <= 0 || maxThumbTop <= 0 || !thumbRef.current) return;

    const grabOffset = dragStartPointerOffsetYRef.current;
    const desiredThumbTop = clientY - grabOffset;
    const clampedThumbTop = Math.max(0, Math.min(maxThumbTop, desiredThumbTop));

    // 1. Instantly update thumb DOM in the same frame
    thumbRef.current.style.transform = `translate3d(0, ${clampedThumbTop}px, 0)`;

    // 2. Instantly update window scroll with behavior: 'auto'
    const scrollRatio = clampedThumbTop / maxThumbTop;
    const targetScrollY = Math.round(scrollRatio * scrollable);

    window.scrollTo({
      top: targetScrollY,
      behavior: 'auto',
    });
  }, [getMetrics]);

  // Initiate dragging
  const startDragging = useCallback((clientY: number, grabOffset: number) => {
    isDraggingRef.current = true;
    setIsDragging(true);
    dragStartPointerOffsetYRef.current = grabOffset;

    document.documentElement.classList.add('is-dragging-scrollbar');

    const onMouseMove = (moveEvent: MouseEvent) => {
      if (!isDraggingRef.current) return;
      moveEvent.preventDefault();
      handleDragMove(moveEvent.clientY);
    };

    const onMouseUp = () => {
      isDraggingRef.current = false;
      setIsDragging(false);
      document.documentElement.classList.remove('is-dragging-scrollbar');

      window.removeEventListener('mousemove', onMouseMove, { capture: true });
      window.removeEventListener('mouseup', onMouseUp, { capture: true });
    };

    window.addEventListener('mousemove', onMouseMove, { capture: true, passive: false });
    window.addEventListener('mouseup', onMouseUp, { capture: true });
  }, [handleDragMove]);

  // Handle thumb mousedown
  const handleThumbMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();

    const thumbRect = thumbRef.current?.getBoundingClientRect();
    const grabOffset = thumbRect ? (e.clientY - thumbRect.top) : (thumbHeightRef.current / 2);

    startDragging(e.clientY, grabOffset);
  };

  // Handle track mousedown: jump to click position and seamlessly continue dragging
  const handleTrackMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    // If clicked directly on the thumb, thumb handler manages it
    if (e.target === thumbRef.current || thumbRef.current?.contains(e.target as Node)) {
      return;
    }

    e.preventDefault();
    e.stopPropagation();

    const { scrollable, maxThumbTop } = getMetrics();
    const currentHeight = thumbHeightRef.current;
    if (scrollable <= 0 || maxThumbTop <= 0) return;

    // Center thumb at the click position
    const clickY = e.clientY;
    const desiredThumbTop = clickY - currentHeight / 2;
    const clampedThumbTop = Math.max(0, Math.min(maxThumbTop, desiredThumbTop));

    // Update thumb DOM immediately
    if (thumbRef.current) {
      thumbRef.current.style.transform = `translate3d(0, ${clampedThumbTop}px, 0)`;
    }

    // Update window scroll
    const scrollRatio = clampedThumbTop / maxThumbTop;
    const targetScrollY = Math.round(scrollRatio * scrollable);
    window.scrollTo({
      top: targetScrollY,
      behavior: 'auto',
    });

    // Seamlessly initiate drag from this click position
    startDragging(e.clientY, currentHeight / 2);
  };

  if (!canScroll) return null;

  return (
    <div
      className="fixed top-0 right-0 h-screen w-4.5 z-[9999] pointer-events-auto select-none transition-opacity duration-300"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      title="Scroll"
    >
      {/* Scrollbar Track & Click Area */}
      <div
        ref={trackRef}
        className="relative h-full w-full flex justify-end items-stretch pr-0.5 cursor-pointer"
        onMouseDown={handleTrackMouseDown}
      >
        {/* Subtle Frosted Track Groove */}
        <div
          className={`absolute inset-y-1 right-0.5 rounded-full transition-all duration-200 border border-white/5 backdrop-blur-sm ${
            isHovered || isDragging
              ? 'w-2.5 bg-black/60 shadow-[inset_0_0_8px_rgba(0,0,0,0.8)]'
              : 'w-1.5 bg-black/25'
          }`}
        />

        {/* Draggable Scrollbar Thumb */}
        <div
          ref={thumbRef}
          className={`absolute right-0.5 rounded-full cursor-grab active:cursor-grabbing transition-[width,background,box-shadow,opacity] duration-150 ${
            isDragging
              ? 'w-3 bg-gradient-to-b from-[#5EEAD4] via-[#2DD4BF] to-[#10B981] shadow-[0_0_16px_rgba(45,212,191,0.9),inset_0_1px_1px_rgba(255,255,255,0.6)] opacity-100'
              : isHovered
              ? 'w-2.5 bg-gradient-to-b from-[#34D399] via-[#2DD4BF] to-[#059669] shadow-[0_0_12px_rgba(45,212,191,0.7),inset_0_1px_1px_rgba(255,255,255,0.4)] opacity-95'
              : 'w-1.5 bg-gradient-to-b from-[#2DD4BF]/70 to-[#10B981]/80 shadow-[0_0_6px_rgba(16,185,129,0.35)] opacity-80 hover:opacity-100'
          }`}
          style={{
            height: `${thumbHeight}px`,
            transform: 'translate3d(0, 0, 0)',
            willChange: 'transform',
          }}
          onMouseDown={handleThumbMouseDown}
        />
      </div>
    </div>
  );
};

export default CustomScrollbar;
