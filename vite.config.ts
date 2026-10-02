import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import { aiProxyPlugin } from "./server/viteAiProxyPlugin";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Secrets are loaded into the dev *server* only (no VITE_ prefix required),
  // so no provider key is ever inlined into the client bundle.
  const env = loadEnv(mode, process.cwd(), '');

  return {
    server: {
      host: "0.0.0.0",
      port: 3000,
      // Arena's live preview proxies requests through a generated host.
      allowedHosts: true,
      // Transform the two interactive routes before first navigation. This keeps
      // proxy-backed previews from racing the initial lazy-module request.
      warmup: {
        clientFiles: [
          './src/pages/DiagnosePage.tsx',
          './src/pages/RecommendPage.tsx',
        ],
      },
    },
    preview: {
      host: "0.0.0.0",
      port: 3000,
      allowedHosts: true,
    },
    plugins: [
      react(),
      aiProxyPlugin({ ...process.env, ...env }),
      mode === 'development' && componentTagger(),
    ].filter(Boolean),
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    esbuild: {
      drop: mode === 'production' ? ['console', 'debugger'] : [],
      legalComments: 'none',
    },
    build: {
      target: 'es2020',
      cssCodeSplit: true,
      cssMinify: true,
      assetsInlineLimit: 4096,
      reportCompressedSize: false,
      chunkSizeWarningLimit: 800,
      modulePreload: { polyfill: false },
      sourcemap: false,
      rollupOptions: {
        output: {
          // Hash-stable, dependency-aware chunking: vendors that rarely change
          // stay cacheable across deploys, and route code stays out of the
          // critical path.
          manualChunks(id: string) {
            if (!id.includes('node_modules')) return undefined;
            if (/[\\/]node_modules[\\/](react|react-dom|scheduler|react-router|react-router-dom)[\\/]/.test(id)) {
              return 'vendor-react';
            }
            if (/[\\/]node_modules[\\/](framer-motion|motion-dom|motion-utils|gsap|@gsap|lenis)[\\/]/.test(id)) {
              return 'vendor-animation';
            }
            if (id.includes('node_modules/@radix-ui/')) return 'vendor-radix';
            if (/[\\/]node_modules[\\/](recharts|d3-|victory-)/.test(id)) return 'vendor-charts';
            if (id.includes('node_modules/lucide-react/')) return 'vendor-icons';
            return undefined;
          },
        },
      },
    },
  };
});
