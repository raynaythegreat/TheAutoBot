// The POT Bot Service Worker
const CACHE_NAME = 'pot-bot-v1.0.0';
const urlsToCache = [
  '/',
  '/index.html',
  '/css/styles.css',
  '/js/app.js',
  '/js/camera.js',
  '/js/ai-analysis.js',
  '/manifest.json',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css'
];

// Install event
self.addEventListener('install', event => {
  console.log('PocketOption AI Service Worker installing...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Caching PocketOption AI files...');
        return cache.addAll(urlsToCache);
      })
      .then(() => {
        console.log('PocketOption AI Service Worker installed');
        return self.skipWaiting();
      })
      .catch(error => {
        console.error('PocketOption AI Service Worker installation failed:', error);
      })
  );
});

// Activate event
self.addEventListener('activate', event => {
  console.log('PocketOption AI Service Worker activating...');
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      console.log('PocketOption AI Service Worker activated');
      return self.clients.claim();
    })
  );
});

// Fetch event
self.addEventListener('fetch', event => {
  // Skip non-GET requests
  if (event.request.method !== 'GET') {
    return;
  }

  // Skip external requests (except for PocketOption)
  if (!event.request.url.startsWith(self.location.origin) && 
      !event.request.url.includes('pocketoption.com') &&
      !event.request.url.includes('cdnjs.cloudflare.com')) {
    return;
  }

  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Return cached version or fetch from network
        if (response) {
          console.log('Serving from cache:', event.request.url);
          return response;
        }

        console.log('Fetching from network:', event.request.url);
        return fetch(event.request).then(response => {
          // Don't cache if not a valid response
          if (!response || response.status !== 200 || response.type !== 'basic') {
            return response;
          }

          // Clone the response
          const responseToCache = response.clone();

          caches.open(CACHE_NAME)
            .then(cache => {
              cache.put(event.request, responseToCache);
            });

          return response;
        }).catch(error => {
          console.error('Fetch failed:', error);
          
          // Return offline page for navigation requests
          if (event.request.mode === 'navigate') {
            return caches.match('/index.html');
          }
          
          throw error;
        });
      })
  );
});

// Background sync for signal data
self.addEventListener('sync', event => {
  if (event.tag === 'background-sync-signals') {
    console.log('Background sync: PocketOption signals');
    event.waitUntil(syncSignals());
  }
});

// Push notifications for signals
self.addEventListener('push', event => {
  console.log('Push notification received');
  
  const options = {
    body: 'New PocketOption signal available!',
    icon: '/assets/icons/icon-192x192.png',
    badge: '/assets/icons/icon-72x72.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {
        action: 'explore',
        title: 'View Signal',
        icon: '/assets/icons/icon-192x192.png'
      },
      {
        action: 'close',
        title: 'Close',
        icon: '/assets/icons/icon-192x192.png'
      }
    ]
  };

  event.waitUntil(
    self.registration.showNotification('PocketOption AI Signal', options)
  );
});

// Notification click handler
self.addEventListener('notificationclick', event => {
  console.log('Notification clicked:', event.action);
  
  event.notification.close();

  if (event.action === 'explore') {
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});

// Helper function for background sync
async function syncSignals() {
  try {
    // Sync signal data when online
    console.log('Syncing PocketOption signals...');
    
    // Get signal data from IndexedDB or localStorage
    const signalData = await getSignalData();
    
    if (signalData && signalData.length > 0) {
      // Send to server (if implemented)
      console.log('Signal data synced:', signalData.length, 'signals');
    }
    
  } catch (error) {
    console.error('Background sync failed:', error);
  }
}

// Helper function to get signal data
async function getSignalData() {
  // This would typically read from IndexedDB
  // For now, return empty array
  return [];
}

// Message handling
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  if (event.data && event.data.type === 'GET_VERSION') {
    event.ports[0].postMessage({ version: CACHE_NAME });
  }
});

console.log('PocketOption AI Service Worker loaded');