"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { LayoutDashboard, PlusCircle, User, History, Banknote, LifeBuoy, FileText, CheckCircle, Users, Gavel } from "lucide-react";
import useUserStore from "@/store/useUserStore";

// Daftar Menu
const navItems = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Buat Transaksi", href: "/dashboard/create", icon: PlusCircle },
  { name: "Riwayat", href: "/dashboard/history", icon: History }, 
  { name: "Profil Saya", href: "/dashboard/profile", icon: User },
];



export default function NavLinks({ onNavigate }) {
  const pathname = usePathname();
  const { user } = useUserStore();

  let navItems = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Buat Transaksi", href: "/dashboard/create", icon: PlusCircle },
  { name: "Riwayat", href: "/dashboard/history", icon: History }, 
  { name: "Bantuan", href: "/dashboard/help", icon: LifeBuoy },
];

if (user?.role === "ADMIN") {
    
    navItems = navItems.filter(item => item.href !== "/dashboard/history" && item.href !== "/dashboard/create" && item.href !== "/dashboard/help");

    navItems.push(
      {
        name: "Validasi Pembayaran",
        href: "/dashboard/validation",
        icon: CheckCircle
      },
      {
      name: "Pencairan Dana",
      href: "/dashboard/disbursement",
      icon: Banknote
    },
    {
      name: "Pusat Resolusi",
      href: "/dashboard/disputes",
      icon: Gavel
    },
      {
        name: "Semua Riwayat", 
        href: "/dashboard/admin-history",
        icon: FileText
      },
      {
        name: "Kelola User",
        href: "/dashboard/users",
        icon: Users
      },
    );
  }


  return (
    <div className="flex flex-col gap-1">
      {navItems.map((item) => {
        const isActive = pathname === item.href;
        return (
          <Link 
            key={item.href} 
            href={item.href}
            onClick={onNavigate} // Fungsi untuk menutup menu mobile jika diklik
          >
            <Button 
              variant={isActive ? "secondary" : "ghost"} 
              className={`w-full justify-start gap-3 ${
                isActive ? "bg-blue-50 text-blue-700 font-bold" : "text-slate-600"
              }`}
            >
              <item.icon size={20} />
              {item.name}
            </Button>
          </Link>
        );
      })}
    </div>
  );
}