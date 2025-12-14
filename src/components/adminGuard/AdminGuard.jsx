"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import useUserStore from "@/store/useUserStore";

export default function AdminGuard({ children }) {
  const user = useUserStore((state) => state.user);
  const router = useRouter();

  useEffect(() => {
    if (!user) return; // still loading / not available
    if (user.role !== "ADMIN") {
      router.replace("/dashboard");
    }
  }, [user, router]);

  // derive "checking" from `user` instead of using local setState in the effect
  if (!user || user.role !== "ADMIN") {
    return (
      <div className="flex h-[50vh] w-full items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return <>{children}</>;
}