// Local fallback data — mirrors the InsForge `workshops` model
// (id, title, description, category, instructor_id, price, schedule, max_participants).
// Used when VITE_API_BASE_URL is not configured or the backend is unreachable.

export const CATEGORIES = [
  {
    id: 'batik',
    title: 'Batik Gutta Tamarind',
    desc: 'Melukis kain dengan teknik gutta tamarind yang ramah untuk semua usia.',
    color: '#b0722a',
    icon: 'batik',
  },
  {
    id: 'pottery',
    title: 'Pottery & Keramik',
    desc: 'Membentuk tanah liat menjadi karya — meditatif dan memuaskan.',
    color: '#c05f38',
    icon: 'pottery',
  },
  {
    id: 'painting',
    title: 'Melukis & Sketsa',
    desc: 'Eksplorasi warna di atas kanvas, dari akrilik hingga cat air.',
    color: '#7c6aa6',
    icon: 'painting',
  },
  {
    id: 'punchneedle',
    title: 'Punch Needle',
    desc: 'Seni benang modern yang menenangkan, cocok untuk pemula.',
    color: '#c4574e',
    icon: 'punchneedle',
  },
  {
    id: 'journaling',
    title: 'Art Journaling',
    desc: 'Menuangkan isi kepala lewat kolase, tulisan, dan gambar.',
    color: '#6f8a5e',
    icon: 'journaling',
  },
  {
    id: 'tiedye',
    title: 'Tie Dye & Ecoprint',
    desc: 'Bermain warna dan motif alami di atas kain.',
    color: '#3f8a8c',
    icon: 'tiedye',
  },
]

export const AGE_GROUPS = ['Semua', 'Kids', 'Adult', 'Senior']
export const TYPES = ['Semua', 'Batik', 'Pottery', 'Painting', 'Punch Needle', 'Journaling', 'Tie Dye']
export const DURATIONS = ['Semua', '< 2 jam', '2-3 jam', '> 3 jam']

export const WORKSHOPS = [
  {
    id: 'ws-batik-01',
    title: 'Batik Gutta Tamarind: Selendang Pertamamu',
    description:
      'Belajar melukis motif batik di atas selendang sutra menggunakan pasta gutta tamarind — teknik yang aman, tanpa lilin panas, dan cocok untuk segala usia. Kamu akan pulang membawa selendang karyamu sendiri.',
    category: 'Batik',
    categoryId: 'batik',
    ageGroup: 'Adult',
    duration: 3,
    price: 350000,
    instructor: 'Ibu Sari Wulandari',
    maxParticipants: 12,
    schedule: [
      { id: 's1', date: 'Sab, 18 Jul 2026', time: '09.00', left: 5 },
      { id: 's2', date: 'Min, 19 Jul 2026', time: '13.00', left: 2 },
      { id: 's3', date: 'Sab, 25 Jul 2026', time: '09.00', left: 0 },
    ],
  },
  {
    id: 'ws-batik-02',
    title: 'Batik Cilik: Sapu Tangan Ceria',
    description:
      'Workshop batik khusus anak-anak (6–12 tahun). Dengan gutta tamarind yang aman, si kecil bebas berkreasi mewarnai sapu tangan dengan motif favoritnya.',
    category: 'Batik',
    categoryId: 'batik',
    ageGroup: 'Kids',
    duration: 1.5,
    price: 175000,
    instructor: 'Kak Dinda Ayu',
    maxParticipants: 15,
    schedule: [
      { id: 's1', date: 'Min, 19 Jul 2026', time: '09.00', left: 8 },
      { id: 's2', date: 'Min, 26 Jul 2026', time: '09.00', left: 10 },
    ],
  },
  {
    id: 'ws-pottery-01',
    title: 'Hand-Building Pottery: Mug & Mangkuk',
    description:
      'Rasakan terapi memijat tanah liat. Teknik pinch dan coil untuk membentuk mug atau mangkuk unik. Karya akan dibakar dan bisa diambil dua minggu kemudian.',
    category: 'Pottery',
    categoryId: 'pottery',
    ageGroup: 'Adult',
    duration: 2.5,
    price: 425000,
    instructor: 'Mas Bayu Aji',
    maxParticipants: 10,
    schedule: [
      { id: 's1', date: 'Sab, 18 Jul 2026', time: '10.00', left: 3 },
      { id: 's2', date: 'Sab, 18 Jul 2026', time: '15.00', left: 6 },
    ],
  },
  {
    id: 'ws-pottery-02',
    title: 'Wheel Throwing untuk Pemula',
    description:
      'Duduk di depan roda putar dan biarkan tanganmu belajar. Sesi intensif kecil (maks. 6 orang) dengan pendampingan penuh dari instruktur.',
    category: 'Pottery',
    categoryId: 'pottery',
    ageGroup: 'Adult',
    duration: 3.5,
    price: 550000,
    instructor: 'Mas Bayu Aji',
    maxParticipants: 6,
    schedule: [
      { id: 's1', date: 'Min, 19 Jul 2026', time: '10.00', left: 1 },
      { id: 's2', date: 'Min, 26 Jul 2026', time: '10.00', left: 4 },
    ],
  },
  {
    id: 'ws-paint-01',
    title: 'Melukis Bebas: Akrilik di Kanvas',
    description:
      'Tidak perlu bisa menggambar — cukup datang dan biarkan warna bicara. Sesi melukis intuitif dengan panduan ringan, kanvas 30×40 cm untuk dibawa pulang.',
    category: 'Painting',
    categoryId: 'painting',
    ageGroup: 'Adult',
    duration: 2,
    price: 285000,
    instructor: 'Ibu Ratna Dewi',
    maxParticipants: 14,
    schedule: [
      { id: 's1', date: 'Jum, 17 Jul 2026', time: '18.30', left: 7 },
      { id: 's2', date: 'Sab, 25 Jul 2026', time: '14.00', left: 9 },
    ],
  },
  {
    id: 'ws-paint-02',
    title: 'Cat Air Santai untuk Lansia',
    description:
      'Kelas cat air bertempo lambat dengan tema bunga dan pemandangan. Dirancang khusus agar nyaman untuk peserta senior — kursi ergonomis dan istirahat teh.',
    category: 'Painting',
    categoryId: 'painting',
    ageGroup: 'Senior',
    duration: 2,
    price: 225000,
    instructor: 'Ibu Ratna Dewi',
    maxParticipants: 10,
    schedule: [
      { id: 's1', date: 'Rab, 22 Jul 2026', time: '09.30', left: 6 },
    ],
  },
  {
    id: 'ws-punch-01',
    title: 'Punch Needle: Hiasan Dinding Mini',
    description:
      'Tusuk, tarik, ulangi — ritme punch needle terbukti menenangkan pikiran. Buat hiasan dinding bermotif abstrak dengan benang wol warna-warni.',
    category: 'Punch Needle',
    categoryId: 'punchneedle',
    ageGroup: 'Adult',
    duration: 2.5,
    price: 265000,
    instructor: 'Kak Laras Putri',
    maxParticipants: 12,
    schedule: [
      { id: 's1', date: 'Sab, 18 Jul 2026', time: '13.00', left: 4 },
      { id: 's2', date: 'Min, 26 Jul 2026', time: '13.00', left: 11 },
    ],
  },
  {
    id: 'ws-journal-01',
    title: 'Art Journaling: Halaman Rasa',
    description:
      'Kolase, cap, tulisan tangan, dan warna — semua sah di halaman journalmu. Sesi reflektif untuk menuangkan emosi dalam bentuk visual.',
    category: 'Journaling',
    categoryId: 'journaling',
    ageGroup: 'Adult',
    duration: 1.5,
    price: 195000,
    instructor: 'Kak Laras Putri',
    maxParticipants: 16,
    schedule: [
      { id: 's1', date: 'Jum, 17 Jul 2026', time: '16.00', left: 9 },
      { id: 's2', date: 'Jum, 24 Jul 2026', time: '16.00', left: 12 },
    ],
  },
  {
    id: 'ws-tiedye-01',
    title: 'Tie Dye Keluarga: Kaos Pelangi',
    description:
      'Workshop seru untuk anak dan orang tua. Ikat, celup, dan buka kejutan motif pelangimu. Satu tiket termasuk dua kaos (anak + dewasa).',
    category: 'Tie Dye',
    categoryId: 'tiedye',
    ageGroup: 'Kids',
    duration: 2,
    price: 295000,
    instructor: 'Kak Dinda Ayu',
    maxParticipants: 20,
    schedule: [
      { id: 's1', date: 'Min, 19 Jul 2026', time: '10.00', left: 14 },
      { id: 's2', date: 'Min, 26 Jul 2026', time: '10.00', left: 18 },
    ],
  },
  {
    id: 'ws-ecoprint-01',
    title: 'Ecoprint Daun: Totebag Alam',
    description:
      'Pukul-pukul daun segar di atas kain dan saksikan alam mencetak motifnya sendiri. Ramah lingkungan, memuaskan, dan hasilnya selalu satu-satunya di dunia.',
    category: 'Tie Dye',
    categoryId: 'tiedye',
    ageGroup: 'Senior',
    duration: 2,
    price: 235000,
    instructor: 'Ibu Sari Wulandari',
    maxParticipants: 12,
    schedule: [
      { id: 's1', date: 'Kam, 23 Jul 2026', time: '09.30', left: 8 },
    ],
  },
]
