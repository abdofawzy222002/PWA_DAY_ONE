const CACHE_NAME = "product-App";

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
  console.log("myApp: installing ...");
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => {
        console.log("myApp sw: Cache opened - + ", CACHE_NAME);
        return cache.addAll(urlsToCache);
      })
      .then(() => {
        console.log("myApp SW: All files cached successfully");
        return self.skipWaiting();
      })
      .catch((error) => {
        console.error("myApp SW: Cached Faild: ", error);
      })
  );
});

self.addEventListener("activate", (event) => {
  console.log("myApp: activating ...");

  event.waitUntil(
    caches
      .keys()
      .then((keys) => {
        console.log("Found Caches: ", keys);
        return Promise.all(
          keys
            .filter((key) => {
              return key != CACHE_NAME;
            })
            .map((key) => {
              console.log("myApp SW: Deleting old caches: ", key);
              return caches.delete(key);
            })
        );
      })
      .then(() => {
        console.log("myApp SW: Activation completed ...");
        return self.clients.claim();
      })
      .catch((error) => {
        console.error("myApp SW: activation faild: ", error);
      })
  );
});

// http request cache !

self.addEventListener("fetch", (event) => {
  console.log("myApp: fetching ..., ", event.request.url);
  const url = new URL(event.request.url);

  if (
    url.protocol === "chrome-extension:" ||
    url.protocol === "moz-extension:"
  ) {
    return;
  }

  if (url.hostname === "jsonplaceholder.typicode.com") {
    event.respondWith(
      caches.match(event.request).then((cachedResponse) => {
        if (cachedResponse) {
          console.log(
            "myApp: this is a serving api response from cache:",
            event.request.url
          );
          return cachedResponse;
        }

        return fetch(event.request)
          .then((response) => {
            console.log(
              "myApp: API request success, caching response: ",
              event.request.url
            );
            const responseClone = response.clone();

            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, responseClone);
            });
            return response;
          })
          .catch(() => {
            console.log("myApp: API request faild");
            if (url.pathname.includes("/posts/")) {
              return caches.match("./offline-message.json");
            }

            return new Response(JSON.stringify([]), {
              headers: { "Content-Type": "application/json" },
            });
          });
      })
    );
    return;
  }

  if (url.origin !== location.origin) {
    return;
  }

  event.respondWith(
    caches
      .match(event.request)
      .then((response) => {
        if (response) {
          return response;
        }

        return fetch(event.request);
      })
      .catch(() => {
        console.log("Faild to fetch cached content....");

        return new Response("Offline - SW faild to fetch posts");
      })
  );
});
