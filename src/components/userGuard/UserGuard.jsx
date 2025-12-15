"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import useUserStore from "@/store/useUserStore";

export function UserGuard({ children }) {
  // Ambil data user
  const user = useUserStore((state) => state.user);
  const router = useRouter();

  useEffect(() => {
    if (user && user.role === "ADMIN") {
      router.replace("/dashboard"); 
    }
  }, [user, router]);

  if (!user) {
    return (
      <div className="flex h-[50vh] w-full items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (user.role === "ADMIN") {
    return null; 
  }

  return <>{children}</>;
}