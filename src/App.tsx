
import { Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@/components/ThemeProvider';
import { Toaster } from '@/components/ui/toaster';
import AnimatedLoader from '@/components/ui/animated-loader';
import DynamicBackground from '@/components/DynamicBackground';

// Lazily load components for better performance
const TextHighlighter = lazy(() => import('@/components/TextHighlighter'));
const FixedMobileNav = lazy(() => import('@/components/FixedMobileNav'));

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
    <AnimatedLoader size="lg" color="primary" text="Loading Plant Doc..." />
  </div>
);

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="plantdoc-theme">
      {/* Apply DynamicBackground to all pages */}
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
      
      {/* Global Components */}
      <Suspense fallback={null}>
        <FixedMobileNav />
        <TextHighlighter />
      </Suspense>
      <Toaster />
    </ThemeProvider>
  );
}

export default App;
