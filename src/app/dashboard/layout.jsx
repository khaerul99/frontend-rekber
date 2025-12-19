"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import useUserStore from "@/store/useUserStore";
import UserNav from "@/components/dashboard/UserNav";
import NotificationMenu from "@/components/dashboard/NotificationMenu";

// Import komponen pecahan tadi
import Sidebar from "@/components/dashboard/Sidebar";
import MobileNav from "@/components/dashboard/MobileNav";

export default function DashboardLayout({ children }) {
  const { user, token, _hasHydrated } = useUserStore();
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

   if (!_hasHydrated) {
      return null; 
  }

  if (!user) return null;

  return (
    <div className="flex min-h-screen w-full bg-slate-50/50 ">
      <Sidebar />

      <div className="flex flex-1 flex-col md:pl-64 transition-all duration-300">
       <header className="sticky top-0 z-20 flex h-16 items-center gap-4 border-b bg-white px-4 shadow-sm">
            
            <div className="md:hidden">
                <MobileNav />
            </div>
            <div className="ml-auto flex items-center gap-4">
               <NotificationMenu />
                <UserNav />
            </div>
        </header>

       <main className="flex-1 w-full p-4 md:p-6 overflow-x-hidden">
            <div className="mx-auto w-[1024px] max-w-7xl">
                {children}
            </div>
        </main>
      </div>
    </div>
  );
}
