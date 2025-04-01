
import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/components/ThemeProvider";
import { TranslationProvider } from "@/hooks/useTranslation";
import Index from "./pages/Index";
import DiagnosePage from "./pages/DiagnosePage";
import RecommendPage from "./pages/RecommendPage";
import NotFound from "./pages/NotFound";

// Create a client
const queryClient = new QueryClient();

const App: React.FC = () => {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="plantdoc-theme">
      <TranslationProvider>
        <QueryClientProvider client={queryClient}>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/diagnose" element={<DiagnosePage />} />
                <Route path="/recommend" element={<RecommendPage />} />
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </QueryClientProvider>
      </TranslationProvider>
    </ThemeProvider>
  );
};

export default App;
