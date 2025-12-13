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
import { PasswordInput } from "@/components/ui/password-input";
import { useRegister } from "@/hooks/auth/useRegister";

export default function RegisterPage() {
  const { loading, handleChange, handleRegister } = useRegister();
  

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
              <PasswordInput 
                id="password" name="password" placeholder="******" 
                onChange={handleChange} required 
              />
              <p className="text-xs text-slate-500">*Min 8 karakter, 1 Huruf Besar, 1 Simbol</p>
            </div>
            <div className="mt-4">
            <label className="block text-gray-700">Konfirmasi Password</label>
            <PasswordInput 
              name="confirmPassword"
              placeholder="Ulangi Password"
              onChange={handleChange}
              required 
            />
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