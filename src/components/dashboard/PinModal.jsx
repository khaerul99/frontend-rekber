"use client";

import { useState } from "react";
import api from "@/lib/axios";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function PinModal({ isOpen, onClose, onSuccess }) {
  const [pin, setPin] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (pin.length < 6) return;

    setLoading(true);
    try {
      // Cek PIN ke Backend
      await api.post("/users/pin/verify", { pin });
      
      // Jika sukses, jalankan aksi selanjutnya (callback)
      onSuccess();
      onClose();
      setPin(""); // Reset
    } catch (error) {
      toast.error(error.response?.data?.message || "PIN Salah");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent className="sm:max-w-[400px]">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-center">Verifikasi PIN</AlertDialogTitle>
          <AlertDialogDescription className="text-center">
            Masukkan 6 digit PIN Transaksi Anda untuk melanjutkan.
          </AlertDialogDescription>
        </AlertDialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
            <div className="flex justify-center">
                <Input 
                    type="password" 
                    maxLength={6}
                    className="text-center text-3xl tracking-[0.5em] font-mono w-48 h-12"
                    value={pin}
                    onChange={(e) => setPin(e.target.value.replace(/[^0-9]/g, ''))}
                    autoFocus
                />
            </div>

            <div className="flex gap-2 justify-end">
                <Button type="button" variant="ghost" onClick={onClose}>Batal</Button>
                <Button type="submit" disabled={loading || pin.length < 6}>
                    {loading ? "Memproses..." : "Konfirmasi"}
                </Button>
            </div>
        </form>
      </AlertDialogContent>
    </AlertDialog>
  );
}