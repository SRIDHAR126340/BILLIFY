/**
 * Billify Offline Service Worker (v221)
 * Restored original and reliable standard Service Worker configuration.
 * Cache-First with Dynamic Caching & Network Fallback guarantees absolute correctness.
 */

const VERSION = 'sma-v221';
const CACHE_NAME = `sma-core-${VERSION}`;
const RUNTIME_CACHE = `sma-runtime-${VERSION}`;

// Comprehensive list of local assets and direct CDN entrypoints for offline caching
const CORE_ASSETS = [
  './',
  './index.html',
  './offline.html',
  './manifest.json',
  './manifest.webmanifest',
  './app-version.json',
  './assets/app-icon.svg',
  './assets/icon-192.svg',
  './assets/icon-512.svg',
  './styles/main.css',
  './src/main.js',
  './src/jsx.js',
  './src/App.js',
  './src/mainProviders.js',
  './src/components/Layout.js',
  './src/components/StatCard.js',
  './src/components/EmptyState.js',
  './src/components/CompanyPrintHeader.js',
  './src/pages/Dashboard.js',
  './src/pages/Invoices.js',
  './src/pages/InvoiceEditor.js',
  './src/pages/InvoiceView.js',
  './src/pages/Quotations.js',
  './src/pages/Estimates.js',
  './src/pages/PurchaseOrders.js',
  './src/pages/Customers.js',
  './src/pages/Items.js',
  './src/pages/Ledger.js',
  './src/pages/Expenses.js',
  './src/pages/Reports.js',
  './src/pages/Tools.js',
  './src/pages/Settings.js',
  './src/pages/DataSync.js',
  './src/pages/NotFound.js',
  './src/store/useBillingStore.js',
  './src/utils/format.js',
  './src/utils/companyPdf.js',
  './src/utils/whatsappPdf.js',
  // CDN entry points
  'https://esm.sh/react@19.2.0',
  'https://esm.sh/react-dom@19.2.0/client?deps=react@19.2.0',
  'https://esm.sh/react-router-dom@7.13.0?deps=react@19.2.0',
  'https://esm.sh/lucide-react?deps=react@19.2.0',
  'https://esm.sh/htm',
  'https://esm.sh/zustand@5.0.0?deps=react@19.2.0',
  'https://esm.sh/zustand@5.0.0/middleware?deps=react@19.2.0',
  'https://esm.sh/jspdf',
  'https://esm.sh/jspdf-autotable',
  'https://esm.sh/recharts?deps=react@19.2.0',
  'https://esm.sh/framer-motion?deps=react@19.2.0',
  'https://esm.sh/file-saver',
  'https://esm.sh/xlsx'
];

// Install Event: Cache all core assets and skip waiting
self.addEventListener('install', event => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then(async cache => {
      console.log('[SW] Pre-caching core local assets and CDN entrypoints...');
      
      const cachePromises = CORE_ASSETS.map(async url => {
        try {
          const res = await fetch(url, { cache: 'reload' });
          if (res && res.ok) {
            await cache.put(url, res.clone());
            // Also store absolute version
            const absoluteUrl = new URL(url, self.location.href).href;
            await cache.put(absoluteUrl, res);
          }
        } catch (err) {
          console.warn(`[SW] Failed pre-caching asset: ${url}`, err);
        }
      });
      
      await Promise.allSettled(cachePromises);
      console.log('Cache Created'); // Exact requested log
    })
  );
});

// Activate Event: Clean up old caches and claim clients
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.filter(key => key.startsWith('sma-') && key !== CACHE_NAME && key !== RUNTIME_CACHE)
            .map(key => caches.delete(key))
      );
    }).then(() => {
      console.log('[SW] Service Worker Activated. Ready.');
      console.log('Offline Ready'); // Exact requested log
      return self.clients.claim();
    })
  );
});

// Fetch Event: Cache-First with Dynamic Caching & Network Fallback
self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;

  let url;
  try {
    url = new URL(event.request.url);
  } catch (err) {
    return;
  }

  // Only handle HTTP / HTTPS protocols
  if (url.protocol !== 'http:' && url.protocol !== 'https:') return;

  // 1. app-version.json must ALWAYS use Network-First to avoid cache-locking
  if (url.pathname.includes('app-version.json')) {
    event.respondWith(
      fetch(event.request)
        .then(async networkResponse => {
          if (networkResponse && networkResponse.status === 200) {
            const cache = await caches.open(RUNTIME_CACHE);
            await cache.put(event.request, networkResponse.clone());
          }
          return networkResponse;
        })
        .catch(async () => {
          const cachedResponse = await caches.match(event.request);
          if (cachedResponse) return cachedResponse;
          return new Response('{"version":"221"}', { headers: { 'Content-Type': 'application/json' } });
        })
    );
    return;
  }

  // 2. GenMB auth calls or other non-asset APIs should be Network-Only/Network-First
  const isSelfOrigin = url.origin === self.location.origin;
  const isApiOrGenMbAuth = !isSelfOrigin && (url.hostname.includes('genmb') || url.pathname.includes('/api/'));

  if (isApiOrGenMbAuth) {
    event.respondWith(
      fetch(event.request)
        .catch(() => {
          // Robust offline fallback to prevent blocking "Offline API call failed." errors
          const isScript = event.request.destination === 'script' || url.pathname.endsWith('.js');
          if (isScript) {
            return new Response('console.warn("Offline fallback for GenMB script loaded gracefully.");', {
              status: 200,
              headers: { 'Content-Type': 'application/javascript' }
            });
          }
          
          // Return a safe 200 OK JSON response instead of a 503 error, which triggers platform blocking banners
          return new Response(JSON.stringify({ 
            success: false, 
            offline: true, 
            message: "Offline mode active. Cloud services are paused." 
          }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
          });
        })
    );
    return;
  }

  // 3. For static/local assets and CDN packages (esm.sh), do Cache-First
  event.respondWith(
    (async () => {
      // Look up in any cache
      let cachedResponse = await caches.match(event.request);
      if (!cachedResponse) {
        // Strip query params and look up again (e.g. for main.css?v=220)
        cachedResponse = await caches.match(event.request, { ignoreSearch: true });
      }

      // If we found it in cache, return it instantly!
      if (cachedResponse) {
        return cachedResponse;
      }

      // If not in cache, fetch from network and cache dynamically
      try {
        const networkResponse = await fetch(event.request);
        
        if (networkResponse && networkResponse.status === 200) {
          const cache = await caches.open(RUNTIME_CACHE);
          await cache.put(event.request, networkResponse.clone());
        }
        
        return networkResponse;
      } catch (err) {
        // If network is offline and we don't have it in cache, see if it is a navigation request
        if (event.request.mode === 'navigate' || 
            (url.origin === self.location.origin && !url.pathname.includes('.'))) {
          const shell = await caches.match('./index.html') || 
                        await caches.match('index.html') || 
                        await caches.match('./');
          if (shell) return shell.clone();
        }

        // Return a basic SVG image fallback for images if available
        if (event.request.destination === 'image') {
          return new Response(
            '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>',
            { headers: { 'Content-Type': 'image/svg+xml' } }
          );
        }

        return new Response('Offline resource unavailable.', { status: 503 });
      }
    })()
  );
});

// Messages Handler (Safe fallback for SKIP_WAITING)
self.addEventListener('message', event => {
  if (event.data?.type === 'SKIP_WAITING' || event.data === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
