
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/axios";
import { toast } from "sonner";
import useUserStore from "@/store/useUserStore";
import { authService } from "@/services/auth/authServices";


export function useLogin() {
  const router = useRouter();
  const { login } = useUserStore();
  const [loading, setLoading] = useState(false);

  const [step, setStep] = useState("LOGIN"); 

  const [form, setForm] = useState({
    email: "",
    password: "",
    twofaToken: "", 
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = await authService.login(form);

      if (data.require2FA) {
        setStep("2FA");
        toast.info("Masukkan kode Authenticator Anda.");
        setLoading(false);
        return;
      }

      const token = data.token;
      localStorage.setItem("token", token);
      login(data, token);

      toast.success("Login Berhasil!");
      router.push("/dashboard");
    } catch (error) {

      toast.error(error.response?.data?.message || "Terjadi kesalahan");

      if (step === "2FA") {
        setForm({ ...form, twofaToken: "" });
      }
    } finally {
      setLoading(false);
    }
  };
  return  {form, step, loading, setStep, handleLogin, handleChange};
}
