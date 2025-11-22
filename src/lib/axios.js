// src/lib/axios.js
import axios from 'axios';
import dotenv from 'dotenv'

dotenv.config()

const api = axios.create({
  // Baca dari Environment Variable. Kalau tidak ada, baru pakai localhost.
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api',
  withCredentials: true,
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