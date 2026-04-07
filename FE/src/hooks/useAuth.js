import { useAuthContext } from '@/contexts/AuthContext';

/**
 * useAuth – shortcut hook để lấy auth state
 * Usage: const { user, permissions, login, logout } = useAuth();
 */
export const useAuth = () => useAuthContext();
