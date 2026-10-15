// Network-first: members always get the newest version; the cache is only a fallback when offline.
const V = "ymsdi-pay-v1", SHELL = ["pay.html","learn.html","terms.html","privacy.html","manifest.webmanifest","icon-192.png","icon-512.png"];
self.addEventListener("install", e => { e.waitUntil(caches.open(V).then(c => c.addAll(SHELL)).then(() => self.skipWaiting())); });
self.addEventListener("activate", e => { e.waitUntil(caches.keys().then(k => Promise.all(k.filter(x => x !== V).map(x => caches.delete(x)))).then(() => self.clients.claim())); });
self.addEventListener("fetch", e => {
  const r = e.request, u = new URL(r.url);
  if (r.method !== "GET" || u.origin !== location.origin || u.pathname.includes("admin")) return;   // never touch the API, other sites or admin
  e.respondWith(fetch(r).then(res => { const copy = res.clone(); caches.open(V).then(c => c.put(r, copy)); return res; })
    .catch(() => caches.match(r).then(m => m || caches.match("pay.html"))));
});
