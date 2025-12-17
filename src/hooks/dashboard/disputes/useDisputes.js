"use client";

import { useEffect, useState } from "react";
import api from "@/lib/axios";
import { toast } from "sonner";
import useUserStore from "@/store/useUserStore";
import { transactionService } from "@/services/transaction/transactionServices";

export function useDisputes() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useUserStore();

  const fetchDisputes = async () => {
    if (!user || user.role !== "ADMIN") {
      setLoading(false);
      return;
    }
    try {
      const dataDisputes = await transactionService.getDisputes();
      setTransactions(dataDisputes);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDisputes();
  }, []);

  const handleResolve = async (id, decision) => {
    try {
      await transactionService.resolveDispute(id, {
        decision,
      });
      toast.success(
        decision === "REFUND_BUYER"
          ? "Transaksi Dibatalkan (Refund)"
          : "Komplain Ditolak (Lanjut Cair)"
      );
      fetchDisputes();
    } catch (error) {
      toast.error("Gagal memproses");
    }
  };

  return { transactions, loading, handleResolve };
}
