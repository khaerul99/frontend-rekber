// src/app/dashboard/create/page.jsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/axios";
import { toast } from "sonner";
import { Wallet, ArrowRight, Info } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function CreateTransactionPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  
  const [form, setForm] = useState({
    sellerEmail: "",
    amount: "",
    description: "",
  });

  // Format angka saat mengetik nominal (Hanya angka)
  const handleAmountChange = (e) => {
    const value = e.target.value.replace(/[^0-9]/g, "");
    setForm({ ...form, amount: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Validasi Nominal (Misal minimal Rp 10.000)
      if (parseInt(form.amount) < 10000) {
        toast.warning("Minimal transaksi adalah Rp 10.000");
        setLoading(false);
        return;
      }

      // Kirim ke Backend
      const res = await api.post("/transactions", {
        sellerEmail: form.sellerEmail,
        amount: parseInt(form.amount), // Ubah string ke number
        description: form.description
      });

      toast.success("Transaksi Berhasil Dibuat!");
      
      // Redirect otomatis ke halaman Detail Transaksi (Chat Room)
      // Backend mengirim ID transaksi baru di res.data.data.id
      router.push(`/dashboard/transaction/${res.data.data.id}`);

    } catch (error) {
      // Tampilkan error jika Email Penjual tidak ditemukan
      toast.error(error.response?.data?.message || "Gagal membuat transaksi");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      
      {/* Header Halaman */}
      <div className="flex items-center gap-2">
         <Wallet className="h-8 w-8 text-blue-600" />
         <h1 className="text-3xl font-bold">Buat Transaksi Baru</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Formulir Rekber</CardTitle>
          <CardDescription>
            Isi data dengan benar. Dana akan ditahan oleh sistem sampai barang diterima.
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* INFO BOX */}
            <Alert className="bg-blue-50 border-blue-200 text-blue-800">
              <Info className="h-4 w-4" />
              <AlertTitle>Penting!</AlertTitle>
              <AlertDescription>
                Pastikan email penjual sudah terdaftar di aplikasi ini agar transaksi bisa diproses.
              </AlertDescription>
            </Alert>

            {/* INPUT EMAIL PENJUAL */}
            <div className="space-y-2">
              <Label htmlFor="sellerEmail">Email Penjual (Lawan Transaksi)</Label>
              <Input 
                id="sellerEmail"
                type="email" 
                placeholder="contoh: penjual@gmail.com"
                value={form.sellerEmail}
                onChange={(e) => setForm({...form, sellerEmail: e.target.value})}
                required
              />
            </div>

            {/* INPUT NOMINAL */}
            <div className="space-y-2">
              <Label htmlFor="amount">Nominal Transaksi (Rp)</Label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-slate-500 font-semibold">Rp</span>
                <Input 
                    id="amount"
                    type="text" 
                    className="pl-10" // Kasih padding kiri biar gak nabrak "Rp"
                    placeholder="150000"
                    value={form.amount}
                    onChange={handleAmountChange}
                    required
                />
              </div>
              {/* Preview Format Rupiah (Biar user gak salah nol) */}
              {form.amount && (
                <p className="text-sm text-blue-600 font-medium text-right">
                  Terbaca: Rp {parseInt(form.amount).toLocaleString("id-ID")}
                </p>
              )}
            </div>

            {/* INPUT DESKRIPSI */}
            <div className="space-y-2">
              <Label htmlFor="description">Keterangan Barang / Jasa</Label>
              <Textarea 
                id="description"
                placeholder="Contoh: Jual Akun ML Rank Mythic, Full Skin, Login Moonton..."
                className="min-h-[100px]"
                value={form.description}
                onChange={(e) => setForm({...form, description: e.target.value})}
                required
              />
            </div>

            <Button type="submit" className="w-full text-lg h-12" disabled={loading}>
              {loading ? "Memproses..." : (
                <span className="flex items-center gap-2">
                    Lanjut ke Pembayaran <ArrowRight size={20} />
                </span>
              )}
            </Button>

          </form>
        </CardContent>
      </Card>
    </div>
  );
}