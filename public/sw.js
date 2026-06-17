const CACHE_NAME = 'bousai-navi-stage3-v1';
const APP_SHELL = [
  '/',
  '/index.html',
  '/assets/styles.css',
  '/assets/src/main.js',
  '/assets/src/App.js',
  '/assets/src/components/BottomTabs.js',
  '/assets/src/components/EmergencyCard.js',
  '/assets/src/components/EmergencyTab.js',
  '/assets/src/components/Header.js',
  '/assets/src/components/LibraryCard.js',
  '/assets/src/components/LibraryTab.js',
  '/assets/src/components/OfflineNotice.js',
  '/assets/src/components/RegionMapTab.js',
  '/assets/src/components/SharePanel.js',
  '/assets/src/data/emergencyActions.js',
  '/assets/src/data/libraryItems.js',
  '/assets/src/data/municipalities.js',
  '/assets/src/data.js'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key)))).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const request = event.request;
  if (request.method !== 'GET') return;

  event.respondWith(
    caches.match(request).then((cachedResponse) => {
      if (cachedResponse) return cachedResponse;
      return fetch(request).then((networkResponse) => {
        const shouldCache = request.url.startsWith(self.location.origin) || request.url.startsWith('https://esm.sh/');
        if (shouldCache && networkResponse.ok) {
          const responseClone = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, responseClone));
        }
        return networkResponse;
      }).catch(() => {
        if (request.mode === 'navigate') return caches.match('/index.html');
        return new Response('Offline', { status: 503, statusText: 'Offline' });
      });
    })
  );
});
