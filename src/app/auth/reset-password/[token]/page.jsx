"use client";
import { useState } from "react";
import { useParams, useRouter } from "next/navigation"; // Pakai useParams untuk ambil token
import api from "@/lib/axios";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { PasswordInput } from "@/components/ui/password-input"; // Pakai komponen mata yang sudah dibuat
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default function ResetPasswordPage() {
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

  return (
    <div className="flex h-screen items-center justify-center bg-slate-50">
      <Card className="w-[400px] shadow-lg">
        <CardHeader>
          <CardTitle>Buat Password Baru</CardTitle>
          <CardDescription>Silakan masukkan password baru Anda.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <PasswordInput 
                placeholder="Password Baru (Min 8 Karakter)" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
            />
                
            <PasswordInput 
            placeholder="Konfirmasi Password Baru"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required 
          />
            <Button className="w-full bg-green-600 hover:bg-green-700" disabled={loading}>
                {loading ? "Menyimpan..." : "Simpan Password Baru"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}