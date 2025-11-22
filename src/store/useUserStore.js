// src/store/useUserStore.js
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useUserStore = create(
  persist(
    (set) => ({
      user: null,
      token: null,
      
      // Fungsi Login: Simpan data user & token
      login: (userData, token) => set({ user: userData, token }),
      
      // Fungsi Logout: Hapus semua data
      logout: () => set({ user: null, token: null }),
    }),
    {
      name: 'user-storage', // Nama key di LocalStorage browser
    }
  )
);

export default useUserStore;