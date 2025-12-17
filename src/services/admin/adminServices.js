import api from "@/lib/axios";

export const adminService = {
  getAllUsers: async () => {
    const response = await api.get("/users");
    return response.data;
  },

  deleteUser: async (id) => {
    const response = await api.delete(`/users/${id}`);
    return response.data;
  },

  getAllBanks: async () => {
    const response = await api.get("/settings/admin-banks");
    return response.data;
  },

  updateBank: async (bankId, data) => {
    const response = await api.put(`/settings/admin-banks/${bankId}`, data);
    return response.data;
  },

  addBank: async (data) => {
    const response = await api.post("/settings/admin-banks", data);
    return response.data;
  },

  deleteBank: async (bankId) => {
    const response = await api.delete(`/settings/admin-banks/${bankId}`);
    return response.data;
  },

  getAdminFee: async () => {
    const response = await api.get("/settings/payment");
    return response.data;
  },

  addFee: async (data) => {
    const response = await api.post("/settings/payment", data);
    return response.data;
  },
};
