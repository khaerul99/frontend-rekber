"use client";


import Link from "next/link";
import { format } from "date-fns";
import { Search, Loader2 } from "lucide-react";

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

import { useHistoryAdmin } from "@/hooks/dashboard/admin-history/useHistoryAdmin";
import AdminGuard from "@/components/adminGuard/AdminGuard";
import DataTable from "react-data-table-component";

export default function AdminHistoryPage() {
  const {filteredTransactions, loading, search, statusFilter,  setSearch, setStatusFilter, getStatusColor} = useHistoryAdmin();

  const columns = [
    {
      name: 'Kode TRX',
      selector: row => row.trx_code,
      sortable: true, // Fitur sort otomatis aktif
      width: '180px',
    },
    {
      name: 'Pembeli',
      selector: row => row.buyer,
      cell: (row) => (
        <div className="flex flex-col gap-2">
        <Badge variant="outline" className="bg-green-50">
           {row.buyer.username}
        </Badge>
        <p>
           {row.buyer.email}
        </p>
        </div>
      ),
      width: '200px',
      sortable: true,
    },

    {
      name: 'Penjual',
      selector: row => row.seller,
      cell: (row) => (
        <div className="flex flex-col gap-2">
        <Badge variant="outline" className="bg-blue-50">
           {row.seller.username}
        </Badge>
        <p>
           {row.seller.email}
        </p>
        </div>
      ),
      width: '200px',
      sortable: true,
    },
 
    {
      name: 'Nominal',
      selector: row => row.amount,
      sortable: true,
      cell: (row) => new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR" }).format(row.amount),
      width: '150px',
    },
    {
      name: 'admin Fee',
      selector: row => row.admin_fee,
      sortable: true,
      cell: (row) => new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR" }).format(row.admin_fee),
      width: '150px',

    },
    {
      name: 'Tanggal',
      selector: row => row.createdAt,
      sortable: true,
      cell: (row) => format(new Date(row.createdAt), "dd MMM yyyy HH:mm"),
      width: '150px',

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
      width: '100px',
      style: { display: 'flex', justifyContent: 'center' },
      ignoreRowClick: true, 
    },
  ];


  const customStyles = {
    headCells: {
      style: {
        fontSize: '14px',
        fontWeight: 'bold',
        backgroundColor: '#f8fafc', // slate-50
      },
    },
    rows: {
        style: {
            minHeight: '60px', // override the row height
        },
    },
  };

  return (
    <AdminGuard>
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
                <SelectItem value="COMPLETED">Selesai (Belum Cair)</SelectItem> {/* Perjelas Labelnya */}
                <SelectItem value="DISBURSED">Sudah Cair (TF Admin)</SelectItem>
                <SelectItem value="DISPUTED">Sengketa</SelectItem>
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
        <CardContent className="w-full max-w-[calc(100vw-2rem)] sm:max-w-full overflow-x-auto">
          {loading ? (
            <div className="text-center py-8">Memuat data...</div>
          ) : filteredTransactions.length === 0 ? (
            <div className="text-center py-8 text-slate-500">Tidak ada data.</div>
          ) : (
            <div className="overflow-x-auto">
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
            </div>
          )}
        </CardContent>
      </Card>
    </div>
    </AdminGuard>
  );
}