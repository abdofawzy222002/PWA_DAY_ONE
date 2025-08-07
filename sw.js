const CACHE_NAME = "product-app-v2";

const urlsToCache = [
  "./",
  "./index.html",
  "./about.html",
  "./contact.html",
  "./product.html",
  "./index.js",
  "./main.js",
  "./style.css",
  "./manifest.json",
  "./sw.js",
  "./images/icons/icon-192.png",
  "./images/icons/icon-512.png",
];

self.addEventListener("install", (event) => {
  console.log("Service Worker: Installing...");
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => {
        console.log("Caching app shell...");
        return cache.addAll(urlsToCache);
      })
      .then(() => self.skipWaiting())
      .catch((error) => console.error("Cache failed:", error))
  );
});

self.addEventListener("activate", (event) => {
  console.log("Service Worker: Activating...");
  event.waitUntil(
    caches
      .keys()
      .then((keys) => {
        return Promise.all(
          keys
            .filter((key) => key !== CACHE_NAME)
            .map((oldKey) => caches.delete(oldKey))
        );
      })
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);

  if (
    url.protocol.startsWith("chrome-extension") ||
    url.protocol.startsWith("moz-extension")
  ) {
    return;
  }

  if (url.hostname === "fakestoreapi.com") {
    event.respondWith(
      caches.match(event.request).then((cached) => {
        if (cached) {
          console.log("Serving API from cache:", event.request.url);
          return cached;
        }

        return fetch(event.request)
          .then((response) => {
            const responseClone = response.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, responseClone);
            });
            return response;
          })
          .catch(() => {
            return new Response(JSON.stringify([]), {
              headers: { "Content-Type": "application/json" },
            });
          });
      })
    );
    return;
  }


  event.respondWith(
    caches
      .match(event.request)
      .then((response) => response || fetch(event.request))
      .catch(() => {
        return new Response("Offline and content not cached", {
          headers: { "Content-Type": "text/plain" },
        });
      })
  );
});
