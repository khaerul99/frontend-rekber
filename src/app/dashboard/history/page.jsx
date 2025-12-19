// src/app/dashboard/history/page.jsx
"use client";

import Link from "next/link";
import { format } from "date-fns";
import { Search, Filter, Loader2 } from "lucide-react";
import DataTable from "react-data-table-component";

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

import { useHistory } from "@/hooks/dashboard/history/useHistory";

export default function HistoryPage() {
  const { loading,
    filteredTransactions,
    search,
    setSearch,
    statusFilter,
    setStatusFilter,
    getStatusColor,
    user } = useHistory();

    const columns = [
    {
      name: 'Kode TRX',
      selector: row => row.trx_code,
      sortable: true, // Fitur sort otomatis aktif
      width: '180px',
    },
    {
      name: 'Peran',
      selector: row => row.buyerId,
      cell: (row) => (
        <Badge variant="outline">
           {row.buyerId === user?.id ? "Pembeli" : "Penjual"}
        </Badge>
      ),
      width: '120px',
      sortable: true,
    },
    {
      name: 'Lawan Transaksi',
      selector: row => row.buyerId === user?.id ? row.seller?.username : row.buyer?.username,
      cell: (row) => (
         <div className="flex flex-col py-2">
            <span className="font-bold text-sm">
                {row.buyerId === user?.id ? row.seller?.username : row.buyer?.username}
            </span>
            <span className="text-xs text-gray-400">
                {row.buyerId === user?.id ? row.seller?.email : row.buyer?.email}
            </span>
         </div>
      )
    },
    {
      name: 'Nominal',
      selector: row => row.amount,
      sortable: true,
      cell: (row) => new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR" }).format(row.amount)
    },
    {
      name: 'Status',
      selector: row => row.status,
      sortable: true,
      cell: (row) => (
        <Badge className={`${getStatusColor(row.status)} border-0`}>
          {row.status.replace("_", " ")}
        </Badge>
      )
    },
    {
      name: 'Aksi',
      cell: (row) => (
        <Button asChild size="sm" variant="outline" className="h-8">
            <Link href={`/dashboard/transaction/${row.id}`}>Detail</Link>
        </Button>
      ),
      style: { display: 'flex', justifyContent: 'center' },
      ignoreRowClick: true, 
    },
  ];


  const customStyles = {
    headCells: {
      style: {
        fontSize: '14px',
        fontWeight: 'bold',
        backgroundColor: '#f8fafc', 
      },
    },
    rows: {
        style: {
            minHeight: '60px', 
        },
    },
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
          <CardTitle>Daftar Transaksi ({(filteredTransactions || []).length})</CardTitle>
        </CardHeader>
        <CardContent className="w-full max-w-[calc(100vw-2rem)] sm:max-w-full overflow-x-auto">
          {loading ? (
            <div className="text-center py-8 text-slate-500">Memuat data...</div>
          ) : (filteredTransactions || []).length === 0 ? (
            <div className="text-center py-8 flex flex-col items-center gap-2 text-slate-500">
              <Filter className="h-10 w-10 opacity-20" />
              <p>Tidak ada transaksi yang ditemukan.</p>
            </div>
          ) : (
             <DataTable
                columns={columns}
                data={filteredTransactions} // Data sudah difilter search/status
                
                pagination // 👈 Fitur Pagination Aktif Otomatis!
                paginationPerPage={10}
                paginationRowsPerPageOptions={[10, 20, 50]}
                
                progressPending={loading}
                progressComponent={<div className="p-10"><Loader2 className="animate-spin" /></div>}
                
                customStyles={customStyles}
                highlightOnHover
                pointerOnHover
                noDataComponent={<div className="p-10 text-slate-500">Tidak ada transaksi ditemukan</div>}
            />
          )}

        </CardContent>
      </Card>
      
    </div>
  );
}