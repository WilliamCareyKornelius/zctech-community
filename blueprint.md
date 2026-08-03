# Blueprint: Dual Website — Organization + Business

## 1. Konsep & strategi

Dua website ini berjalan sebagai ekosistem yang saling memperkuat. Website organisasi membangun komunitas, trust, dan talent pipeline. Website bisnis memonetisasi expertise melalui layanan profesional. Keduanya cross-link tapi berdiri independen di domain dan VPS terpisah.

**Flywheel-nya:**
Org build community → community jadi social proof → social proof drive leads ke bisnis → revenue dari bisnis fund kegiatan org → org makin besar → repeat.

---

## 2. Tech stack

| Layer | Teknologi | Alasan |
|---|---|---|
| Framework | Next.js 15 (App Router) | SSR/SSG hybrid, SEO-friendly, React ecosystem |
| Language | TypeScript | Type safety, developer experience |
| Styling | Tailwind CSS v4 + shadcn/ui | Rapid prototyping, consistent design system |
| Database | PostgreSQL (per VPS) | Reliable, full-featured, free |
| ORM | Prisma | Type-safe queries, migration management |
| Auth (admin) | NextAuth.js / Auth.js | Session-based admin panel |
| Email | Resend | Transactional email, contact form delivery |
| Analytics | Umami (self-hosted) | Privacy-first, GDPR compliant, shared instance |
| File storage | MinIO atau Cloudflare R2 | S3-compatible, untuk gambar/dokumen |
| Blog | MDX (file-based) atau Prisma-backed | Phase 1: MDX. Phase 2: CMS admin |
| Deployment | Docker + docker-compose | Reproducible, easy rollback |
| Reverse proxy | Nginx | SSL termination, caching, rate limiting |
| SSL | Let's Encrypt (Certbot) | Auto-renewal |
| CI/CD | GitHub Actions | Auto deploy on push to main |

---

## 3. Website 1 — Organisasi

### 3.1 Tujuan
Profiling organisasi cybersecurity/tech community. Membangun brand awareness, menarik member, dan menjadi hub informasi kegiatan tech di Indonesia.

### 3.2 Sitemap & halaman

```
/                        → Homepage (hero + highlights)
/about                   → Tentang organisasi (visi, misi, tim/member)
/events                  → Kegiatan organisasi (upcoming + arsip)
/events/[slug]           → Detail kegiatan
/training                → Program pelatihan (daftar pelatihan)
/training/[slug]         → Detail pelatihan
/competitions            → Info lomba tech (agregator + kurasi)
/competitions/[slug]     → Detail lomba
/blog                    → Blog / artikel
/blog/[slug]             → Detail artikel
/contact                 → Contact form + social links
```

### 3.3 Detail per halaman

#### Homepage `/`
- **Hero section**: Tagline organisasi + CTA utama (Join Discord) + CTA sekunder (Lihat Kegiatan)
- **Stats bar**: Jumlah member, kegiatan selesai, pelatihan delivered (animated counter)
- **Upcoming events**: 3 event terdekat (card horizontal scroll di mobile)
- **Latest blog**: 3 artikel terbaru
- **Discord CTA section**: Embed preview Discord + join button
- **Footer**: Links, social media, copyright

#### About `/about`
- Visi & misi
- Sejarah singkat organisasi
- Core values (3-4 nilai utama)
- Tim / pengurus inti (foto, nama, role, link socmed)
- Struktur organisasi (optional, bisa diagram SVG)

#### Events `/events`
- Filter: upcoming / past
- Card grid: judul, tanggal, lokasi (online/offline), thumbnail
- Badge status: upcoming, ongoing, completed
- Click → detail page

#### Event detail `/events/[slug]`
- Hero image
- Judul, tanggal, waktu, lokasi
- Deskripsi lengkap (rich text / MDX)
- Speaker/fasilitator (jika ada)
- Registration link atau recap (tergantung status)
- Share button (copy link, WhatsApp, Twitter)

#### Training `/training`
- Card grid program pelatihan
- Badge: free / paid, level (beginner / intermediate / advanced)
- Kategori: cybersecurity, networking, programming, dll
- Filter by kategori dan level

#### Training detail `/training/[slug]`
- Syllabus / kurikulum
- Duration & schedule
- Prerequisites
- Trainer info
- CTA: Daftar (link ke form atau WhatsApp)

#### Competitions `/competitions`
- Agregator info lomba tech nasional/internasional
- Card: nama lomba, penyelenggara, deadline, prize, kategori
- Filter: CTF, hackathon, competitive programming, UI/UX, dll
- Sort: deadline terdekat
- External link ke halaman resmi lomba

#### Blog `/blog`
- Card grid: thumbnail, judul, excerpt, author, tanggal
- Kategori: writeup, tutorial, news, opinion
- Pagination atau infinite scroll
- Reading time estimate

#### Blog detail `/blog/[slug]`
- MDX rendered content
- Table of contents (auto-generated dari headings)
- Author info + avatar
- Related posts
- Share buttons

#### Contact `/contact`
- Contact form: nama, email, subjek (dropdown), pesan
- Social links: Discord, Instagram, Twitter/X, LinkedIn, GitHub
- Email organisasi
- Google Maps embed (optional, kalau ada base fisik)

### 3.4 Fitur khusus

1. **Discord widget**: Real-time member count + online status, embed di homepage dan `/about`
2. **Event countdown**: Timer countdown untuk event terdekat
3. **SEO optimized**: Dynamic OG images per halaman, structured data (JSON-LD)
4. **RSS feed**: `/feed.xml` untuk blog
5. **Dark mode**: Toggle, default ikut system preference
6. **Responsive**: Mobile-first, breakpoints di 640/768/1024/1280px
7. **Bahasa**: Bahasa Indonesia primary, English secondary (i18n ready tapi phase 1 Indo only)

---

## 4. Website 2 — Bisnis

### 4.1 Tujuan
Profiling bisnis cybersecurity services. Mengkonversi visitor jadi leads melalui free consultation. Revenue dari pentest services dan pelatihan tech.

### 4.2 Sitemap & halaman

```
/                        → Homepage (hero + layanan overview)
/about                   → Tentang bisnis (company profile)
/services                → Overview semua layanan
/services/pentest-coin   → Detail Pentest Coin (crypto/blockchain audit)
/services/pentest        → Jasa Pentest (web, mobile, API, network, cloud)
/services/training       → Pelatihan Tech (semua bidang)
/portfolio               → Portofolio / case studies
/portfolio/[slug]        → Detail case study
/blog                    → Blog / knowledge base
/blog/[slug]             → Detail artikel
/consultation            → Free consultation form
/contact                 → Contact info + form
```

### 4.3 Detail per halaman

#### Homepage `/`
- **Hero section**: Headline bisnis + value proposition + CTA (Free Consultation)
- **Trust signals**: Client count, pentest completed, vulnerabilities found, years experience
- **Services overview**: 3 card utama (Pentest Coin, Jasa Pentest, Pelatihan) dengan icon + short desc
- **Why choose us**: 3-4 differentiator (certified, proven track record, free consultation, dll)
- **Testimonials**: Slider / carousel testimonial client (anonymous kalau perlu)
- **CTA section**: "Konsultasi gratis — tanpa komitmen" + form shortcut atau WhatsApp button
- **Latest blog**: 3 artikel terbaru
- **Footer**: Links, social media, legal pages

#### About `/about`
- Company overview & story
- Visi & misi bisnis
- Tim (founder + core team, dengan credentials/sertifikasi)
- Sertifikasi & afiliasi (CEH, OSCP, eJPT, dll — kalau ada)
- Methodologi kerja (high-level)

#### Services overview `/services`
- Grid card 3 layanan utama
- Masing-masing card: icon, judul, short desc, CTA ke detail page
- Cross-link antar layanan

#### Pentest Coin `/services/pentest-coin`
**Layanan audit keamanan untuk proyek cryptocurrency/blockchain.**

Konten halaman:
- Apa itu Pentest Coin (penjelasan untuk audience non-teknis)
- Scope yang di-cover:
  - Smart contract audit (Solidity, Rust)
  - DeFi protocol security review
  - Token contract analysis
  - Bridge & cross-chain security
  - Wallet integration testing
  - Exchange/platform security assessment
- Metodologi (high-level flow diagram)
- Deliverables: report format, severity classification, remediation guidance
- Pricing model: contact for quote (jangan tampilkan harga fix)
- CTA: Free Consultation

#### Jasa Pentest `/services/pentest`
**Layanan penetration testing profesional.**

Sub-services (tampilkan sebagai tab atau accordion):
- **Web Application Pentest**: OWASP Top 10, business logic, auth bypass, API security
- **Mobile App Pentest**: Android & iOS, reverse engineering, API communication, local storage
- **Network Pentest**: Internal/external, vulnerability assessment, firewall review
- **Cloud Security Assessment**: AWS/GCP/Azure misconfiguration, IAM review
- **API Security Testing**: REST/GraphQL, auth, rate limiting, injection
- **Source Code Review**: Manual + automated, SAST integration

Konten per sub-service:
- Deskripsi scope
- Metodologi (OWASP, PTES, OSSTMM reference)
- Timeline estimasi
- Sample report structure (redacted)
- CTA: Free Consultation

#### Pelatihan Tech `/services/training`
**Program pelatihan teknologi untuk semua level.**

Kategori pelatihan:
- **Cybersecurity**: ethical hacking, web security, network security, forensics, SOC analyst
- **Programming**: Python, JavaScript/TypeScript, Go, Rust
- **Cloud & DevOps**: AWS/GCP, Docker, Kubernetes, CI/CD, Terraform
- **Networking**: MikroTik, Cisco, network design, wireless security
- **Data & AI**: data analysis, machine learning basics, LLM/AI integration
- **Mobile Development**: Flutter, React Native, native Android/iOS

Konten halaman:
- Grid card per kategori training
- Setiap card: judul, level, durasi, format (online/offline/hybrid), harga
- Detail page per training program (syllabus, prerequisites, trainer, jadwal)
- Pricing: tampilkan range harga per program
- CTA: Free Consultation untuk customized training
- **Highlight**: Konsultasi gratis sebelum daftar

#### Portfolio `/portfolio`
- Grid card: project title, client industry (anonymous), service type, key findings summary
- Filter by service type
- Angka impact: "X critical vulnerabilities found", "Y% security posture improvement"

#### Portfolio detail `/portfolio/[slug]`
- Client background (anonymized)
- Challenge / scope
- Approach & methodology
- Key findings (redacted, high-level)
- Impact & results
- Testimonial dari client (jika available)

#### Blog `/blog`
- Technical knowledge base + marketing content
- Kategori: security research, writeup (redacted), tutorial, industry news, case study
- Card grid dengan reading time, kategori badge
- Search functionality

#### Consultation `/consultation`
**Ini halaman kunci untuk konversi.**

Form fields:
- Nama / nama perusahaan
- Email
- Nomor WhatsApp
- Jenis layanan yang diminati (dropdown multi-select):
  - Pentest Coin / Blockchain Audit
  - Web Application Pentest
  - Mobile App Pentest
  - Network Pentest
  - Cloud Security Assessment
  - API Security Testing
  - Source Code Review
  - Pelatihan Tech — [specify topic]
  - Lainnya
- Deskripsi singkat kebutuhan (textarea)
- Preferred contact method: Email / WhatsApp / Video Call
- Budget range (optional dropdown): < 5jt / 5-15jt / 15-30jt / 30jt+ / Belum tahu

Submit behavior:
1. Save ke database (lead tracking)
2. Send email notification ke admin via Resend
3. Send WhatsApp notification ke admin (optional, via WhatsApp API)
4. Show success page + estimated response time (1x24 jam)
5. Auto-reply email ke user (thank you + confirmation)

#### Contact `/contact`
- Form sederhana (untuk non-consultation inquiries)
- Office info (jika ada)
- Social links
- WhatsApp direct link
- Google Maps (optional)

### 4.4 Fitur khusus

1. **Free consultation badge**: Floating badge di setiap halaman services — "Konsultasi GRATIS"
2. **WhatsApp floating button**: Sticky di mobile, bottom-right
3. **Lead tracking dashboard**: Admin panel sederhana untuk track consultation requests
4. **SEO optimized**: Dynamic OG images, structured data (LocalBusiness, Service schema)
5. **Trust building**: Sertifikasi badges, methodology references, sample report preview
6. **Blog as SEO engine**: Target long-tail keywords seputar cybersecurity Indonesia
7. **Dark mode**: Sama seperti org site
8. **Bahasa**: Bahasa Indonesia primary

---

## 5. Database schema (Prisma)

### 5.1 Shared schema pattern (kedua website pakai struktur mirip)

```prisma
// === BLOG ===
model Post {
  id          String   @id @default(cuid())
  title       String
  slug        String   @unique
  excerpt     String
  content     String   // MDX content atau rich text
  coverImage  String?
  category    String
  tags        String[] // PostgreSQL array
  author      String
  published   Boolean  @default(false)
  publishedAt DateTime?
  readingTime Int      // estimasi menit
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

// === CONTACT / LEADS ===
model Contact {
  id          String   @id @default(cuid())
  name        String
  email       String
  phone       String?
  subject     String
  message     String
  status      String   @default("new") // new, read, replied, archived
  createdAt   DateTime @default(now())
}
```

### 5.2 Schema tambahan untuk website organisasi

```prisma
model Event {
  id          String   @id @default(cuid())
  title       String
  slug        String   @unique
  description String
  content     String   // rich text / MDX
  coverImage  String?
  eventDate   DateTime
  endDate     DateTime?
  location    String   // "Online" atau alamat
  type        String   // workshop, meetup, webinar, competition
  status      String   @default("upcoming") // upcoming, ongoing, completed
  regLink     String?  // link registrasi eksternal
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

model Training {
  id            String   @id @default(cuid())
  title         String
  slug          String   @unique
  description   String
  syllabus      String   // MDX content
  category      String
  level         String   // beginner, intermediate, advanced
  duration      String   // "8 jam", "3 hari", dll
  format        String   // online, offline, hybrid
  prerequisites String?
  trainer       String
  price         String?  // "Free" atau nominal
  isActive      Boolean  @default(true)
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
}

model Competition {
  id           String   @id @default(cuid())
  title        String
  slug         String   @unique
  organizer    String
  description  String
  category     String   // CTF, hackathon, competitive programming, dll
  deadline     DateTime
  prizeInfo    String?
  externalLink String
  coverImage   String?
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt
}
```

### 5.3 Schema tambahan untuk website bisnis

```prisma
model Consultation {
  id               String   @id @default(cuid())
  name             String
  email            String
  whatsapp         String
  services         String[] // PostgreSQL array, multi-select
  description      String
  contactMethod    String   // email, whatsapp, videocall
  budgetRange      String?
  status           String   @default("new") // new, contacted, in-progress, converted, closed
  notes            String?  // internal notes
  assignedTo       String?
  createdAt        DateTime @default(now())
  updatedAt        DateTime @updatedAt
}

model CaseStudy {
  id              String   @id @default(cuid())
  title           String
  slug            String   @unique
  clientIndustry  String   // anonymized industry
  serviceType     String
  challenge       String
  approach        String
  findings        String   // redacted key findings
  impact          String
  testimonial     String?
  coverImage      String?
  published       Boolean  @default(false)
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
}

model ServicePage {
  id          String   @id @default(cuid())
  slug        String   @unique
  title       String
  content     String   // MDX content
  metadata    Json?    // flexible JSON untuk pricing hints, dll
  isActive    Boolean  @default(true)
  updatedAt   DateTime @updatedAt
}
```

---

## 6. API routes (Next.js App Router)

### 6.1 Website organisasi

```
POST   /api/contact          → Submit contact form
GET    /api/events            → List events (filtered)
GET    /api/events/[slug]     → Event detail
GET    /api/training          → List training programs
GET    /api/competitions      → List competitions
GET    /api/blog              → List posts (paginated)
GET    /api/blog/[slug]       → Post detail
GET    /api/feed.xml          → RSS feed
```

### 6.2 Website bisnis

```
POST   /api/contact           → Submit contact form
POST   /api/consultation      → Submit consultation request
GET    /api/blog               → List posts (paginated)
GET    /api/blog/[slug]        → Post detail
GET    /api/portfolio          → List case studies
GET    /api/portfolio/[slug]   → Case study detail
GET    /api/feed.xml           → RSS feed
```

### 6.3 Admin routes (kedua website)

```
GET    /admin                  → Dashboard
GET    /admin/posts            → Manage blog posts
POST   /admin/posts            → Create post
PUT    /admin/posts/[id]       → Update post
DELETE /admin/posts/[id]       → Delete post
GET    /admin/contacts         → View contact submissions
GET    /admin/consultations    → View consultation leads (bisnis only)
```

---

## 7. Infrastructure & deployment

### 7.1 VPS requirements

| Spec | Minimum | Recommended |
|---|---|---|
| CPU | 1 vCPU | 2 vCPU |
| RAM | 1 GB | 2 GB |
| Storage | 20 GB SSD | 40 GB SSD |
| OS | Ubuntu 24.04 LTS | Ubuntu 24.04 LTS |
| Bandwidth | 1 TB/bulan | Unlimited |

Estimasi budget per VPS: IDR 50.000 - 150.000/bulan (IDCloudHost, Dewaweb, DigitalOcean, Vultr).

### 7.2 Docker compose (per VPS)

```yaml
services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - DATABASE_URL=postgresql://user:pass@db:5432/website
      - RESEND_API_KEY=${RESEND_API_KEY}
      - NEXTAUTH_SECRET=${NEXTAUTH_SECRET}
    depends_on:
      - db
    restart: unless-stopped

  db:
    image: postgres:16-alpine
    volumes:
      - pgdata:/var/lib/postgresql/data
    environment:
      - POSTGRES_USER=user
      - POSTGRES_PASSWORD=pass
      - POSTGRES_DB=website
    restart: unless-stopped

  # Umami analytics (shared, deploy di salah satu VPS)
  # umami:
  #   image: ghcr.io/umami-software/umami:postgresql-latest
  #   ports:
  #     - "3001:3000"
  #   environment:
  #     - DATABASE_URL=postgresql://user:pass@db:5432/umami

volumes:
  pgdata:
```

### 7.3 Nginx config (per domain)

```nginx
server {
    listen 80;
    server_name yourdomain.id;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name yourdomain.id;

    ssl_certificate /etc/letsencrypt/live/yourdomain.id/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.id/privkey.pem;

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
    add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' https:;" always;
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    add_header Permissions-Policy "camera=(), microphone=(), geolocation=()" always;

    # Rate limiting
    limit_req_zone $binary_remote_addr zone=api:10m rate=10r/s;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    location /api/ {
        limit_req zone=api burst=20 nodelay;
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Static file caching
    location /_next/static/ {
        proxy_pass http://localhost:3000;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

### 7.4 CI/CD (GitHub Actions)

```yaml
# .github/workflows/deploy.yml
name: Deploy
on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Deploy to VPS
        uses: appleboy/ssh-action@v1
        with:
          host: ${{ secrets.VPS_HOST }}
          username: ${{ secrets.VPS_USER }}
          key: ${{ secrets.VPS_SSH_KEY }}
          script: |
            cd /opt/website
            git pull origin main
            docker compose build --no-cache
            docker compose up -d
            docker compose exec app npx prisma migrate deploy
```

---

## 8. Security hardening

Checklist keamanan untuk kedua website:

### Application level
- [ ] Input validation & sanitization di semua form (zod schema)
- [ ] CSRF protection (built-in Next.js)
- [ ] Rate limiting di API routes (terutama contact/consultation form)
- [ ] Content Security Policy headers
- [ ] XSS protection headers
- [ ] SQL injection prevention (Prisma parameterized queries)
- [ ] File upload validation (jika ada fitur upload)
- [ ] Authentication untuk admin panel (strong password + 2FA)
- [ ] Session management yang proper
- [ ] CORS configuration yang tepat
- [ ] Environment variables, jangan hardcode secrets

### Server level
- [ ] SSH key-only authentication (disable password login)
- [ ] UFW firewall (allow only 80, 443, SSH port)
- [ ] fail2ban untuk brute force protection
- [ ] Automatic security updates (unattended-upgrades)
- [ ] Non-root user untuk menjalankan aplikasi
- [ ] Docker container security (non-root user, read-only filesystem)
- [ ] Regular backup database (automated daily ke S3)
- [ ] Log monitoring (journalctl + optional: Grafana Loki)

### Domain & DNS
- [ ] DNSSEC enabled
- [ ] CAA record (restrict CA yang bisa issue cert)
- [ ] SPF + DKIM + DMARC untuk email domain

---

## 9. Development roadmap

### Phase 1 — MVP (4-6 minggu)
**Goal: Website live dengan konten statis + blog + contact form**

**Week 1-2: Foundation**
- [ ] Setup repo (2 repo terpisah atau monorepo)
- [ ] Next.js project scaffolding dengan TypeScript + Tailwind
- [ ] Design system setup (color palette, typography, components)
- [ ] Database schema + Prisma setup
- [ ] Layout components (header, footer, navigation)

**Week 3-4: Core pages**
- [ ] Homepage kedua website
- [ ] About page
- [ ] Service pages (bisnis)
- [ ] Events + Training pages (organisasi)
- [ ] Competition aggregator (organisasi)
- [ ] Blog system (MDX-based)
- [ ] Contact form + email integration

**Week 5-6: Polish & deploy**
- [ ] Responsive testing
- [ ] SEO optimization (meta tags, OG images, sitemap, robots.txt)
- [ ] Performance optimization (image optimization, lazy loading)
- [ ] VPS setup + Docker deployment
- [ ] Domain + SSL setup
- [ ] Testing & bug fixes
- [ ] Content population (minimal 3-5 blog posts, services content)
- [ ] Launch

### Phase 2 — Enhancement (2-4 minggu setelah launch)
- [ ] Admin dashboard (CMS) untuk manage blog/events/training
- [ ] Consultation lead tracking dashboard (bisnis)
- [ ] Discord bot integration untuk event notifications
- [ ] WhatsApp floating button + direct link
- [ ] Umami analytics setup
- [ ] RSS feed
- [ ] Search functionality (blog)
- [ ] Performance monitoring (Lighthouse CI)

### Phase 3 — Growth (ongoing)
- [ ] Internasionalisasi (English translation)
- [ ] Newsletter subscription (Resend lists)
- [ ] Payment integration untuk training programs (Midtrans/Xendit)
- [ ] Client portal (bisnis — report delivery, project tracking)
- [ ] API rate limiting dashboard
- [ ] A/B testing untuk landing pages
- [ ] Community forum atau Q&A section (organisasi)

---

## 10. Folder structure (per website)

```
src/
├── app/
│   ├── (marketing)/          # Public pages group
│   │   ├── page.tsx          # Homepage
│   │   ├── about/
│   │   ├── blog/
│   │   │   ├── page.tsx
│   │   │   └── [slug]/
│   │   ├── contact/
│   │   └── layout.tsx
│   ├── (admin)/              # Admin panel group
│   │   ├── admin/
│   │   │   ├── page.tsx      # Dashboard
│   │   │   ├── posts/
│   │   │   ├── contacts/
│   │   │   └── layout.tsx
│   │   └── layout.tsx
│   ├── api/
│   │   ├── contact/
│   │   │   └── route.ts
│   │   ├── blog/
│   │   │   └── route.ts
│   │   └── feed.xml/
│   │       └── route.ts
│   ├── layout.tsx            # Root layout
│   └── globals.css
├── components/
│   ├── ui/                   # shadcn/ui components
│   ├── layout/               # Header, Footer, Nav
│   ├── sections/             # Hero, CTA, Stats, etc.
│   ├── blog/                 # BlogCard, BlogList, etc.
│   └── forms/                # ContactForm, ConsultationForm
├── lib/
│   ├── db.ts                 # Prisma client
│   ├── utils.ts
│   ├── validations.ts        # Zod schemas
│   └── email.ts              # Resend helpers
├── content/                  # MDX blog posts
│   └── posts/
├── public/
│   ├── images/
│   └── fonts/
├── prisma/
│   └── schema.prisma
├── docker-compose.yml
├── Dockerfile
├── nginx.conf
└── .env.example
```

---

## 11. Cross-linking strategy

Kedua website saling memperkuat tapi tetap independen:

| Dari | Ke | Context |
|---|---|---|
| Org homepage | Biz services | "Butuh jasa pentest profesional? Kunjungi partner kami" |
| Org training | Biz training detail | "Pelatihan ini diselenggarakan oleh [Biz Name]" |
| Biz about | Org community | "Kami juga mengelola komunitas tech [Org Name]" |
| Biz blog | Org events | "Ikuti event terkait di komunitas kami" |
| Biz training | Org Discord | "Join Discord untuk diskusi seputar materi training" |

Setiap cross-link pakai `target="_blank" rel="noopener noreferrer"` karena beda domain.

---

## 12. Content strategy (Phase 1)

### Website organisasi — konten awal minimum:
- 3 blog posts (tutorial/writeup ringan)
- 2 upcoming events (bisa virtual/online)
- 2 program pelatihan
- 5 info lomba tech yang sedang berjalan

### Website bisnis — konten awal minimum:
- 3 blog posts (cybersecurity awareness, why pentest matters, dll)
- Semua service pages terisi lengkap
- 1 case study (bisa dari pengalaman sendiri, anonymized)
- Consultation form live dan teruji

---

*Blueprint ini adalah living document — update sesuai progress development.*
