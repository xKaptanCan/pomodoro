// Pomodoro Timer - Service Worker for Offline Support
const CACHE_NAME = 'pomodoro-cache-v2';
const STATIC_ASSETS = [
    '/',
    '/index.html',
    '/manifest.json',

    // CSS
    '/css/style.css',
    '/css/themes.css',
    '/css/animations.css',
    '/css/v2-components.css',

    // JS Core
    '/js/storage.js',
    '/js/i18n.js',
    '/js/timer.js',
    '/js/notifications.js',
    '/js/settings.js',
    '/js/stats.js',
    '/js/tasks.js',
    '/js/app.js',

    // JS Modules
    '/js/achievements.js',
    '/js/tags.js',
    '/js/projects.js',
    '/js/themes.js',
    '/js/avatars.js',
    '/js/clockStyles.js',
    '/js/calendar.js',
    '/js/wellness.js',
    '/js/sounds.js',

    // Icons
    '/icons/favicon.svg',
    '/icons/icon-192.png',
    '/icons/icon-512.png',

    // Sound Files
    '/assets/sounds/rain.mp4',
    '/assets/sounds/forest.mp4',
    '/assets/sounds/cafe.mp4',
    '/assets/sounds/fire.mp4',
    '/assets/sounds/waves.mp4',
    '/assets/sounds/thunder.mp4',
    '/assets/sounds/wind.mp4',
    '/assets/sounds/crickets.mp4'
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('Caching static assets');
                return cache.addAll(STATIC_ASSETS);
            })
            .then(() => self.skipWaiting())
    );
});

// Activate event - clean old caches
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys()
            .then((cacheNames) => {
                return Promise.all(
                    cacheNames
                        .filter((name) => name !== CACHE_NAME)
                        .map((name) => caches.delete(name))
                );
            })
            .then(() => self.clients.claim())
    );
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
    // Skip non-GET requests
    if (event.request.method !== 'GET') return;

    // Skip external requests (CDN, fonts, etc.)
    if (!event.request.url.startsWith(self.location.origin)) return;

    event.respondWith(
        caches.match(event.request)
            .then((cachedResponse) => {
                if (cachedResponse) {
                    return cachedResponse;
                }

                return fetch(event.request)
                    .then((response) => {
                        // Don't cache non-successful responses
                        if (!response || response.status !== 200) {
                            return response;
                        }

                        // Clone and cache the response
                        const responseToCache = response.clone();
                        caches.open(CACHE_NAME)
                            .then((cache) => {
                                cache.put(event.request, responseToCache);
                            });

                        return response;
                    })
                    .catch(() => {
                        // Offline fallback for navigation requests
                        if (event.request.mode === 'navigate') {
                            return caches.match('/index.html');
                        }
                    });
            })
    );
});
