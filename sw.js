/* Buku Resep Seduh — service worker
   Naikkan nomor VERSI setiap kali isi aplikasi diubah,
   supaya perangkat mengambil versi terbaru. */
const VERSION = "resep-seduh-v1";
const SHELL = VERSION + "-shell";
const RUNTIME = VERSION + "-runtime";

const ASSETS = [
  "./",
  "./index.html",
  "./manifest.webmanifest",
  "./assets/anime.min.js",
  "./assets/confetti.min.js",
  "./icons/icon-192.png",
  "./icons/icon-512.png",
  "./icons/maskable-512.png",
  "./icons/apple-touch-icon.png",
  "./icons/favicon-32.png"
];

self.addEventListener("install", e => {
  e.waitUntil(
    caches.open(SHELL)
      .then(c => c.addAll(ASSETS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(
        keys.filter(k => k !== SHELL && k !== RUNTIME).map(k => caches.delete(k))
      ))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", e => {
  const req = e.request;
  if(req.method !== "GET") return;

  // Halaman: coba jaringan dulu, jatuh ke cache kalau offline.
  if(req.mode === "navigate"){
    e.respondWith(
      fetch(req)
        .then(res => {
          const copy = res.clone();
          caches.open(SHELL).then(c => c.put("./index.html", copy));
          return res;
        })
        .catch(() => caches.match("./index.html", {ignoreSearch: true}))
    );
    return;
  }

  const sameOrigin = new URL(req.url).origin === self.location.origin;

  // Aset sendiri: cache dulu, perbarui di latar belakang.
  if(sameOrigin){
    e.respondWith(
      caches.match(req).then(hit => {
        const net = fetch(req).then(res => {
          if(res && res.status === 200){
            const copy = res.clone();
            caches.open(SHELL).then(c => c.put(req, copy));
          }
          return res;
        }).catch(() => hit);
        return hit || net;
      })
    );
    return;
  }

  // Font Google dan sumber luar lain: pakai cache kalau ada, simpan kalau berhasil.
  e.respondWith(
    caches.match(req).then(hit => hit || fetch(req).then(res => {
      const copy = res.clone();
      caches.open(RUNTIME).then(c => c.put(req, copy));
      return res;
    }).catch(() => hit))
  );
});
