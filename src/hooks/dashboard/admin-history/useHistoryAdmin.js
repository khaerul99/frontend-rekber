"use client";

import { useEffect, useState } from "react";
import useUserStore from "@/store/useUserStore";
import { transactionService } from "@/services/transaction/transactionServices";

export function useHistoryAdmin() {
  const { user } = useUserStore();
  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [selectedTrx, setSelectedTrx] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [detailLoading, setDetailLoading] = useState(false);
  useEffect(() => {
    const fetchData = async () => {
      if (!user || user.role !== "ADMIN") {
        setLoading(false);
        return;
      }

      try {
        const dataTransaction = await transactionService.getAllTransactions();
        setTransactions(dataTransaction);
        setFilteredTransactions(dataTransaction);
      } catch (error) {
        console.error("Gagal ambil data", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  // 2. Filter Logic
  useEffect(() => {
    let result = transactions;

    if (statusFilter !== "ALL") {
      result = result.filter((trx) => trx.status === statusFilter);
    }

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
  // Helper Warna
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
    statusFilter,
    filteredTransactions,
    loading,
    search,
    isModalOpen, 
    selectedTrx,
    detailLoading,
    setSearch,
    setStatusFilter,
    getStatusColor,
    setIsModalOpen, 
    openDetailModal,
    closeModal,
    formatRupiah
  };
}
