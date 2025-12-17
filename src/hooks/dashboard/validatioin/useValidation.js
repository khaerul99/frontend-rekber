"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import useUserStore from "@/store/useUserStore";
import { transactionService } from "@/services/transaction/transactionServices";


export function useValidation() {
     const { user } = useUserStore();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  // State untuk Modal Lihat Bukti
  const [selectedProof, setSelectedProof] = useState(null);

  // 1. Fetch Data
  const fetchVerifying = async () => {
    if (!user || user.role !== "ADMIN") {
         setLoading(false);
         return; 
      }
    try {
      const res = await transactionService.getVerifyingList();
      console.log("DATA DARI BACKEND:", res.data);
      setTransactions(res.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVerifying();
  }, []);

  const handleAccept = async (id) => {
    try {
      await transactionService.verifyPayment(id);
      toast.success("Pembayaran Diterima! Status: PROCESSED");
      fetchVerifying(); 
    } catch (error) {
      toast.error("Gagal memproses");
    }
  };

  const handleReject = async (id) => {
    try {
      await transactionService.rejectPayment(id);
      toast.warning("Pembayaran Ditolak. Status dikembalikan ke PENDING.");
      fetchVerifying(); 
    } catch (error) {
      toast.error("Gagal menolak");
    }
  };

  const getStatusColor = (status) => {
  switch (status) {
    case "PENDING_PAYMENT":
      return "bg-yellow-500 hover:bg-yellow-600";
    case "VERIFYING":
      return "bg-orange-500 hover:bg-orange-600";
    case "PROCESSED":
      return "bg-blue-500 hover:bg-blue-600";
    case "SENT":
      return "bg-purple-500 hover:bg-purple-600";
    case "WAITING_REPLACEMENT":
      return "bg-indigo-500 hover:bg-indigo-600";
    case "COMPLETED":
      return "bg-green-500 hover:bg-green-600";
    case "DISPUTED":
      return "bg-red-500 hover:bg-red-600";
    case "CANCELLED":
      return "bg-slate-500 hover:bg-slate-600";
    default:
      return "bg-slate-500";
  }
};

  return {
    user,
    transactions,
    loading,
    selectedProof,
    setSelectedProof,
    handleAccept,
    handleReject,
    getStatusColor,
  };
}
