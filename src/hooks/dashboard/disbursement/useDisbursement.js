import React from "react";

import { useEffect, useState, useRef } from "react";
import api from "@/lib/axios";
import { toast } from "sonner";

export function useDisbursement() {
  const [transactions, setTransactions] = useState([]);
  const [refunds, setRefunds] = useState([]); // State baru untuk refund
  const [loading, setLoading] = useState(true);
  
  // State Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTrx, setSelectedTrx] = useState(null);
  const [actionType, setActionType] = useState(""); // 'DISBURSE' atau 'REFUND'
  const [proofFile, setProofFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const fetchData = async () => {
    try {
      // Ambil Data Pencairan
      const resDisburse = await api.get("/transactions/admin/disbursement");
      setTransactions(resDisburse.data);

      // Ambil Data Refund
      const resRefund = await api.get("/transactions/admin/refunds");
      setRefunds(resRefund.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const openUploadModal = (trx, type) => {
    setSelectedTrx(trx);
    setActionType(type);
    setProofFile(null);
    setIsModalOpen(true);
  };

  const handleSubmit = async () => {
    if (!proofFile) return toast.error("Wajib upload bukti!");
    setUploading(true);
    
    const formData = new FormData();
    formData.append("image", proofFile);

    try {
      const url = actionType === 'DISBURSE' 
        ? `/transactions/${selectedTrx.id}/disburse`
        : `/transactions/${selectedTrx.id}/refund`;

      await api.patch(url, formData);
      toast.success("Berhasil diproses!");
      setIsModalOpen(false);
      fetchData();
    } catch (error) {
      toast.error("Gagal memproses");
    } finally {
      setUploading(false);
    }
  };

  const copyText = (text) => {
    navigator.clipboard.writeText(text);
    toast.success("Berhaasil disalin " + text);
  };
  return {
         actionType, transactions, isModalOpen, refunds, selectedTrx, loading, proofFile, uploading,handleSubmit,setIsModalOpen, openUploadModal, copyText, setProofFile
  };
}
