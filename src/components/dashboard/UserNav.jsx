"use client";

import { useState } from "react";
import { LogOut, User, Settings } from "lucide-react";
import useUserStore from "@/store/useUserStore";
import { useRouter } from "next/navigation";
import Link from "next/link";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function UserNav() {
  const { user, logout } = useUserStore();
  const router = useRouter();
  const [showLogoutDialog, setShowLogoutDialog] = useState(false); // State untuk kontrol popup

  const handleLogout = () => {
    logout();
    localStorage.removeItem("token");
    router.push("/auth/login");
  };

  if (!user) return null;

  return (
    <>
      {/* 1. DROPDOWN MENU */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="hiddenrelative h-10 w-10 rounded-full">
            <Avatar className="h-10 w-10 border">
              <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${user.username}`} />
              <AvatarFallback>{user.username?.charAt(0).toUpperCase()}</AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        
        <DropdownMenuContent className="w-56" align="end" forceMount>
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">{user.username}</p>
              <p className="text-xs leading-none text-muted-foreground">
                {user.email}
              </p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          
          <DropdownMenuGroup>
            <Link href="/dashboard/profile">
              <DropdownMenuItem className="cursor-pointer">
                  <User className="mr-2 h-4 w-4" />
                  <span>Profil Saya</span>
              </DropdownMenuItem>
            </Link>
            
            {user.role === 'ADMIN' && (
               <Link href="/dashboard/settings">
                  <DropdownMenuItem className="cursor-pointer">
                      <Settings className="mr-2 h-4 w-4" />
                      <span>Pengaturan</span>
                  </DropdownMenuItem>
               </Link>
            )}
          </DropdownMenuGroup>
          
          <DropdownMenuSeparator />
          
          {/* Tombol Logout di Dropdown (Hanya memicu state, bukan logout langsung) */}
          <DropdownMenuItem 
            onSelect={() => setShowLogoutDialog(true)} 
            className="text-red-600 cursor-pointer focus:text-red-600"
          >
            <LogOut className="mr-2 h-4 w-4" />
            <span>Log out</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* 2. POPUP KONFIRMASI (Terpisah dari Dropdown) */}
      <AlertDialog open={showLogoutDialog} onOpenChange={setShowLogoutDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Yakin ingin keluar?</AlertDialogTitle>
            <AlertDialogDescription>
              Anda harus login kembali untuk mengakses dashboard.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction onClick={handleLogout} className="bg-red-600 hover:bg-red-700">
              Ya, Logout
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}