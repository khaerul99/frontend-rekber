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
    <div className="flex min-h-screen w-full bg-slate-50 overflow-x-hidden">
      
      <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-64 lg:flex-col">
          <Sidebar />
      </div>

      <div className="flex flex-1 flex-col lg:pl-64 transition-all duration-300 min-w-0">
        
        <header className="sticky top-0 z-20 flex h-16 items-center gap-4 border-b bg-white px-6 shadow-sm">
            <div className="lg:hidden">
                <MobileNav />
            </div>
            <div className="ml-auto flex items-center gap-4">
               <NotificationMenu />
               <UserNav />
            </div>
        </header>

        <main className="flex-1 p-4 md:p-8 w-full">
            <div className="mx-auto w-full max-w-7xl space-y-6">
                {children}
            </div>
        </main>
        
      </div>
    </div>
  );
} 
