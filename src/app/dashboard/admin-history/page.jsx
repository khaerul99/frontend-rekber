"use client";

import { useEffect, useState } from "react";
import api from "@/lib/axios";
import Link from "next/link";
import { format } from "date-fns";
import { Search, Filter, FileText } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function AdminHistoryPage() {
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
      case "COMPLETED": return "bg-green-500";
      case "CANCELLED": return "bg-slate-500";
      default: return "bg-slate-500";
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Semua Riwayat Transaksi</h1>

      {/* FILTER SECTION */}
      <Card>
        <CardContent className="p-4 flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-500" />
            <Input
              placeholder="Cari Kode TRX / Pembeli / Penjual..."
              className="pl-9"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="w-full md:w-[200px]">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger><SelectValue placeholder="Filter Status" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">Semua Status</SelectItem>
                <SelectItem value="PENDING_PAYMENT">Belum Bayar</SelectItem>
                <SelectItem value="VERIFYING">Verifikasi</SelectItem>
                <SelectItem value="PROCESSED">Diproses</SelectItem>
                <SelectItem value="SENT">Dikirim</SelectItem>
                <SelectItem value="COMPLETED">Selesai</SelectItem>
                <SelectItem value="CANCELLED">Dibatalkan</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* TABLE SECTION */}
      <Card>
        <CardHeader>
          <CardTitle>Data Transaksi ({filteredTransactions.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">Memuat data...</div>
          ) : filteredTransactions.length === 0 ? (
            <div className="text-center py-8 text-slate-500">Tidak ada data.</div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Kode TRX</TableHead>
                    <TableHead>Pembeli</TableHead>
                    <TableHead>Penjual</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Tanggal</TableHead>
                    <TableHead className="text-right">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTransactions.map((trx) => (
                    <TableRow key={trx.id}>
                      <TableCell className="font-mono font-medium text-xs">{trx.trx_code}</TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                            <span className="font-medium text-sm">{trx.buyer?.username}</span>
                            <span className="text-[10px] text-slate-400">{trx.buyer?.email}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                            <span className="font-medium text-sm">{trx.seller?.username}</span>
                            <span className="text-[10px] text-slate-400">{trx.seller?.email}</span>
                        </div>
                      </TableCell>
                      <TableCell className="font-bold text-green-600 text-sm">
                         Rp {parseInt(trx.total_transfer).toLocaleString("id-ID")}
                      </TableCell>
                      <TableCell>
                        <Badge className={`${getStatusColor(trx.status)} text-[10px] border-0 text-white`}>
                          {trx.status.replace(/_/g, " ")}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-xs text-slate-500">
                        {format(new Date(trx.createdAt), "dd/MM/yy HH:mm")}
                      </TableCell>
                      <TableCell className="text-right">
                        <Link href={`/dashboard/transaction/${trx.id}`}>
                          <Button size="sm" variant="outline" className="h-8 text-xs">
                             Detail
                          </Button>
                        </Link>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}