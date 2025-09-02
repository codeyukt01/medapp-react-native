import { useAuthStore } from '../store';

// Utility function to manually logout user (for testing)
export const manualLogout = () => {
  const { logout } = useAuthStore.getState();
  logout();
  // The axios interceptor will handle navigation
};

