import React from "react";

import { useEffect, useState, useRef } from "react";
import api from "@/lib/axios";
import { toast } from "sonner";
import useUserStore from "@/store/useUserStore";
import { transactionService } from "@/services/transaction/transactionServices";

export function useDisbursement() {
  const { user } = useUserStore();
  const [transactions, setTransactions] = useState([]);
  const [refunds, setRefunds] = useState([]); // State baru untuk refund
  const [loading, setLoading] = useState(true);
  
  // State Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTrx, setSelectedTrx] = useState(null);
  const [actionType, setActionType] = useState(""); // 'DISBURSE' atau 'REFUND'
  const [proofFile, setProofFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [isPinOpen, setIsPinOpen] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);

  const fetchData = async () => {

    if (!user || user.role !== "ADMIN") {
         setLoading(false);
         return; 
      }

    try {
      // Ambil Data Pencairan
      const dataDisbursement = await transactionService.getDisbursements();
      setTransactions(dataDisbursement);

      // Ambil Data Refund
      const dataRefund = await transactionService.getRefunds();
      setRefunds(dataRefund);
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


  const copyText = (text) => {
    navigator.clipboard.writeText(text);
    toast.success("Berhaasil disalin " + text);
  };

  const onUploadSubmit = () => {
      if (!proofFile) return toast.error("Wajib upload bukti!");
      setIsPinOpen(true); 
  };

  // B. Fungsi Eksekusi (Dipanggil jika PIN Benar)
  const executeDisbursement = async (pinCode) => {
    setUploading(true);
    const formData = new FormData();
    formData.append("pin", pinCode);
    formData.append("image", proofFile);

 

    try {
      if (actionType === 'DISBURSE') {
            await disbursementService.disburse(selectedTrx.id, formData);
        } else {
            await disbursementService.refund(selectedTrx.id, formData);
        }

      toast.success("Berhasil diproses!");
      setIsModalOpen(false); 
      setIsPinOpen(false); 
      fetchData();
    } catch (error) {
      console.log(error);
      
      toast.error("Gagal memproses");
    } finally {
      setUploading(false);
    }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
        setProofFile(file);
        setPreviewUrl(URL.createObjectURL(file)); // Buat URL lokal untuk preview
    }
};

const handleCloseModal = () => {
    setProofFile(null);
    setPreviewUrl(null);
    setIsModalOpen(false);
};

  return {
         actionType, transactions, previewUrl, isPinOpen,isModalOpen, refunds, selectedTrx, loading, proofFile, uploading, handleFileSelect, handleCloseModal, onUploadSubmit, executeDisbursement,setIsModalOpen, openUploadModal,setPreviewUrl, setIsPinOpen,  copyText, setProofFile
  };
}
