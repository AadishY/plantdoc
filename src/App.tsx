
import { Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@/components/ThemeProvider';
import { Toaster } from '@/components/ui/toaster';
import TextHighlighter from '@/components/TextHighlighter';
import MobileNav from '@/components/MobileNav';
import AnimatedLoader from '@/components/ui/animated-loader';

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
  return (
    <ThemeProvider defaultTheme="dark" storageKey="plantdoc-theme">
      <Suspense fallback={<PageLoading />}>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/diagnose" element={<DiagnosePage />} />
          <Route path="/recommend" element={<RecommendPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
      
      {/* Global Components */}
      <MobileNav />
      <TextHighlighter />
      <Toaster />
    </ThemeProvider>
  );
}

export default App;
