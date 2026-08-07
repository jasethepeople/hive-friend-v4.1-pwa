const CACHE = "hive-v4.1";
const ASSETS = ["/", "/manifest.json", "/icons/icon-192x192.png"];
self.addEventListener("install", e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS))); self.skipWaiting(); });
self.addEventListener("activate", e => { e.waitUntil(caches.keys().then(n => Promise.all(n.filter(n => n !== CACHE).map(n => caches.delete(n))))); self.clients.claim(); });
self.addEventListener("fetch", e => {
  if (e.request.url.includes("/api/") || e.request.url.includes(":8080")) { e.respondWith(fetch(e.request).catch(() => new Response(JSON.stringify({ offline: true }), { headers: { "Content-Type": "application/json" } }))); return; }
  e.respondWith(caches.match(e.request).then(c => c || fetch(e.request).then(r => { if (r.ok) caches.open(CACHE).then(c => c.put(e.request, r.clone())); return r; })));
});