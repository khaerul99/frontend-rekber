"use client";
import { useState } from "react";
import api from "@/lib/axios";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default function ForgotPasswordPage() {
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

  return (
    <div className="flex h-screen items-center justify-center bg-slate-50">
      <Card className="w-[400px] shadow-lg">
        <CardHeader>
          <CardTitle>Lupa Password?</CardTitle>
          <CardDescription>Masukkan email yang terdaftar untuk mereset password.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input 
                type="email" 
                placeholder="nama@email.com" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                required 
            />
            <Button className="w-full bg-blue-600 hover:bg-blue-700" disabled={loading}>
                {loading ? "Mengirim..." : "Kirim Link Reset"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}