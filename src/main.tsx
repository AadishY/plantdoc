
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

const rootElement = document.getElementById("root");
if (!rootElement) throw new Error('Root element not found');

createRoot(rootElement).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
