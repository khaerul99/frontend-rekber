"use client";

import {
  CreditCard,
  Pencil,
  ShieldCheck,
  Smartphone,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import PinModal from "@/components/dashboard/PinModal";
import { useProfile } from "@/hooks/dashboard/profile/useProfile";

export default function ProfilePage() {
  const {
    user,
    loading,
    isPinOpen,
    isBankDialogOpen,
    is2FAModalOpen,
    bank,
    qrCodeUrl,
    otpCode,
    isFetching,
    handleSetup2FA,
    handleVerify2FA,
    handleBankSubmit,
    executeSaveBank,
    setIsBankDialogOpen,
    setIs2FAModalOpen,
    setBank,
    setOtpCode,
    defaultTab,
  } = useProfile();

       if (isFetching)
        return <div className="p-8 text-center">Memuat Profil...</div>;
    
  
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold">Pengaturan Profil</h1>

      {/* HEADER PROFIL */}
      <Card className="flex flex-row items-center gap-6 p-6">
        <Avatar className="h-20 w-20">
          <AvatarImage
            src={`https://api.dicebear.com/7.x/initials/svg?seed=${user?.username}`}
          />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
        <div className="space-y-1">
          <h2 className="text-2xl font-semibold">{user?.username}</h2>
          <p className="text-slate-500">{user?.email}</p>
          <div className="flex gap-2 mt-1">
            <Badge variant="secondary">Role: {user?.role || "MEMBER"}</Badge>
            {/* Indikator Status 2FA */}
            {user?.twofa_enabled ? (
              <Badge className="bg-green-500 hover:bg-green-600">
                2FA Aktif
              </Badge>
            ) : (
              <Badge variant="destructive">2FA Non-Aktif</Badge>
            )}
          </div>
        </div>
      </Card>

      <Tabs defaultValue={defaultTab} className="w-full">
        {user.role === 'ADMIN' ?  
        <TabsList className="w-full">
          <TabsTrigger value="security">Autentication</TabsTrigger> 
        </TabsList>
        :
        <TabsList className="grid w-auto grid-cols-2">
          <TabsTrigger value="bank">Data Rekening</TabsTrigger>
          <TabsTrigger value="security">Autentication</TabsTrigger> 
        </TabsList>
        }

      {user.role === 'ADMIN' ? 
       <TabsContent value="security" className="flex flex-col gap-4">
        
          <Card>
            <CardHeader>
              <CardTitle>Two-Factor Authentication (2FA)</CardTitle>
              <CardDescription>
                Tambahkan lapisan keamanan ekstra menggunakan Google
                Authenticator.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Status Card */}
              <div
                className={`flex items-center justify-between rounded-lg border p-4 ${
                  user?.twofa_enabled
                    ? "bg-green-50 border-green-200"
                    : "bg-slate-50"
                }`}
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`p-2 rounded-full ${
                      user?.twofa_enabled
                        ? "bg-green-100 text-green-600"
                        : "bg-slate-200 text-slate-600"
                    }`}
                  >
                    <ShieldCheck size={24} />
                  </div>
                  <div className="space-y-0.5">
                    <h3 className="text-base font-medium">Status Keamanan</h3>
                    <p className="text-sm text-slate-500">
                      {user?.twofa_enabled
                        ? "Akun Anda terlindungi dengan 2FA."
                        : "Akun Anda belum menggunakan 2FA."}
                    </p>
                  </div>
                </div>

                {/* Tombol Aksi */}
                {!user?.twofa_enabled && (
                  <Button onClick={handleSetup2FA} disabled={loading}>
                    {loading ? "Loading..." : "Aktifkan Sekarang"}
                  </Button>
                )}
              </div>

              {/* Info Tambahan */}
              <div className="text-sm text-slate-500 bg-blue-50 p-4 rounded-md border border-blue-100 flex gap-3">
                <Smartphone className="text-blue-500 shrink-0" size={20} />
                <p>
                  Kami menyarankan menggunakan aplikasi{" "}
                  <strong>Google Authenticator</strong> atau{" "}
                  <strong>Authy</strong> yang tersedia di Play Store / App
                  Store.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        : <>
        {/* TAB 1: DATA REKENING */}
        <TabsContent value="bank">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div className="space-y-1.5">
                <CardTitle>Informasi Pencairan Dana</CardTitle>
                <CardDescription>Rekening untuk menerima dana.</CardDescription>
              </div>
              <Button
                onClick={() => setIsBankDialogOpen(true)}
                variant="outline"
                size="sm"
              >
                <Pencil className="mr-2 h-4 w-4" /> Edit Data
              </Button>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-slate-500">
                    Nama Bank
                  </p>
                  <div className="flex items-center gap-2">
                    <CreditCard className="h-4 w-4 text-slate-400" />
                    <p className="font-semibold text-lg">
                      {bank.bank_name || (
                        <span className="text-slate-400 italic text-sm">
                          Belum diatur
                        </span>
                      )}
                    </p>
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-slate-500">
                    Nomor Rekening
                  </p>
                  <p className="font-mono text-lg tracking-wide">
                    {bank.bank_account || (
                      <span className="text-slate-400 italic text-sm">-</span>
                    )}
                  </p>
                </div>
                <div className="space-y-1 md:col-span-2">
                  <p className="text-sm font-medium text-slate-500">
                    Atas Nama Pemilik
                  </p>
                  <p className="font-semibold text-lg">
                    {bank.bank_holder || (
                      <span className="text-slate-400 italic text-sm">-</span>
                    )}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* TAB 2: KEAMANAN */}
        <TabsContent value="security" className="flex flex-col gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Two-Factor Authentication (2FA)</CardTitle>
              <CardDescription>
                Tambahkan lapisan keamanan ekstra menggunakan Google
                Authenticator.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Status Card */}
              <div
                className={`flex items-center justify-between rounded-lg border p-4 ${
                  user?.twofa_enabled
                    ? "bg-green-50 border-green-200"
                    : "bg-slate-50"
                }`}
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`p-2 rounded-full ${
                      user?.twofa_enabled
                        ? "bg-green-100 text-green-600"
                        : "bg-slate-200 text-slate-600"
                    }`}
                  >
                    <ShieldCheck size={24} />
                  </div>
                  <div className="space-y-0.5">
                    <h3 className="text-base font-medium">Status Keamanan</h3>
                    <p className="text-sm text-slate-500">
                      {user?.twofa_enabled
                        ? "Akun Anda terlindungi dengan 2FA."
                        : "Akun Anda belum menggunakan 2FA."}
                    </p>
                  </div>
                </div>

                {/* Tombol Aksi */}
                {!user?.twofa_enabled && (
                  <Button onClick={handleSetup2FA} disabled={loading}>
                    {loading ? "Loading..." : "Aktifkan Sekarang"}
                  </Button>
                )}
              </div>

              {/* Info Tambahan */}
              <div className="text-sm text-slate-500 bg-blue-50 p-4 rounded-md border border-blue-100 flex gap-3">
                <Smartphone className="text-blue-500 shrink-0" size={20} />
                <p>
                  Kami menyarankan menggunakan aplikasi{" "}
                  <strong>Google Authenticator</strong> atau{" "}
                  <strong>Authy</strong> yang tersedia di Play Store / App
                  Store.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        </>
       }
      </Tabs>

      {/* --- MODAL EDIT BANK --- */}
      <Dialog open={isBankDialogOpen} onOpenChange={setIsBankDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Data Rekening</DialogTitle>
            <DialogDescription>
              Pastikan data benar agar pencairan lancar.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleBankSubmit} className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Nama Bank</Label>
              <Input
                value={bank.bank_name}
                onChange={(e) =>
                  setBank({ ...bank, bank_name: e.target.value })
                }
                placeholder="BCA"
              />
            </div>
            <div className="space-y-2">
              <Label>Nomor Rekening</Label>
              <Input
                type="number"
                value={bank.bank_account}
                onChange={(e) =>
                  setBank({ ...bank, bank_account: e.target.value })
                }
                placeholder="1234567890"
              />
            </div>
            <div className="space-y-2">
              <Label>Atas Nama</Label>
              <Input
                value={bank.bank_holder}
                onChange={(e) =>
                  setBank({ ...bank, bank_holder: e.target.value })
                }
                placeholder="Nama Pemilik"
              />
            </div>
            <DialogFooter>
              <Button type="submit" disabled={loading}>
                {loading ? "Menyimpan..." : "Simpan"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* --- MODAL SETUP 2FA */}
      <Dialog open={is2FAModalOpen} onOpenChange={setIs2FAModalOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Setup Google Authenticator</DialogTitle>
            <DialogDescription>
              Scan QR Code ini menggunakan aplikasi Authenticator di HP Anda.
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col items-center justify-center py-4 gap-4">
          
            {qrCodeUrl ? (
              <div className="border-4 border-white shadow-lg rounded-lg overflow-hidden">
                <img
                  src={qrCodeUrl}
                  alt="QR Code 2FA"
                  className="w-48 h-48 object-contain"
                />
              </div>
            ) : (
              <p>Loading QR...</p>
            )}

            <div className="w-full space-y-2">
              <Label>Masukkan 6 Digit Kode</Label>
              <Input
                placeholder="Contoh: 123456"
                className="text-center text-lg tracking-widest font-mono"
                maxLength={6}
                value={otpCode}
                onChange={(e) => setOtpCode(e.target.value)}
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              onClick={handleVerify2FA}
              disabled={loading || otpCode.length < 6}
              className="w-full"
            >
              {loading ? "Memverifikasi..." : "Verifikasi & Aktifkan"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <PinModal 
          isOpen={isPinOpen} 
          onClose={() => setIsPinOpen(false)}
          onSuccess={executeSaveBank} 
      />
    </div>
  );
}
