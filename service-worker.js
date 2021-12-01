/* global self, caches, fetch */
/* eslint-disable no-restricted-globals */

const CACHE = 'cache-3055ca5';

self.addEventListener('install', e => {
  e.waitUntil(precache()).then(() => self.skipWaiting());
});

self.addEventListener('activate', event => {
  self.clients
    .matchAll({
      includeUncontrolled: true,
    })
    .then(clientList => {
      const urls = clientList.map(client => client.url);
      console.log('[ServiceWorker] Matching clients:', urls.join(', '));
    });

  event.waitUntil(
    caches
      .keys()
      .then(cacheNames =>
        Promise.all(
          cacheNames.map(cacheName => {
            if (cacheName !== CACHE) {
              console.log('[ServiceWorker] Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
            return null;
          })
        )
      )
      .then(() => {
        console.log('[ServiceWorker] Claiming clients for version', CACHE);
        return self.clients.claim();
      })
  );
});

function precache() {
  return caches.open(CACHE).then(cache => cache.addAll(["./","./colophon.html","./index.html","./manifest.json","./favicon.png","./osudy_dobreho_vojaka_svejka_iii_iv_001.html","./osudy_dobreho_vojaka_svejka_iii_iv_002.html","./osudy_dobreho_vojaka_svejka_iii_iv_006.html","./osudy_dobreho_vojaka_svejka_iii_iv_007.html","./osudy_dobreho_vojaka_svejka_iii_iv_005.html","./osudy_dobreho_vojaka_svejka_iii_iv_008.html","./osudy_dobreho_vojaka_svejka_iii_iv_009.html","./osudy_dobreho_vojaka_svejka_iii_iv_011.html","./osudy_dobreho_vojaka_svejka_iii_iv_010.html","./osudy_dobreho_vojaka_svejka_iii_iv_012.html","./osudy_dobreho_vojaka_svejka_iii_iv_013.html","./resources.html","./resources/image001_fmt.jpeg","./resources/image003_fmt.jpeg","./resources/image004_fmt.jpeg","./resources/index.xml","./resources/obalka_osudy_dobreho_v_fmt.jpeg","./resources/upoutavka_eknihy_fmt.jpeg","./scripts/bundle.js","./style/style.min.css"]));
}

self.addEventListener('fetch', e => {
  e.respondWith(
    caches.open(CACHE).then(cache => {
      return cache.match(e.request).then(matching => {
        if (matching) {
          console.log('[ServiceWorker] Serving file from cache.');
          console.log(e.request);
          return matching;
        }

        return fetch(e.request);
      });
    })
  );
});
