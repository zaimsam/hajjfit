/* HAJJFIT offline support: always fetch the latest version when online; use the saved copy when offline. */
const CACHE = "hajjfit-v2";
const CORE = ["./", "./index.html", "./manifest.json", "./icon-192.png", "./icon-512.png", "./apple-touch-icon.png"];
self.addEventListener("install", e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(CORE)).then(() => self.skipWaiting())); });
self.addEventListener("activate", e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener("fetch", e => {
  if (e.request.method !== "GET") return;
  e.respondWith(caches.open(CACHE).then(c =>
    fetch(e.request, { cache: "no-cache" }).then(r => { if (r && r.ok) c.put(e.request, r.clone()); return r; })
      .catch(() => c.match(e.request).then(h => h || c.match("./index.html")))
  ));
});
