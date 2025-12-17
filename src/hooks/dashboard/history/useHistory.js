"use client";

import { useEffect, useState } from "react";
import useUserStore from "@/store/useUserStore";
import { userService } from "@/services/users/userServices";
import { transactionService } from "@/services/transaction/transactionServices";

export function useHistory() {
  const { user } = useUserStore();
  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  // State untuk Filter
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  // 1. Data dari API
  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const res = await transactionService.getMyTrasactions();
        setTransactions(res.data);
        setFilteredTransactions(res.data);
      } catch (error) {
        console.error("Gagal ambil data", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  // 2. Logika Filter & Search (Jalan setiap kali user ngetik/ganti status)
  useEffect(() => {
    let result = transactions;

    // Filter by Status
    if (statusFilter !== "ALL") {
      result = result.filter((trx) => trx.status === statusFilter);
    }

    // Filter by Search (Kode TRX atau Nama Lawan)
    if (search) {
      const lowerSearch = search.toLowerCase();
      result = result.filter(
        (trx) =>
          trx.trx_code.toLowerCase().includes(lowerSearch) ||
          trx.buyer?.username.toLowerCase().includes(lowerSearch) ||
          trx.seller?.username.toLowerCase().includes(lowerSearch)
      );
    }

    setFilteredTransactions(result);
  }, [search, statusFilter, transactions]);

  // Helper Warna Status
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
    statusFilter,
    filteredTransactions,
    loading,
    search,
    setSearch,
    setStatusFilter,
    getStatusColor,
  };
}
