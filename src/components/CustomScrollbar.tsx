import React, { useEffect, useState, useRef, useCallback } from 'react';

/**
 * Custom in-DOM GPU-accelerated scrollbar for PlantDoc AI.
 * Replaces the browser's native Win32/macOS scrollbar to guarantee
 * 100% custom animated cursor coverage across the entire viewport,
 * eliminating the OS default arrow cursor leak on the right edge.
 */
export const CustomScrollbar: React.FC = () => {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [thumbHeight, setThumbHeight] = useState(48);
  const [isVisible, setIsVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const isDraggingRef = useRef(false);
  const dragStartYRef = useRef(0);
  const dragStartScrollYRef = useRef(0);
  const hideTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const updateScroll = useCallback(() => {
    if (typeof window === 'undefined') return;
    const doc = document.documentElement;
    const scrollHeight = doc.scrollHeight;
    const clientHeight = doc.clientHeight;
    const scrollable = scrollHeight - clientHeight;

    if (scrollable <= 10) {
      setIsVisible(false);
      return;
    }

    const calculatedThumbHeight = Math.max(36, Math.round((clientHeight / scrollHeight) * clientHeight));
    setThumbHeight(calculatedThumbHeight);

    const maxThumbTop = clientHeight - calculatedThumbHeight;
    const currentProgress = Math.min(1, Math.max(0, window.scrollY / scrollable));
    setScrollProgress(currentProgress * maxThumbTop);

    setIsVisible(true);

    if (!isDraggingRef.current && !isHovered) {
      if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
      hideTimerRef.current = setTimeout(() => {
        if (!isDraggingRef.current && !isHovered) {
          setIsVisible(false);
        }
      }, 1600);
    }
  }, [isHovered]);

  useEffect(() => {
    // Only mount on desktop/pointer: fine devices
    if (typeof window === 'undefined' || !window.matchMedia('(pointer: fine)').matches) {
      return;
    }

    updateScroll();

    const onScroll = () => {
      updateScroll();
    };

    const onResize = () => {
      updateScroll();
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onResize, { passive: true });

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
      if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
    };
  }, [updateScroll]);

  // Handle dragging
  const handleThumbMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
    isDraggingRef.current = true;
    dragStartYRef.current = e.clientY;
    dragStartScrollYRef.current = window.scrollY;

    const onMouseMove = (moveEvent: MouseEvent) => {
      if (!isDraggingRef.current) return;
      moveEvent.preventDefault();
      const deltaY = moveEvent.clientY - dragStartYRef.current;
      const doc = document.documentElement;
      const clientHeight = doc.clientHeight;
      const scrollHeight = doc.scrollHeight;
      const scrollable = scrollHeight - clientHeight;
      const trackSpace = clientHeight - thumbHeight;

      if (trackSpace > 0) {
        const scrollDelta = (deltaY / trackSpace) * scrollable;
        window.scrollTo({
          top: dragStartScrollYRef.current + scrollDelta,
          behavior: 'auto'
        });
      }
    };

    const onMouseUp = () => {
      setIsDragging(false);
      isDraggingRef.current = false;
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
      hideTimerRef.current = setTimeout(() => {
        setIsVisible(false);
      }, 1400);
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
  };

  const handleTrackClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target !== e.currentTarget) return;
    const doc = document.documentElement;
    const clientHeight = doc.clientHeight;
    const scrollHeight = doc.scrollHeight;
    const scrollable = scrollHeight - clientHeight;
    const clickY = e.clientY;
    const ratio = clickY / clientHeight;

    window.scrollTo({
      top: ratio * scrollable,
      behavior: 'smooth'
    });
  };

  return (
    <div
      className={`fixed top-0 right-0 h-screen w-3.5 z-[9999] pointer-events-auto select-none transition-opacity duration-300 cursor-pointer ${
        isVisible || isHovered || isDragging ? 'opacity-100' : 'opacity-0'
      }`}
      onMouseEnter={() => {
        setIsHovered(true);
        setIsVisible(true);
      }}
      onMouseLeave={() => {
        setIsHovered(false);
        if (!isDraggingRef.current) {
          if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
          hideTimerRef.current = setTimeout(() => setIsVisible(false), 1200);
        }
      }}
      onClick={handleTrackClick}
      title="Scroll"
    >
      {/* Scrollbar Track */}
      <div className="absolute inset-y-1.5 right-0.5 w-2 rounded-full bg-black/40 backdrop-blur-md transition-all duration-200 border border-white/5 group hover:w-2.5 hover:bg-black/60">
        {/* Scrollbar Thumb */}
        <div
          className="absolute right-0 w-full rounded-full transition-[background,box-shadow,width] duration-200 cursor-pointer"
          style={{
            height: `${thumbHeight}px`,
            transform: `translate3d(0, ${scrollProgress}px, 0)`,
            background: isDragging
              ? 'linear-gradient(180deg, #5EEAD4 0%, #2DD4BF 60%, #10B981 100%)'
              : isHovered
              ? 'linear-gradient(180deg, #34D399 0%, #2DD4BF 50%, #059669 100%)'
              : 'linear-gradient(180deg, rgba(45, 212, 191, 0.5) 0%, rgba(16, 185, 129, 0.6) 100%)',
            boxShadow: isDragging || isHovered
              ? '0 0 14px rgba(45, 212, 191, 0.75), inset 0 1px 1px rgba(255, 255, 255, 0.4)'
              : '0 0 8px rgba(16, 185, 129, 0.35)',
          }}
          onMouseDown={handleThumbMouseDown}
        />
      </div>
    </div>
  );
};

export default CustomScrollbar;
