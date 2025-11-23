"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/axios";
import { toast } from "sonner";

export function useRegister() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
  });

  // Handle Input Change
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  // Handle Submit Register
  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Panggil API Backend
      await api.post("/auth/register",  form);
      
      toast.success("Registrasi Berhasil! Silakan Login.");
      
      // Arahkan ke halaman login (sesuaikan path-nya)
      // Biasanya /login, tapi sesuaikan jika kamu pakai /auth/login
      router.push("/auth/login"); 
      
    } catch (error) {
      const errMsg = error.response?.data?.message || "Terjadi kesalahan";
      toast.error(errMsg);
    } finally {
      setLoading(false);
    }
  };

  // Return semua yang dibutuhkan oleh View (Halaman)
  return {
    form,
    loading,
    handleChange,
    handleRegister,
  };
}