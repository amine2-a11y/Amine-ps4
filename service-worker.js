/* Optional modern offline cache; AppCache remains the primary fallback for older PS4 WebKit. */
const CACHE_NAME = 'ps4-13-main-offline-v2026-08-25';
const CORE = [
  './', './index.html', './run_chain.html', './run_lapse.html', './PS4_13.00_Webkit.html',
  './chain_poops.js', './chain_lapse.js', './core.js', './mem.js', './int64.js',
  './ps4_offsets.js', './rpc_worker.js', './payload.bin', './preview.png', './sysctl.html', './sysctl.js'
];
self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE_NAME).then(c => c.addAll(CORE)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', event => {
  event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;
  event.respondWith(caches.match(event.request).then(cached => cached || fetch(event.request).then(response => {
    const copy = response.clone();
    caches.open(CACHE_NAME).then(c => c.put(event.request, copy));
    return response;
  }).catch(() => caches.match('./index.html'))));
});
