// src/app/register/page.jsx
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { toast } from "sonner"; // Notifikasi
import api from "@/lib/axios"; // Axios yang sudah kita setting
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Panggil API Backend
      await api.post("/auth/register", form);
      
      toast.success("Registrasi Berhasil! Silakan Login.");
      router.push("/auth/login"); // Arahkan ke halaman login
    } catch (error) {
      // Tampilkan pesan error dari backend
      toast.error(error.response?.data?.message || "Terjadi kesalahan");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen items-center justify-center bg-slate-50">
      <Card className="w-[350px] shadow-lg">
        <CardHeader>
          <CardTitle>Daftar Akun</CardTitle>
          <CardDescription>Buat akun rekber baru sekarang.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleRegister} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input 
                id="username" name="username" placeholder="Jhon Doe" 
                onChange={handleChange} required 
              />
            </div>
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
              <p className="text-xs text-slate-500">*Min 8 karakter, 1 Huruf Besar, 1 Simbol</p>
            </div>
            
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Memproses..." : "Daftar Sekarang"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-sm text-slate-600">
            Sudah punya akun? <Link href="/auth/login" className="text-blue-600 hover:underline">Login</Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}