// src/lib/axios.js
import axios from 'axios';

const api = axios.create({
  // baseURL: 'http://localhost:5000/api', 
  baseURL: 'https://backend-rekber-production.up.railway.app', 
  withCredentials: true, // Agar cookie/header aman
});

// Interceptor: Otomatis tempel Token di setiap request jika ada
api.interceptors.request.use((config) => {
  // Kita akan simpan token di localStorage nanti
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;