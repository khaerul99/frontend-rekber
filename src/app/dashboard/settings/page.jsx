"use client";

import { useState, useEffect } from "react";
import api from "@/lib/axios";
import { toast } from "sonner";
import { Landmark, Coins, Save, Plus, Pencil, Trash2, CreditCard } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";

export default function SettingsPage() {
  const [loading, setLoading] = useState(false);
  
  // Data State
  const [banks, setBanks] = useState([]);
  const [fee, setFee] = useState("");

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBank, setEditingBank] = useState(null); // Jika null = Mode Tambah, Jika object = Mode Edit

  // Form State untuk Bank
  const [bankForm, setBankForm] = useState({ bankName: "", bankNumber: "", bankHolder: "" });
  const [logoFile, setLogoFile] = useState(null);
  const [previewLogo, setPreviewLogo] = useState(null);

  // 1. Load Data
  const fetchData = async () => {
    try {
      // Ambil List Bank
      const resBanks = await api.get("/settings/admin-banks");
      setBanks(resBanks.data);

      // Ambil Fee (Dari endpoint setting lama)
      const resFee = await api.get("/settings/payment");
      setFee(resFee.data.admin_fee || "0");
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // 2. Handle Buka Modal (Tambah/Edit)
  const openModal = (bank = null) => {
    setEditingBank(bank);
    if (bank) {
        // Mode Edit: Isi form dengan data bank
        setBankForm({
            bankName: bank.bankName,
            bankNumber: bank.bankNumber,
            bankHolder: bank.bankHolder
        });
        setPreviewLogo(bank.logoUrl ? `http://localhost:5000${bank.logoUrl}` : null);
    } else {
        // Mode Tambah: Kosongkan form
        setBankForm({ bankName: "", bankNumber: "", bankHolder: "" });
        setPreviewLogo(null);
    }
    setLogoFile(null);
    setIsModalOpen(true);
  };

  // 3. Handle Simpan Bank (Add/Update)
  const handleSaveBank = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    const formData = new FormData();
    formData.append("bankName", bankForm.bankName);
    formData.append("bankNumber", bankForm.bankNumber);
    formData.append("bankHolder", bankForm.bankHolder);
    if (logoFile) formData.append("logo", logoFile);

    try {
        if (editingBank) {
            // Update
            await api.put(`/settings/admin-banks/${editingBank.id}`, formData);
            toast.success("Bank berhasil diupdate");
        } else {
            // Create
            await api.post("/settings/admin-banks", formData);
            toast.success("Bank berhasil ditambahkan");
        }
        setIsModalOpen(false);
        fetchData(); // Refresh data
    } catch (error) {
        toast.error("Gagal menyimpan bank");
    } finally {
        setLoading(false);
    }
  };

  // 4. Handle Hapus Bank
  const handleDeleteBank = async (id) => {
      if(!confirm("Yakin hapus rekening ini?")) return;
      try {
          await api.delete(`/admin-banks/${id}`);
          toast.success("Bank dihapus");
          fetchData();
      } catch (error) {
          toast.error("Gagal hapus");
      }
  };

  // 5. Handle Simpan Fee
  const handleSaveFee = async (e) => {
      e.preventDefault();
      setLoading(true);
      try {
          // GANTI DARI FORM DATA KE JSON BIASA
          await api.put("/settings/payment", {
            admin_fee: fee
          });
          
          toast.success("Fee berhasil diupdate");
      } catch (error) {
          toast.error("Gagal update fee");
          console.error(error);
      } finally {
          setLoading(false);
      }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold">Pengaturan Admin</h1>

      <Tabs defaultValue="bank" className="w-full">
        <TabsList className="grid w-full grid-cols-2 lg:w-[400px]">
          <TabsTrigger value="bank" className="gap-2"><Landmark size={16}/> Rekening Bank</TabsTrigger>
          <TabsTrigger value="fee" className="gap-2"><Coins size={16}/> Biaya Layanan</TabsTrigger>
        </TabsList>

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
                              <span className="font-mono font-medium text-slate-700">{bank.bankNumber}</span>
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
            <CardContent>
                <form onSubmit={handleSaveFee} className="space-y-4">
                    <div className="space-y-2">
                        <Label>Nominal Fee (Rp)</Label>
                        <Input type="number" value={fee} onChange={(e) => setFee(e.target.value)} />
                    </div>
                    <Button disabled={loading}><Save className="mr-2 h-4 w-4"/> Simpan Fee</Button>
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