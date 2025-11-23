"use client";

import { useEffect, useState, useRef } from "react";
import { useParams } from "next/navigation";
import api from "@/lib/axios";
import useUserStore from "@/store/useUserStore";
import { io } from "socket.io-client"; // Wajib install: npm install socket.io-client
import { format } from "date-fns";
import { toast } from "sonner";
import { Send, CheckCircle, Clock, AlertTriangle, Eye, Undo2, X, Loader2, ExternalLink } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

// Setup Socket di luar komponen agar tidak reconnect terus
let socket;

export default function TransactionDetailPage() {
  const { id } = useParams(); // Ambil ID dari URL
  const { user } = useUserStore();

  const [transaction, setTransaction] = useState(null);
  const [loading, setLoading] = useState(true);
  const [adminBanks, setAdminBanks] = useState([]);

  // State Chat
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const chatEndRef = useRef(null); // Untuk auto-scroll chat ke bawah
  const [viewImage, setViewImage] = useState(null);

  // State Upload
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  // preview
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  const [isDisputeOpen, setIsDisputeOpen] = useState(false); // Untuk buka/tutup modal
  const [disputeReason, setDisputeReason] = useState("");

  // 1. Fetch Data Transaksi & Setup Socket
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get(`/transactions/${id}`);

        setTransaction(res.data);
        setMessages(res.data.chats || []);

        const bankRes = await api.get("/settings/admin-banks");
        setAdminBanks(bankRes.data);
      } catch (error) {
        toast.error("Gagal memuat transaksi");
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    // Konek Socket.io
    socket = io("http://localhost:5000"); // URL Backend
    socket.emit("join_transaction", id); // Join Room

    // Dengar Pesan Masuk
    socket.on("receive_message", (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    return () => {
      socket.disconnect();
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
    socket.emit("send_message", msgData);

    setNewMessage("");
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
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
      await api.post(`/transactions/${id}/upload-proof`, formData);
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
        await api.patch(`/transactions/${id}/sent`);
        toast.success("Status diubah menjadi DIKIRIM");
      } else if (actionType === "finish") {
        await api.patch(`/transactions/${id}/complete`);
        toast.success("Transaksi Selesai!");
      }
      // Tambahkan logika 'finish' atau 'complain' disini nanti
      window.location.reload();
    } catch (error) {
      toast.error("Gagal memproses aksi");
    }
  };

  const handleDispute = async () => {
    if (!disputeReason.trim()) return toast.error("Alasan wajib diisi!");

    try {
      await api.patch(`/transactions/${id}/dispute`, { reason: disputeReason });
      toast.error("Komplain Diajukan! Admin akan segera memeriksa.");
      setIsDisputeOpen(false);
      window.location.reload();
    } catch (error) {
      toast.error(error.response?.data?.message || "Gagal mengajukan komplain");
    }
  };

  if (loading) return <div className="p-8 text-center">Memuat Detail...</div>;
  if (!transaction)
    return <div className="p-8 text-center">Transaksi tidak ditemukan</div>;

  const isBuyer = user.email === transaction.buyer?.email;
  const isSeller = user.email === transaction.seller?.email;

  console.log("=== DEBUGGING ===");
  console.log("Status Transaksi:", transaction.status);
  console.log("Daftar Bukti (Proofs):", transaction.proofs);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-auto lg:h-[calc(100vh-100px)] ">
      {/* KOLOM KIRI: DETAIL & AKSI (Scrollable) */}
      <div className="lg:col-span-2 space-y-6 overflow-y-auto pr-2">
        {/* Header Status */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-lg">
                Transaksi #{transaction.trx_code}
              </CardTitle>
              <p className="text-sm text-slate-500">
                Dibuat pada{" "}
                {format(new Date(transaction.createdAt), "dd MMM yyyy")}
              </p>
            </div>
            <Badge className="text-md px-3 py-1">
              {transaction.status.replace("_", " ")}
            </Badge>
          </CardHeader>
        </Card>

        {/* Info Barang & Nominal */}
        <Card>
          <CardContent className="pt-6 space-y-4">
            <div className="flex justify-between">
              <span className="text-slate-500">Deskripsi</span>
              <span className="font-medium">
                {transaction.description || "-"}
              </span>
            </div>
            <Separator />
            <div className="flex justify-between">
              <span className="text-slate-500">Nominal Transaksi</span>
              <span className="font-medium">
                Rp {parseInt(transaction.amount).toLocaleString("id-ID")}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-500">Biaya Admin</span>
              <span className="font-medium">
                Rp {parseInt(transaction.admin_fee).toLocaleString("id-ID")}
              </span>
            </div>
            <Separator />
            <div className="flex justify-between text-lg font-bold text-blue-600">
              <span>Total Transfer</span>
              <span>
                Rp{" "}
                {parseInt(transaction.total_transfer).toLocaleString("id-ID")}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* AREA AKSI (Tombol Berubah sesuai Status) */}
        <Card className="border-blue-200 bg-blue-50/50">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <AlertTriangle size={18} className="text-orange-500" /> Tindakan
              Diperlukan
            </CardTitle>
          </CardHeader>
          <CardContent>
            {/* 1. JIKA STATUS PENDING & USER = PEMBELI */}
            {transaction.status === "PENDING_PAYMENT" && isBuyer && (
              <div className="space-y-4">
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-4">
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
                    Transfer ke Salah Satu Rekening Berikut:
                  </p>

                  {/* --- LOOPING DAFTAR BANK --- */}
                  <div className="space-y-4">
                    {adminBanks.length > 0 ? (
                      adminBanks.map((bank) => (
                        <div
                          key={bank.id}
                          className="flex items-start gap-4 border-b last:border-0 pb-4 last:pb-0"
                        >
                          {/* 1. LOGO */}
                          <div className="w-16 h-10 bg-slate-50 rounded border flex items-center justify-center p-1 overflow-hidden shrink-0">
                            {bank.logoUrl ? (
                              <img
                                src={`http://localhost:5000${bank.logoUrl}`}
                                alt={bank.bankName}
                                className="w-full h-full object-contain"
                              />
                            ) : (
                              <span className="text-[10px] font-bold text-slate-400">
                                BANK
                              </span>
                            )}
                          </div>

                          {/* 2. INFO REKENING */}
                          <div className="flex-1 min-w-0">
                            <p className="font-bold text-sm text-slate-700">
                              {bank.bankName}
                            </p>

                            <div className="flex items-center gap-2">
                              <span className="text-lg font-mono font-bold text-slate-900 tracking-wide truncate">
                                {bank.bankNumber}
                              </span>
                              {/* Tombol Copy */}
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6 text-slate-400 hover:text-blue-600 shrink-0"
                                onClick={() => {
                                  navigator.clipboard.writeText(
                                    bank.bankNumber
                                  );
                                  toast.success("Nomor Rekening disalin!");
                                }}
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="14"
                                  height="14"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                >
                                  <rect
                                    width="14"
                                    height="14"
                                    x="8"
                                    y="8"
                                    rx="2"
                                    ry="2"
                                  />
                                  <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
                                </svg>
                              </Button>
                            </div>

                            <p className="text-xs text-slate-500">
                              a.n {bank.bankHolder}
                            </p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-red-500 italic">
                        Admin belum mengatur rekening bank.
                      </p>
                    )}
                  </div>
                  {/* --------------------------- */}
                </div>

                {/* Tombol Upload (Tetap Sama) */}
                <div className="space-y-3 pt-2">
                  <p className="text-xs text-slate-600">
                    Setelah transfer, upload bukti pembayaran di bawah ini.
                  </p>

                  {/* KONDISI 1: BELUM ADA FILE DIPILIH */}
                  {!selectedFile ? (
                    <>
                      <Button
                        className="w-full bg-blue-600 hover:bg-blue-700"
                        onClick={() => fileInputRef.current.click()}
                      >
                        Pilih Bukti Transfer
                      </Button>
                      {/* Input File Tetap Hidden */}
                      <input
                        type="file"
                        hidden
                        ref={fileInputRef}
                        onChange={handleFileSelect} // Panggil fungsi select, bukan upload langsung
                        accept="image/*"
                      />
                    </>
                  ) : (
                    /* KONDISI 2: FILE SUDAH DIPILIH (PREVIEW MODE) */
                    <div className="space-y-3 border-2 border-dashed border-blue-200 rounded-lg p-4 bg-blue-50/50">
                      <p className="text-xs font-bold text-blue-600 text-center mb-2">
                        Preview Bukti:
                      </p>

                      {/* Gambar Preview */}
                      <div className="relative w-full h-48 rounded-md overflow-hidden bg-white border shadow-sm">
                        <img
                          src={previewUrl}
                          alt="Preview"
                          className="w-full h-full object-contain"
                        />
                      </div>

                      {/* Tombol Aksi (Kirim / Batal) */}
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          className="flex-1 text-red-600 hover:text-red-700 hover:bg-red-50"
                          onClick={handleCancelUpload}
                          disabled={uploading}
                        >
                          Batal
                        </Button>
                        <Button
                          className="flex-1 bg-blue-600 hover:bg-blue-700"
                          onClick={handleConfirmUpload}
                          disabled={uploading}
                        >
                          {uploading ? "Mengirim..." : "Kirim Bukti"}
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* 2. JIKA STATUS PENDING & USER = PENJUAL */}
            {transaction.status === "PENDING_PAYMENT" && isSeller && (
              <p className="text-sm text-slate-600">
                Menunggu pembeli melakukan pembayaran...
              </p>
            )}

            {transaction.status === "VERIFYING" && isSeller && (
              <p className="text-sm text-slate-600">
                Menunggu verifikasi admin
              </p>
            )}

            {transaction.status === "VERIFYING"  && (
              <p className="text-sm text-slate-600">
                Menunggu verifikasi admin
              </p>
            )}

            {/* 3. JIKA STATUS PROCESSED (Sudah Valid) & USER = PENJUAL */}
            {transaction.status === "PROCESSED" && isSeller && (
              <div className="space-y-3">
                <p className="text-sm font-medium text-green-600">
                  Dana sudah diamankan Rekber.
                </p>
                <p className="text-sm">
                  Silakan kirim barang/akun ke pembeli, lalu konfirmasi.
                </p>
                <Button
                  onClick={() => handleAction("sent")}
                  className="bg-green-600 hover:bg-green-700"
                >
                  Konfirmasi Barang Dikirim
                </Button>
              </div>
            )}

            {/* 4. JIKA STATUS DIKIRIM */}
            {transaction.status === "SENT" && (
              <div className="space-y-4">
                {/* TAMPILAN KHUSUS PEMBELI */}
                {isBuyer ? (
                  <>
                    <div className="bg-green-50 p-3 rounded-md border border-green-200 text-sm text-green-800">
                      <p className="font-semibold">
                        Barang sedang dikirim / sudah sampai.
                      </p>
                      <p className="text-xs mt-1">
                        Cek barang dengan teliti. Jika sesuai, klik tombol di
                        bawah.
                      </p>
                    </div>

                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button className="w-full bg-green-600 hover:bg-green-700">
                          <CheckCircle className="mr-2 h-4 w-4" /> Pesanan
                          Diterima (Selesai)
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>
                            Barang Sudah Diterima?
                          </AlertDialogTitle>
                          <AlertDialogDescription>
                            Tindakan ini <strong>tidak dapat dibatalkan</strong>
                            . Dana akan diteruskan ke Penjual dan transaksi
                            dianggap selesai.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Batal</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleAction("finish")}
                            className="bg-green-600 hover:bg-green-700"
                          >
                            Ya, Selesaikan Transaksi
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>

                    <Dialog
                      open={isDisputeOpen}
                      onOpenChange={setIsDisputeOpen}
                    >
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full text-red-600 border-red-200 hover:bg-red-50"
                        >
                          Ajukan Komplain
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle className="text-red-600">
                            Ajukan Komplain
                          </DialogTitle>
                          <DialogDescription>
                            Jelaskan masalah yang Anda alami. Admin akan masuk
                            ke chat untuk menengahi (Mediasi). Uang akan ditahan
                            sementara.
                          </DialogDescription>
                        </DialogHeader>

                        <div className="py-4">
                          <Label className="mb-2 block">Alasan Komplain</Label>
                          <Textarea
                            placeholder="Contoh: Barang rusak, akun tidak bisa login, tidak sesuai deskripsi..."
                            value={disputeReason}
                            onChange={(e) => setDisputeReason(e.target.value)}
                          />
                        </div>

                        <DialogFooter>
                          <Button
                            variant="ghost"
                            onClick={() => setIsDisputeOpen(false)}
                          >
                            Batal
                          </Button>
                          <Button
                            variant="destructive"
                            onClick={handleDispute}
                            disabled={!disputeReason}
                          >
                            Kirim Komplain
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </>
                ) : (
                  /* TAMPILAN UNTUK PENJUAL */
                  <div className="space-y-2">
                    <p className="text-sm font-medium">
                      Menunggu konfirmasi pembeli.
                    </p>
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <Clock size={14} /> Otomatis selesai dalam 2x24 jam jika
                      tidak ada komplain.
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* 5. JIKA STATUS COMPLETED (Barang Diterima, Menunggu Admin Cairkan) */}
            {transaction.status === "COMPLETED" && (
              <div className="bg-green-50 p-4 rounded-lg border border-green-200 text-center space-y-2">
                <div className="flex justify-center text-green-600">
                  <Clock size={32} />
                </div>
                <h3 className="font-bold text-green-700">
                  Menunggu Pencairan Dana
                </h3>
                <p className="text-sm text-green-600">
                  Transaksi selesai. Admin sedang memproses transfer dana ke
                  rekening Penjual.
                </p>
              </div>
            )}

            {/* 6. JIKA STATUS DISBURSED (SUDAH CAIR) */}
            {transaction.status === "DISBURSED" && (
              <div className="bg-green-50 p-4 rounded-lg border border-green-200 text-center space-y-3">
                <div className="flex justify-center text-green-600">
                  <CheckCircle size={32} />
                </div>
                <div>
                  <h3 className="font-bold text-green-700 text-lg">
                    Dana Telah Dicairkan
                  </h3>
                  <p className="text-sm text-green-600">
                    Admin telah mentransfer dana ke rekening Penjual. Transaksi
                    Selesai.
                  </p>
                </div>

                {/* Tombol Lihat Bukti Admin */}
                {transaction.proofs?.find(
                  (p) => p.type === "admin_transfer_proof"
                ) && (
                  <div className="pt-2">
                    <a
                      href={`http://localhost:5000${
                        transaction.proofs.find(
                          (p) => p.type === "admin_transfer_proof"
                        ).imageUrl
                      }`}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <Button
                        variant="outline"
                        className="bg-white border-green-300 text-green-700 hover:bg-green-50"
                      >
                        <Eye className="mr-2 h-4 w-4" /> Lihat Bukti Transfer
                        Admin
                      </Button>
                    </a>
                  </div>
                )}
              </div>
            )}

            {transaction.status === 'REFUNDED' && (
                 <div className="bg-slate-100 p-4 rounded-lg border border-slate-300 text-center space-y-3">
                    <div className="flex justify-center text-slate-600">
                        <Undo2 size={32} />
                    </div>
                    <div>
                        <h3 className="font-bold text-slate-800 text-lg">Dana Telah Dikembalikan</h3>
                        <p className="text-sm text-slate-600">
                           Admin telah mentransfer balik dana ke rekening Pembeli. Transaksi Dibatalkan.
                        </p>
                    </div>
                    
                    {/* Tombol Lihat Bukti Refund */}
                    {transaction.proofs?.find(p => p.type === 'admin_refund_proof') && (
                        <div className="pt-2">
                            <Button 
                                variant="outline" 
                                className="bg-white border-slate-300 text-slate-700 hover:bg-slate-200"
                                onClick={() => setViewImage(transaction.proofs.find(p => p.type === 'admin_refund_proof').imageUrl)}
                            >
                                <Eye className="mr-2 h-4 w-4" /> Lihat Bukti Refund
                            </Button>
                        </div>
                    )}
                 </div>
              )}

            {/* DEFAULT */}
            {["CANCELLED"].includes(transaction.status) && (
              <p className="text-sm font-medium text-slate-500">
                Transaksi ini di cancel
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* KOLOM KANAN: CHAT ROOM (Fixed Height) */}
      <Card className="flex flex-col h-full max-h-[600px]">
        <CardHeader className="border-b py-3">
          <CardTitle className="text-base">Diskusi Transaksi</CardTitle>
        </CardHeader>

        {/* Area Pesan (Scrollable) */}
        <ScrollArea className="flex-1 p-4 overflow-hidden">
          <div className="space-y-4">
            {messages.length === 0 && (
              <p className="text-center text-xs text-slate-400 mt-10">
                Belum ada pesan. Mulailah diskusi.
              </p>
            )}

            {messages.map((msg, i) => {
              const isMe = msg.senderId === user.id;

              const isAdmin =
                msg.sender?.role === "ADMIN" || msg.senderName === "Admin";

              return (
                <div
                  key={i}
                  className={`flex flex-col mb-4 ${
                    isMe ? "items-end" : "items-start"
                  }`}
                >
                  {/* --- NAMA PENGIRIM (BARU) --- */}
                  {!isMe && (
                    <span className="text-[10px] text-slate-500 mb-1 ml-1 font-semibold">
                      {msg.sender?.username ||
                        msg.sender?.role ||
                        msg.senderName ||
                        "User"}
                    </span>
                  )}

                  {/* BUBBLE CHAT */}
                  <div
                    className={`
          max-w-[80%] rounded-lg px-4 py-2 text-sm shadow-sm break-words whitespace-pre-wrap 
          ${
            isMe
              ? "bg-blue-600 text-white rounded-br-none"
              : isAdmin
              ? "bg-yellow-100 text-yellow-800 border border-yellow-200"
              : "bg-slate-100 text-slate-800 rounded-bl-none border border-slate-200"
          }
       `}
                  >
                    <p>{msg.message}</p>
                    <span
                      className={`text-[10px] block text-right mt-1 opacity-70`}
                    >
                      {format(new Date(msg.createdAt || new Date()), "HH:mm")}
                    </span>
                  </div>
                </div>
              );
            })}
            <div ref={chatEndRef} />
          </div>
        </ScrollArea>

        {/* Input Pesan */}
        <div className="p-3 border-t">
          <form onSubmit={handleSendMessage} className="flex gap-2">
            <Input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Tulis pesan..."
              className="flex-1"
            />
            <Button type="submit" size="icon">
              <Send size={18} />
            </Button>
          </form>
        </div>
      </Card>

      <Dialog open={!!viewImage} onOpenChange={() => setViewImage(null)}>
        {/* STYLE KHUSUS DARK MODE DI SINI (bg-black/95, text-white) */}
        <DialogContent className="max-w-5xl h-[85vh] p-0 overflow-hidden flex flex-col bg-white/95 border-none text-white">
            
            {/* Judul untuk screen reader (wajib ada tapi tersembunyi) */}
            <DialogHeader className="sr-only">
               <DialogTitle>Preview Bukti Transaksi</DialogTitle>
            </DialogHeader>

            {/* Tombol Close Custom di pojok kanan atas */}
            <button 
                onClick={() => setViewImage(null)}
                className="absolute top-4 right-4 z-50 p-2 bg-white/50 hover:bg-black/80 rounded-full text-white/80 hover:text-white transition-colors"
            >
               {/* <X size={24} /> */}
            </button>

            {/* Area Gambar */}
            <div className="flex-1 w-full h-full relative flex items-center justify-center p-4 bg-white/95 overflow-hidden">
                {viewImage ? (
                    <img src={`http://localhost:5000${viewImage}`} alt="Bukti Full" className="w-auto h-auto max-w-full max-h-full object-contain rounded-lg shadow-2xl"
                    />
                ) : (
                    // Loading State
                    <div className="flex flex-col items-center text-white/50">
                        <Loader2 className="h-10 w-10 animate-spin mb-2" />
                        <p>Memuat gambar...</p>
                    </div>
                 )}
            </div>

            {/* Footer Gelap */}
            <div className="bg-white/80 p-4 flex justify-end gap-2 backdrop-blur-md border-t border-white/10">
                <Button variant="ghost" size="sm" onClick={() => setViewImage(null)} className="text-black hover:bg-white/20 hover:text-white">
                    Tutup
                </Button>
                {viewImage && (
                    <a href={`http://localhost:5000${viewImage}`} target="_blank" rel="noreferrer">
                        <Button size="sm" className=" hover:bg-gray-700 border-none">
                            Buka Original <ExternalLink size={14} className="ml-2"/>
                        </Button>
                    </a>
                )}
            </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
