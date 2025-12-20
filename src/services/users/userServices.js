import api from "@/lib/axios";

export const userService = {
  
  getProfile: async () => {
    const response = await api.get("/users/me");
    return response.data;
  },

  getUserById: async (id) => {
    const response = await api.get(`/users/${id}`);
    return response.data;
  },

  updateUser: async (data) => {
    const response = await api.put("/users/update", data);
    return response.data;
  },

  updatePassword: async (data) => {
    const response = await api.put("/users/change-password", data);
    return response.data;
  },

  savePin: async (data) => {
    const response = await api.put("/users/pin", data);
    return response.data;
  },

 
};
