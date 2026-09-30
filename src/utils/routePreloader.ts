/**
 * Proactive route preloading engine.
 *
 * A failed preview/proxy fetch must never poison the in-memory preload state:
 * the route stays eligible for a later normal navigation attempt. Touch events
 * deliberately do not invoke this helper—on mobile they fire before a gesture
 * is known to be a tap and can create unnecessary competing module requests.
 */

const preloadedRoutes = new Set<string>();
const pendingRoutes = new Map<string, Promise<void>>();

type RouteImporter = () => Promise<unknown>;

const routeImporters: Record<string, RouteImporter> = {
  '/diagnose': () => import('@/pages/DiagnosePage'),
  '/recommend': () => import('@/pages/RecommendPage'),
  '/about': () => import('@/pages/AboutPage'),
  '/privacy': () => import('@/pages/PrivacyPage'),
};

export const preloadRoute = (path: string): Promise<void> => {
  const cleanPath = path.split('?')[0].split('#')[0];
  if (cleanPath === '/' || preloadedRoutes.has(cleanPath)) return Promise.resolve();

  const pending = pendingRoutes.get(cleanPath);
  if (pending) return pending;

  const importer = routeImporters[cleanPath];
  if (!importer) return Promise.resolve();

  const request = importer()
    .then(() => {
      preloadedRoutes.add(cleanPath);
    })
    .catch(() => {
      // Network/proxy failures are transient in development previews. Do not
      // retain a rejected import or mark the route as preloaded.
    })
    .finally(() => {
      pendingRoutes.delete(cleanPath);
    });

  pendingRoutes.set(cleanPath, request);
  return request;
};

export const preloadAllRoutes = (): void => {
  if (typeof window === 'undefined') return;

  const runPreload = () => {
    void preloadRoute('/diagnose');
    void preloadRoute('/recommend');
    void preloadRoute('/about');
  };

  if ('requestIdleCallback' in window) {
    (window as Window & { requestIdleCallback: (cb: () => void, opts?: { timeout: number }) => void })
      .requestIdleCallback(runPreload, { timeout: 1_500 });
  } else {
    window.setTimeout(runPreload, 800);
  }
};
