// Nome do cache
const CACHE_NAME = 'v1_cache_react_app';
const urlsToCache = [
  '/', // Cache a página principal
  '/index.html',
  '/static/css/main.css',
  '/static/js/main.js',
  '/static/js/bundle.js',
  '/logo192.png', // Adicione o logo se estiver usando
];

// Durante a fase de instalação, cacheie os arquivos estáticos
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Cache aberto');
        return cache.addAll(urlsToCache);
      })
  );
});

// Intercepta as requisições de rede e tenta servir os arquivos do cache
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        if (response) {
          return response; // Retorne do cache se disponível
        }
        return fetch(event.request); // Se não estiver no cache, busque na rede
      })
  );
});

// Atualize o Service Worker e limpe caches antigos
self.addEventListener('activate', (event) => {
  const cacheWhitelist = [CACHE_NAME];

  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName); // Exclua caches antigos
          }
        })
      );
    })
  );
});
