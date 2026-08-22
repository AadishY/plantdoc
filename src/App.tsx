import { Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@/components/ThemeProvider';
import { Toaster } from '@/components/ui/toaster';
import AnimatedLoader from '@/components/ui/animated-loader';
import DynamicBackground from '@/components/DynamicBackground';
import SiteLoader from '@/components/SiteLoader';
import SmoothScroll from '@/components/SmoothScroll';
import ErrorBoundary from '@/components/ErrorBoundary';

// Lazily load components for better performance
const TextHighlighter = lazy(() => import('@/components/TextHighlighter'));

// Preload critical pages
import Index from '@/pages/Index';

// Lazily load less frequently accessed pages
const DiagnosePage = lazy(() => import('@/pages/DiagnosePage'));
const RecommendPage = lazy(() => import('@/pages/RecommendPage'));
const AboutPage = lazy(() => import('@/pages/AboutPage'));
const NotFound = lazy(() => import('@/pages/NotFound'));

// Fallback loading component for lazy-loaded routes
const PageLoading = () => (
  <div className="h-screen w-full flex flex-col items-center justify-center">
    <AnimatedLoader size="lg" color="primary" text="Loading PlantDoc..." />
  </div>
);

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="plantdoc-theme">
      <ErrorBoundary>
        {/* Smooth Lenis Inertia Scroll */}
        <SmoothScroll>
          {/* Initial load splash */}
          <SiteLoader />
          
          {/* Ultra-fast GPU background */}
          <DynamicBackground />
          
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/diagnose" element={
              <Suspense fallback={<PageLoading />}>
                <DiagnosePage />
              </Suspense>
            } />
            <Route path="/recommend" element={
              <Suspense fallback={<PageLoading />}>
                <RecommendPage />
              </Suspense>
            } />
            <Route path="/about" element={
              <Suspense fallback={<PageLoading />}>
                <AboutPage />
              </Suspense>
            } />
            <Route path="*" element={
              <Suspense fallback={<PageLoading />}>
                <NotFound />
              </Suspense>
            } />
          </Routes>

          {/* Global Highlights & Toast */}
          <Suspense fallback={null}>
            <TextHighlighter />
          </Suspense>
          <Toaster />
        </SmoothScroll>
      </ErrorBoundary>
    </ThemeProvider>
  );
}

export default App;
