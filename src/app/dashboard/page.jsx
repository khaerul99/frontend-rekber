"use client";

import { useEffect, useState } from "react";
import api from "@/lib/axios";
import useUserStore from "@/store/useUserStore";
import Link from "next/link";
import { format } from "date-fns";
import { 
  Users, 
  CreditCard, 
  Wallet, 
  AlertCircle,
  ArrowUpRight 
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
// Import di paling atas
import DashboardChart from "@/components/dashboard/DashboardChart";

export default function DashboardPage() {
  const { user } = useUserStore();
  
  // State untuk User Biasa
  const [transactions, setTransactions] = useState([]);
  const [chartData, setChartData] = useState([]);
  
  // State untuk Admin
  const [stats, setStats] = useState({
    totalUsers: 0,
    pendingVerification: 0,
    successTransactions: 0,
    totalRevenue: 0,
    totalVolume: 0,   // <--- Tambah
    activeHolding: 0
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (user?.role === "ADMIN") {
            const res = await api.get("/admin/stats");
            setStats(res.data);

            const resChart = await api.get("/admin/chart");
            setChartData(resChart.data);
        } else {
            const res = await api.get("/transactions/my-transactions");
            setTransactions(res.data);
        }
      } catch (error) {
        console.error("Gagal ambil data dashboard", error);
      } finally {
        setLoading(false);
      }
    };

    if (user) fetchData();
  }, [user]);

  // --- TAMPILAN KHUSUS ADMIN ---
  if (user?.role === "ADMIN") {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Dashboard Admin</h1>
        
        {/* Grid Statistik */}
       <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            
            {/* Card 1: KEUNTUNGAN BERSIH */}
            <Card className="bg-green-50 border-green-200">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-green-700">Total Keuntungan (Fee)</CardTitle>
                    <Wallet className="h-4 w-4 text-green-600" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold text-green-700">
                        Rp {parseInt(stats.totalRevenue).toLocaleString("id-ID")}
                    </div>
                    <p className="text-xs text-green-600 mt-1">Milik Platform (Admin)</p>
                </CardContent>
            </Card>

            {/* Card 2: DANA TERTAHAN (PENTING) */}
            <Card className="bg-blue-50 border-blue-200">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-blue-700">Dana Tertahan (Escrow)</CardTitle>
                    <CreditCard className="h-4 w-4 text-blue-600" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold text-blue-700">
                        Rp {parseInt(stats.activeHolding).toLocaleString("id-ID")}
                    </div>
                    <p className="text-xs text-blue-600 mt-1">Milik Penjual (Belum Cair)</p>
                </CardContent>
            </Card>

            {/* Card 3: TOTAL VOLUME (Omset) */}
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Volume Transaksi</CardTitle>
                    <ArrowUpRight className="h-4 w-4 text-slate-500" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">
                        Rp {parseInt(stats.totalVolume).toLocaleString("id-ID")}
                    </div>
                    <p className="text-xs text-slate-500 mt-1">Total perputaran uang</p>
                </CardContent>
            </Card>

            {/* Card 4: PERLU VERIFIKASI */}
            <Card className={stats.pendingVerification > 0 ? "border-orange-400 bg-orange-50" : ""}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Perlu Verifikasi</CardTitle>
                    <AlertCircle className={`h-4 w-4 ${stats.pendingVerification > 0 ? "text-orange-600" : "text-slate-500"}`} />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">
                        {stats.pendingVerification}
                    </div>
                    <Link href="/dashboard/validation" className="text-xs text-blue-600 hover:underline mt-1 block">
                        Cek sekarang &rarr;
                    </Link>
                </CardContent>
            </Card>

            {/* Card 5: TRANSAKSI SUKSES */}
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Transaksi Sukses</CardTitle>
                    <CreditCard className="h-4 w-4 text-slate-500" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{stats.successTransactions}</div>
                </CardContent>
            </Card>

            {/* Card 6: TOTAL MEMBER */}
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Member</CardTitle>
                    <Users className="h-4 w-4 text-slate-500" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{stats.totalUsers}</div>
                </CardContent>
            </Card>
        </div>

        {/* Bisa ditambahkan Grafik atau Tabel Recent Activity di sini nanti */}
        <div className="mt-8 p-8 border-2 border-dashed rounded-lg text-center text-slate-400">
           <DashboardChart data={chartData} />
        </div>
      </div>
    );
  }

  // --- TAMPILAN MEMBER BIASA (KODE LAMA) ---
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
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <Link href="/dashboard/create">
           <Button>+ Transaksi Baru</Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Halo, {user?.username || "User"} 👋</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-slate-500">Selamat datang kembali di panel transaksi aman Anda.</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Riwayat Transaksi</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-center py-4">Memuat data...</p>
          ) : transactions.length === 0 ? (
            <p className="text-center py-4 text-slate-500">Belum ada transaksi.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Kode TRX</TableHead>
                  <TableHead>Lawan Transaksi</TableHead>
                  <TableHead>Nominal</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Tanggal</TableHead>
                  <TableHead>Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactions.map((trx) => (
                  <TableRow key={trx.id}>
                    <TableCell className="font-medium">{trx.trx_code}</TableCell>
                    <TableCell>
                      {user?.email === trx.buyer?.email 
                        ? `Penjual: ${trx.seller?.username}` 
                        : `Pembeli: ${trx.buyer?.username}`}
                    </TableCell>
                    <TableCell>Rp {parseInt(trx.amount).toLocaleString("id-ID")}</TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(trx.status)}>
                        {trx.status.replace("_", " ")}
                      </Badge>
                    </TableCell>
                    <TableCell>{format(new Date(trx.createdAt), "dd MMM yyyy")}</TableCell>
                    <TableCell>
                      <Link href={`/dashboard/transaction/${trx.id}`}>
                        <Button variant="outline" size="sm">Detail</Button>
                      </Link>
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