"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import api from "@/lib/axios"; // Pastikan axios sudah di-setup
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  ShieldCheck, Zap, MessageCircle, Search, 
  Menu, X, ArrowRight, Wallet , Star
} from "lucide-react";

export default function LandingPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  // State untuk Cek Transaksi
  const [trackCode, setTrackCode] = useState("");
  const [trackResult, setTrackResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [reviews, setReviews] = useState([]);

  // Fungsi Cek Resi
  const handleTrack = async (e) => {
    e.preventDefault();
    if (!trackCode) return;
    
    setLoading(true);
    setError("");
    setTrackResult(null);

    try {
      // Panggil API Public yang sudah kita buat di Backend
      const res = await api.get(`/transactions/track/${trackCode}`);
      setTrackResult(res.data);
    } catch (err) {
      setError("Transaksi tidak ditemukan. Cek kembali Kode TRX Anda.");
    } finally {
      setLoading(false);
    }
  };

    useEffect(() => {
    const fetchReviews = async () => {
        try {
            const res = await api.get("/reviews/public");
            setReviews(res.data);
        } catch (error) {
            console.error("Gagal load review");
        }
    };
    fetchReviews();
}, []);

  // Helper Warna Status
  const getStatusColor = (status) => {
    const colors = {
      PENDING_PAYMENT: "bg-yellow-500",
      VERIFYING: "bg-orange-500",
      PROCESSED: "bg-blue-500",
      SENT: "bg-purple-500",
      COMPLETED: "bg-green-500",
      DISPUTED: "bg-red-500",
      CANCELLED: "bg-slate-500",
    };
    return colors[status] || "bg-slate-500";
  };

  return (
    <div className="min-h-screen bg-white text-slate-900">
      
      {/* --- NAVBAR --- */}
      <nav className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur">
        <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-8">
          <div className="flex items-center gap-2 font-bold text-xl text-blue-600">
            <Wallet className="h-6 w-6" />
            <span>RekberApp</span>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-6">
            <Link href="#fitur" className="text-sm font-medium hover:text-blue-600">Fitur</Link>
            <Link href="#cara-kerja" className="text-sm font-medium hover:text-blue-600">Cara Kerja</Link>
            <Link href="#tracking" className="text-sm font-medium hover:text-blue-600">Cek Transaksi</Link>
            <div className="flex items-center gap-2 ml-4">
                <Link href="/auth/login">
                    <Button variant="ghost">Masuk</Button>
                </Link>
                <Link href="/auth/register">
                    <Button className="bg-blue-600 hover:bg-blue-700">Daftar Sekarang</Button>
                </Link>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X /> : <Menu />}
          </button>
        </div>

        {/* Mobile Dropdown */}
        {isMenuOpen && (
            <div className="md:hidden border-t p-4 space-y-4 bg-white">
                <Link href="/auth/login" className="block w-full">
                    <Button variant="outline" className="w-full">Masuk</Button>
                </Link>
                <Link href="/auth/register" className="block w-full">
                    <Button className="w-full bg-blue-600">Daftar</Button>
                </Link>
            </div>
        )}
      </nav>

      {/* --- HERO SECTION --- */}
      <section className="py-20 md:py-32 bg-gradient-to-b from-blue-50 to-white">
        <div className="container mx-auto px-4 text-center max-w-4xl">
            <Badge className="mb-4 bg-blue-100 text-blue-700 hover:bg-blue-100 px-3 py-1 text-sm">
                #1 Platform Rekber Terpercaya
            </Badge>
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-slate-900 mb-6">
                Transaksi Online <span className="text-blue-600">Tanpa Cemas</span>
            </h1>
            <p className="text-lg text-slate-600 mb-8 max-w-2xl mx-auto">
                Amankan jual beli online Anda. Kami menahan dana pembeli sampai barang diterima dengan baik. Anti penipuan, cepat, dan transparan.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Link href="/auth/register">
                    <Button size="lg" className="w-full sm:w-auto text-lg h-12 px-8 bg-blue-600 hover:bg-blue-700">
                        Buat Transaksi Baru <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                </Link>
                <Link href="#tracking">
                    <Button size="lg" variant="outline" className="w-full sm:w-auto text-lg h-12">
                        Cek Status Transaksi
                    </Button>
                </Link>
            </div>
        </div>
      </section>

      {/* --- FITUR SECTION --- */}
      <section id="fitur" className="py-20 bg-white">
        <div className="container mx-auto px-4">
            <div className="text-center mb-16">
                <h2 className="text-3xl font-bold mb-4">Kenapa Memilih Kami?</h2>
                <p className="text-slate-500">Keamanan dan kenyamanan Anda adalah prioritas utama.</p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
                <Card className="border-none shadow-lg bg-slate-50">
                    <CardHeader>
                        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4 text-blue-600">
                            <ShieldCheck size={28} />
                        </div>
                        <CardTitle>Aman & Terjamin</CardTitle>
                    </CardHeader>
                    <CardContent className="text-slate-600">
                        Dana ditahan di rekening bersama yang aman. Penjual tidak akan kabur, pembeli tidak akan menipu.
                    </CardContent>
                </Card>
                <Card className="border-none shadow-lg bg-slate-50">
                    <CardHeader>
                        <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4 text-green-600">
                            <Zap size={28} />
                        </div>
                        <CardTitle>Proses Cepat</CardTitle>
                    </CardHeader>
                    <CardContent className="text-slate-600">
                        Verifikasi otomatis dan pencairan dana instan setelah transaksi selesai dikonfirmasi.
                    </CardContent>
                </Card>
                <Card className="border-none shadow-lg bg-slate-50">
                    <CardHeader>
                        <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4 text-purple-600">
                            <MessageCircle size={28} />
                        </div>
                        <CardTitle>Support 24/7</CardTitle>
                    </CardHeader>
                    <CardContent className="text-slate-600">
                        Tim admin siap membantu menengahi sengketa (dispute) secara adil dan transparan.
                    </CardContent>
                </Card>
            </div>
        </div>
      </section>

      {/* --- TESTIMONI SECTION --- */}
      <section className="py-20 bg-slate-50">
        <div className="container mx-auto px-4">
            <div className="text-center mb-12">
                <h2 className="text-3xl font-bold mb-4">Apa Kata Mereka?</h2>
                <p className="text-slate-500">Pengalaman pengguna yang telah bertransaksi aman bersama kami.</p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
                {reviews.length === 0 ? (
                    <p className="text-center col-span-3 text-slate-400">Belum ada ulasan.</p>
                ) : (
                    reviews.map((rev) => (
                        <Card key={rev.id} className="border-none shadow-sm hover:shadow-md transition">
                            <CardContent className="pt-6">
                                <div className="flex gap-1 mb-4">
                                    {[...Array(5)].map((_, i) => (
                                        <Star 
                                            key={i} 
                                            size={16} 
                                            className={i < rev.rating ? "fill-yellow-400 text-yellow-400" : "text-slate-200"} 
                                        />
                                    ))}
                                </div>
                                <p className="text-slate-700 mb-4 italic">{rev.comment}</p>
                                <div className="flex items-center gap-3">
                                    <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-xs font-bold text-blue-600">
                                        {rev.reviewer.username.charAt(0).toUpperCase()}
                                    </div>
                                    <p className="text-sm font-bold text-slate-900">{rev.reviewer.username}</p>
                                </div>
                            </CardContent>
                        </Card>
                    ))
                )}
            </div>
        </div>
      </section>

      {/* --- TRACKING SECTION --- */}
      <section id="tracking" className="py-20 bg-slate-900 text-white">
        <div className="container mx-auto px-4 max-w-3xl text-center">
            <h2 className="text-3xl font-bold mb-6">Cek Status Transaksi</h2>
            <p className="text-slate-300 mb-8">Masukkan Kode Transaksi (TRX-...) untuk melacak status uang dan barang.</p>
            
            <div className="bg-white p-2 rounded-lg flex flex-col sm:flex-row gap-2 shadow-xl">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                    <Input 
                        placeholder="Contoh: TRX-1763799471348" 
                        className="pl-10 h-12 text-slate-900 border-none bg-transparent focus-visible:ring-0"
                        value={trackCode}
                        onChange={(e) => setTrackCode(e.target.value)}
                    />
                </div>
                <Button 
                    size="lg" 
                    className="h-12 px-8 bg-blue-600 hover:bg-blue-700"
                    onClick={handleTrack}
                    disabled={loading}
                >
                    {loading ? "Mencari..." : "Lacak"}
                </Button>
            </div>

            {/* HASIL TRACKING */}
            {error && (
                <div className="mt-6 p-4 bg-red-500/20 border border-red-500 rounded-lg text-red-200">
                    {error}
                </div>
            )}

            {trackResult && (
                <div className="mt-8 bg-white rounded-xl p-6 text-left text-slate-900 shadow-2xl animate-in fade-in slide-in-from-bottom-4">
                    <div className="flex justify-between items-start mb-4 border-b pb-4">
                        <div>
                            <p className="text-xs text-slate-500 uppercase">Kode Transaksi</p>
                            <p className="font-mono font-bold text-lg">{trackResult.trx_code}</p>
                        </div>
                        <Badge className={`${getStatusColor(trackResult.status)} text-white border-0`}>
                            {trackResult.status.replace(/_/g, " ")}
                        </Badge>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <p className="text-xs text-slate-500 uppercase">Total Nominal</p>
                            <p className="font-bold text-blue-600 text-lg">
                                Rp {parseInt(trackResult.total_transfer).toLocaleString("id-ID")}
                            </p>
                        </div>
                        <div>
                            <p className="text-xs text-slate-500 uppercase">Tanggal</p>
                            <p className="font-medium">
                                {new Date(trackResult.createdAt).toLocaleDateString("id-ID", {
                                    day: 'numeric', month: 'long', year: 'numeric'
                                })}
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
      </section>

      {/* --- CARA KERJA --- */}
      <section id="cara-kerja" className="py-20 bg-white">
        <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-16">Cara Kerja Rekber</h2>
            
            <div className="grid md:grid-cols-4 gap-8 relative">
                {/* Garis Penghubung (Desktop Only) */}
                <div className="hidden md:block absolute top-8 left-0 w-full h-0.5 bg-slate-100 -z-10" />

                {[
                    { title: "Sepakat", desc: "Penjual & Pembeli sepakat harga & barang.", icon: "1" },
                    { title: "Transfer", desc: "Pembeli transfer dana ke rekening Rekber.", icon: "2" },
                    { title: "Kirim", desc: "Penjual mengirim barang/akun ke pembeli.", icon: "3" },
                    { title: "Selesai", desc: "Pembeli konfirmasi, dana cair ke penjual.", icon: "4" },
                ].map((step, i) => (
                    <div key={i} className="text-center bg-white p-4">
                        <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4 ring-8 ring-white">
                            {step.icon}
                        </div>
                        <h3 className="font-bold text-lg mb-2">{step.title}</h3>
                        <p className="text-slate-500 text-sm">{step.desc}</p>
                    </div>
                ))}
            </div>
        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="bg-slate-900 text-slate-400 py-12 border-t border-slate-800">
        <div className="container mx-auto px-4 grid md:grid-cols-4 gap-8">
            <div className="col-span-2">
                <div className="flex items-center gap-2 font-bold text-xl text-white mb-4">
                    <Wallet className="h-6 w-6" />
                    <span>RekberApp</span>
                </div>
                <p className="text-sm max-w-xs">
                    Platform rekening bersama terpercaya untuk transaksi digital yang aman, cepat, dan transparan.
                </p>
            </div>
            <div>
                <h4 className="text-white font-bold mb-4">Menu</h4>
                <ul className="space-y-2 text-sm">
                    <li><Link href="/login" className="hover:text-white">Masuk</Link></li>
                    <li><Link href="/register" className="hover:text-white">Daftar</Link></li>
                    <li><Link href="#tracking" className="hover:text-white">Cek Resi</Link></li>
                </ul>
            </div>
            <div>
                <h4 className="text-white font-bold mb-4">Hubungi Kami</h4>
                <ul className="space-y-2 text-sm">
                    <li>support@rekberapp.com</li>
                    <li>+62 812 3456 7890</li>
                </ul>
            </div>
        </div>
        <div className="container mx-auto px-4 mt-12 pt-8 border-t border-slate-800 text-center text-xs">
            &copy; 2025 Rekber App. All rights reserved.
        </div>
      </footer>

    </div>
  );
}