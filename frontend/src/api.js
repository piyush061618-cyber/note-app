import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL, // Auto-picks the URL from .env or Vercel
  withCredentials: true, // Needed for cookies/sessions
});

export default api;