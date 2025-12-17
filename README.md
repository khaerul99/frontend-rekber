# 💻 Rekber App - Frontend Client

![Next.js](https://img.shields.io/badge/Next.js-14-black.svg)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-blue.svg)
![Shadcn UI](https://img.shields.io/badge/UI-Shadcn-black.svg)
![License](https://img.shields.io/badge/license-MIT-orange.svg)

Antarmuka pengguna (User Interface) modern untuk aplikasi **Layanan Rekening Bersama (Escrow Service)**.
Aplikasi ini dirancang untuk memberikan pengalaman transaksi yang aman, responsif, dan *real-time* bagi Penjual, Pembeli, dan Admin.

Dibangun menggunakan **Next.js 14 (App Router)** untuk performa maksimal dan SEO yang baik.

---

## 📸 Preview

<img width="1919" height="991" alt="Image" src="https://github.com/user-attachments/assets/9922fa86-172b-4a5a-9ac2-e9471025e881" />
---

## ✨ Fitur Unggulan

### 🎨 UI/UX Interaktif
* **Modern Dashboard:** Dashboard khusus untuk peran Pembeli, Penjual, dan Admin.
* **Status Tracking:** Visualisasi alur transaksi langkah demi langkah (Stepper).
* **Responsive Design:** Tampilan optimal di Desktop, Tablet, dan Mobile.

### 🛡️ Fitur Keamanan Client-Side
* **PIN Protection:** Modal interaktif untuk validasi PIN sebelum aksi sensitif (Pencairan/Refund).
* **Middleware Protection:** Proteksi halaman (Route Guard) berdasarkan status login dan role user.

### ⚡ Real-time & Interaktivitas
* **Live Chat:** Fitur chat langsung antar pengguna menggunakan Socket.io-client.
* **Instant Notifications:** Notifikasi *toast* (Sonner) untuk setiap aksi sukses/gagal.
* **Image Preview:** Pratinjau gambar instan sebelum upload bukti transfer/resi.

---

## 🚀 Tech Stack

Aplikasi ini dibangun dengan pustaka teknologi terkini:

* **Framework:** [Next.js 14](https://nextjs.org/) (App Router)
* **Styling:** [Tailwind CSS](https://tailwindcss.com/)
* **UI Components:** [Shadcn UI](https://ui.shadcn.com/) (Radix Primitives)
* **State Management:** [Zustand](https://github.com/pmndrs/zustand) (Ringan & Cepat)
* **Icons:** [Lucide React](https://lucide.dev/)
* **HTTP Client:** Axios
* **Real-time:** Socket.io Client
* **Form & Validation:** React Hook Form (Opsional)

---

## 🛠️ Cara Instalasi (Local Setup)

Pastikan **Backend** sudah berjalan sebelum menjalankan Frontend.

### 1. Clone Repository
```bash
git clone [[https://github.com/username-anda/rekber-frontend.git](https://github.com/khaerul99/frontend-rekber.git)]
cd rekber-frontend
