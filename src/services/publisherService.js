import api from './api';

export const publisherService = {
  getAll: () => api.get('/publishers'),
  getById: (id) => api.get(`/publishers/${id}`),
  create: (data) => api.post('/publishers', data),
  update: (id, data) => api.put(`/publishers/${id}`, data),
  delete: (id) => api.delete(`/publishers/${id}`),
};