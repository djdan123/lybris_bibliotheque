import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

// Récupérer le token du localStorage
const getToken = () => {
  const user = JSON.parse(localStorage.getItem('currentUser'));
  return user?.token || null;
};

// Créer l'instance axios
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Intercepteur pour ajouter le token à chaque requête
api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Intercepteur de réponse pour gérer les erreurs d'authentification
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token invalide ou expiré : déconnecter l'utilisateur
      localStorage.removeItem('currentUser');
      // Rediriger vers la page de login
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Services API
export const authService = {
  register: (userData) => api.post('/auth/register', userData),
  login: (credentials) => api.post('/auth/login', credentials),
  getProfile: () => api.get('/auth/profile'),
  updateProfile: (data) => api.put('/auth/profile', data),
};

export const bookService = {
  getAll: () => api.get('/books'),
  getStats: () => api.get('/books/stats'),
  getById: (id) => api.get(`/books/${id}`),
  create: (data) => api.post('/books', data),
  update: (id, data) => api.put(`/books/${id}`, data),
  updateStock: (id, stock) => api.put(`/books/${id}/stock`, { stock }),
  delete: (id) => api.delete(`/books/${id}`),
};

export const authorService = {
  getAll: () => api.get('/authors'),
  getById: (id) => api.get(`/authors/${id}`),
  create: (data) => api.post('/authors', data),
  update: (id, data) => api.put(`/authors/${id}`, data),
  delete: (id) => api.delete(`/authors/${id}`),
};

export const publisherService = {
  getAll: () => api.get('/publishers'),
  getById: (id) => api.get(`/publishers/${id}`),
  create: (data) => api.post('/publishers', data),
  update: (id, data) => api.put(`/publishers/${id}`, data),
  delete: (id) => api.delete(`/publishers/${id}`),
};

export default api;