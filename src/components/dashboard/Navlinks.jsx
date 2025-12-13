"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { 
  LayoutDashboard, 
  PlusCircle, 
  User, 
  History, 
  Banknote, 
  LifeBuoy, 
  FileText, 
  CheckCircle, 
  Users, 
  Gavel 
} from "lucide-react";
import useUserStore from "@/store/useUserStore";

export default function NavLinks({ onNavigate }) {
  const pathname = usePathname();
  const { user } = useUserStore();

  // Struktur Data Baru: Array of Groups
  let menuGroups = [];

  if (user?.role === "ADMIN") {
    // --- MENU KHUSUS ADMIN ---
    menuGroups = [
      {
        heading: "Overview",
        items: [
          { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
        ]
      },
      {
        heading: "Validasi & Keuangan",
        items: [
          { name: "Validasi Pembayaran", href: "/dashboard/validation", icon: CheckCircle },
          { name: "Pencairan Dana", href: "/dashboard/disbursement", icon: Banknote },
          { name: "Pusat Resolusi", href: "/dashboard/disputes", icon: Gavel },
        ]
      },
      {
        heading: "Manajemen Data",
        items: [
          { name: "Semua Riwayat", href: "/dashboard/admin-history", icon: FileText },
          { name: "Kelola User", href: "/dashboard/users", icon: Users },
        ]
      }
    ];
  } else {
    // --- MENU MEMBER BIASA ---
    menuGroups = [
      {
        heading: "Menu Utama",
        items: [
          { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
          { name: "Buat Transaksi", href: "/dashboard/create", icon: PlusCircle },
          { name: "Riwayat Saya", href: "/dashboard/history", icon: History },
        ]
      },
      {
        heading: "Lainnya",
        items: [
          { name: "Profil Akun", href: "/dashboard/profile", icon: User },
          { name: "Bantuan", href: "/dashboard/help", icon: LifeBuoy },
        ]
      }
    ];
  }

  return (
    <div className="flex flex-col gap-6 px-2">
      {menuGroups.map((group, index) => (
        <div key={index}>
          {/* Judul Kategori (Pembatas) */}
          {group.heading && (
            <h4 className="mb-2 px-4 text-xs font-bold text-slate-400 uppercase tracking-wider">
              {group.heading}
            </h4>
          )}
          
          {/* List Menu Item */}
          <div className="flex flex-col gap-1">
            {group.items.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link 
                  key={item.href} 
                  href={item.href}
                  onClick={onNavigate}
                >
                  <Button 
                    variant={isActive ? "secondary" : "ghost"} 
                    className={`w-full justify-start gap-3 ${
                      isActive 
                        ? "bg-blue-50 text-blue-700 font-bold" 
                        : "text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    <item.icon size={18} />
                    {item.name}
                  </Button>
                </Link>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}