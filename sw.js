// Plan-Run service worker : cache-first app shell for offline use.
// Bump CACHE when you change any cached file so clients refresh.
const CACHE = "plan-run-v1";
const SHELL = [
  "./",
  "./index.html",
  "./manifest.webmanifest",
  "./icons/icon-192.png",
  "./icons/icon-512.png",
  "./icons/icon-maskable-512.png",
];

self.addEventListener("install", (e) => {
  e.waitUntil(
    caches
      .open(CACHE)
      .then((c) => c.addAll(SHELL))
      .then(() => self.skipWaiting()),
  );
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)),
        ),
      )
      .then(() => self.clients.claim()),
  );
});

self.addEventListener("fetch", (e) => {
  const req = e.request;
  if (req.method !== "GET") return;
  // network-first for navigations (so updates land), cache fallback offline
  if (req.mode === "navigate") {
    e.respondWith(
      fetch(req)
        .then((r) => {
          const cp = r.clone();
          caches.open(CACHE).then((c) => c.put("./index.html", cp));
          return r;
        })
        .catch(() => caches.match("./index.html")),
    );
    return;
  }
  // cache-first for everything else (shell + cross-origin fonts)
  e.respondWith(
    caches.match(req).then(
      (hit) =>
        hit ||
        fetch(req)
          .then((r) => {
            if (
              r &&
              r.status === 200 &&
              (req.url.startsWith(self.location.origin) ||
                req.url.includes("fonts.g"))
            ) {
              const cp = r.clone();
              caches.open(CACHE).then((c) => c.put(req, cp));
            }
            return r;
          })
          .catch(() => hit),
    ),
  );
});
