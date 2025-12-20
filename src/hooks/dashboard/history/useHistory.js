"use client";

import { useEffect, useState } from "react";
import useUserStore from "@/store/useUserStore";
import { transactionService } from "@/services/transaction/transactionServices";

export function useHistory() {
  const { user } = useUserStore();
  const [allTransactions, setAllTransactions] = useState([]); 
  const [filteredTransactions, setFilteredTransactions] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [selectedTrx, setSelectedTrx] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [detailLoading, setDetailLoading] = useState(false);


    const openDetailModal = async (row) => {
    setIsModalOpen(true);
    setDetailLoading(true);
    setSelectedTrx(null);

    try {
      const freshData = await transactionService.getTransactionById(row.id);
      setSelectedTrx(freshData);
    } catch (error) {
      console.error("Gagal ambil detail:", error);
      setSelectedTrx(row);
    } finally {
      setDetailLoading(false);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const formatRupiah = (number) => new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR" }).format(number);


  // 1. Fetch Data
  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const data = await transactionService.getMyTransactions();
        const safeData = Array.isArray(data) ? data : (data.data || []);
        setAllTransactions(safeData);
        setFilteredTransactions(safeData);
      } catch (error) {
        console.error("Gagal ambil data", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  // 2. Logic Filter Search & Status
  useEffect(() => {
    let result = [...allTransactions];

    if (statusFilter !== "ALL") {
      result = result.filter((trx) => trx.status === statusFilter);
    }

    if (search) {
      const lowerSearch = search.toLowerCase();
      result = result.filter(
        (trx) =>
          trx.trx_code?.toLowerCase().includes(lowerSearch) ||
          trx.buyer?.username?.toLowerCase().includes(lowerSearch) ||
          trx.seller?.username?.toLowerCase().includes(lowerSearch)
      );
    }

    // Kita TIDAK melakukan slice/potong data disini. 
    // Biarkan library yang memotongnya nanti.
    setFilteredTransactions(result);

  }, [search, statusFilter, allTransactions]);

  // Helper Warna (Tetap dipakai)
  const getStatusColor = (status) => {
     // ... (kode warna sama seperti sebelumnya) ...
     switch (status) {
        case "PENDING_PAYMENT": return "bg-yellow-500 text-white"; // Tambah text-white biar aman
        case "VERIFYING": return "bg-orange-500 text-white";
        case "PROCESSED": return "bg-blue-500 text-white";
        case "SENT": return "bg-purple-500 text-white";
        case "WAITING_REPLACEMENT": return "bg-indigo-500 text-white";
        case "COMPLETED": return "bg-green-500 text-white";
        case "DISPUTED": return "bg-red-500 text-white";
        case "CANCELLED": return "bg-slate-500 text-white";
        default: return "bg-slate-500 text-white";
     }
  };

  return {
    user,
    loading,
    filteredTransactions, 
    selectedTrx,
    detailLoading,
    search, setSearch,
    formatRupiah,
    statusFilter, setStatusFilter,
    isModalOpen,setIsModalOpen,
    openDetailModal,
    closeModal,
    getStatusColor,
  };
}