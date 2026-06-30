import { createContext, useCallback, type ReactNode } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useLogin, useMe } from '@/hooks/api/auth';
import { authStorage } from '@/lib/auth-storage';
import { queryClient } from '@/api';
import type { User } from '@/types';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const navigate = useNavigate();
  const { data: meData, isLoading: isMeLoading } = useMe();
  const loginMutation = useLogin();

  const user = meData?.data?.user ?? null;
  const isAuthenticated = !!user;
  const isLoading = !!authStorage.getToken() && isMeLoading;

  const login = useCallback(
    async (email: string, password: string) => {
      const response = await loginMutation.mutateAsync({ email, password });
      authStorage.setToken(response.data.accessToken);
      await queryClient.invalidateQueries({ queryKey: ['auth'] });
    },
    [loginMutation],
  );

  const logout = useCallback(() => {
    authStorage.removeToken();
    queryClient.clear();
    navigate({ to: '/login' });
  }, [navigate]);

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated, isLoading, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}
