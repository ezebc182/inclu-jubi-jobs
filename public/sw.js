/**
 * Service Worker — JubiJobs / InclúJobs
 *
 * Sin librerías: Workbox trae 40 KB para lo que acá se resuelve en 150 líneas
 * legibles. Menos peso en la red de un usuario que puede estar con 3G en el
 * conurbano, y cero magia que después nadie sabe depurar.
 *
 * Estrategias:
 *   - Navegación (HTML) → network-first con timeout, fallback a /offline
 *   - Assets de Next    → cache-first (llevan hash en el nombre, son inmutables)
 *   - Imágenes          → stale-while-revalidate
 *   - POST / actions    → SIEMPRE red. Nunca se cachea una mutación.
 */

const VERSION = "v1";
const SHELL_CACHE = `shell-${VERSION}`;
const PAGES_CACHE = `pages-${VERSION}`;
const ASSETS_CACHE = `assets-${VERSION}`;
const IMAGES_CACHE = `images-${VERSION}`;

const OFFLINE_URL = "/offline";
const MAX_PAGES = 50;
const MAX_IMAGES = 60;
const NETWORK_TIMEOUT_MS = 4000;

/** Recursos mínimos para que la app abra sin conexión. */
const PRECACHE_URLS = [OFFLINE_URL];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(SHELL_CACHE)
      .then((cache) => cache.addAll(PRECACHE_URLS))
      // Si el precache falla no queremos abortar la instalación entera:
      // la app sigue funcionando online.
      .catch(() => undefined)
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  const keep = new Set([SHELL_CACHE, PAGES_CACHE, ASSETS_CACHE, IMAGES_CACHE]);

  event.waitUntil(
    caches
      .keys()
      .then((names) =>
        Promise.all(
          names
            .filter((name) => !keep.has(name))
            .map((name) => caches.delete(name))
        )
      )
      .then(() => self.clients.claim())
  );
});

/** Permite que la página fuerce la activación de un SW nuevo. */
self.addEventListener("message", (event) => {
  if (event.data === "SKIP_WAITING") self.skipWaiting();
});

/** Poda LRU simple: los caches del navegador no son infinitos. */
async function trimCache(cacheName, maxEntries) {
  const cache = await caches.open(cacheName);
  const keys = await cache.keys();
  if (keys.length <= maxEntries) return;
  await Promise.all(
    keys.slice(0, keys.length - maxEntries).map((key) => cache.delete(key))
  );
}

function timeout(ms) {
  return new Promise((_, reject) =>
    setTimeout(() => reject(new Error("timeout")), ms)
  );
}

/**
 * Navegación: intentamos red primero para no servir avisos viejos, pero con
 * techo de tiempo. Si la red tarda o falla, entregamos lo cacheado y, en
 * último caso, la página offline.
 */
async function handleNavigation(request) {
  try {
    const response = await Promise.race([
      fetch(request),
      timeout(NETWORK_TIMEOUT_MS),
    ]);

    if (response && response.ok) {
      const copy = response.clone();
      caches
        .open(PAGES_CACHE)
        .then((cache) => cache.put(request, copy))
        .then(() => trimCache(PAGES_CACHE, MAX_PAGES))
        .catch(() => undefined);
    }
    return response;
  } catch {
    const cached = await caches.match(request);
    if (cached) return cached;

    const offline = await caches.match(OFFLINE_URL);
    if (offline) return offline;

    return new Response("Sin conexión", {
      status: 503,
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  }
}

/** Assets con hash en el nombre: si están en cache, no hace falta la red. */
async function handleAsset(request, cacheName, maxEntries) {
  const cached = await caches.match(request);
  if (cached) return cached;

  const response = await fetch(request);
  if (response && response.ok) {
    const copy = response.clone();
    caches
      .open(cacheName)
      .then((cache) => cache.put(request, copy))
      .then(() => (maxEntries ? trimCache(cacheName, maxEntries) : undefined))
      .catch(() => undefined);
  }
  return response;
}

/** Imágenes: mostramos lo cacheado y refrescamos por detrás. */
async function handleImage(request) {
  const cached = await caches.match(request);

  const network = fetch(request)
    .then((response) => {
      if (response && response.ok) {
        const copy = response.clone();
        caches
          .open(IMAGES_CACHE)
          .then((cache) => cache.put(request, copy))
          .then(() => trimCache(IMAGES_CACHE, MAX_IMAGES))
          .catch(() => undefined);
      }
      return response;
    })
    .catch(() => cached);

  return cached || network;
}

self.addEventListener("fetch", (event) => {
  const { request } = event;

  // Nunca tocamos mutaciones ni peticiones cross-origin.
  if (request.method !== "GET") return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  // Auth y API siempre van a la red: cachear una sesión es un agujero.
  if (url.pathname.startsWith("/api/")) return;

  if (request.mode === "navigate") {
    event.respondWith(handleNavigation(request));
    return;
  }

  if (url.pathname.startsWith("/_next/static/")) {
    event.respondWith(handleAsset(request, ASSETS_CACHE));
    return;
  }

  if (
    request.destination === "image" ||
    url.pathname.startsWith("/_next/image")
  ) {
    event.respondWith(handleImage(request));
    return;
  }

  if (request.destination === "font" || request.destination === "style") {
    event.respondWith(handleAsset(request, ASSETS_CACHE));
  }
});
