
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/axios";
import { toast } from "sonner";
import useUserStore from "@/store/useUserStore";


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
      const res = await api.post("/auth/login", form);

      if (res.data.require2FA) {
        setStep("2FA");
        toast.info("Masukkan kode Authenticator Anda.");
        setLoading(false);
        return;
      }

      const token = res.data.token;
      localStorage.setItem("token", token);
      login(res.data, token);

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
