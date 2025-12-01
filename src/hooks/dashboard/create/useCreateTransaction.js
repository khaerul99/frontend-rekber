"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/axios";
import { toast } from "sonner";


export function useCreateTransaction() {
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
      if (parseInt(form.amount) < 10000) {
        toast.warning("Minimal transaksi adalah Rp 10.000");
        setLoading(false);
        return;
      }

      console.log("Data yang dikirim:", form);
      const res = await api.post("/transactions", {
        sellerEmail: form.sellerEmail,
        amount: parseInt(form.amount), 
        description: form.description,
      });

      toast.success("Transaksi Berhasil Dibuat!");

      router.push(`/dashboard/transaction/${res.data.data.id}`);
    } catch (error) {
      toast.error(error.response?.data?.message || "Gagal membuat transaksi");
    } finally {
      setLoading(false);
    }


  };
  
  return {form, loading, handleAmountChange, handleSubmit, setForm};
}
