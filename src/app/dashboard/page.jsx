"use client";

import { useEffect, useState } from "react";
import api from "@/lib/axios";
import useUserStore from "@/store/useUserStore";
import Link from "next/link";
import {
  Wallet,
  AlertCircle,
  ArrowUpRight,
  Loader2,
  Eye
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
// Import di paling atas
import DashboardChart from "@/components/dashboard/DashboardChart";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Info, CheckCircle2, AlertTriangle } from "lucide-react";
import AdminDashboard from "./admin/page";
import { transactionService } from "@/services/transaction/transactionServices";
import DataTable from "react-data-table-component";

export default function DashboardPage() {
  const { user } = useUserStore();
  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [userStats, setUserStats] = useState({
    totalSpent: 0,
    totalEarned: 0,
    activeTransactions: 0,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const resData = await transactionService.getMyTransactions();
        const safeData = Array.isArray(resData) ? resData : (resData.data || []);
        setTransactions(safeData);
        setFilteredTransactions(safeData);

        const resStats = await api.get("/user/stats");
        setUserStats(resStats.data);
      } catch (error) {
        console.error("Gagal ambil data dashboard", error);
      } finally {
        setLoading(false);
      }
    };

    if (user) fetchData();
  }, [user]);

  useEffect(() => {
    if (!transactions) return;

    const activeStatuses = [
      "PENDING_PAYMENT",     
      // "VERIFYING",            
      // "PROCESSED",            
      // "SENT",                 
      // "WAITING_REPLACEMENT",  
      // "DISPUTED",            
      // "RETURN_PROCESS",       
      // "RETURN_SENT",          
      // "REFUND_PENDING"      
    ];

    // 2. Filter data: Hanya ambil yang statusnya ada di daftar activeStatuses
    const ongoingTransactions = transactions.filter((trx) => 
      activeStatuses.includes(trx.status)
    );

    // 3. Masukkan hasil filter ke state tabel
    setFilteredTransactions(ongoingTransactions);

  }, [transactions]);

  if (user?.role === "ADMIN") {
    return <AdminDashboard />;
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "PENDING_PAYMENT":
        return "bg-yellow-500";
      case "VERIFYING":
        return "bg-orange-500";
      case "PROCESSED":
        return "bg-blue-500";
      case "SENT":
        return "bg-purple-500";
      case "WAITING_REPLACEMENT":
        return "bg-indigo-500";
      case "COMPLETED":
        return "bg-green-500";
      case "CANCELLED":
        return "bg-slate-500";
      default:
        return "bg-slate-500";
    }
  };

  const columns = [
    {
      name: 'Kode TRX',
      selector: row => row.trx_code,
      sortable: true, 
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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-slate-500">Halo, {user?.username} 👋</p>
        </div>
      </div>

      {!user?.bank_account && (
        <Alert className="bg-orange-50 border-orange-200 text-orange-800">
          <Info className="h-4 w-4" />
          <AlertTitle>Rekening Bank Belum Diatur!</AlertTitle>
          <AlertDescription className="flex items-center justify-between">
            <span>
              Anda belum mengatur rekening pencairan dana. Mohon lengkapi agar
              proses pencairan tidak terhambat.
            </span>
            <Link href="/dashboard/profile">
              <Button
                size="sm"
                variant="outline"
                className="bg-white border-orange-300 text-orange-800 hover:bg-orange-100 ml-4"
              >
                Atur Sekarang
              </Button>
            </Link>
          </AlertDescription>
        </Alert>
      )}

      {/* KARTU STATISTIK USER */}
      <div className="grid gap-4 md:grid-cols-3">
        {/* Card 1: Pemasukan (Penjualan) */}
        <Card className="bg-green-50 border-green-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-green-700">
              Total Pemasukan
            </CardTitle>
            <ArrowUpRight className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-700">
              Rp {parseInt(userStats.totalEarned).toLocaleString("id-ID")}
            </div>
            <p className="text-xs text-green-600 mt-1">Dari penjualan sukses</p>
          </CardContent>
        </Card>

        {/* Card 2: Pengeluaran (Pembelian) */}
        <Card className="bg-blue-50 border-blue-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-blue-700">
              Total Pengeluaran
            </CardTitle>
            <Wallet className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-700">
              Rp {parseInt(userStats.totalSpent).toLocaleString("id-ID")}
            </div>
            <p className="text-xs text-blue-600 mt-1">
              Untuk pembelian barang/jasa
            </p>
          </CardContent>
        </Card>

        {/* Card 3: Transaksi Aktif */}
        <Card
          className={
            userStats.activeTransactions > 0
              ? "border-orange-300 bg-orange-50"
              : ""
          }
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-700">
              Sedang Berjalan
            </CardTitle>
            <AlertCircle
              className={`h-4 w-4 ${
                userStats.activeTransactions > 0
                  ? "text-orange-500"
                  : "text-slate-400"
              }`}
            />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-800">
              {userStats.activeTransactions} Transaksi
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Menunggu proses / penyelesaian
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Tabel Riwayat (Tetap Ada) */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Transaksi Berjalan</CardTitle>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/dashboard/history" className="text-blue-600">
               Lihat Semua Riwayat &rarr;
            </Link>
          </Button>
        </CardHeader>
        <CardContent className="w-full max-w-[calc(100vw-2rem)] sm:max-w-full overflow-x-auto">
          {loading ? (
            <p className="text-center py-4">Memuat data...</p>
          ) : transactions.length === 0 ? (
            <div className="text-center py-12 border-2 border-dashed rounded-lg text-slate-400">
              <p>Belum ada riwayat transaksi.</p>
              <Link
                href="/dashboard/create"
                className="text-blue-600 hover:underline text-sm"
              >
                Mulai transaksi sekarang
              </Link>
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
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
