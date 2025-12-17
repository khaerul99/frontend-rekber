"use client";

import { useEffect, useState, useRef } from "react";
import { useParams } from "next/navigation";
import api from "@/lib/axios";
import useUserStore from "@/store/useUserStore";
import { io } from "socket.io-client"; // Wajib install: npm install socket.io-client
import { format } from "date-fns";
import { toast } from "sonner";
import { transactionService } from "@/services/transaction/transactionServices";
import { adminService } from "@/services/admin/adminServices";


export function useTransaction() {
  const { id } = useParams(); // Ambil ID dari URL
  const { user } = useUserStore();
  const socketRef = useRef();

  const [selectedProof, setSelectedProof] = useState(null);
  const [transaction, setTransaction] = useState(null);
  const [loading, setLoading] = useState(true);
  const [adminBanks, setAdminBanks] = useState([]);

  const [isSendModalOpen, setIsSendModalOpen] = useState(false);
  const [trackingNumber, setTrackingNumber] = useState("");

  // State Chat
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const chatEndRef = useRef(null); // Untuk auto-scroll chat ke bawah
  const [viewImage, setViewImage] = useState(null);

  // State Upload
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);
  const returnFileRef = useRef(null);

  // preview
  const [returnFile, setReturnFile] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  const [isDisputeOpen, setIsDisputeOpen] = useState(false);
  const [disputeReason, setDisputeReason] = useState("");

  // State Review
  const [isReviewOpen, setIsReviewOpen] = useState(false);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

  // 1. Fetch Data Transaksi & Setup Socket
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await transactionService.getTransactionById(id);

        setTransaction(data);
        setMessages(data.chats || []);

        const adminBanks = await adminService.getAllBanks();
        setAdminBanks(adminBanks);
      } catch (error) {
        toast.error("Gagal memuat transaksi");
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    // Konek Socket.io
    const socketUrl = (
      process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"
    ).replace("/api", "");

    socketRef.current = io(socketUrl, {
      transports: ["websocket", "polling"],
      withCredentials: true,
    });

    socketRef.current.emit("join_transaction", id);

    socketRef.current.on("receive_message", (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    return () => {
      socketRef.current.disconnect();
    };
  }, [id]);

  // Auto Scroll Chat ke Bawah
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // --- FUNGSI CHAT ---
  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const msgData = {
      transactionId: id,
      senderId: user.id,
      message: newMessage,
      senderName: user.username,
    };

    // 1. Kirim ke Backend via Socket
    socketRef.current.emit("send_message", msgData);

    setNewMessage("");
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setReturnFile(file);
      // Buat URL sementara agar gambar bisa muncul
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  // B. FUNGSI BATAL UPLOAD
  const handleCancelUpload = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = ""; // Reset input file
  };

  // --- FUNGSI UPLOAD BUKTI ---
  const handleConfirmUpload = async () => {
    if (!selectedFile) return;

    const formData = new FormData();
    formData.append("image", selectedFile);

    // Tentukan tipe bukti
    const type =
      user.id === transaction.buyerId ? "payment_proof" : "shipping_proof";
    formData.append("type", type);

    setUploading(true);

    try {
      await transactionService.uploadPaymentProof(id, formData);
      toast.success("Bukti berhasil dikirim!");
      window.location.reload();
    } catch (error) {
      toast.error("Gagal upload bukti");
      setUploading(false);
    }
  };

  // --- FUNGSI KONFIRMASI AKSI ---
  const handleAction = async (actionType) => {
    try {
      if (actionType === "sent") {
        await transactionService.updateResi(id, trackingNumber);
        // await api.patch(`/transactions/${id}/sent`, {
        //   trackingNumber: trackingNumber,
        // });
        toast.success("Status diubah menjadi DIKIRIM");

      } else if (actionType === "finish") {
        await transactionService.completeOrder(id);
        toast.success("Transaksi Selesai!");
      }
      // Tambahkan logika 'finish' atau 'complain' disini nanti
      window.location.reload();
    } catch (error) {
      toast.error("Gagal memproses aksi");
    }
  };

  const handleReturnUpload = async (e) => {
    const desc = document.getElementById("returnDesc").value;

    if (!desc) return toast.error("Harap isi Nomor Resi / Keterangan dulu!");
    if (!returnFile) return toast.error("Harap pilih foto bukti resi!");

    const formData = new FormData();
    formData.append("image", returnFile);
    formData.append("description", desc);

    try {
      await transactionService.uploadReturnProof(id, formData);
      toast.success("Bukti Retur Terkirim!");
      window.location.reload();
    } catch (error) {
      toast.error("Gagal kirim");
    }
  };

  const handleCancelPreview = () => {
    setReturnFile(null);
    setPreviewUrl(null);
    if (returnFileRef.current) returnFileRef.current.value = ""; 
  };

  const handleDispute = async () => {
    if (!disputeReason.trim()) return toast.error("Alasan wajib diisi!");

    try {
      await transactionService.submitDispute(id, disputeReason);
      toast.error("Komplain Diajukan! Admin akan segera memeriksa.");
      setIsDisputeOpen(false);
      window.location.reload();
    } catch (error) {
      toast.error(error.response?.data?.message || "Gagal mengajukan komplain");
    }
  };

  const handleSubmitReview = async () => {
    try {
      await transactionService.createReview({
        transactionId: id,
        rating,
        comment,
      });
      toast.success("Terima kasih atas ulasan Anda!");
      setIsReviewOpen(false);
      setReviewSubmitted(true); // Hilangkan tombol setelah submit
    } catch (error) {
      toast.error("Gagal mengirim ulasan");
    }
  };

  if (loading) return <div className="p-8 text-center">Memuat Detail...</div>;
  if (!transaction)
    return <div className="p-8 text-center">Transaksi tidak ditemukan</div>;

  const isBuyer = user.email === transaction.buyer?.email;
  const isSeller = user.email === transaction.seller?.email;

  return {
    user,
    loading,
    transaction,
    isBuyer,
    isSeller,
    adminBanks,
    selectedProof,
    isSendModalOpen,
    trackingNumber,
    messages,
    newMessage,
    chatEndRef,
    viewImage,
    fileInputRef,
    previewUrl,
    selectedFile,
    uploading,
    returnFileRef,
    returnFile,
    isDisputeOpen,
    disputeReason,
    isReviewOpen,
    rating,
    comment,
    reviewSubmitted,
    setSelectedProof,
    setIsSendModalOpen,
    setTrackingNumber,
    setNewMessage,
    setViewImage,
    handleSendMessage,
    handleFileSelect,
    handleCancelUpload,
    handleConfirmUpload,
    handleAction,
    handleReturnUpload,
    handleCancelPreview,
    setIsDisputeOpen,
    setDisputeReason,
    handleDispute,
    setIsReviewOpen,
    setRating,
    setComment,
    handleSubmitReview,
  };
}
