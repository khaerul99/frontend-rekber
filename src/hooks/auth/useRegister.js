"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/axios";
import { toast } from "sonner";
import { authService } from "@/services/auth/authServices";

export function useRegister() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: ''
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);


   if (form.password !== form.confirmPassword) {
      toast.error("Password dan Konfirmasi Password tidak cocok!");
      setLoading(false);
      return; 
    }

    try {
      await authService.register(form);

    
      toast.success("Registrasi Berhasil! Silakan Login.");


      router.push("/auth/login");   
    } catch (error) {
      const errMsg = error.response?.data?.message || "Terjadi kesalahan";
      toast.error(errMsg);
    } finally {
      setLoading(false);
    }
  };

  return {
    form,
    loading,
    handleChange,
    handleRegister,
  };
}