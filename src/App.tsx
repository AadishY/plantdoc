import { Suspense, lazy, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@/components/ThemeProvider';
import { Toaster as RadixToaster } from '@/components/ui/toaster';
import { Toaster as SonnerToaster } from '@/components/ui/sonner';
import DynamicBackground from '@/components/DynamicBackground';
import SiteLoader from '@/components/SiteLoader';
import SmoothScroll from '@/components/SmoothScroll';
import ErrorBoundary from '@/components/ErrorBoundary';
import ScrollToTop from '@/components/ScrollToTop';
import PageLoadingFallback from '@/components/PageLoadingFallback';
import CustomScrollbar from '@/components/CustomScrollbar';
import { preloadAllRoutes } from '@/utils/routePreloader';

// Lazily load components for better performance
const TextHighlighter = lazy(() => import('@/components/TextHighlighter'));

// Preload critical landing page
import Index from '@/pages/Index';

// Lazily load routes with instant prefetch support
const DiagnosePage = lazy(() => import('@/pages/DiagnosePage'));
const RecommendPage = lazy(() => import('@/pages/RecommendPage'));
const AboutPage = lazy(() => import('@/pages/AboutPage'));
const PrivacyPage = lazy(() => import('@/pages/PrivacyPage'));
const NotFound = lazy(() => import('@/pages/NotFound'));

function App() {
  // Silently warm and cache route chunks during browser idle time for 0ms transitions
  useEffect(() => {
    preloadAllRoutes();
  }, []);

  return (
    <ThemeProvider defaultTheme="dark" storageKey="plantdoc-theme">
      <ErrorBoundary>
        {/* Smooth Lenis Inertia Scroll & Scroll Restoration */}
        <SmoothScroll>
          <ScrollToTop />
          
          {/* Initial load splash */}
          <SiteLoader />
          
          {/* Ultra-fast GPU background */}
          <DynamicBackground />
          
          {/* Custom in-DOM obsidian-emerald scrollbar with custom animated cursor */}
          <CustomScrollbar />
          
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/diagnose" element={
              <Suspense fallback={<PageLoadingFallback title="Mounting Diagnostics" subtitle="Preparing foliar neural models & lesion vision..." />}>
                <DiagnosePage />
              </Suspense>
            } />
            <Route path="/recommend" element={
              <Suspense fallback={<PageLoadingFallback title="Mounting Recommendations" subtitle="Loading botanical taxonomy & climate algorithms..." />}>
                <RecommendPage />
              </Suspense>
            } />
            <Route path="/about" element={
              <Suspense fallback={<PageLoadingFallback title="Mounting Architecture" subtitle="Loading system specifications & technology stack..." />}>
                <AboutPage />
              </Suspense>
            } />
            <Route path="/privacy" element={
              <Suspense fallback={<PageLoadingFallback title="Mounting Privacy Policy" subtitle="Loading data protection & privacy guidelines..." />}>
                <PrivacyPage />
              </Suspense>
            } />
            <Route path="*" element={
              <Suspense fallback={<PageLoadingFallback title="Loading Page" subtitle="Resolving navigation route..." />}>
                <NotFound />
              </Suspense>
            } />
          </Routes>

          {/* Global Highlights & Toast */}
          <Suspense fallback={null}>
            <TextHighlighter />
          </Suspense>
          <RadixToaster />
          <SonnerToaster />
        </SmoothScroll>
      </ErrorBoundary>
    </ThemeProvider>
  );
}

export default App;
