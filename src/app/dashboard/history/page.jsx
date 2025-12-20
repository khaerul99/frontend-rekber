// src/app/dashboard/history/page.jsx
"use client";

import Link from "next/link";
import { format } from "date-fns";
import { Search, Filter, Loader2, Eye } from "lucide-react";
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";

import { useHistory } from "@/hooks/dashboard/history/useHistory";

export default function HistoryPage() {
  const { 
    user,
    loading,
    filteredTransactions, 
    selectedTrx,
    detailLoading,
    formatRupiah,
    openDetailModal,
    search, setSearch,
    statusFilter, setStatusFilter,
    isModalOpen,setIsModalOpen,
    closeModal,
    getStatusColor,r } = useHistory();

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
      ),
      width: "250px"
    },
    {
      name: 'Nominal',
      selector: row => row.amount,
      sortable: true,
      cell: (row) => new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR" }).format(row.amount),
      width:'200px',
    },
    {
      name: 'Status',
      selector: row => row.status,
      sortable: true,
      cell: (row) => (
        <Badge className={`${getStatusColor(row.status)} border-0`}>
          {row.status.replace("_", " ")}
        </Badge>
      ),
      width: "200px"
    },
    {
      name: 'Aksi',
      cell: (row) => (
           <div className="flex gap-2">
        <Button 
          onClick={() => openDetailModal(row)} 
          size="sm" 
          variant="outline" 
          className="h-8 gap-2"
        >
            <Eye className="w-3 h-3" /> Detail
        </Button>
        <Button asChild size="sm" variant="outline" className="h-8">
            <Link href={`/dashboard/transaction/${row.id}`}> 
            <Eye className="w-3 h-3" />
            Transaction</Link>
        </Button>
        </div>
      ),
      width:'200px',
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
                data={filteredTransactions} 
                pagination 
                paginationPerPage={10}
                paginationRowsPerPageOptions={[10, 20, 50]}
                
                progressPending={loading}
                progressComponent={<div className="p-10"><Loader2 className="animate-spin" /></div>}
                
                customStyles={customStyles}
                highlightOnHover
                pointerOnHover
                noDataComponent={<div className="p-10 text-slate-500">Tidak ada transaksi ditemukan</div>}
                className="w-full"
            />
          )}

        </CardContent>
      </Card>
      

       <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>Detail Transaksi</DialogTitle>
              <DialogDescription>
                Informasi lengkap mengenai transaksi terpilih.
              </DialogDescription>
            </DialogHeader>

            {selectedTrx && (
              <div className="grid gap-6 py-4">
                
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border">
                    <div>
                        <p className="text-sm text-slate-500">Kode Transaksi</p>
                        <p className="font-mono text-lg font-bold">{selectedTrx.trx_code}</p>
                    </div>
                    <div className="text-right">
                        <p className="text-sm text-slate-500 mb-1">Status Saat Ini</p>
                        <Badge className={`${getStatusColor(selectedTrx.status)} text-md px-3 py-1`}>
                            {selectedTrx.status.replace("_", " ")}
                        </Badge>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                        <p className="text-sm text-slate-500">Nominal Transaksi</p>
                        <p className="font-semibold text-lg">{formatRupiah(selectedTrx.amount)}</p>
                    </div>
                    <div className="space-y-1">
                        <p className="text-sm text-slate-500">Biaya Admin (Fee)</p>
                        <p className="font-semibold text-lg">{formatRupiah(selectedTrx.admin_fee)}</p>
                    </div>
                </div>

                <Separator />

                {/* Informasi User */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Pembeli */}
                    <div className="space-y-3">
                        <h4 className="font-semibold flex items-center gap-2">
                           <Badge variant="outline" className="bg-green-100 text-green-800">Pembeli</Badge>
                        </h4>
                        <div className="text-sm space-y-1 border-l-2 border-green-200 pl-3">
                            <p><span className="font-medium">Username:</span> {selectedTrx.buyer?.username}</p>
                            <p><span className="font-medium">Email:</span> {selectedTrx.buyer?.email}</p>
                        </div>
                    </div>

                    {/* Penjual */}
                    <div className="space-y-3">
                        <h4 className="font-semibold flex items-center gap-2">
                           <Badge variant="outline" className="bg-blue-100 text-blue-800">Penjual</Badge>
                        </h4>
                        <div className="text-sm space-y-1 border-l-2 border-blue-200 pl-3">
                            <p><span className="font-medium">Username:</span> {selectedTrx.seller?.username}</p>
                            <p><span className="font-medium">Email:</span> {selectedTrx.seller?.email}</p>
                        </div>
                    </div>
                </div>

                <Separator />

                {/* Timeline */}
                <div className="space-y-2">
                    <h4 className="text-sm font-semibold">Waktu Transaksi</h4>
                    <div className="grid grid-cols-2 text-sm">
                         <div>
                            <span className="text-slate-500">Dibuat pada:</span>
                            <p className="font-medium">{format(new Date(selectedTrx.createdAt), "dd MMMM yyyy, HH:mm")}</p>
                         </div>
                         
                    </div>
                </div>

              </div>
            )}     
            <div className="flex justify-end gap-2">
                <Button variant="secondary" onClick={closeModal}>Tutup</Button>
            </div>
          </DialogContent>
        </Dialog>
    </div>
  );
}