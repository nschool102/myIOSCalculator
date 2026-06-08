const CACHE_NAME = "app-cache-v1";

const FILES = [
  "./",
  "./index.html",
  "./manifest.json",
  "./build.txt"
];

self.addEventListener("install", event => {

  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(FILES))
  );

  self.skipWaiting();

});

self.addEventListener("activate", event => {

  event.waitUntil(

    caches.keys().then(keys =>
      Promise.all(
        keys.map(key => {

          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }

        })
      )
    )

  );

  self.clients.claim();

});

self.addEventListener("fetch", event => {

  event.respondWith(

    fetch(event.request)

      .then(response => {

        const clone = response.clone();

        caches.open(CACHE_NAME)
          .then(cache => cache.put(event.request, clone));

        return response;

      })

      .catch(() => caches.match(event.request))

  );

});