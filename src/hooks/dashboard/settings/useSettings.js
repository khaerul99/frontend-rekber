"use client";

import { useState, useEffect } from "react";
import api from "@/lib/axios";
import { toast } from "sonner";
import useUserStore from "@/store/useUserStore";

export function useSettings() {
  const { user } = useUserStore();
  const [loading, setLoading] = useState(false);

  // --- STATE KEAMANAN ---
  const [passForm, setPassForm] = useState({
    oldPass: "",
    newPass: "",
    confirmPass: "",
  });
  const [pin, setPin] = useState("");
  const [pinForm, setPinForm] = useState({ pin: "", password: "" });

  // Data State
  const [banks, setBanks] = useState([]);
  const [fee, setFee] = useState("");

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBank, setEditingBank] = useState(null);

  // Form State untuk Bank
  const [bankForm, setBankForm] = useState({
    bankName: "",
    bankNumber: "",
    bankHolder: "",
  });
  const [logoFile, setLogoFile] = useState(null);
  const [previewLogo, setPreviewLogo] = useState(null);

  // Load Data
  const fetchData = async () => {
    try {
      const resBanks = await api.get("/settings/admin-banks");
      setBanks(resBanks.data);
      const resFee = await api.get("/settings/payment");
      setFee(resFee.data.admin_fee || "0");
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // --- HANDLER OPEN MODAL (TAMBAH/EDIT) ---
  const openModal = (bank = null) => {
    setEditingBank(bank);
    if (bank) {
      setBankForm({
        bankName: bank.bankName,
        bankNumber: bank.bankNumber,
        bankHolder: bank.bankHolder,
      });
      setPreviewLogo(
        bank.logoUrl ? `http://localhost:5000${bank.logoUrl}` : null
      );
    } else {
      setBankForm({ bankName: "", bankNumber: "", bankHolder: "" });
      setPreviewLogo(null);
    }
    setLogoFile(null);
    setIsModalOpen(true);
  };

  // --- HANDLER SAVE BANK (TAMBAH/EDIT) ---
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
      fetchData();
    } catch (error) {
      toast.error("Gagal menyimpan bank");
    } finally {
      setLoading(false);
    }
  };

  // --- HANDLER DELETE BANK ---
  const handleDeleteBank = async (id) => {
    if (!confirm("Yakin hapus rekening ini?")) return;
    try {
      await api.delete(`/admin-banks/${id}`);
      toast.success("Bank dihapus");
      fetchData();
    } catch (error) {
      toast.error("Gagal hapus");
    }
  };

  // --- HANDLER SAVE FEE ---
  const handleSaveFee = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.put("/settings/payment", {
        admin_fee: fee,
      });

      toast.success("Fee berhasil diupdate");
    } catch (error) {
      toast.error("Gagal update fee");
    } finally {
      setLoading(false);
    }
  };

  // --- HANDLER UPDATE PASSWORD ---
  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    if (passForm.newPass !== passForm.confirmPass) {
      return toast.error("Konfirmasi password tidak cocok!");
    }
    setLoading(true);
    try {
      await api.put("/users/change-password", {
        currentPassword: passForm.oldPass,
        newPassword: passForm.newPass,
      });
      toast.success("Password berhasil diubah!");
      setPassForm({ oldPass: "", newPass: "", confirmPass: "" });
    } catch (error) {
      toast.error(error.response?.data?.message || "Gagal ubah password");
    } finally {
      setLoading(false);
    }
  };

 
  const handleSavePin = async (e) => {
    e.preventDefault();
    if (pin.length !== 6) return toast.error("PIN harus 6 digit");
    setLoading(true);
    try {
      await api.put("/users/pin", pinForm);
      toast.success("PIN Berhasil Disimpan");
      setPinForm({ pin: "", password: "" });
    } catch (error) {
      toast.error(error.response?.data?.message || "Gagal");
    } finally {
      setLoading(false);
    }
  };

  const defaultTab = user.role === "ADMIN" ? "bank" : "security";

  return {
    user,
    defaultTab,
    banks,
    fee,
    passForm,
    pin,
    pinForm,
    loading,
    isModalOpen,
    editingBank,
    bankForm,
    logoFile,
    previewLogo,
    setIsModalOpen,
    setBankForm,
    setLogoFile,
    openModal,
    handleSavePin,
    handleSaveBank,
    handleDeleteBank,
    handleSaveFee,
    handleUpdatePassword,
    handleSavePin,
  };
}
