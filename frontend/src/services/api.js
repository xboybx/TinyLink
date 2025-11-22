import axios from 'axios';

const API_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const linkService = {
  createLink: async (targetUrl, code) => {
    const response = await api.post('/api/links', { targetUrl, code });
    return response.data;
  },

  getLinks: async () => {
    const response = await api.get('/api/links');
    return response.data;
  },

  getLinkStats: async (code) => {
    const response = await api.get(`/api/links/${code}`);
    return response.data;
  },

  deleteLink: async (code) => {
    await api.delete(`/api/links/${code}`);
  },

  healthCheck: async () => {
    const response = await api.get('/healthz');
    return response.data;
  }
};

export default api;