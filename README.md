# BuddyUp — Digital Employee Onboarding Platform

A self-service employee onboarding web application built with PocketBase, Tailwind CSS, and Vanilla JavaScript.

---

## 🚀 Quick Start

### Prerequisites
- [Docker](https://docs.docker.com/get-docker/) and Docker Compose

### Menjalankan Aplikasi

```bash
docker-compose up -d
```

PocketBase akan otomatis menginisialisasi skema database dan membuat akun-akun demo saat pertama kali dijalankan via migrasi otomatis (`--automigrate`).

Buka di browser: **http://localhost:8090**

---

## 👥 Demo Credentials

Semua akun demo menggunakan password default: **`password123`**

| Nama Karyawan | Email | Divisi | Status Onboarding Awal |
|---|---|---|---|
| **Alex Johnson** | `alexjohnson@buddyup.com` | Human Resources | 1 / 10 task (10%) |
| **Sarah Connor** | `sarahconnor@buddyup.com` | Software Engineering | 5 / 10 task (50%) |
| **David Miller** | `davidmiller@buddyup.com` | Product Management | 8 / 10 task (80%) |
| **Emily Watson** | `emilywatson@buddyup.com` | Brand Marketing | 0 / 10 task (0% - New Hire) |
| **Budi Santoso** | `budisantoso@buddyup.com` | Finance & Accounting | 3 / 10 task (30%) |

### PocketBase Admin Panel & Superuser CLI

Akses dashboard backend admin di: **http://localhost:8090/_/**

Untuk membuat akun Superuser / Admin secara instan via CLI tanpa membuka UI, jalankan skrip otomatis sesuai sistem operasi Anda:

- **Linux / macOS / Git Bash / WSL**:
  ```bash
  ./mk_superuser.sh admin password123
  # atau
  bash mk_superuser.sh admin@buddyup.com password123
  ```

- **Windows (PowerShell)**:
  ```powershell
  .\mk_superuser.ps1 admin password123
  ```

- **Windows (Command Prompt / CMD)**:
  ```cmd
  mk_superuser.bat admin password123
  ```

- **Semua OS (menggunakan Python)**:
  ```bash
  python mk_superuser.py admin password123
  ```

> [!TIP]
> Jika Anda hanya memasukkan username biasa (contoh: `admin`), skrip akan secara otomatis menambahkan domain `@buddyup.com` (`admin@buddyup.com`) agar sesuai dengan format akun PocketBase. Password minimal 8 karakter.

---

## 🌟 Fitur-Fitur Aplikasi

| Modul | Deskripsi Fitur |
|---|---|
| **Autentikasi & Sesi** | Login kredensial perusahaan, toggle intip password, pencadangan sesi ke cookie 14 hari, dan *route session guards* (`requireAuth` / `requireGuest`). |
| **Request Account (HR)** | Modal pengajuan akun bagi calon karyawan baru yang belum memiliki kredensial resmi kantor. |
| **Dashboard Karyawan** | Kartu profil karyawan, live progress bar persentase penyelesaian, ringkasan *recent tasks*, dan shortcut chat. |
| **Onboarding Checklist** | 10 daftar tugas standar yang terisolasi per karyawan, toggle centang, pencatatan tanggal selesai (`completed_at`), dan sinkronisasi real-time via WebSocket. |
| **Buddy Chat (AI Assistant)** | Asisten chatbot onboarding cerdas berbasis kata kunci (KTP, NPWP, kontrak kerja, laptop/IT, dll.) dengan riwayat obrolan yang tersimpan ke database. |

---

## 📖 Panduan Tutorial Penggunaan Web

### 1. Menjalankan Aplikasi
Jalankan container dengan perintah:
```bash
docker-compose up -d
```
Buka browser dan kunjungi: **http://localhost:8090**

---

### 2. Alur Pengajuan Akun Baru (Jika Belum Memiliki Akun)
1. Pada halaman login, klik tautan **"Request account from HR"** di bagian bawah.
2. Jendela modal akan terbuka. Lengkapi data diri Anda:
   - **First name & Last name**: Nama lengkap.
   - **Personal email**: Alamat email pribadi aktif untuk menerima kredensial akun.
   - **Division / Department**: Departemen tempat Anda ditempatkan.
   - **Start date**: Tanggal mulai masuk kerja.
   - **Additional notes**: Informasi tambahan untuk tim HR (opsional).
3. Klik tombol **Submit Request**.
4. Setelah loading selesai, modal akan menampilkan konfirmasi bahwa pengajuan berhasil dikirimkan ke HR. Klik **Close** untuk menutup modal.

---

### 3. Masuk / Login ke Akun Karyawan
1. Masukkan email salah satu karyawan demo (misal: `sarahconnor@buddyup.com`).
2. Masukkan password: `password123`.
3. Klik tombol **Sign in**. Anda akan otomatis dialihkan ke halaman utama dashboard.

---

### 4. Menggunakan Halaman Dashboard
1. **Profil Karyawan**: Periksa nama, divisi, tanggal bergabung, dan email kantor pada kartu profil di bagian atas.
2. **Onboarding Progress**: Pantau progres onboarding Anda. Bar progres dan persentase akan mencerminkan rasio tugas yang sudah diselesaikan.
3. **Recent Tasks**: Lihat cuplikan 5 tugas terkini beserta statusnya (*Done* / *Pending*).

---

### 5. Mengelola Checklist Onboarding
1. Klik tab **Checklist** pada menu navigasi atas.
2. Anda akan melihat 10 daftar tugas onboarding standar:
   - *Attend New Employee Orientation*
   - *Sign Employment Contract*
   - *Submit National ID (KTP) Copy*
   - *Submit Tax Identification Number (NPWP)*
   - *Complete IT Equipment Request Form*
   - *Set Up Company Email Account*
   - *Read & Acknowledge Company Handbook*
   - *Complete Data Privacy & Security Training*
   - *Submit Emergency Contact Information*
   - *Meet Your Team & Direct Manager*
3. **Mencentang Tugas**: Klik kotak centang pada tugas yang telah Anda selesaikan. Kotak akan berubah biru bertanda centang, teks dicoret, dan waktu penyelesaian akan tercatat.
4. Perubahan tugas disinkronkan secara langsung antar tab/perangkat via WebSocket (ditandai dengan indikator titik hijau *Live sync: connected*).

---

### 6. Berinteraksi dengan Buddy Chat
1. Klik tab **Buddy Chat** pada menu navigasi (atau klik tombol **Open Chat →** pada dashboard).
2. Ketik pertanyaan seputar onboarding pada kolom chat, contoh:
   - *"How do I submit my KTP and NPWP?"*
   - *"Where can I request my IT equipment and laptop?"*
   - *"When should I sign the employment contract?"*
   - *"What is my onboarding progress right now?"*
3. Tekan **Enter** atau klik tombol kirim biru.
4. Asisten Buddy akan menampilkan animasi sedang mengetik lalu memberikan panduan jawaban yang relevan. Seluruh riwayat percakapan Anda otomatis tersimpan di database.

---

### 7. Keluar / Logout
Untuk mengakhiri sesi:
1. Klik ikon **Sign out** (panah keluar merah) di samping foto profil pada sudut kanan atas.
2. Sesi dan cookie browser akan dihapus dengan aman, lalu Anda akan diarahkan kembali ke halaman login.

---

## 📂 Struktur Proyek

```
BuddyUp-IBM/
├── docker-compose.yml          # Konfigurasi container PocketBase
├── README.md                   # Dokumentasi panduan & tutorial aplikasi
├── mk_superuser.sh             # Skrip CLI pembuat superuser (Linux / macOS / WSL)
├── mk_superuser.bat            # Skrip CLI pembuat superuser (Windows CMD)
├── mk_superuser.ps1            # Skrip CLI pembuat superuser (Windows PowerShell)
├── mk_superuser.py             # Skrip CLI pembuat superuser (Cross-platform Python)
├── hooks/
│   └── main.pb.js              # Server-side PocketBase JS hook (auto-provision checklist user baru)
├── migrations/                 # Migrasi database otomatis PocketBase
│   ├── 1_init_schema.js        # Koleksi 'checklists' & hak akses
│   ├── 2_create_chats.js       # Koleksi 'chats' & hak akses
│   ├── 3_extend_users.js       # Penambahan field division, avatar, joined_date ke users
│   ├── 4_seed_demo_data.js     # Akun demo awal (Alex Johnson) & checklist
│   ├── 5_checklist_completed_at.js # Penambahan field completed_at
│   ├── 6_add_created_updated.js    # Penambahan AutodateField created & updated
│   ├── 7_ensure_user_checklists.js # Memastikan seluruh user memiliki checklist
│   └── 8_seed_more_dummy_employees.js # Seeding akun dummy tambahan (Sarah, David, Emily, Budi)
├── data/                       # Database SQLite lokal PocketBase (pb_data) - diabaikan di git
└── public/                     # Static web assets
    ├── index.html              # Root redirect → login.html
    ├── login.html              # Halaman login + modal Request Account HR
    ├── dashboard.html          # Aplikasi utama (Dashboard + Checklist + Chat)
    └── js/
        ├── pb.js               # Inisialisasi PocketBase SDK & cookie sync
        ├── auth.js             # Session guards (requireAuth / requireGuest / logout)
        ├── api.js              # Centralised API wrappers
        └── buddy.js            # Engine chatbot AI berbasis keyword
```

---

## 🛑 Stop / Reset Database

```bash
# Menghentikan container
docker-compose down

# Reset bersih total (menghapus container beserta database)
docker-compose down -v
rm -rf data/
```
