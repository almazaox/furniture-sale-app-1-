import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { mockUsers } from '@/mocks/users';
import { useLanguageStore } from './languageStore';

export interface User {
  id: string;
  email: string;
  name: string;
  notificationsEnabled?: boolean;
  role?: 'admin' | 'moderator' | 'visitor';
}

interface AuthState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  updateUser: (updatedUser: User) => Promise<void>;
  logout: () => void;
  clearError: () => void;
  isAdmin: () => boolean;
  isModerator: () => boolean;
  hasAdminAccess: () => boolean;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isLoading: false,
      error: null,
      isAuthenticated: false,

      login: async (email: string, password: string) => {
        set({ isLoading: true, error: null });
        
        try {
          // Simulate API call
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          // Mock authentication
          const user = mockUsers.find(u => u.email === email);
          
          if (user && (email === "user@example.com" || email === "admin@example.com" || email === "moderator@example.com") && password === "password") {
            set({ user, isAuthenticated: true, isLoading: false });
          } else {
            const t = useLanguageStore.getState().t;
            set({ error: t('invalidCredentials'), isLoading: false });
          }
        } catch (error) {
          set({ error: "Login failed. Please try again.", isLoading: false });
        }
      },

      register: async (email: string, password: string, name: string) => {
        set({ isLoading: true, error: null });
        
        try {
          // Simulate API call
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          // Check if email already exists
          if (mockUsers.some(u => u.email === email)) {
            const t = useLanguageStore.getState().t;
            set({ error: t('emailInUse'), isLoading: false });
            return;
          }
          
          // Mock registration
          const newUser = {
            id: `user-${Date.now()}`,
            email,
            name,
            notificationsEnabled: false,
            role: 'visitor' as const // Default role for new users
          };
          
          set({ user: newUser, isAuthenticated: true, isLoading: false });
        } catch (error) {
          set({ error: "Registration failed. Please try again.", isLoading: false });
        }
      },

      updateUser: async (updatedUser: User) => {
        set({ isLoading: true, error: null });
        
        try {
          // Simulate API call
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          // Update user
          set({ user: updatedUser, isLoading: false });
        } catch (error) {
          const t = useLanguageStore.getState().t;
          set({ error: t('updateFailed'), isLoading: false });
        }
      },

      logout: () => {
        set({ user: null, isAuthenticated: false });
      },

      clearError: () => {
        set({ error: null });
      },
      
      isAdmin: () => {
        const { user } = get();
        return user?.role === 'admin';
      },
      
      isModerator: () => {
        const { user } = get();
        return user?.role === 'moderator';
      },
      
      hasAdminAccess: () => {
        const { user } = get();
        return user?.role === 'admin' || user?.role === 'moderator';
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);