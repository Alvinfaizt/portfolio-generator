# Universal Student Portfolio Generator

Aplikasi web berbasis Vanilla Code untuk membantu mahasiswa dari segala jurusan membuat halaman portfolio/cv interaktif secara instan dan responsif. Proyek ini dibangun murni menggunakan HTML, CSS, dan JavaScript tanpa framework untuk memperkuat logika pemrograman dasar.

---

## Fitur Utama

* **Form Input Dinamis:** Input data diri, skill, dan pengalaman organisasi/proyek.
* **Live Preview:** Hasil modifikasi langsung terlihat di layar.
* **Multi-Theme System:** Pilihan tema tampilan yang dapat disesuaikan dengan karakteristik jurusan kuliah.
* **Responsive Design:** Tampilan optimal baik di akses melalui Desktop maupun Smartphone.
* **Local Storage Persistence:** Data tidak hilang meskipun halaman di-refresh.

---

## Struktur Folder

```text
portfolio-generator/
│
├── index.html                  # Halaman utama tempat semua seksi (Home, Portfolio, About, Contact) berada.
│
├── css/
│   ├── style.css               # Mengatur tata letak global, bentuk navbar stik es krim, dan tata ruang halaman.
│   └── themes.css              # Khusus menyimpan variabel warna untuk tema (seperti warna Tech-Noir).
│
├── js/
│   ├── main.js                 # File utama yang menyalakan fungsi-fungsi dasar web saat pertama dimuat.
│   ├── dom.js                  # Menangani perubahan tulisan secara real-time dari form ke kartu cetak portfolio.
│   ├── storage.js              # Mengatur penyimpanan otomatis agar data yang kamu ketik tidak hilang saat di-refresh (localStorage).
│   └── interactive.js          # BARU: Mengontrol munculnya gambar preview komentar dan pop-up cetak kertas sertifikat.
│
├── assets/
│   ├── img/
│   │   ├── profile.jpg         # Tempat menyimpan foto profil bulat milikmu.
│   │   └── certificates/       # Folder khusus untuk menaruh gambar file sertifikat aslimu (cth: cert1.jpg).
│   └── docs/
│       └── cv-alvin.pdf        # File dokumen CV yang nantinya bisa di-download lewat tombol.
│
└── README.md                   # Catatan penjelasan proyek untuk portofolio di GitHub kamu.