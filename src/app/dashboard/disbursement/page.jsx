"use client";

import { useEffect, useState } from "react";
import api from "@/lib/axios";
import { toast } from "sonner";
import { format } from "date-fns";
import { Banknote, CheckCheck, AlertCircle, Copy } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

export default function DisbursementPage() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchDisbursement = async () => {
    try {
      const res = await api.get("/transactions/admin/disbursement");
      setTransactions(res.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDisbursement();
  }, []);

  const handleDisburse = async (id) => {
    if (!confirm("Pastikan Anda SUDAH mentransfer uang ke penjual. Lanjutkan?")) return;
    
    try {
      await api.patch(`/transactions/${id}/disburse`);
      toast.success("Status diubah menjadi CAIR (Disbursed)");
      fetchDisbursement(); // Refresh list
    } catch (error) {
      toast.error("Gagal update status");
    }
  };

  const copyText = (text) => {
    navigator.clipboard.writeText(text);
    toast.success("Disalin: " + text);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
         <div className="p-2 bg-green-100 text-green-700 rounded-lg">
            <Banknote size={28} />
         </div>
         <div>
            <h1 className="text-3xl font-bold">Pencairan Dana</h1>
            <p className="text-slate-500">Daftar penjual yang menunggu pembayaran.</p>
         </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Antrian Transfer ({transactions.length})</CardTitle>
          <CardDescription>
            Transfer sesuai nominal bersih (Total - Fee), lalu klik tombol `Sudah Transfer`.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-center py-8">Memuat data...</p>
          ) : transactions.length === 0 ? (
            <div className="text-center py-12 text-slate-500 border-2 border-dashed rounded-lg">
                <CheckCheck className="mx-auto h-12 w-12 mb-2 text-green-500 opacity-50" />
                <p>Semua aman! Tidak ada tagihan yang harus dibayar.</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Kode TRX</TableHead>
                  <TableHead>Info Penjual (Tujuan)</TableHead>
                  <TableHead>Rekening Tujuan</TableHead>
                  <TableHead>Nominal Transfer</TableHead>
                  <TableHead className="text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactions.map((trx) => {
                  // Hitung yang harus ditransfer (Total dari pembeli - Fee Admin)
                  const amountToTransfer = parseFloat(trx.amount); 
                  return (
                    <TableRow key={trx.id}>
                      <TableCell className="font-mono font-medium">{trx.trx_code}</TableCell>
                      
                      <TableCell>
                        <div className="flex flex-col">
                            <span className="font-bold">{trx.seller?.username}</span>
                            <span className="text-xs text-slate-500">{trx.seller?.email}</span>
                        </div>
                      </TableCell>

                      <TableCell>
                        {trx.seller?.bank_account ? (
                            <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                    <Badge variant="outline">{trx.seller.bank_name}</Badge>
                                    <span className="font-mono font-bold">{trx.seller.bank_account}</span>
                                    <Copy 
                                        size={14} className="cursor-pointer text-slate-400 hover:text-blue-500" 
                                        onClick={() => copyText(trx.seller.bank_account)}
                                    />
                                </div>
                                <p className="text-xs text-slate-500">a.n {trx.seller.bank_holder}</p>
                            </div>
                        ) : (
                            <Badge variant="destructive">Belum set rekening</Badge>
                        )}
                      </TableCell>

                      <TableCell>
                        <div className="flex flex-col">
                            <span className="font-bold text-lg text-green-600">
                                Rp {amountToTransfer.toLocaleString("id-ID")}
                            </span>
                            <span className="text-[10px] text-slate-400">
                                (Harga Barang Asli)
                            </span>
                        </div>
                      </TableCell>

                      <TableCell className="text-right">
                        <Button 
                            size="sm" 
                            className="bg-green-600 hover:bg-green-700 gap-2"
                            onClick={() => handleDisburse(trx.id)}
                            disabled={!trx.seller?.bank_account} // Gabisa klik kalau penjual blm isi rekening
                        >
                            <CheckCheck size={16} /> Sudah Transfer
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}