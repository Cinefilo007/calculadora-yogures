const CACHE_NAME = 'yogurt-pro-v2.8';
const ASSETS = [
    './',
    './index.html',
    './css/styles.css',
    './js/app.js',
    './js/ui/handlers.js',
    './js/logic/calculadora.js',
    './js/logic/crm_logic.js',
    './js/logic/calendar_logic.js',
    './js/services/bcv.js',
    './js/services/telemetria.js',
    './icons/icon-192.png',
    './icons/icon-512.png'
];

self.addEventListener('install', (e) => {
    e.waitUntil(
        caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
    );
});

self.addEventListener('fetch', (e) => {
    e.respondWith(
        caches.match(e.request).then((res) => res || fetch(e.request))
    );
});
