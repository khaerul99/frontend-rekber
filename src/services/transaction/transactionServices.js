import api from "@/lib/axios";

export const transactionService = {
  // ==========================
  // GENERAL / USER ACTIONS
  // ==========================

  getAllTransactions: async () => {
    const response = await api.get("/transactions/all");
    return response.data;
  },

  getMyTransactions: async () => {
    const response = await api.get("/transactions/my-transactions");
    return response.data;
  },

  createTransaction: async (data) => {
    const response = await api.post("/transactions/create-transaction", data);
    return response.data;
  },

  getTransactionById: async (id) => {
    const response = await api.get(`/transactions/${id}`);
    return response.data;
  },

  uploadPaymentProof: async (transactionId, formData) => {
    const response = await api.post(
      `/transactions/${transactionId}/upload-proof`,
      formData
    );
    return response.data;
  },

  updateResi: async (id, trackingNumber) => {
    const response = await api.patch(`/transactions/${id}/sent`, {
      trackingNumber,
    });
    return response.data;
  },

  completeOrder: async (id) => {
    const response = await api.patch(`/transactions/${id}/complete`);
    return response.data;
  },

  uploadReturnProof: async (id, formData) => {
    const response = await api.patch(
      `/transactions/${id}/return-send`,
      formData
    );
    return response.data;
  },

  submitDispute: async (id, reason) => {
    const response = await api.patch(`/transactions/${id}/dispute`, { reason });
    return response.data;
  },

  createReview: async (data) => {
    const response = await api.post("/reviews", data);
    return response.data;
  },

  // ==========================
  // ADMIN ACTIONS (REKBER)
  // ==========================

  getVerifyingList: async () => {
    const response = await api.get("/transactions/admin/verifying");
    return response.data;
  },

  verifyPayment: async (id) => {
    const response = await api.patch(`/transactions/${id}/verify`);
    return response.data;
  },

  rejectPayment: async (id) => {
    const response = await api.patch(`/transactions/${id}/reject`);
    return response.data;
  },

  getDisbursements: async () => {
    const response = await api.get("/transactions/admin/disbursement");
    return response.data;
  },

  getRefunds: async () => {
    const response = await api.get("/transactions/admin/refunds");
    return response.data;
  },

  getDisputes: async () => {
    const response = await api.get("/transactions/admin/disputes");
    return response.data;
  },

  disburse: async (transactionId, formData) => {
    const response = await api.patch(
      `/transactions/${transactionId}/disburse`,
      formData
    );
    return response.data;
  },

  refund: async (transactionId, formData) => {
    const response = await api.patch(
      `/transactions/${transactionId}/refund`,
      formData
    );
    return response.data;
  },

  resolveDispute: async (transactionId, data) => {
    const response = await api.post(
      `/transactions/admin/disputes/${transactionId}/resolve`,
      data
    );
    return response.data;
  },
};
