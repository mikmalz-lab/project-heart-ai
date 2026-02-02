import { create } from 'zustand';
import { chatAPI } from '../services/api';

export const useChatStore = create((set, get) => ({
    messages: [],
    isLoading: false,
    language: 'id',

    sendMessage: async (message) => {
        const userMessage = { role: 'user', content: message, timestamp: new Date() };
        set({ messages: [...get().messages, userMessage], isLoading: true });

        const startTime = Date.now();

        try {
            const { data } = await chatAPI.sendMessage(message, get().language);
            const endTime = Date.now();
            const duration = Math.round((endTime - startTime) / 1000); // Duration in seconds

            const aiMessage = {
                role: 'assistant',
                content: data.response,
                timestamp: new Date(),
                thoughtDuration: duration
            };
            set({ messages: [...get().messages, aiMessage], isLoading: false });
        } catch (error) {
            set({ isLoading: false });
            console.error('Chat error:', error);
            // Optional: Add error message to chat
            const errorMessage = { role: 'assistant', content: "Maaf, terjadi kesalahan. Silakan coba lagi.", timestamp: new Date() };
            set({ messages: [...get().messages, errorMessage], isLoading: false });
        }
    },

    loadHistory: async () => {
        set({ isLoading: true });
        try {
            const { data } = await chatAPI.getHistory();
            set({ messages: data, isLoading: false });
        } catch (error) {
            console.error("Failed to load history", error);
            set({ isLoading: false });
        }
    },

    setLanguage: (lang) => set({ language: lang }),
    clearMessages: () => set({ messages: [] })
}));
