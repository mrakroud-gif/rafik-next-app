const CACHE = 'rafik-v1';
const CORE = ['/', '/chat', '/manifest.webmanifest', '/logo.svg'];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(CORE)));
  self.skipWaiting();
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (e) => {
  const req = e.request;
  const url = new URL(req.url);

  // Ne rien intercepter hors même origine
  if (url.origin !== self.location.origin) return;

  // Ne JAMAIS intercepter les assets Next/HMR/dev
  if (
    url.pathname.startsWith('/_next/') ||
    url.pathname.startsWith('/__nextjs/') ||
    url.pathname.includes('webpack-hmr') ||
    url.pathname.includes('.hot-update.')
  ) return;

  // Ne pas intercepter l'API et les requêtes non-GET
  if (url.pathname.startsWith('/api/') || req.method !== 'GET') return;

  // SWR basique
  e.respondWith((async () => {
    const cache = await caches.open(CACHE);
    const cached = await cache.match(req);
    const fetchPromise = fetch(req).then(res => {
      if (res && res.status === 200) cache.put(req, res.clone());
      return res;
    }).catch(() => cached || Response.error());
    return cached || fetchPromise;
  })());
});
