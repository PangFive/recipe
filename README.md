# Buku Resep Seduh

Aplikasi resep kopi pribadi: manual brew bertimer, racikan kopi susu dan cold brew, serta catatan rasio konsentrat. Berjalan sepenuhnya di perangkat, tanpa server dan tanpa akun.

## Cara hosting di GitHub Pages

1. Buat repo baru di GitHub, misalnya `resep-seduh`.
2. Unggah **seluruh isi folder ini** ke root repo (bukan foldernya, tapi isinya):
   ```
   index.html
   manifest.webmanifest
   sw.js
   .nojekyll
   assets/
   icons/
   ```
   Lewat web: tombol **Add file → Upload files**, seret semuanya, lalu Commit.

   Lewat git:
   ```bash
   git init
   git add .
   git commit -m "Buku resep seduh"
   git branch -M main
   git remote add origin https://github.com/PangFive/resep-seduh.git
   git push -u origin main
   ```
3. Buka **Settings → Pages**. Bagian *Source* pilih **Deploy from a branch**, branch `main`, folder `/ (root)`, lalu Save.
4. Tunggu satu sampai dua menit. Alamatnya menjadi:
   `https://PangFive.github.io/resep-seduh/`

Semua path di aplikasi ini relatif, jadi tetap jalan walau ada di subfolder repo.

## Cara memasang di HP

- **Android / Chrome**: buka alamatnya, akan muncul banner "Pasang ke layar utama". Kalau tidak muncul, pakai menu titik tiga → *Tambahkan ke layar utama* / *Install app*.
- **iPhone / Safari**: tombol Bagikan → *Tambahkan ke Layar Utama*.

Setelah terpasang, aplikasi dibuka tanpa address bar dan tetap bisa dipakai offline karena semua file di-cache oleh service worker.

## Menyimpan dan memindah data

Resep buatan sendiri, hasil edit, dan tanda bintang disimpan di `localStorage` perangkat itu saja. Di beranda ada tombol:

- **Ekspor data** — mengunduh file JSON berisi semua perubahanmu.
- **Impor data** — memuat kembali file itu di HP atau browser lain.

Menghapus data situs di browser akan menghapus resep buatanmu juga, jadi ekspor sesekali.

## Kalau aplikasi diperbarui

Setelah mengubah `index.html`, naikkan nomor versi di baris pertama `sw.js`:

```js
const VERSION = "resep-seduh-v2";
```

Tanpa itu, HP yang sudah memasang aplikasi bisa tetap memakai versi lama dari cache.

## Isi folder

| File | Fungsi |
|---|---|
| `index.html` | seluruh aplikasi: data resep, tampilan, timer, editor |
| `sw.js` | service worker, membuat aplikasi jalan offline |
| `manifest.webmanifest` | nama, ikon, warna, mode standalone |
| `assets/` | anime.js dan canvas-confetti, dibundel lokal |
| `icons/` | ikon aplikasi 192/512 px dan versi maskable |
| `.nojekyll` | mencegah GitHub Pages memproses ulang file |

Font Fraunces dan Inter diambil dari Google Fonts saat online, dan otomatis turun ke font bawaan sistem kalau tidak tersedia.
