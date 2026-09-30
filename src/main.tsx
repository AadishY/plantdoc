
import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.tsx';
import './index.css';
import './styles/performance.css';

// The animated cursor is desktop-only. Keeping its large sprite sheet out of
// the mobile CSS request saves bandwidth and parse time on Android.
if (typeof window !== 'undefined' && window.matchMedia('(pointer: fine)').matches) {
  import('./custom-cursors.css');
}

// A freshly published build can briefly coexist with stale cached chunks in a
// browser tab. Recover once from Vite's production preload error instead of
// leaving a route stuck behind a failed dynamic import. Offline visitors are
// left alone and see the app's connection notice rather than a reload loop.
if (typeof window !== 'undefined') {
  const recoveryKey = 'plantdoc_chunk_recovery_attempted';
  window.addEventListener('vite:preloadError', (event) => {
    if (navigator.onLine === false) return;
    try {
      const previousAttempt = Number(sessionStorage.getItem(recoveryKey) || 0);
      if (Date.now() - previousAttempt < 15_000) return;
      sessionStorage.setItem(recoveryKey, String(Date.now()));
    } catch {
      // Continue with one best-effort reload if session storage is unavailable.
    }
    event.preventDefault();
    window.location.reload();
  });
}

const rootElement = document.getElementById("root");
if (!rootElement) throw new Error('Root element not found');

createRoot(rootElement).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
