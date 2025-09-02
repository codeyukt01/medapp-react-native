import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  userid: string;
  userType: string;
  name: string;
  phone: string;
  // Add other fields as needed
}

interface AuthState {
  user: User | null;
  token: string | null;
  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
  reset: () => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      setUser: (user) => set({ user }),
      setToken: (token) => set({ token }),
      reset: () => set({ user: null, token: null }),
      logout: () => {
        // Clear auth state
        set({ user: null, token: null });
        console.log('🔌 Logout: Auth state cleared');
      },
    }),
    {
      name: 'auth-storage', // storage key
    }
  )
); 