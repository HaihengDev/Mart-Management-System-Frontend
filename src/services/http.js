import axios from 'axios';
import { getToken } from '../utils/storage';

export const http = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8888/api',
  headers: {
    'Cache-Control': 'no-cache',
    Pragma: 'no-cache',
  },
});

http.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
