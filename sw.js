const CACHE_NAME = 'betnet-v1';
const urlsToCache = [
  '/',
  'index.html',
  'webmanifest.json'
];

// Instalação
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('Arquivos em cache!');
      return cache.addAll(urlsToCache);
    })
  );
});

// Interceptar requisições (permite funcionar offline)
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});