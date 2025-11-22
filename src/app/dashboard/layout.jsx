"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import useUserStore from "@/store/useUserStore";
import UserNav from "@/components/dashboard/UserNav";

// Import komponen pecahan tadi
import Sidebar from "@/components/dashboard/Sidebar";
import MobileNav from "@/components/dashboard/MobileNav";

export default function DashboardLayout({ children }) {
  const { user, token } = useUserStore();
  const router = useRouter();

  // Proteksi Halaman
  useEffect(() => {
    if (!token) {
      const storedToken =
        typeof window !== "undefined" ? localStorage.getItem("token") : null;

      if (!storedToken) {
        router.push("/auth/login");
      }
    }
  }, [token, router]);

  if (!user) return null;

  return (
    <div className="flex min-h-screen w-full bg-slate-50/50">
      {/* 1. Sidebar Desktop */}
      <Sidebar />

      {/* 2. Main Wrapper */}
      <div className="flex flex-1 flex-col md:pl-64 transition-all duration-300">
        {/* 3. Header Mobile */}
       <header className="sticky top-0 z-20 flex h-16 items-center gap-4 border-b bg-white px-6 shadow-sm">
            
            {/* Tombol Menu Mobile (Kiri) */}
            <div className="md:hidden">
                <MobileNav />
            </div>

            {/* Spacer agar UserNav mojok ke kanan */}
            <div className="ml-auto flex items-center gap-4">
                {/* User Profil Dropdown (Kanan) */}
                <UserNav />
            </div>
        </header>

        {/* 4. Konten Halaman (Page.jsx masuk sini) */}
        <main className="flex-1 p-4 md:p-8">{children}</main>
      </div>
    </div>
  );
}
