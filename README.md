# MaryamHomeschool

Aplikasi pelacak kemajuan belajar untuk anak homeschooling dengan fitur lengkap dan modern, dengan sinkronisasi cloud untuk akses multi-device.

## 🚀 Fitur Utama

- **Study Timer** - Timer Pomodoro dengan tracking otomatis
- **Weekly Planner** - Jadwal mingguan mata pelajaran Islam & akademik
- **Progress Chart** - Visualisasi kemajuan belajar harian
- **Daily Journal** - Jurnal harian dengan mood tracking
- **Gamification** - Sistem reward dan achievement
- **Parent View** - Laporan kemajuan untuk orang tua
- **Focus Mode** - Mode fokus tanpa distraksi
- **PWA Support** - Dapat diinstall sebagai aplikasi
- **Cloud Sync** - Data tersimpan online dengan Firebase

## 🛠️ Teknologi

- **React 18** + **TypeScript**
- **Material-UI v5** dengan custom theme
- **Redux Toolkit** untuk state management
- **MUI X Charts** untuk visualisasi data
- **Vite** sebagai build tool
- **PWA** dengan service worker
- **Firebase** untuk cloud storage dan sinkronisasi

## 📦 Instalasi

1. **Clone atau download project**

2. **Install dependencies:**
```bash
npm install
```

3. **Setup Firebase (untuk cloud sync):**
   - Buat project di [Firebase Console](https://console.firebase.google.com/)
   - Tambahkan web app dan copy config
   - Copy `env.example` ke `.env.local` dan isi dengan config Firebase

4. **Jalankan development server:**
```bash
npm run dev
```

5. **Buka browser di:**
```
http://localhost:3000
```

## 🎯 Cara Penggunaan

1. **Timer Study** - Pilih mata pelajaran dan durasi, lalu mulai belajar
2. **Weekly Planner** - Klik mata pelajaran untuk langsung ke timer
3. **Journal** - Catat mood dan catatan harian
4. **Parent View** - Lihat laporan kemajuan lengkap
5. **Focus Mode** - Aktifkan untuk belajar tanpa distraksi

## 📱 PWA Installation

Aplikasi dapat diinstall sebagai PWA di device:
- Desktop: Klik icon install di address bar
- Mobile: Tambah ke home screen

## 🚀 Deployment

### Vercel
1. Push code ke GitHub
2. Connect repository di [Vercel](https://vercel.com)
3. Tambahkan environment variables dari `.env.local`
4. Deploy otomatis

### Netlify
1. Push code ke GitHub  
2. Connect repository di [Netlify](https://netlify.com)
3. Tambahkan environment variables di Settings > Environment
4. Deploy otomatis

## 🏗️ Build Production

```bash
npm run build
```

## 📄 License

MIT License - Bebas digunakan untuk keperluan pendidikan.

---

**Selamat Belajar! 📚✨**