import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import api from "@/lib/axios"; // Pastikan path ini sesuai dengan file axios kamu
import { toast } from "sonner";



export default function VerifyContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [status, setStatus] = useState("verifying"); // verifying | success | error

  useEffect(() => {
    const verifyUserEmail = async () => {
      if (!token) {
        setStatus("error");
        return;
      }

      try {
        // Panggil API Backend
        await api.post("/auth/verify-email", { token });
        
        setStatus("success");
        toast.success("Email berhasil diverifikasi!");
        
        // Redirect ke login setelah 3 detik
        setTimeout(() => {
          router.push("/auth/login");
        }, 3000);

      } catch (error) {
        console.error("Verifikasi Gagal:", error);
        setStatus("error");
        toast.error(error.response?.data?.message || "Token tidak valid atau kadaluarsa.");
      }
    };

    verifyUserEmail();
  }, [token, router]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-4">
      <div className="bg-white p-8 rounded-2xl shadow-lg max-w-md w-full text-center">
        
        {/* TAMPILAN LOADING */}
        {status === "verifying" && (
          <>
            <h2 className="text-2xl font-bold mb-2 text-blue-600">Memverifikasi...</h2>
            <p className="text-gray-600">Mohon tunggu sebentar, kami sedang mengecek token Anda.</p>
          </>
        )}

        {/* TAMPILAN SUKSES */}
        {status === "success" && (
          <>
            <h2 className="text-2xl font-bold mb-2 text-green-600">Berhasil! 🎉</h2>
            <p className="text-gray-600 mb-6">Akun Anda sudah aktif. Anda akan dialihkan ke halaman Login.</p>
            <button 
              onClick={() => router.push('/auth/login')}
              className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition"
            >
              Login Sekarang
            </button>
          </>
        )}

        {/* TAMPILAN ERROR */}
        {status === "error" && (
          <>
            <h2 className="text-2xl font-bold mb-2 text-red-600">Gagal Verifikasi ❌</h2>
            <p className="text-gray-600 mb-6">Token tidak valid atau sudah kadaluarsa.</p>
            <button 
              onClick={() => router.push('/auth/register')}
              className="bg-gray-800 text-white px-6 py-2 rounded-lg hover:bg-gray-900 transition"
            >
              Daftar Ulang
            </button>
          </>
        )}
      </div>
    </div>
  );
}