// src/store/useUserStore.js
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

const useUserStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      _hasHydrated: false,
      
      login: (userData, token) => set({ user: userData, token, isAuthenticated: true }),
      
      logout: () => {
        localStorage.removeItem("token"); 
        localStorage.removeItem("rekber-session");

        set({ user: null, token: null, isAuthenticated: false });
      },

      updateUser: (updates) => set((state) => ({
        user: { ...state.user, ...updates }
      })),

      setHasHydrated: (state) => set({ _hasHydrated: state }),


      isAdmin: () => {
        const { user } = get();
        return user?.role === 'ADMIN';
      }

    }),
    {
      name: 'rekber-session', 
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ 
        user: state.user, 
        token: state.token, 
        isAuthenticated: state.isAuthenticated 
      }), 

      onRehydrateStorage: () => (state) => {
        state.setHasHydrated(true);
      }
    }
  )
);

export default useUserStore;