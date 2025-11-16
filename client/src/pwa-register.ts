/**
 * FloreSer PWA Service Worker Registration
 * Handles installation, updates, and offline functionality
 */

export function registerServiceWorker() {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', async () => {
      try {
        const registration = await navigator.serviceWorker.register('/sw.js', {
          scope: '/'
        });

        console.log('[PWA] Service Worker registered:', registration.scope);

        // Check for updates periodically (every hour)
        setInterval(() => {
          registration.update();
        }, 60 * 60 * 1000);

        // Handle service worker updates
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;

          if (newWorker) {
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                // New service worker available
                console.log('[PWA] New version available! Refresh to update.');

                // Optionally show a toast or notification to user
                showUpdateNotification();
              }
            });
          }
        });

      } catch (error) {
        console.error('[PWA] Service Worker registration failed:', error);
      }
    });

    // Handle offline/online events
    window.addEventListener('online', () => {
      console.log('[PWA] Back online!');
      showConnectionStatus('online');
    });

    window.addEventListener('offline', () => {
      console.log('[PWA] You are offline');
      showConnectionStatus('offline');
    });
  } else {
    console.warn('[PWA] Service Workers are not supported in this browser');
  }
}

function showUpdateNotification() {
  // Create a subtle notification for PWA updates
  if ('Notification' in window && Notification.permission === 'granted') {
    new Notification('FloreSer Update Available', {
      body: 'A new version is available. Refresh to update.',
      icon: '/icons/icon-192x192.png',
      badge: '/icons/icon-96x96.png',
      tag: 'pwa-update',
      requireInteraction: false
    });
  }
}

function showConnectionStatus(status: 'online' | 'offline') {
  // You can integrate this with your toast notification system
  const event = new CustomEvent('connection-status-changed', {
    detail: { status }
  });
  window.dispatchEvent(event);
}

/**
 * Request notification permission for PWA features
 */
export async function requestNotificationPermission() {
  if ('Notification' in window && Notification.permission === 'default') {
    try {
      const permission = await Notification.requestPermission();
      console.log('[PWA] Notification permission:', permission);
      return permission === 'granted';
    } catch (error) {
      console.error('[PWA] Error requesting notification permission:', error);
      return false;
    }
  }
  return Notification.permission === 'granted';
}

/**
 * Check if app is running as installed PWA
 */
export function isPWA(): boolean {
  return window.matchMedia('(display-mode: standalone)').matches ||
         (window.navigator as any).standalone === true ||
         document.referrer.includes('android-app://');
}

/**
 * Get install prompt and show custom install UI
 */
let deferredPrompt: any = null;

export function initInstallPrompt() {
  window.addEventListener('beforeinstallprompt', (e) => {
    // Prevent the default install prompt
    e.preventDefault();
    deferredPrompt = e;
    console.log('[PWA] Install prompt available');

    // Dispatch event so app can show custom install button
    const event = new CustomEvent('pwa-installable', {
      detail: { canInstall: true }
    });
    window.dispatchEvent(event);
  });

  window.addEventListener('appinstalled', () => {
    console.log('[PWA] App installed successfully');
    deferredPrompt = null;

    // Track installation
    if ((window as any).gtag) {
      (window as any).gtag('event', 'pwa_install', {
        event_category: 'engagement'
      });
    }
  });
}

export async function promptInstall() {
  if (!deferredPrompt) {
    console.log('[PWA] Install prompt not available');
    return false;
  }

  // Show the install prompt
  deferredPrompt.prompt();

  // Wait for user response
  const { outcome } = await deferredPrompt.userChoice;
  console.log('[PWA] User choice:', outcome);

  deferredPrompt = null;
  return outcome === 'accepted';
}

/**
 * Unregister service worker (for debugging/development)
 */
export async function unregisterServiceWorker() {
  if ('serviceWorker' in navigator) {
    const registrations = await navigator.serviceWorker.getRegistrations();
    for (const registration of registrations) {
      await registration.unregister();
      console.log('[PWA] Service Worker unregistered');
    }
  }
}
