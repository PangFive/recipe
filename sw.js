/* Buku Resep Seduh — service worker
   Naikkan VERSION setiap kali index.html diubah. */
const VERSION = "resep-seduh-v15";
const CACHE = VERSION;

const ASSETS = [
  "./",
  "index.html",
  "manifest.webmanifest",
  "icon-192.png",
  "icon-512.png",
  "icon-maskable-512.png"
];

self.addEventListener("install", e => {
  e.waitUntil((async () => {
    const c = await caches.open(CACHE);
    // Satu file yang hilang tidak boleh menggagalkan pemasangan.
    await Promise.all(ASSETS.map(u => c.add(u).catch(() => {})));
    self.skipWaiting();
  })());
});

self.addEventListener("activate", e => {
  e.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)));
    await self.clients.claim();
  })());
});

self.addEventListener("fetch", e => {
  const req = e.request;
  if(req.method !== "GET") return;

  // Halaman: jaringan dulu, cache kalau offline.
  if(req.mode === "navigate"){
    e.respondWith((async () => {
      try{
        const res = await fetch(req);
        const c = await caches.open(CACHE);
        c.put("index.html", res.clone());
        return res;
      }catch(err){
        return (await caches.match("index.html", {ignoreSearch: true})) || Response.error();
      }
    })());
    return;
  }

  // Sisanya: pakai cache kalau ada, sambil perbarui di latar.
  e.respondWith((async () => {
    const hit = await caches.match(req);
    const net = fetch(req).then(res => {
      if(res && res.status === 200 && res.type !== "opaque"){
        caches.open(CACHE).then(c => c.put(req, res.clone()));
      }
      return res;
    }).catch(() => hit);
    return hit || net;
  })());
});
