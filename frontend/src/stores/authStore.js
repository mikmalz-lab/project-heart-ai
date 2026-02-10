import { create } from 'zustand';
import { authAPI } from '../services/api';

export const useAuthStore = create((set) => ({
    user: null,
    token: localStorage.getItem('token'),
    isAuthenticated: false,
    isLoading: false,

    login: async (email, password) => {
        set({ isLoading: true });
        try {
            const { data } = await authAPI.login({ email, password });
            localStorage.setItem('token', data.token);
            set({ user: data.user, token: data.token, isAuthenticated: true, isLoading: false });
        } catch (error) {
            set({ isLoading: false });
            throw error;
        }
    },

    loginGoogle: async (credential) => {
        set({ isLoading: true });
        try {
            const { data } = await authAPI.googleLogin(credential);
            localStorage.setItem('token', data.token);
            set({ user: data.user, token: data.token, isAuthenticated: true, isLoading: false });
        } catch (error) {
            set({ isLoading: false });
            throw error;
        }
    },

    logout: () => {
        localStorage.removeItem('token');
        set({ user: null, token: null, isAuthenticated: false });
    },

    checkAuth: async () => {
        const token = localStorage.getItem('token');
        if (!token) return;

        try {
            const { data } = await authAPI.getProfile();
            set({ user: data, isAuthenticated: true });
        } catch (error) {
            localStorage.removeItem('token');
            set({ user: null, token: null, isAuthenticated: false });
        }
    }
}));
