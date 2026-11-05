import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Suppress harmless Vite HMR WebSocket closing messages in the iframe preview environment
if (typeof window !== 'undefined') {
  window.addEventListener('error', (event) => {
    if (
      event.message?.includes('WebSocket') ||
      event.message?.includes('without opened') ||
      event.filename?.includes('@vite/client')
    ) {
      event.stopImmediatePropagation();
      event.preventDefault();
    }
  });

  window.addEventListener('unhandledrejection', (event) => {
    const msg = event.reason?.message || String(event.reason);
    if (msg.includes('WebSocket') || msg.includes('without opened')) {
      event.stopImmediatePropagation();
      event.preventDefault();
    }
  });
}

createRoot(document.getElementById('root')!).render(<App />);
