"use client";

import { useEffect, useState } from "react";
import api from "@/lib/axios";


export function useHistoryAdmin() {
  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  // 1. Fetch Data (Endpoint Admin)
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get("/transactions/admin/all");
        setTransactions(res.data);
        setFilteredTransactions(res.data);
      } catch (error) {
        console.error("Gagal ambil data", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // 2. Filter Logic
  useEffect(() => {
    let result = transactions;

    if (statusFilter !== "ALL") {
      result = result.filter((trx) => trx.status === statusFilter);
    }

    if (search) {
      const lowerSearch = search.toLowerCase();
      result = result.filter((trx) => 
        trx.trx_code.toLowerCase().includes(lowerSearch) || 
        trx.buyer?.username.toLowerCase().includes(lowerSearch) ||
        trx.seller?.username.toLowerCase().includes(lowerSearch)
      );
    }

    setFilteredTransactions(result);
  }, [search, statusFilter, transactions]);

  // Helper Warna
 const getStatusColor = (status) => {
    switch (status) {
      case "PENDING_PAYMENT": return "bg-yellow-500";
      case "VERIFYING": return "bg-orange-500";
      case "PROCESSED": return "bg-blue-500";
      case "SENT": return "bg-purple-500";
      
      // COMPLETED = Barang Diterima (Uang Masih di Admin)
      case "COMPLETED": return "bg-green-500"; 
      
      // DISBURSED = Uang Sudah Cair (Admin Sudah TF)
      case "DISBURSED": return "bg-cyan-600"; 
      
      case "DISPUTED": return "bg-red-500"; // Tambahan untuk sengketa
      case "CANCELLED": return "bg-slate-500";
      default: return "bg-slate-500";
    }
  };

  return {statusFilter, filteredTransactions, loading, search, setSearch, setStatusFilter, getStatusColor, }
}
