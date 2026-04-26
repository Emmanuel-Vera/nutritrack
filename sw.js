const CACHE_NAME = 'nutritrack-v2';
const ASSETS = [
    './',
    './index.html',
    'https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,600;0,9..144,800;1,9..144,400&family=Work+Sans:wght@300;400;500;600;700&display=swap'
];

self.addEventListener('install', e => {
    e.waitUntil(
        caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS))
    );
    self.skipWaiting();
});

self.addEventListener('activate', e => {
    e.waitUntil(
        caches.keys().then(keys =>
            Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
        )
    );
    self.clients.claim();
});

self.addEventListener('fetch', e => {
    e.respondWith(
        caches.match(e.request).then(cached => {
            if (cached) return cached;
            return fetch(e.request).then(resp => {
                const clone = resp.clone();
                caches.open(CACHE_NAME).then(cache => cache.put(e.request, clone));
                return resp;
            }).catch(() => caches.match('./'));
        })
    );
});
