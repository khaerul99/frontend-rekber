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
    confirmPassword: ''
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


   if (form.password !== form.confirmPassword) {
      toast.error("Password dan Konfirmasi Password tidak cocok!");
      setLoading(false);
      return; 
    }

    try {
      // Panggil API Backend
      await api.post("/auth/register",  form);

    
      toast.success("Registrasi Berhasil! Silakan Login.");


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