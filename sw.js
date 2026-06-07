const CACHE = 'mario-runner-v1';
const ASSETS = [
    './',
    './index.html',
    './style.css',
    './game.js',
    './sprites.js',
    './audio.js',
    './manifest.json',
    './icons/icon.svg'
];

// Instala e pré-cacheia todos os assets do jogo
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE).then(cache => cache.addAll(ASSETS))
    );
    self.skipWaiting();
});

// Remove caches antigas ao ativar nova versão
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(keys =>
            Promise.all(
                keys.filter(k => k !== CACHE).map(k => caches.delete(k))
            )
        )
    );
    self.clients.claim();
});

// Cache-first para assets locais; network-first para fontes externas
self.addEventListener('fetch', event => {
    const url = new URL(event.request.url);

    // Ignorar requisições externas (Google Fonts etc.) — só passa para a rede
    if (url.origin !== self.location.origin) return;

    event.respondWith(
        caches.match(event.request).then(cached => {
            if (cached) return cached;
            return fetch(event.request).then(response => {
                if (response && response.ok) {
                    const clone = response.clone();
                    caches.open(CACHE).then(c => c.put(event.request, clone));
                }
                return response;
            });
        })
    );
});
