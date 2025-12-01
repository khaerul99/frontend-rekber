"use client";

import { useEffect, useState } from "react";
import api from "@/lib/axios";
import { toast } from "sonner";
import Link from "next/link";
import { Gavel, MessageCircle, Undo2, CheckCircle2, Truck } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
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

export default function DisputePage() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchDisputes = async () => {
    try {
      const res = await api.get("/transactions/admin/disputes");
      setTransactions(res.data);
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
      await api.post(`/transactions/admin/disputes/${id}/resolve`, { decision });
      toast.success(decision === 'REFUND_BUYER' ? "Transaksi Dibatalkan (Refund)" : "Komplain Ditolak (Lanjut Cair)");
      fetchDisputes();
    } catch (error) {
      toast.error("Gagal memproses");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
         <div className="p-2 bg-red-100 text-red-700 rounded-lg">
            <Gavel size={28} />
         </div>
         <div>
            <h1 className="text-3xl font-bold">Pusat Resolusi</h1>
            <p className="text-slate-500">Daftar transaksi yang dikomplain oleh pembeli.</p>
         </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Antrian Sengketa ({transactions.length})</CardTitle>
          <CardDescription>
            Pelajari chat dan bukti sebelum mengambil keputusan.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-center py-8">Memuat data...</p>
          ) : transactions.length === 0 ? (
            <p className="text-center py-12 text-slate-500">Aman! Tidak ada sengketa aktif.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Kode TRX</TableHead>
                  <TableHead>Pembeli (Pelapor)</TableHead>
                  <TableHead>Penjual (Terlapor)</TableHead>
                  <TableHead>Nominal</TableHead>
                  <TableHead className="text-center">Investigasi</TableHead>
                  <TableHead className="text-right">Keputusan Hakim</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactions.map((trx) => (
                  <TableRow key={trx.id}>
                    <TableCell className="font-mono font-medium">{trx.trx_code}</TableCell>
                    <TableCell>{trx.buyer?.username}</TableCell>
                    <TableCell>{trx.seller?.username}</TableCell>
                    <TableCell>Rp {parseInt(trx.amount).toLocaleString("id-ID")}</TableCell>
                    
                    {/* Tombol Cek Chat */}
                    <TableCell className="text-center">
                        <Link href={`/dashboard/transaction/${trx.id}`} target="_blank">
                            <Button variant="outline" size="sm" className="gap-2">
                                <MessageCircle size={14} /> Cek Chat & Bukti
                            </Button>
                        </Link>
                    </TableCell>

                    {/* Tombol Keputusan */}
                    <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                            
                            {/* Tombol Refund (Menangkan Pembeli) */}
                            <AlertDialog>
                                <AlertDialogTrigger asChild>
                                    <Button size="sm" variant="destructive" className="gap-1">
                                        <Undo2 size={16} /> Refund
                                    </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                        <AlertDialogTitle>Menangkan Pembeli?</AlertDialogTitle>
                                        <AlertDialogDescription>
                                            Status akan menjadi <strong>CANCELLED</strong>. Uang harus dikembalikan manual ke Pembeli.
                                        </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                        <AlertDialogCancel>Batal</AlertDialogCancel>
                                        <AlertDialogAction onClick={() => handleResolve(trx.id, 'REFUND_BUYER')}>
                                            Ya, Refund Pembeli
                                        </AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>

                            <AlertDialog>
                                <AlertDialogTrigger asChild>
                                    <Button size="sm" variant="secondary" className="gap-1 bg-orange-100 text-orange-700 hover:bg-orange-200 border border-orange-200">
                                        <Truck size={16} /> Retur
                                    </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                        <AlertDialogTitle>Izinkan Retur Barang?</AlertDialogTitle>
                                        <AlertDialogDescription>
                                            Pembeli akan diminta mengirimkan barang kembali ke Penjual. Setelah Penjual menerima, baru dana direfund.
                                        </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                        <AlertDialogCancel>Batal</AlertDialogCancel>
                                        <AlertDialogAction onClick={() => handleResolve(trx.id, 'RETURN_GOODS')}>
                                            Ya, Izinkan Retur
                                        </AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>

                            {/* Tombol Release (Menangkan Penjual) */}
                            <AlertDialog>
                                <AlertDialogTrigger asChild>
                                    <Button size="sm" className="bg-green-600 hover:bg-green-700 gap-1">
                                        <CheckCircle2 size={16} /> Release
                                    </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                        <AlertDialogTitle>Tolak Komplain?</AlertDialogTitle>
                                        <AlertDialogDescription>
                                            Komplain dianggap tidak valid. Status menjadi <strong>COMPLETED</strong> dan uang akan masuk antrian pencairan Penjual.
                                        </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                        <AlertDialogCancel>Batal</AlertDialogCancel>
                                        <AlertDialogAction onClick={() => handleResolve(trx.id, 'RELEASE_SELLER')}>
                                            Ya, Cairkan ke Penjual
                                        </AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>

                        </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}