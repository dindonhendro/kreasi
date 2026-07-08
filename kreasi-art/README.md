# kreasi.art — Terapi Seni Kreatif

Website workshop seni terapi ("Menenangkan Pikiran Sambil Berkarya") yang dibangun
sesuai [PRDInit.md](../PRDInit.md): Vite + React, animasi penuh dengan GSAP,
scene 3D persisten dengan Three.js, dan smooth scrolling Lenis.

## Menjalankan

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # produksi → dist/
```

## Arsitektur (sesuai PRD §9)

| Layer | Implementasi |
|---|---|
| DOM | Komponen React per seksi ([src/components](src/components)) |
| 3D | Canvas R3F fixed-fullscreen yang persisten ([src/three/Scene.jsx](src/three/Scene.jsx)) |
| Animasi | GSAP (SplitText, ScrollTrigger) mengorkestrasi DOM + 3D bersamaan |
| Scroll | Lenis, tersinkron dengan ScrollTrigger ([src/hooks/useLenis.js](src/hooks/useLenis.js)) |
| State | Zustand ([src/store/useStore.js](src/store/useStore.js)) — tema, pointer, burst partikel |

## Fitur animasi

- **Preloader** dengan animasi huruf dan progress bar.
- **Hero SplitText** — judul teranimasi per karakter setelah webfont siap.
- **Scene 3D persisten** — pot keramik (LatheGeometry), gelang tanah liat, kuas,
  dan simpul canting yang mengikuti gerakan mouse dan progres scroll.
- **Shader dither GLSL** (Bayer 4×4) sebagai backdrop bergaya risograph.
- **Tema adaptif** — tiap seksi memiliki `data-theme`; ScrollTrigger men-tween CSS
  variables sekaligus warna material 3D (studio → calm → batik → pottery → dusk).
- **Partikel reaktif** — hover kartu kategori memicu particle burst dengan warna
  kategori; juga menyala saat pendaftaran berhasil.
- **Filter workshop** (usia / jenis / durasi) dengan re-animasi kartu.
- **Modal detail + pendaftaran** — pilih slot jadwal, isi data, status sukses.

## Backend (InsForge, PRD §6)

Terhubung ke project InsForge "kreasi" via `@insforge/sdk`
([src/api/client.js](src/api/client.js)). Konfigurasi di `.env`
(lihat [.env.example](.env.example)): `VITE_INSFORGE_URL` + `VITE_INSFORGE_ANON_KEY`
(anon key: `npx @insforge/cli secrets get ANON_KEY`). Tanpa env tersebut, situs
memakai data demo lokal di [src/data/workshops.js](src/data/workshops.js).

Skema (migrasi di [../migrations](../migrations)):

- `workshops` — katalog, publik read-only.
- `workshop_schedules` — slot jadwal; `seats_taken` dijaga trigger
  (klaim saat daftar, rilis saat batal, tolak jika penuh).
- `registrations` — pendaftaran guest/user, append-only dari klien;
  `status` + `payment_status` sesuai PRD.
- `profiles` — user/instruktur dengan proteksi eskalasi role.

Semua tabel ber-RLS: katalog publik, pendaftaran hanya terbaca pemiliknya
dan instruktur workshop terkait.

## Studio Portal (tombol "Masuk" di navbar, atau buka `#portal`)

Satu pintu login ([src/components/Portal.jsx](src/components/Portal.jsx));
dashboard menyesuaikan peran di tabel `profiles`:

| Peran | Kemampuan |
|---|---|
| `user` | "Workshop Saya" — daftar pendaftaran + status kehadiran/pembayaran |
| `instructor` | Kelas yang diajar, jadwal, daftar peserta, ubah status kehadiran |
| `admin` | Tambah/hapus workshop, kelola slot jadwal, semua pendaftaran + status |

Akun demo (ganti kata sandi sebelum produksi — email verification saat ini
dinonaktifkan via `insforge.toml`):

- Admin: `admin@kreasi.art` / `KreasiAdmin!2026`
- Instruktur: `sari@` `dinda@` `bayu@` `ratna@` `laras@kreasi.art`
  / `Kreasi<Nama>!2026` (cth. `KreasiSari!2026`)
- Peserta demo: `peserta@kreasi.art` / `KreasiPeserta!2026`

Pendaftaran workshop oleh pengguna yang sedang login otomatis terhubung ke
akunnya (`user_id`) dan muncul di "Workshop Saya".

## Halaman Pengalaman (scroll-animated, per kategori)

Enam halaman sinematik bergaya "Apple product page" di
[public/experience](public/experience) — video prosedural (seamless loop, 5 dtk)
diubah menjadi animasi frame-by-frame yang dimainkan lewat scroll, lengkap
dengan dwell engine, partikel ambient, film grain, kartu glass morphism, dan
galeri paralaks. Tautan "✦ Rasakan vibe-nya" ada di kartu kategori dan modal
workshop (`/experience/<kategori>/index.html`).

Tiap folder berisi `video.mp4` (sumber), `frames/` (WebP desktop+mobile +
manifest), dan `index.html` (halaman mandiri tanpa dependensi). Video dibuat
prosedural secara lokal (Node + ffmpeg) karena kredit Higgsfield habis — bila
kredit tersedia, ganti `video.mp4` lalu jalankan ulang ekstraksi frame untuk
memakai video AI.
