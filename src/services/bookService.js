import api from './api';

export const bookService = {
  getAll: () => api.get('/books'),
  getStats: () => api.get('/books/stats'),
  getById: (id) => api.get(`/books/${id}`),
  create: (data) => api.post('/books', data),
  update: (id, data) => api.put(`/books/${id}`, data),
  updateStock: (id, stock) => api.put(`/books/${id}/stock`, { stock }),
  delete: (id) => api.delete(`/books/${id}`),
};