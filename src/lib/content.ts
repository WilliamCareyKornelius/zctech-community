import { Event, Post, TeamMember, CoreValue } from './types';

export const siteConfig = {
  name: 'ZCTech Community',
  tagline: 'Pusat Ekosistem Cybersecurity & Tech Talent Indonesia',
  description:
    'Wadah terbuka bagi para antusias keamanan siber, pentester, dan pengembang teknologi Indonesia. Berbagi wawasan, ikuti kegiatan komunitas, dan tingkatkan keahlian teknis Anda.',
  url: 'https://community.zctech.id',
  discordInvite: 'https://discord.gg/s67RfATTBk',
  email: 'community@zctech.id',
  socials: {
    discord: 'https://discord.gg/s67RfATTBk',
    instagram: 'https://instagram.com/zctech.id',
    twitter: 'https://x.com/zctech_id',
    linkedin: 'https://linkedin.com/company/zctech',
    github: 'https://github.com/zctech-community',
  },
  stats: {
    members: 1250,
    eventsCompleted: 48,
    trainingDelivered: 0,
    competitions: 0,
  },
};

export const coreValues: CoreValue[] = [
  {
    title: 'Open Knowledge',
    description: 'Pengetahuan seputar cybersecurity dan teknologi harus terbuka dan dapat diakses siapa saja.',
  },
  {
    title: 'Hands-on Learning',
    description: 'Belajar paling efektif lewat praktik langsung di lab dan proyek nyata.',
  },
  {
    title: 'Collaborative Growth',
    description: 'Tumbuh bersama melalui diskusi, mentoring, dan kolaborasi antar anggota komunitas.',
  },
  {
    title: 'Ethical Impact',
    description: 'Menerapkan keahlian secara bertanggung jawab dan memberi dampak positif bagi industri.',
  },
];

export const team: TeamMember[] = [
  { name: 'William Kornelius', role: 'Founder & Community Lead', image: '/kegiatan/img-07.jpg', socmed: [{ platform: 'linkedin', url: 'https://linkedin.com/in/williamkornelius' }] },
  { name: 'Ari Setiawan', role: 'Lead Pentest Mentor', image: '/kegiatan/img-08.jpg', socmed: [{ platform: 'github', url: 'https://github.com' }] },
  { name: 'Dewi Lestari', role: 'Community & Event Manager', image: '/kegiatan/img-09.jpg', socmed: [{ platform: 'linkedin', url: 'https://linkedin.com' }] },
  { name: 'Rizki Fauzi', role: 'Content & Research Lead', image: '/kegiatan/img-10.jpg', socmed: [{ platform: 'github', url: 'https://github.com' }] },
];

/**
 * Helper untuk menentukan status event secara dinamis berdasarkan waktu saat ini:
 * - Jika waktu saat ini sudah melewati endDate (atau eventDate jika tanpa endDate), status = 'completed'
 * - Jika waktu saat ini berada di antara eventDate dan endDate, status = 'ongoing'
 * - Jika belum dimulai, status = 'upcoming'
 */
export function getEventEffectiveStatus(event: Event): 'upcoming' | 'ongoing' | 'completed' {
  const now = new Date().getTime();
  const start = new Date(event.eventDate).getTime();
  const end = event.endDate ? new Date(event.endDate).getTime() : start + 3 * 60 * 60 * 1000;

  if (now > end) return 'completed';
  if (now >= start && now <= end) return 'ongoing';
  return 'upcoming';
}

export const events: Event[] = [
  {
    id: 'tech-future-expo-2026',
    slug: 'tech-future-expo-2026',
    title: 'TECH-FUTURE EXPO 2026',
    description: 'Cybersecurity & IT Infrastructure Awareness for the Future Generation bersama Praktisi Pentester.',
    content: 'Halo rekan-rekan semua! 👋\n\nYuk hadiri TECH-FUTURE EXPO 2026 dengan tema "Cybersecurity & IT Infrastructure Awareness for the Future Generation".\n\nDalam seminar ini, kita akan mengupas tuntas pentingnya kesadaran keamanan siber, live demo offensive ethical hacking, serta implementasi teknologi mutakhir seperti Smart Agriculture berbasis IoT.\n\n🎙️ Pemateri: Muhammad Kevin Adli Pratama (Web & Android Penetration Testing, Letter of Recognition NASA, Transjakarta Hall of Fame, Web Bug Bounty)\n💡 Topik Utama:\n• Cybersecurity Seminar\n• Live Ethical Hacking Demo\n• Smart Agriculture (IoT)\n\n🎟️ Fasilitas & Benefit:\n• GRATIS untuk Umum\n• Free E-Certificate\n• Interactive Platform Showcase',
    coverImage: '/kegiatan/tech-future-expo-2026.jpg',
    eventDate: '2026-09-15T14:00:00+08:00',
    endDate: '2026-09-15T16:30:00+08:00',
    location: 'Aula Kampus Politani Samarinda',
    type: 'meetup',
    status: 'upcoming',
    isRegistrationClosed: true,
    registrationClosedMessage: 'Pendaftaran peserta untuk kegiatan ini sementara ditutup oleh panitia. Data peserta yang telah terdaftar tetap tersimpan aman dan tiket tetap berlaku untuk hari-H.',
    regLink: '/events/tech-future-expo-2026/register',
    speaker: 'Muhammad Kevin Adli Pratama',
    price: 'GRATIS untuk Umum',
    topics: ['Cybersecurity Seminar', 'Live Ethical Hacking Demo', 'Smart Agriculture (IoT)'],
    benefits: ['Free E-Certificate', 'Interactive Platform Showcase'],
  },
  {
    id: '1',
    slug: 'workshop-bug-bounty-101',
    title: 'Workshop Bug Bounty 101',
    description: 'Belajar dasar-dasar bug bounty, platform, dan teknik reconnaissance untuk pemula.',
    content: 'Workshop ini dirancang untuk pemula yang ingin memulai karir bug bounty. Kita akan membahas platform seperti HackerOne, Bugcrowd, dan Intigriti, lalu praktik reconnaissance dan identifikasi low-hanging fruit.',
    coverImage: '/kegiatan/img-01.jpg',
    eventDate: '2026-08-15T09:00:00+07:00',
    endDate: '2026-08-15T12:00:00+07:00',
    location: 'Samarinda — Online via Discord',
    type: 'workshop',
    status: 'completed',
    regLink: 'https://discord.gg/s67RfATTBk',
  },
];


export const posts: Post[] = [
  {
    id: 'p1',
    slug: 'memulai-karir-bug-bounty',
    title: 'Memulai Karir Bug Bounty untuk Pemula',
    excerpt: 'Panduan praktis memulai bug bounty dari nol: mindset, platform, dan langkah pertama.',
    content: 'Bug bounty adalah cara belajar sekaligus mendapatkan penghasilan. Artikel ini membahas cara memilih platform, membaca policy, dan menemukan bug pertama.',
    coverImage: '/kegiatan/img-04.jpg',
    category: 'tutorial',
    tags: ['bug bounty', 'career', 'hacking'],
    author: 'Ari Setiawan',
    publishedAt: '2026-07-20T08:00:00+07:00',
    readingTime: 6,
  },
  {
    id: 'p2',
    slug: 'mengenal-owasp-top-10-2025',
    title: 'Mengenal OWASP Top 10 2025',
    excerpt: 'Ringkasan risiko keamanan aplikasi web terbaru dan cara mitigasi utamanya.',
    content: 'OWASP Top 10 terus berkembang mengikuti lanskap ancaman. Kita bahas satu per satu kategori terbaru beserta contoh kasus nyata.',
    coverImage: '/kegiatan/img-05.jpg',
    category: 'tutorial',
    tags: ['owasp', 'web security', 'pentest'],
    author: 'William Kornelius',
    publishedAt: '2026-07-15T08:00:00+07:00',
    readingTime: 8,
  },
  {
    id: 'p3',
    slug: 'writeup-ctf-pwn-heat',
    title: 'Writeup CTF: Pwn The Heat',
    excerpt: 'Writeup lengkap challenge pwnable dari kompetisi lokal dengan eksploitasi buffer overflow.',
    content: 'Challenge ini mengajarkan buffer overflow di stack modern dengan mitigasi partial. Simak langkah analisis sampai dapat flag.',
    coverImage: '/kegiatan/img-03.jpg',
    category: 'writeup',
    tags: ['ctf', 'pwn', 'binary exploitation'],
    author: 'Rizki Fauzi',
    publishedAt: '2026-07-10T08:00:00+07:00',
    readingTime: 12,
  },
  {
    id: 'p4',
    slug: 'cybersecurity-di-indonesia-2026',
    title: 'Tren Cybersecurity di Indonesia 2026',
    excerpt: 'Laporan singkat tren ancaman, talenta, dan regulasi keamanan siber di Indonesia.',
    content: 'Indonesia menghadapi ancaman siber yang kompleks seiring transformasi digital. Artikel ini mengulas tren utama dan peluang talenta.',
    coverImage: '/kegiatan/img-06.jpg',
    category: 'news',
    tags: ['indonesia', 'trends', 'policy'],
    author: 'Dewi Lestari',
    publishedAt: '2026-07-05T08:00:00+07:00',
    readingTime: 5,
  },
  {
    id: 'p5',
    slug: 'opinion-ethical-hacker',
    title: 'Etika Seorang Ethical Hacker',
    excerpt: 'Refleksi tentang tanggung jawab dan etika di dunia offensive security.',
    content: 'Kekuatan teknis harus diimbangi etika. Artikel ini membahas prinsip responsible disclosure, privasi, dan profesionalisme.',
    coverImage: '/kegiatan/img-11.jpg',
    category: 'opinion',
    tags: ['ethics', 'hacking', 'responsible disclosure'],
    author: 'William Kornelius',
    publishedAt: '2026-06-28T08:00:00+07:00',
    readingTime: 7,
  },
];

export const nearestEvent = events
  .filter((e) => new Date(e.eventDate) > new Date())
  .sort((a, b) => new Date(a.eventDate).getTime() - new Date(b.eventDate).getTime())[0];
