/**
 * Proactive Route Preloading Engine
 * Silently warms Vite lazy-loaded module chunks during idle cycles
 * or on link hover/touch to guarantee instantaneous perceived page transitions.
 */

const preloadedRoutes = new Set<string>();

export const preloadRoute = (path: string): void => {
  const cleanPath = path.split('?')[0].split('#')[0];
  if (preloadedRoutes.has(cleanPath)) return;

  try {
    if (cleanPath === '/diagnose') {
      preloadedRoutes.add(cleanPath);
      import('@/pages/DiagnosePage');
    } else if (cleanPath === '/recommend') {
      preloadedRoutes.add(cleanPath);
      import('@/pages/RecommendPage');
    } else if (cleanPath === '/about') {
      preloadedRoutes.add(cleanPath);
      import('@/pages/AboutPage');
    } else if (cleanPath === '/privacy') {
      preloadedRoutes.add(cleanPath);
      import('@/pages/PrivacyPage');
    } else if (cleanPath === '/') {
      preloadedRoutes.add(cleanPath);
      // Index is already eagerly loaded in initial entry bundle
    }
  } catch {
    // Non-blocking prefetch failure
  }
};

export const preloadAllRoutes = (): void => {
  if (typeof window === 'undefined') return;

  const runPreload = () => {
    preloadRoute('/diagnose');
    preloadRoute('/recommend');
    preloadRoute('/about');
  };

  if ('requestIdleCallback' in window) {
    (window as Window & { requestIdleCallback: (cb: () => void, opts?: { timeout: number }) => void })
      .requestIdleCallback(runPreload, { timeout: 1500 });
  } else {
    setTimeout(runPreload, 800);
  }
};
