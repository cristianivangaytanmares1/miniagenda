
const CACHE_NAME = "my-todo-list-v1";

const ASSETS = [
    "./",
    "./index.html",
    "./manifest.json",
    "./styles/styles.min.css",
    "./js/app.js",
    "./assets/icons/icon-192x192.png",
    "./assets/icons/icon-256x256.png",
    "./assets/icons/icon-384x384.png",
    "./assets/icons/icon-512x512.png"
];

// INSTALACIÓN
self.addEventListener("install", event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => cache.addAll(ASSETS))
            .then(() => self.skipWaiting())
    );
});

// ACTIVACIÓN
self.addEventListener("activate", event => {
    event.waitUntil(
        caches.keys()
            .then(keys => Promise.all(
                keys
                    .filter(key => key !== CACHE_NAME)
                    .map(key => caches.delete(key))
            ))
            .then(() => self.clients.claim())
    );
});

// FUNCIONAMIENTO SIN INTERNET
self.addEventListener("fetch", event => {
    const request = event.request;

    if (
        request.method !== "GET" ||
        new URL(request.url).origin !== self.location.origin
    ) {
        return;
    }

    event.respondWith(
        caches.match(request).then(cachedResponse => {
            if (cachedResponse) {
                return cachedResponse;
            }

            if (request.mode === "navigate") {
                return caches.match("./index.html");
            }

            return fetch(request);
        })
    );
});
