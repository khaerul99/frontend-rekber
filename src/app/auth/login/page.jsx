// src/app/login/page.jsx
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { toast } from "sonner";
import api from "@/lib/axios";
import useUserStore from "@/store/useUserStore";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ShieldCheck } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useUserStore();
  const [loading, setLoading] = useState(false);
  
  // State untuk mengontrol tampilan (Login biasa vs Input OTP)
  const [step, setStep] = useState("LOGIN"); // "LOGIN" atau "2FA"
  
  const [form, setForm] = useState({
    email: "",
    password: "",
    twofaToken: "" // Tambahan untuk kode OTP
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Kirim semua data form (termasuk token jika ada)
      const res = await api.post("/auth/login", form);

      // 1. Jika Backend minta 2FA
      if (res.data.require2FA) {
        setStep("2FA"); // Ganti tampilan ke Input OTP
        toast.info("Masukkan kode Authenticator Anda.");
        setLoading(false);
        return;
      }

      // 2. Jika Login Sukses (Dapat Token)
      const token = res.data.token;
      localStorage.setItem("token", token); 
      login(res.data, token);

      toast.success("Login Berhasil!");
      router.push("/dashboard"); 
      
    } catch (error) {
      toast.error(error.response?.data?.message || "Terjadi kesalahan");
      
      // Jika kode salah, reset input token biar user bisa coba lagi
      if (step === "2FA") {
          setForm({ ...form, twofaToken: "" });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen items-center justify-center bg-slate-50">
      <Card className="w-[350px] shadow-lg">
        <CardHeader>
          <CardTitle>{step === "LOGIN" ? "Login Masuk" : "Verifikasi 2FA"}</CardTitle>
          <CardDescription>
            {step === "LOGIN" 
                ? "Masuk untuk mengelola transaksi." 
                : "Masukkan 6 digit kode dari aplikasi Google Authenticator."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            
            {/* TAMPILAN 1: INPUT EMAIL & PASSWORD */}
            {step === "LOGIN" && (
                <>
                    <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input 
                        id="email" name="email" type="email" placeholder="nama@email.com" 
                        onChange={handleChange} required 
                    />
                    </div>
                    <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input 
                        id="password" name="password" type="password" placeholder="******" 
                        onChange={handleChange} required 
                    />
                    </div>
                </>
            )}

            {/* TAMPILAN 2: INPUT OTP KHUSUS */}
            {step === "2FA" && (
                <div className="space-y-4 py-4">
                    <div className="flex justify-center">
                        <div className="p-3 bg-blue-50 rounded-full text-blue-600">
                            <ShieldCheck size={40} />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label className="text-center block">Kode Authenticator</Label>
                        <Input 
                            name="twofaToken" 
                            type="text" 
                            placeholder="123456" 
                            className="text-center text-2xl tracking-[0.5em] font-mono"
                            maxLength={6}
                            autoFocus
                            value={form.twofaToken}
                            onChange={handleChange} 
                            required 
                        />
                    </div>
                </div>
            )}
            
            <Button type="submit" className="w-full" disabled={loading}>
              {loading 
                ? "Memproses..." 
                : (step === "LOGIN" ? "Masuk" : "Verifikasi")}
            </Button>

            {/* Tombol Kembali jika salah email */}
            {step === "2FA" && (
                <Button 
                    type="button" 
                    variant="ghost" 
                    className="w-full mt-2" 
                    onClick={() => setStep("LOGIN")}
                >
                    Kembali ke Login
                </Button>
            )}

          </form>
        </CardContent>
        
        {step === "LOGIN" && (
            <CardFooter className="flex justify-center">
            <p className="text-sm text-slate-600">
                Belum punya akun? <Link href="/auth/register" className="text-blue-600 hover:underline">Daftar</Link>
            </p>
            </CardFooter>
        )}
      </Card>
    </div>
  );
}