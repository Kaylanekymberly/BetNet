const CACHE_NAME = 'betnet-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/popup.html',
  '/manifest.json'
];

// Instalando o Service Worker e salvando arquivos no cache
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(urlsToCache);
    })
  );
});

// Fazendo o App responder mesmo sem internet
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/service-worker.js')
        .then(reg => console.log('Proteção BetNet Ativa!', reg))
        .catch(err => console.log('Erro ao ativar proteção:', err));
    });
  }
