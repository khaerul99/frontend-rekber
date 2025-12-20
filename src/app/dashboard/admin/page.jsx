"use client";

import { useState, useEffect } from "react";
import {
  Users,
  CreditCard,
  Wallet,
  AlertCircle,
  ArrowUpRight,
  Loader2,
} from "lucide-react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import DashboardChart from "@/components/dashboard/DashboardChart";
import useUserStore from "@/store/useUserStore";
import api from "@/lib/axios";


export default function AdminDashboard() {
  const { user } = useUserStore();
  const [chartData, setChartData] = useState([]);
  const [stats, setStats] = useState({
    totalUsers: 0,
    pendingVerification: 0,
    successTransactions: 0,
    totalRevenue: 0,
    totalVolume: 0,
    activeHolding: 0,
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

          const resStats = await api.get("/user/stats");
          setUserStats(resStats.data);
        }
      } catch (error) {
        console.error("Gagal ambil data dashboard", error);
      } finally {
        setLoading(false);
      }
    };

    if (user) fetchData();
  }, [user]);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Dashboard Admin</h1>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {/* Card KEUNTUNGAN BERSIH */}
        {loading ? (
          <div className="flex items-center justify-center col-span-3">
            <Loader2 className="animate-spin h-6 w-6 text-gray-500" />
          </div>
        ) : (
          <Card className="bg-green-50 border-green-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-green-700">
                Total Keuntungan (Fee)
              </CardTitle>
              <Wallet className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-700">
                Rp {parseInt(stats.totalRevenue).toLocaleString("id-ID")}
              </div>
              <p className="text-xs text-green-600 mt-1">
                Milik Platform (Admin)
              </p>
            </CardContent>
          </Card>
        )}

        {/* Card DANA TERTAHAN (PENTING) */}
        {loading ? (
          <div className="flex items-center justify-center col-span-3">
            <Loader2 className="animate-spin h-6 w-6 text-gray-500" />
          </div>
        ) : (
          <Card className="bg-blue-50 border-blue-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-blue-700">
                Dana Tertahan (Escrow)
              </CardTitle>
              <CreditCard className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-700">
                Rp {parseInt(stats.activeHolding).toLocaleString("id-ID")}
              </div>
              <p className="text-xs text-blue-600 mt-1">
                Milik Penjual (Belum Cair)
              </p>
            </CardContent>
          </Card>
        )}

        {/* Card TOTAL VOLUME (Omset) */}
        {loading ? (
          <div className="flex items-center justify-center col-span-3">
            <Loader2 className="animate-spin h-6 w-6 text-gray-500" />
          </div>
        ) : (
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Volume Transaksi
              </CardTitle>
              <ArrowUpRight className="h-4 w-4 text-slate-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                Rp {parseInt(stats.totalVolume).toLocaleString("id-ID")}
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Total perputaran uang
              </p>
            </CardContent>
          </Card>
        )}

        {/* Card PERLU VERIFIKASI */}
          {loading ? (
                <div className="flex items-center justify-center col-span-3">
                    <Loader2 className="animate-spin h-6 w-6 text-gray-500" />
                </div>
            ) :
        <Card
          className={
            stats.pendingVerification > 0
              ? "border-orange-400 bg-orange-50"
              : ""
          }
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Perlu Verifikasi
            </CardTitle>
            <AlertCircle
              className={`h-4 w-4 ${
                stats.pendingVerification > 0
                  ? "text-orange-600"
                  : "text-slate-500"
              }`}
            />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.pendingVerification}
            </div>
            <Link
              href="/dashboard/validation"
              className="text-xs text-blue-600 hover:underline mt-1 block"
            >
              Cek sekarang &rarr;
            </Link>
          </CardContent>
        </Card> 
        }

        {/* Card TRANSAKSI SUKSES */}
          {loading ? (
                <div className="flex items-center justify-center col-span-3">
                    <Loader2 className="animate-spin h-6 w-6 text-gray-500" />
                </div>
            ) :
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Transaksi Sukses
            </CardTitle>
            <CreditCard className="h-4 w-4 text-slate-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.successTransactions}
            </div>
          </CardContent>
        </Card>
        }

        {/* Card TOTAL MEMBER */}
          {loading ? (
                <div className="flex items-center justify-center col-span-3">
                    <Loader2 className="animate-spin h-6 w-6 text-gray-500" />
                </div>
            ) :
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Member</CardTitle>
            <Users className="h-4 w-4 text-slate-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalUsers}</div>
          </CardContent>
        </Card>
        }
      </div>

      <div className="mt-8 p-8 border-2 border-dashed rounded-lg text-center text-slate-400">
        <DashboardChart data={chartData} />
      </div>
    </div>
  );
}
