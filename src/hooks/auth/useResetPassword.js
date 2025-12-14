"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation"; // Pakai useParams untuk ambil token
import api from "@/lib/axios";
import { toast } from "sonner";

export function useResetPassword() {
  const { token } = useParams(); // Ambil token dari URL
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password.length < 8) return toast.error("Password minimal 8 karakter");
         
    if (password !== confirmPassword) {
        alert("Konfirmasi password tidak cocok!");
        return;
      }
    setLoading(true);
    try {
      await api.put(`/auth/reset-password/${token}`, { 
        password: password,
        confirmPassword: confirmPassword 
      });

      toast.success("Password berhasil diubah! Mengalihkan ke Login...");
      setTimeout(() => router.push("/auth/login"), 2000);
    } catch (error) {
      toast.error(error.response?.data?.message || "Link kadaluarsa atau tidak valid");
    } finally {
      setLoading(false);
    }
  };
  return {password, confirmPassword, loading, setPassword, setConfirmPassword, handleSubmit};
}

export default useResetPassword