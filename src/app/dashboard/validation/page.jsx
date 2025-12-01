"use client";

import { useEffect, useState } from "react";
import api from "@/lib/axios";
import { format } from "date-fns";
import { toast } from "sonner";
import { CheckCircle, XCircle, Eye, ExternalLink } from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import { Badge } from "@/components/ui/badge";

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

export default function ValidationPage() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  // State untuk Modal Lihat Bukti
  const [selectedProof, setSelectedProof] = useState(null);

  // 1. Fetch Data
  const fetchVerifying = async () => {
    try {
      const res = await api.get("/transactions/admin/verifying");
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

  // 2. Handle Terima (Valid)
  const handleAccept = async (id) => {
    try {
      await api.patch(`/transactions/${id}/verify`);
      toast.success("Pembayaran Diterima! Status: PROCESSED");
      fetchVerifying(); // Refresh tabel
    } catch (error) {
      toast.error("Gagal memproses");
    }
  };

  // 3. Handle Tolak (Invalid)
  const handleReject = async (id) => {
    try {
      await api.patch(`/transactions/${id}/reject`);
      toast.warning("Pembayaran Ditolak. Status dikembalikan ke PENDING.");
      fetchVerifying(); // Refresh tabel
    } catch (error) {
      toast.error("Gagal menolak");
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Validasi Pembayaran</h1>

      <Card>
        <CardHeader>
          <CardTitle>Antrian Verifikasi ({transactions.length})</CardTitle>
          <CardDescription>
            Cek mutasi bank Anda sebelum menekan tombol Valid.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-center py-4">Memuat data...</p>
          ) : transactions.length === 0 ? (
            <div className="text-center py-10 text-slate-500 border-2 border-dashed rounded-lg">
              <CheckCircle className="mx-auto h-10 w-10 mb-2 opacity-20" />
              <p>Tidak ada pembayaran yang perlu dicek saat ini.</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tanggal</TableHead>
                  <TableHead>Kode TRX</TableHead>
                  <TableHead>Pembeli</TableHead>
                  <TableHead>Nominal</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-center">Bukti</TableHead>
                  <TableHead className="text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactions.map((trx) => {
                  // Cari bukti pembayaran (tipe payment_proof)
                  const proofImg = trx.proofs.find(
                    (p) => p.type === "payment_proof"
                  )?.imageUrl;

                  return (
                    <TableRow key={trx.id}>
                      <TableCell className="text-xs text-slate-500">
                        {format(new Date(trx.updatedAt), "dd/MM HH:mm")}
                      </TableCell>
                      <TableCell className="font-medium">
                        {trx.trx_code}
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span>{trx.buyer?.username}</span>
                          <span className="text-xs text-slate-400">
                            {trx.buyer?.email}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="font-bold text-blue-600">
                        Rp{" "}
                        {parseInt(trx.total_transfer).toLocaleString("id-ID")}
                      </TableCell>

                      <TableCell>
                        <Badge
                          className={`${getStatusColor(
                            trx.status
                          )} text-white border-0`}
                        >
                          {trx.status.replace(/_/g, " ")}
                        </Badge>
                      </TableCell>

                      {/* Kolom Bukti */}
                      <TableCell className="text-center">
                        {proofImg ? (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() =>
                              setSelectedProof(
                                `http://localhost:5000${proofImg}`
                              )
                            }
                          >
                            <Eye size={14} className="mr-1" /> Lihat
                          </Button>
                        ) : (
                          <Badge variant="outline" className="text-red-500">
                            No File
                          </Badge>
                        )}
                      </TableCell>

                      {/* Kolom Aksi */}
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          {/* Tombol TOLAK (Reject) */}
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button size="sm" variant="destructive">
                                <XCircle size={16} />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>
                                  Tolak Pembayaran?
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                  Status transaksi akan dikembalikan ke{" "}
                                  <strong>PENDING</strong>. Pembeli harus
                                  mengupload ulang bukti transfer yang benar.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Batal</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleReject(trx.id)}
                                  className="bg-red-600 hover:bg-red-700"
                                >
                                  Ya, Tolak
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>

                          {/* Tombol TERIMA (Valid) */}
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                size="sm"
                                className="bg-green-600 hover:bg-green-700"
                              >
                                <CheckCircle size={16} className="mr-1" /> Valid
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>
                                  Konfirmasi Pembayaran
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                  Pastikan Anda sudah mengecek mutasi bank dan
                                  dana benar-benar masuk sejumlah{" "}
                                  <strong>
                                    Rp{" "}
                                    {parseInt(
                                      trx.total_transfer
                                    ).toLocaleString("id-ID")}
                                  </strong>
                                  .
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Batal</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleAccept(trx.id)}
                                  className="bg-green-600 hover:bg-green-700"
                                >
                                  Ya, Pembayaran Valid
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* --- MODAL LIHAT GAMBAR --- */}
      <Dialog
        open={!!selectedProof}
        onOpenChange={() => setSelectedProof(null)}
      >
        <DialogContent className="max-w-3xl h-[80vh] flex flex-col">
          <DialogHeader>
            <DialogTitle>Bukti Pembayaran</DialogTitle>
          </DialogHeader>
          <div className="flex-1 relative bg-slate-100 rounded-md flex items-center justify-center overflow-hidden">
            {selectedProof && (
              <img
                src={selectedProof}
                alt="Bukti Transfer"
                className="w-full h-full object-contain"
              />
            )}
          </div>
          <div className="flex justify-end">
            <a href={selectedProof} target="_blank" rel="noreferrer">
              <Button variant="secondary" size="sm">
                <ExternalLink size={14} className="mr-2" /> Buka Original
              </Button>
            </a>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
