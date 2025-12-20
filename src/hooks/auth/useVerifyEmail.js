"use client";


import { useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import api from "@/lib/axios"; // Pastikan path ini sesuai dengan file axios kamu
import { toast } from "sonner";
import { authService } from "@/services/auth/authServices";

export function useVerifyEmail() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const token = searchParams.get("token");
    const [status, setStatus] = useState(token ? "verifying" : "error");

    const isRun = useRef(false);

     useEffect(() => {

      if (!token) return;

      if (isRun.current) return;

      isRun.current = true;
      
      const verifyUserEmail = async () => {
    

      try {
        await authService.verifyEmail(token);
        
        setStatus("success");
        toast.success("Email berhasil diverifikasi!");
    
        setTimeout(() => {
          router.push("/auth/login");
        }, 3000);

      } catch (error) {
        console.error("Verifikasi Gagal:", error);
        setStatus("error");
        toast.error(error.response?.data?.message || "Token tidak valid atau kadaluarsa.");
      }
    };

    verifyUserEmail();
  }, [token]);




  return {status, router};
}
