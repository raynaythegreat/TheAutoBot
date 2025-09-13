const CACHE_NAME = 'pocketoption-signals-v1.0.0';
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  '/css/styles.css',
  '/js/app.js',
  '/js/camera.js',
  '/js/signals.js',
  '/js/ai-analysis.js',
  '/assets/icons/icon-192x192.png',
  '/assets/icons/icon-512x512.png',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css'
];

// Install event - cache resources
self.addEventListener('install', event => {
  console.log('Service Worker installing...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
      .then(() => {
        console.log('All resources cached');
        return self.skipWaiting();
      })
      .catch(error => {
        console.error('Cache installation failed:', error);
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
  console.log('Service Worker activating...');
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
      console.log('Service Worker activated');
      return self.clients.claim();
    })
  );
});

// Fetch event - serve cached content when offline
self.addEventListener('fetch', event => {
  // Skip non-GET requests
  if (event.request.method !== 'GET') {
    return;
  }

  // Skip external requests (except for our CDN resources)
  const url = new URL(event.request.url);
  if (url.origin !== location.origin && !url.hostname.includes('cdnjs.cloudflare.com')) {
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
          // Don't cache non-successful responses
          if (!response || response.status !== 200 || response.type !== 'basic') {
            return response;
          }

          // Clone the response
          const responseToCache = response.clone();

          // Cache the response
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

// Background sync for signal generation
self.addEventListener('sync', event => {
  if (event.tag === 'background-sync-signals') {
    console.log('Background sync: generating signals');
    event.waitUntil(
      generateBackgroundSignals()
    );
  }
});

// Push notifications for new signals
self.addEventListener('push', event => {
  console.log('Push notification received');
  
  const options = {
    body: event.data ? event.data.text() : 'New trading signal available!',
    icon: '/assets/icons/icon-192x192.png',
    badge: '/assets/icons/icon-72x72.png',
    vibrate: [200, 100, 200],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {
        action: 'explore',
        title: 'View Signal',
        icon: '/assets/icons/icon-96x96.png'
      },
      {
        action: 'close',
        title: 'Close',
        icon: '/assets/icons/icon-96x96.png'
      }
    ]
  };

  event.waitUntil(
    self.registration.showNotification('PocketOption AI Signals', options)
  );
});

// Handle notification clicks
self.addEventListener('notificationclick', event => {
  console.log('Notification clicked:', event.action);
  
  event.notification.close();

  if (event.action === 'explore') {
    // Open the app
    event.waitUntil(
      clients.openWindow('/')
    );
  } else if (event.action === 'close') {
    // Just close the notification
    return;
  } else {
    // Default action - open the app
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});

// Message handling from main thread
self.addEventListener('message', event => {
  console.log('Service Worker received message:', event.data);
  
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  if (event.data && event.data.type === 'GET_VERSION') {
    event.ports[0].postMessage({ version: CACHE_NAME });
  }
  
  if (event.data && event.data.type === 'CACHE_SIGNAL') {
    cacheSignalData(event.data.signal);
  }
});

// Background signal generation
async function generateBackgroundSignals() {
  try {
    console.log('Generating background signals...');
    
    // Simulate signal generation
    const signal = {
      id: Date.now(),
      asset: 'EUR/USD',
      action: Math.random() > 0.5 ? 'CALL' : 'PUT',
      confidence: Math.floor(Math.random() * 30) + 70, // 70-100%
      timeframe: '5m',
      timestamp: new Date(),
      source: 'Background AI'
    };
    
    // Store signal in IndexedDB
    await storeSignalInDB(signal);
    
    // Send notification to all clients
    const clients = await self.clients.matchAll();
    clients.forEach(client => {
      client.postMessage({
        type: 'NEW_SIGNAL',
        signal: signal
      });
    });
    
    console.log('Background signal generated:', signal);
    
  } catch (error) {
    console.error('Background signal generation failed:', error);
  }
}

// Store signal in IndexedDB
async function storeSignalInDB(signal) {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('PocketOptionSignals', 1);
    
    request.onerror = () => reject(request.error);
    request.onsuccess = () => {
      const db = request.result;
      const transaction = db.transaction(['signals'], 'readwrite');
      const store = transaction.objectStore('signals');
      const addRequest = store.add(signal);
      
      addRequest.onsuccess = () => resolve();
      addRequest.onerror = () => reject(addRequest.error);
    };
    
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains('signals')) {
        const store = db.createObjectStore('signals', { keyPath: 'id' });
        store.createIndex('timestamp', 'timestamp', { unique: false });
        store.createIndex('asset', 'asset', { unique: false });
      }
    };
  });
}

// Cache signal data
async function cacheSignalData(signal) {
  try {
    const cache = await caches.open(CACHE_NAME);
    const response = new Response(JSON.stringify(signal), {
      headers: { 'Content-Type': 'application/json' }
    });
    await cache.put(`/signals/${signal.id}`, response);
    console.log('Signal cached:', signal.id);
  } catch (error) {
    console.error('Failed to cache signal:', error);
  }
}

// Periodic background sync (if supported)
if ('periodicSync' in self.registration) {
  self.addEventListener('periodicsync', event => {
    if (event.tag === 'signal-generation') {
      console.log('Periodic sync: generating signals');
      event.waitUntil(generateBackgroundSignals());
    }
  });
}

// Handle app updates
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'UPDATE_AVAILABLE') {
    console.log('Update available, reloading...');
    self.skipWaiting();
  }
});

console.log('Service Worker loaded successfully');
