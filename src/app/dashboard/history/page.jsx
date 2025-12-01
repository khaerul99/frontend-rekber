// src/app/dashboard/history/page.jsx
"use client";

import { useEffect, useState } from "react";
import api from "@/lib/axios";
import useUserStore from "@/store/useUserStore";
import Link from "next/link";
import { format } from "date-fns";
import { Search, Filter } from "lucide-react";

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

export default function HistoryPage() {
  const { user } = useUserStore();
  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  // State untuk Filter
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  // 1. Ambil Data dari API
  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const res = await api.get("/transactions/my-transactions");
        setTransactions(res.data);
        setFilteredTransactions(res.data); // Init data filter
      } catch (error) {
        console.error("Gagal ambil data", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  // 2. Logika Filter & Search (Jalan setiap kali user ngetik/ganti status)
  useEffect(() => {
    let result = transactions;

    // Filter by Status
    if (statusFilter !== "ALL") {
      result = result.filter((trx) => trx.status === statusFilter);
    }

    // Filter by Search (Kode TRX atau Nama Lawan)
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

  // Helper Warna Status
  const getStatusColor = (status) => {
    switch (status) {
      case "PENDING_PAYMENT": return "bg-yellow-500 hover:bg-yellow-600";
      case "VERIFYING": return "bg-orange-500 hover:bg-orange-600";
      case "PROCESSED": return "bg-blue-500 hover:bg-blue-600";
      case "SENT": return "bg-purple-500 hover:bg-purple-600";
      case "COMPLETED": return "bg-green-500 hover:bg-green-600";
      case "DISPUTED": return "bg-red-500 hover:bg-red-600";
      case "CANCELLED": return "bg-slate-500 hover:bg-slate-600";
      default: return "bg-slate-500";
    }
  };

  return (
    <div className="space-y-6 mx-auto">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h1 className="text-3xl font-bold">Riwayat Transaksi</h1>
        
        {/* Tombol Pintas */}
        <Link href="/dashboard/create">
          <Button>+ Transaksi Baru</Button>
        </Link>
      </div>

      {/* --- FILTER SECTION --- */}
      
      <Card>
        <CardContent className="p-4 flex flex-col md:flex-row gap-4">
          
          {/* Input Search */}
          <div className="relative flex-1 ">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-500" />
            <Input
              placeholder="Cari Kode TRX atau Nama User..."
              className="pl-9"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {/* Dropdown Status */}
          <div className="w-full md:w-[200px]">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">Semua Status</SelectItem>
                <SelectItem value="PENDING_PAYMENT">Belum Bayar</SelectItem>
                <SelectItem value="PROCESSED">Diproses</SelectItem>
                <SelectItem value="SENT">Dikirim</SelectItem>
                <SelectItem value="COMPLETED">Selesai</SelectItem>
                <SelectItem value="CANCELLED">Dibatalkan</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>
      

      {/* --- TABLE SECTION --- */}
      
      <Card>
        <CardHeader>
          <CardTitle>Daftar Transaksi ({filteredTransactions.length})</CardTitle>
        </CardHeader>
        <CardContent className="w-full max-w-[calc(100vw-2rem)] sm:max-w-full overflow-x-auto">
          {loading ? (
            <div className="text-center py-8 text-slate-500">Memuat data...</div>
          ) : filteredTransactions.length === 0 ? (
            <div className="text-center py-8 flex flex-col items-center gap-2 text-slate-500">
              <Filter className="h-10 w-10 opacity-20" />
              <p>Tidak ada transaksi yang ditemukan.</p>
            </div>
          ) : (
              <Table className="">
                <TableHeader>
                  <TableRow>
                    <TableHead>Kode TRX</TableHead>
                    <TableHead>Peran</TableHead>
                    <TableHead>Lawan Transaksi</TableHead>
                    <TableHead>Nominal</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Tanggal</TableHead>
                    <TableHead className="text-right">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTransactions.map((trx) => {
                     const isBuyer = user?.email === trx.buyer?.email;
                     
                     return (
                      <TableRow key={trx.id}>
                        <TableCell className="font-mono font-medium text-xs sm:text-sm">
                          {trx.trx_code}
                        </TableCell>
                        <TableCell>
                           {isBuyer ? (
                             <Badge variant="outline" className="text-blue-600 border-blue-200 bg-blue-50">Pembeli</Badge>
                           ) : (
                             <Badge variant="outline" className="text-orange-600 border-orange-200 bg-orange-50">Penjual</Badge>
                           )}
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col">
                            <span className="font-medium text-sm">
                              {isBuyer ? trx.seller?.username : trx.buyer?.username}
                            </span>
                            <span className="text-[10px] text-slate-500">
                              {isBuyer ? trx.seller?.email : trx.buyer?.email}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="font-medium text-sm">
                           Rp {parseInt(trx.amount).toLocaleString("id-ID")}
                        </TableCell>
                        <TableCell>
                          <Badge className={`${getStatusColor(trx.status)} text-[10px] sm:text-xs border-0 text-white`}>
                            {trx.status.replace(/_/g, " ")}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-slate-500 text-xs sm:text-sm whitespace-nowrap">
                          {format(new Date(trx.createdAt), "dd MMM yyyy, HH:mm")}
                        </TableCell>
                        <TableCell className="text-right">
                          <Link href={`/dashboard/transaction/${trx.id}`}>
                            <Button size="sm" variant="secondary" className="h-8 text-xs">Lihat Detail</Button>
                          </Link>
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