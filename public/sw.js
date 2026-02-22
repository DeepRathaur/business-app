/**
 * Service Worker - Production caching
 * - Cache-first: static images, /_next/static (JS/CSS chunks)
 * - Network-first: API calls (never cache authenticated or API responses)
 */

const STATIC_CACHE = "airtel-static-v1";
const isApiOrAuth = (req) => {
  const u = req.url || "";
  const auth = req.headers.get("Authorization");
  if (auth) return true;
  if (u.includes("/bfe/") || u.includes("bfe/web") || u.includes("/api/")) return true;
  return false;
};

const isStaticAsset = (req) => {
  const u = new URL(req.url);
  if (u.pathname.startsWith("/_next/static/")) return true;
  if (u.pathname.startsWith("/images/") || u.pathname.startsWith("/images")) return true;
  const ext = u.pathname.split(".").pop()?.toLowerCase();
  if (["png", "jpg", "jpeg", "svg", "ico", "webp", "woff2", "woff", "ttf", "eot"].includes(ext)) return true;
  return false;
};

self.addEventListener("install", (e) => {
  self.skipWaiting();
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== STATIC_CACHE).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (e) => {
  const { request } = e;

  // Never cache API or authenticated requests
  if (isApiOrAuth(request)) {
    e.respondWith(fetch(request));
    return;
  }

  // Cache-first for static assets
  if (isStaticAsset(request)) {
    e.respondWith(
      caches.open(STATIC_CACHE).then((cache) =>
        cache.match(request).then((cached) => {
          if (cached) return cached;
          return fetch(request).then((res) => {
            if (res.ok && res.type === "basic") cache.put(request, res.clone());
            return res;
          });
        })
      )
    );
    return;
  }

  // Default: network first (no caching)
  e.respondWith(fetch(request));
});
