"use client";

import { Button } from "@/components/ui/button";
import { PasswordInput } from "@/components/ui/password-input"; // Pakai komponen mata yang sudah dibuat
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useResetPassword } from "@/hooks/auth/useResetPassword";

export default function ResetPasswordPage() {
 const {password, confirmPassword, loading, setPassword, setConfirmPassword, handleSubmit} = useResetPassword();

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