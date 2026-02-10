import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:5000/api',
    headers: {
        'Content-Type': 'application/json'
    }
});

// Add token to requests
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Auth APIs
export const authAPI = {
    register: (data) => api.post('/auth/register', data),
    login: (data) => api.post('/auth/login', data),
    googleLogin: (credential) => api.post('/auth/google', { id_token: credential }),
    getProfile: () => api.get('/auth/profile')
};

// Chat APIs
export const chatAPI = {
    sendMessage: (message, language = 'id') => api.post('/chat', { message, language }),
    getHistory: () => api.get('/chat/history')
};

// Product APIs
export const productAPI = {
    search: (query) => api.get(`/products/search?q=${query}`),
    getById: (id) => api.get(`/products/${id}`)
};

// Shopping List APIs
export const shoppingListAPI = {
    create: (items) => api.post('/shopping-lists', { items }),
    getAll: () => api.get('/shopping-lists'),
    update: (id, data) => api.put(`/shopping-lists/${id}`, data),
    delete: (id) => api.delete(`/shopping-lists/${id}`)
};

export default api;
