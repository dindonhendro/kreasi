-- Seed the arte.coffee workshop catalog (initial content; managed by admins).
-- Deterministic UUIDs (…-4000-8000-…) so schedules can reference workshops
-- and future migrations can address these rows.

insert into public.workshops
  (id, title, description, category, category_id, age_group, duration_hours, price, instructor_name, max_participants)
values
  ('10000000-0000-4000-8000-000000000001',
   'Batik Gutta Tamarind: Selendang Pertamamu',
   'Belajar melukis motif batik di atas selendang sutra menggunakan pasta gutta tamarind — teknik yang aman, tanpa lilin panas, dan cocok untuk segala usia. Kamu akan pulang membawa selendang karyamu sendiri.',
   'Batik', 'batik', 'Adult', 3, 350000, 'Ibu Sari Wulandari', 12),
  ('10000000-0000-4000-8000-000000000002',
   'Batik Cilik: Sapu Tangan Ceria',
   'Workshop batik khusus anak-anak (6–12 tahun). Dengan gutta tamarind yang aman, si kecil bebas berkreasi mewarnai sapu tangan dengan motif favoritnya.',
   'Batik', 'batik', 'Kids', 1.5, 175000, 'Kak Dinda Ayu', 15),
  ('10000000-0000-4000-8000-000000000003',
   'Hand-Building Pottery: Mug & Mangkuk',
   'Rasakan terapi memijat tanah liat. Teknik pinch dan coil untuk membentuk mug atau mangkuk unik. Karya akan dibakar dan bisa diambil dua minggu kemudian.',
   'Pottery', 'pottery', 'Adult', 2.5, 425000, 'Mas Bayu Aji', 10),
  ('10000000-0000-4000-8000-000000000004',
   'Wheel Throwing untuk Pemula',
   'Duduk di depan roda putar dan biarkan tanganmu belajar. Sesi intensif kecil (maks. 6 orang) dengan pendampingan penuh dari instruktur.',
   'Pottery', 'pottery', 'Adult', 3.5, 550000, 'Mas Bayu Aji', 6),
  ('10000000-0000-4000-8000-000000000005',
   'Melukis Bebas: Akrilik di Kanvas',
   'Tidak perlu bisa menggambar — cukup datang dan biarkan warna bicara. Sesi melukis intuitif dengan panduan ringan, kanvas 30×40 cm untuk dibawa pulang.',
   'Painting', 'painting', 'Adult', 2, 285000, 'Ibu Ratna Dewi', 14),
  ('10000000-0000-4000-8000-000000000006',
   'Cat Air Santai untuk Lansia',
   'Kelas cat air bertempo lambat dengan tema bunga dan pemandangan. Dirancang khusus agar nyaman untuk peserta senior — kursi ergonomis dan istirahat teh.',
   'Painting', 'painting', 'Senior', 2, 225000, 'Ibu Ratna Dewi', 10),
  ('10000000-0000-4000-8000-000000000007',
   'Punch Needle: Hiasan Dinding Mini',
   'Tusuk, tarik, ulangi — ritme punch needle terbukti menenangkan pikiran. Buat hiasan dinding bermotif abstrak dengan benang wol warna-warni.',
   'Punch Needle', 'punchneedle', 'Adult', 2.5, 265000, 'Kak Laras Putri', 12),
  ('10000000-0000-4000-8000-000000000008',
   'Art Journaling: Halaman Rasa',
   'Kolase, cap, tulisan tangan, dan warna — semua sah di halaman journalmu. Sesi reflektif untuk menuangkan emosi dalam bentuk visual.',
   'Journaling', 'journaling', 'Adult', 1.5, 195000, 'Kak Laras Putri', 16),
  ('10000000-0000-4000-8000-000000000009',
   'Tie Dye Keluarga: Kaos Pelangi',
   'Workshop seru untuk anak dan orang tua. Ikat, celup, dan buka kejutan motif pelangimu. Satu tiket termasuk dua kaos (anak + dewasa).',
   'Tie Dye', 'tiedye', 'Kids', 2, 295000, 'Kak Dinda Ayu', 20),
  ('10000000-0000-4000-8000-000000000010',
   'Ecoprint Daun: Totebag Alam',
   'Pukul-pukul daun segar di atas kain dan saksikan alam mencetak motifnya sendiri. Ramah lingkungan, memuaskan, dan hasilnya selalu satu-satunya di dunia.',
   'Tie Dye', 'tiedye', 'Senior', 2, 235000, 'Ibu Sari Wulandari', 12);

insert into public.workshop_schedules
  (workshop_id, label_date, label_time, seats_total, seats_taken, starts_at)
values
  -- Batik Gutta Tamarind (max 12)
  ('10000000-0000-4000-8000-000000000001', 'Sab, 18 Jul 2026', '09.00', 12, 7,  '2026-07-18 09:00+07'),
  ('10000000-0000-4000-8000-000000000001', 'Min, 19 Jul 2026', '13.00', 12, 10, '2026-07-19 13:00+07'),
  ('10000000-0000-4000-8000-000000000001', 'Sab, 25 Jul 2026', '09.00', 12, 12, '2026-07-25 09:00+07'),
  -- Batik Cilik (max 15)
  ('10000000-0000-4000-8000-000000000002', 'Min, 19 Jul 2026', '09.00', 15, 7,  '2026-07-19 09:00+07'),
  ('10000000-0000-4000-8000-000000000002', 'Min, 26 Jul 2026', '09.00', 15, 5,  '2026-07-26 09:00+07'),
  -- Hand-Building Pottery (max 10)
  ('10000000-0000-4000-8000-000000000003', 'Sab, 18 Jul 2026', '10.00', 10, 7,  '2026-07-18 10:00+07'),
  ('10000000-0000-4000-8000-000000000003', 'Sab, 18 Jul 2026', '15.00', 10, 4,  '2026-07-18 15:00+07'),
  -- Wheel Throwing (max 6)
  ('10000000-0000-4000-8000-000000000004', 'Min, 19 Jul 2026', '10.00', 6, 5,   '2026-07-19 10:00+07'),
  ('10000000-0000-4000-8000-000000000004', 'Min, 26 Jul 2026', '10.00', 6, 2,   '2026-07-26 10:00+07'),
  -- Melukis Bebas (max 14)
  ('10000000-0000-4000-8000-000000000005', 'Jum, 17 Jul 2026', '18.30', 14, 7,  '2026-07-17 18:30+07'),
  ('10000000-0000-4000-8000-000000000005', 'Sab, 25 Jul 2026', '14.00', 14, 5,  '2026-07-25 14:00+07'),
  -- Cat Air Santai (max 10)
  ('10000000-0000-4000-8000-000000000006', 'Rab, 22 Jul 2026', '09.30', 10, 4,  '2026-07-22 09:30+07'),
  -- Punch Needle (max 12)
  ('10000000-0000-4000-8000-000000000007', 'Sab, 18 Jul 2026', '13.00', 12, 8,  '2026-07-18 13:00+07'),
  ('10000000-0000-4000-8000-000000000007', 'Min, 26 Jul 2026', '13.00', 12, 1,  '2026-07-26 13:00+07'),
  -- Art Journaling (max 16)
  ('10000000-0000-4000-8000-000000000008', 'Jum, 17 Jul 2026', '16.00', 16, 7,  '2026-07-17 16:00+07'),
  ('10000000-0000-4000-8000-000000000008', 'Jum, 24 Jul 2026', '16.00', 16, 4,  '2026-07-24 16:00+07'),
  -- Tie Dye Keluarga (max 20)
  ('10000000-0000-4000-8000-000000000009', 'Min, 19 Jul 2026', '10.00', 20, 6,  '2026-07-19 10:00+07'),
  ('10000000-0000-4000-8000-000000000009', 'Min, 26 Jul 2026', '10.00', 20, 2,  '2026-07-26 10:00+07'),
  -- Ecoprint Daun (max 12)
  ('10000000-0000-4000-8000-000000000010', 'Kam, 23 Jul 2026', '09.30', 12, 4,  '2026-07-23 09:30+07');
