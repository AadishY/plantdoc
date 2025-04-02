
import { Suspense, lazy, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@/components/ThemeProvider';
import { Toaster } from '@/components/ui/toaster';
import AnimatedLoader from '@/components/ui/animated-loader';

// Lazily load components for better performance
const TextHighlighter = lazy(() => import('@/components/TextHighlighter'));
const FixedMobileNav = lazy(() => import('@/components/FixedMobileNav'));

// Lazily load pages for better performance
const Index = lazy(() => import('@/pages/Index'));
const DiagnosePage = lazy(() => import('@/pages/DiagnosePage'));
const RecommendPage = lazy(() => import('@/pages/RecommendPage'));
const AboutPage = lazy(() => import('@/pages/AboutPage'));
const NotFound = lazy(() => import('@/pages/NotFound'));

// Fallback loading component for lazy-loaded routes
const PageLoading = () => (
  <div className="h-screen w-full flex flex-col items-center justify-center">
    <AnimatedLoader size="lg" color="primary" text="Loading Plant Doc..." />
  </div>
);

function App() {
  // Preload critical components when idle
  useEffect(() => {
    if ('requestIdleCallback' in window) {
      const idleCallback = window.requestIdleCallback(() => {
        // Preload components likely to be used
        const preloadComponents = async () => {
          // Preload the Index page since it's the most common entry point
          import('@/pages/Index').catch(console.error);
          
          // Add a small delay to not overwhelm mobile devices
          setTimeout(() => {
            // Preload key components
            import('@/components/TextHighlighter').catch(console.error);
            import('@/components/FixedMobileNav').catch(console.error);
          }, 2000); // Longer delay for mobile optimization
        };
        
        preloadComponents();
      });
      
      return () => {
        if ('cancelIdleCallback' in window) {
          window.cancelIdleCallback(idleCallback);
        }
      };
    }
  }, []);

  return (
    <ThemeProvider defaultTheme="dark" storageKey="plantdoc-theme">
      <div className="min-h-screen w-full bg-background">
        <Suspense fallback={<PageLoading />}>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/diagnose" element={<DiagnosePage />} />
            <Route path="/recommend" element={<RecommendPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          
          {/* Global Components - lazy loaded for better initial page load */}
          <FixedMobileNav />
          <TextHighlighter />
        </Suspense>
        <Toaster />
      </div>
    </ThemeProvider>
  );
}

export default App;
