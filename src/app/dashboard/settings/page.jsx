"use client";

import { useState, useEffect } from "react";
import api from "@/lib/axios";
import { toast } from "sonner";
import useUserStore from "@/store/useUserStore";

import { Landmark, Coins, Save, Plus, Pencil, Trash2, CreditCard, ShieldCheck, Lock, KeyRound } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { PasswordInput } from "@/components/ui/password-input";
import { useSettings } from "@/hooks/dashboard/settings/useSettings";

export default function SettingsPage() {
    const { user, defaultTab, banks, fee, passForm, pinForm, loading, isModalOpen, editingBank, bankForm, previewLogo, openModal,setPinForm, setIsModalOpen, setBankForm, setLogoFile, handleSaveBank, handleDeleteBank, handleSaveFee, handleUpdatePassword, handleSavePin } = useSettings();


if (!user) {
  return (
    <div className="flex h-screen items-center justify-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
    </div>
  );
}

  return (
    <div className="max-w-4xl mx-auto space-y-6">
        {user.role === 'ADMIN' ?
      <h1 className="text-3xl font-bold">Pengaturan Admin</h1> :  <h1 className="text-3xl font-bold">Pengaturan Keamanan</h1>
        }

    
      <Tabs defaultValue={defaultTab} className="w-full">
         {user?.role === 'ADMIN' ?
        <TabsList className="grid w-auto grid-cols-3">  
            <TabsTrigger value="bank" className="gap-2"><Landmark size={16}/> Rekening Bank</TabsTrigger>
            <TabsTrigger value="fee" className="gap-2"><Coins size={16}/> Biaya Layanan</TabsTrigger>
            <TabsTrigger value="security" className="gap-2"><ShieldCheck size={16}/> Keamanan Akun</TabsTrigger> 
        </TabsList>
        :
        <TabsList className="grid w-auto grid-cols-1">
            <TabsTrigger value="security" className="gap-2"><ShieldCheck size={16}/> Keamanan Akun</TabsTrigger> 
        </TabsList>
        }
    

        {user?.role === 'ADMIN' && 
        <>
         {/* --- TAB 1: LIST BANK --- */}
        <TabsContent value="bank" className="space-y-4">
          <div className="flex justify-end">
              <Button onClick={() => openModal(null)} size="sm" className="gap-2">
                  <Plus size={16} /> Tambah Bank
              </Button>
          </div>

          {/* TAMPILAN LIST CARD (Looping Array) */}
          {banks.map((bank) => (
              <Card key={bank.id} className="flex flex-row items-center p-6 gap-6">
                  {/* Logo */}
                  <div className="w-20 h-12 bg-slate-50 rounded border flex items-center justify-center p-1">
                      {bank.logoUrl ? (
                          <img src={`http://localhost:5000${bank.logoUrl}`} className="w-full h-full object-contain" />
                      ) : (
                          <CreditCard className="text-slate-300" />
                      )}
                  </div>

                  {/* Info Teks */}
                  <div className="flex-1 space-y-1">
                      <div className="flex items-center justify-between">
                          <h3 className="font-semibold text-lg">{bank.bankName}</h3>
                          
                          {/* Tombol Edit & Delete */}
                          <div className="flex gap-2">
                              <Button variant="outline" size="sm" onClick={() => openModal(bank)}>
                                  <Pencil size={14} className="mr-1"/> Edit Data
                              </Button>
                              <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-600 hover:bg-red-50" onClick={() => handleDeleteBank(bank.id)}>
                                  <Trash2 size={16} />
                              </Button>
                          </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-8 w-fit">
                          <div>
                              <span className="text-xs text-slate-500 block uppercase">Nomor Rekening</span>
                              <span className="font-mono font-medium text-slate-700">{bank.bankNumber}
                                </span>
                          </div>
                          <div>
                              <span className="text-xs text-slate-500 block uppercase">Atas Nama Pemilik</span>
                              <span className="font-medium text-slate-700">{bank.bankHolder}</span>
                          </div>
                      </div>
                  </div>
              </Card>
          ))}

          {banks.length === 0 && <p className="text-center text-slate-500 py-10">Belum ada rekening bank.</p>}
        </TabsContent>

        {/* --- TAB 2: FEE (Sama seperti sebelumnya) --- */}
        <TabsContent value="fee">
          <Card>
            <CardHeader><CardTitle>Biaya Admin</CardTitle></CardHeader>
            <div className="p-6 border-b bg-slate-50">
                <h2>Fee saat ini</h2>
                <p className="text-3xl font-bold text-green-600"> {fee} %</p>
            </div>
            <CardContent>
                <form onSubmit={handleSaveFee} className="space-y-4">
                    <div className="space-y-2">
                        <Label>Persentase Fee</Label>
                        <Input type="number" value={fee} step="0.01" placeholder="Masukan persentase (contoh: 0.5)" onChange={(e) => setFee(e.target.value)} />
                    </div>
                    <Button disabled={loading}><Save className="mr-2 h-4 w-4"/> Simpan Fee</Button>
                </form>
            </CardContent>
          </Card>
        </TabsContent>
        </>
        }

        <TabsContent value="security" className="space-y-6"> 
            {/* 1. PIN TRANSAKSI */}
           <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Lock className="w-5 h-5 text-blue-600"/> PIN Transaksi
                </CardTitle>
                <CardDescription>Masukkan password akun untuk mengatur ulang PIN.</CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSavePin} className="space-y-4">
                    
                    {/* 1. Input PIN Baru */}
                    <div className="space-y-2">
                        <Label>PIN Baru (6 Digit)</Label>
                        <Input 
                            type="password" 
                            placeholder="******" 
                            maxLength={6}
                            value={pinForm.pin}
                            onChange={(e) => {
                                const val = e.target.value.replace(/[^0-9]/g, '');
                                setPinForm({...pinForm, pin: val});
                            }}
                        />
                    </div>

                    {/* 2. Input Password Login (Satu baris dengan tombol biar rapi) */}
                    <div className="flex gap-4 items-end">
                        <div className="space-y-2 flex-1">
                            <Label>Konfirmasi Password Login</Label>
                            <Input 
                                type="password" 
                                placeholder="Masukkan password login Anda..." 
                                value={pinForm.password}
                                onChange={(e) => setPinForm({...pinForm, password: e.target.value})}
                            />
                        </div>
                        <Button type="submit" disabled={loading || pinForm.pin.length !== 6}>
                            Simpan PIN
                        </Button>
                    </div>

                </form>
            </CardContent>
        </Card>

            {/* 2. GANTI PASSWORD */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <KeyRound className="w-5 h-5 text-blue-600"/> Ganti Password
                    </CardTitle>
                    <CardDescription>Gunakan password kuat kombinasi huruf & angka.</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleUpdatePassword} className="space-y-4">
                        <div className="space-y-2">
                            <Label>Password Lama</Label>
                            <PasswordInput 
                                placeholder="Masukkan password saat ini"
                                value={passForm.oldPass}
                                onChange={(e) => setPassForm({...passForm, oldPass: e.target.value})}
                            />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Password Baru</Label>
                                <PasswordInput 
                                    placeholder="Minimal 8 karakter"
                                    value={passForm.newPass}
                                    onChange={(e) => setPassForm({...passForm, newPass: e.target.value})}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Konfirmasi Password Baru</Label>
                                <PasswordInput 
                                    placeholder="Ulangi password baru"
                                    value={passForm.confirmPass}
                                    onChange={(e) => setPassForm({...passForm, confirmPass: e.target.value})}
                                />
                            </div>
                        </div>
                        <div className="flex justify-end">
                            <Button type="submit" disabled={loading} variant="default">Update Password</Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </TabsContent>
        
          
      </Tabs>

      {/* --- MODAL FORM BANK (Tambah / Edit) --- */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent>
            <DialogHeader>
                <DialogTitle>{editingBank ? "Edit Rekening Bank" : "Tambah Rekening Baru"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSaveBank} className="space-y-4 py-2">
                <div>
                    <Label>Logo Bank</Label>
                    {previewLogo && <img src={previewLogo} className="h-10 object-contain my-2 border p-1 rounded" />}
                    <Input type="file" onChange={(e) => {
                        const file = e.target.files[0];
                        if(file) {
                            setLogoFile(file);
                            setPreviewLogo(URL.createObjectURL(file));
                        }
                    }} />
                </div>
                <div>
                    <Label>Nama Bank</Label>
                    <Input placeholder="BCA" value={bankForm.bankName} onChange={(e) => setBankForm({...bankForm, bankName: e.target.value})} required />
                </div>
                <div>
                    <Label>Nomor Rekening</Label>
                    <Input placeholder="1234567890" value={bankForm.bankNumber} onChange={(e) => setBankForm({...bankForm, bankNumber: e.target.value})} required />
                </div>
                <div>
                    <Label>Atas Nama</Label>
                    <Input placeholder="Admin" value={bankForm.bankHolder} onChange={(e) => setBankForm({...bankForm, bankHolder: e.target.value})} required />
                </div>
                <DialogFooter>
                    <Button type="submit" disabled={loading}>Simpan</Button>
                </DialogFooter>
            </form>
        </DialogContent>
      </Dialog>

    </div>
  );
}