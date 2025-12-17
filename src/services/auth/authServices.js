import api from "@/lib/axios";

export const authService = {
  login: async (credentials) => {
    const response = await api.post("/auth/login", credentials);
    return response.data;
  },

  register: async (userInfo) => {
    const response = await api.post("/auth/register", userInfo);
    return response.data;
  },

  verifyEmail: async (token) => {
    const response = await api.post("/auth/verify-email", { token });
    return response.data;
  },

  setup2FA: async () => {
    const response = await api.post("/auth/2fa/setup");
    return response.data;
  },

  verify2FA: async (otpCode) => {
    const response = await api.post("/auth/2fa/verify", { otp: otpCode });
    return response.data;
  },

};

export const passwordService = {
  forgotPassword: async (email) => {
    const response = await api.post("/auth/forgot-password", { email });
    return response.data;
  },

  resetPassword: async (token, data) => {
    const response = await api.put(`/auth/reset-password/${token}`, data);
    return response.data;
  },
};

