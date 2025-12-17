"use client";

import { useEffect, useState } from "react";
import api from "@/lib/axios";
import { toast } from "sonner";
import useUserStore from "@/store/useUserStore";
import { authService } from "@/services/auth/authServices";
import { userService } from "@/services/users/userServices";


export function useProfile() {
     const { user, login } = useUserStore();
      const [loading, setLoading] = useState(false);
      const [isFetching, setIsFetching] = useState(true);
      const [isPinOpen, setIsPinOpen] = useState(false);
    
      // State Modal
      const [isBankDialogOpen, setIsBankDialogOpen] = useState(false);
      const [is2FAModalOpen, setIs2FAModalOpen] = useState(false);
    
      // State Data Bank
      const [bank, setBank] = useState("")
    
      // State Data 2FA
      const [qrCodeUrl, setQrCodeUrl] = useState("");
      const [otpCode, setOtpCode] = useState("");
    
      // Data Profil Terbaru
      useEffect(() => {
        const fetchProfile = async () => {
          try {
            const dataProfile = await userService.getProfile();
            const userData = dataProfile;
    
            setBank({
              bank_name: userData.bank_name || "",
              bank_account: userData.bank_account || "",
              bank_holder: userData.bank_holder || "",
            });
    
            const currentToken = localStorage.getItem("token");
            if (currentToken) {
              login(userData, currentToken);
            }
          } catch (error) {
            console.error("Gagal ambil profil", error);
          } finally {
            setIsFetching(false);
          }
        };
    
        fetchProfile();
      }, [login]);
    
      //  Minta QR Code ke Backend
      const handleSetup2FA = async () => {
        setLoading(true);
        try {
          const res = await authService.setup2FA();
          setQrCodeUrl(res.data.qrCode); 
          setIs2FAModalOpen(true); 
        } catch (error) {
          toast.error("Gagal generate 2FA");
        } finally {
          setLoading(false);
        }
      };
    
      //  Verifikasi Kode OTP
      const handleVerify2FA = async () => {
        if (!otpCode) return toast.error("Masukkan kode OTP dulu");
        setLoading(true);
        try {
          await authService.verify2FA(otpCode);
          toast.success("2FA Berhasil Diaktifkan!");
          setIs2FAModalOpen(false);
    
          window.location.reload();
        } catch (error) {
          toast.error("Kode OTP Salah / Kadaluarsa");
        } finally {
          setLoading(false);
        }
      };
    
     
    
      const handleBankSubmit = (e) => {
        e.preventDefault();
        setIsPinOpen(true); 
      };
    
      const executeSaveBank = async (pinCode) => {
        setLoading(true);
        try {
    
          const payload = {
                ...bank,
                pin: pinCode 
            };

          await userService.updateUser(payload);
          toast.success("Data Rekening Berhasil Disimpan!");
          setIsBankDialogOpen(false); 
        } catch (error) {
          toast.error(error.response?.data?.message || "Gagal menyimpan data");
        } finally {
          setLoading(false);
        }
      };
    
 
      const defaultTab = user.role === "ADMIN" ? "security" : "bank";

  return {
    user,
    loading,
    isFetching,
    isPinOpen,
    isBankDialogOpen,
    is2FAModalOpen,
    bank,
    qrCodeUrl,
    otpCode,
    isFetching,
    defaultTab,
    setIsPinOpen,
    setIsBankDialogOpen,
    setIs2FAModalOpen,
    setOtpCode,
    setBank,
    handleSetup2FA,
    handleVerify2FA,
    handleBankSubmit,
    executeSaveBank
  }
}