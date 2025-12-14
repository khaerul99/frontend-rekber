"use client";

import { useState } from "react";
import api from "@/lib/axios";


export function useForgotPassword() {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
  
    const handleSubmit = async (e) => {
      e.preventDefault();
      setLoading(true);
      try {
        await api.post("/auth/forgot-password", { email });
        toast.success("Silakan cek email Anda (Inbox/Spam)!");
      } catch (error) {
        toast.error(error.response?.data?.message || "Gagal mengirim email");
      } finally {
        setLoading(false);
      }
    };


  return {email, loading, setEmail, handleSubmit};
}