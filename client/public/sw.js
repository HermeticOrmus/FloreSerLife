// FloreSer Service Worker - PWA Offline Support
const CACHE_VERSION = 'floreser-v1.0.0';
const STATIC_CACHE = `${CACHE_VERSION}-static`;
const DYNAMIC_CACHE = `${CACHE_VERSION}-dynamic`;
const API_CACHE = `${CACHE_VERSION}-api`;

// Assets to cache immediately on install
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/offline.html',
  '/manifest.json',
  // Add your bundled assets here - Vite will handle this
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
  console.log('[ServiceWorker] Installing...');

  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) => {
      console.log('[ServiceWorker] Caching static assets');
      return cache.addAll(STATIC_ASSETS.map(url => new Request(url, { cache: 'no-cache' })));
    }).then(() => {
      console.log('[ServiceWorker] Installed successfully');
      return self.skipWaiting(); // Activate immediately
    }).catch(error => {
      console.error('[ServiceWorker] Installation failed:', error);
    })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('[ServiceWorker] Activating...');

  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((cacheName) => {
            // Delete old cache versions
            return cacheName.startsWith('floreser-') && cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE && cacheName !== API_CACHE;
          })
          .map((cacheName) => {
            console.log('[ServiceWorker] Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          })
      );
    }).then(() => {
      console.log('[ServiceWorker] Activated successfully');
      return self.clients.claim(); // Take control immediately
    })
  );
});

// Fetch event - smart caching strategy
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }

  // Skip chrome-extension and other non-http(s) requests
  if (!url.protocol.startsWith('http')) {
    return;
  }

  // API requests - Network first, cache fallback
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(
      networkFirstStrategy(request, API_CACHE)
    );
    return;
  }

  // Static assets - Cache first, network fallback
  if (
    url.pathname.match(/\.(js|css|png|jpg|jpeg|svg|gif|webp|woff|woff2|ttf|eot)$/) ||
    url.pathname === '/' ||
    url.pathname.startsWith('/assets/')
  ) {
    event.respondWith(
      cacheFirstStrategy(request, STATIC_CACHE)
    );
    return;
  }

  // HTML pages - Network first with offline fallback
  if (request.headers.get('accept')?.includes('text/html')) {
    event.respondWith(
      networkFirstWithOfflineFallback(request, DYNAMIC_CACHE)
    );
    return;
  }

  // Default: Network first
  event.respondWith(
    networkFirstStrategy(request, DYNAMIC_CACHE)
  );
});

// Cache-first strategy (for static assets)
async function cacheFirstStrategy(request, cacheName) {
  try {
    const cachedResponse = await caches.match(request);

    if (cachedResponse) {
      console.log('[ServiceWorker] Serving from cache:', request.url);
      // Update cache in background
      updateCache(request, cacheName);
      return cachedResponse;
    }

    // Not in cache - fetch and cache
    const response = await fetch(request);
    const cache = await caches.open(cacheName);
    cache.put(request, response.clone());
    console.log('[ServiceWorker] Cached new resource:', request.url);
    return response;
  } catch (error) {
    console.error('[ServiceWorker] Cache-first error:', error);
    // Try cache one more time
    const cachedResponse = await caches.match(request);
    if (cachedResponse) return cachedResponse;

    throw error;
  }
}

// Network-first strategy (for API calls)
async function networkFirstStrategy(request, cacheName) {
  try {
    const response = await fetch(request);

    // Cache successful responses
    if (response.ok) {
      const cache = await caches.open(cacheName);
      cache.put(request, response.clone());
      console.log('[ServiceWorker] Updated cache from network:', request.url);
    }

    return response;
  } catch (error) {
    console.log('[ServiceWorker] Network failed, trying cache:', request.url);

    // Network failed - try cache
    const cachedResponse = await caches.match(request);

    if (cachedResponse) {
      console.log('[ServiceWorker] Serving stale content from cache');
      return cachedResponse;
    }

    throw error;
  }
}

// Network-first with offline fallback page
async function networkFirstWithOfflineFallback(request, cacheName) {
  try {
    const response = await fetch(request);

    if (response.ok) {
      const cache = await caches.open(cacheName);
      cache.put(request, response.clone());
    }

    return response;
  } catch (error) {
    // Try cache
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }

    // Return offline page
    const offlinePage = await caches.match('/offline.html');
    if (offlinePage) {
      return offlinePage;
    }

    // Last resort - generic offline response
    return new Response(
      '<html><body><h1>Offline</h1><p>You are currently offline. Please check your connection.</p></body></html>',
      { headers: { 'Content-Type': 'text/html' } }
    );
  }
}

// Background cache update
async function updateCache(request, cacheName) {
  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(cacheName);
      cache.put(request, response);
      console.log('[ServiceWorker] Background cache update:', request.url);
    }
  } catch (error) {
    // Silently fail - we're already serving from cache
  }
}

// Background sync (for future offline form submissions)
self.addEventListener('sync', (event) => {
  console.log('[ServiceWorker] Background sync:', event.tag);

  if (event.tag === 'sync-data') {
    event.waitUntil(syncData());
  }
});

async function syncData() {
  // Future: sync offline form submissions, favorites, etc.
  console.log('[ServiceWorker] Syncing data...');
}

// Push notifications (for future use)
self.addEventListener('push', (event) => {
  const data = event.data ? event.data.json() : {};
  const title = data.title || 'FloreSer';
  const options = {
    body: data.body || 'New update available',
    icon: '/icons/icon-192x192.png',
    badge: '/icons/icon-96x96.png',
    vibrate: [200, 100, 200],
    tag: data.tag || 'default',
    requireInteraction: false,
    data: data.url || '/'
  };

  event.waitUntil(
    self.registration.showNotification(title, options)
  );
});

// Notification click handler
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  event.waitUntil(
    clients.openWindow(event.notification.data || '/')
  );
});

console.log('[ServiceWorker] Loaded');
