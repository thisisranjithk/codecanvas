import { createContext, useCallback, type ReactNode, useState, useEffect } from 'react';
import { useRouterState } from '@tanstack/react-router';
import { useMe } from '@/hooks/api/auth/use-me';
import { sessionManager } from '@/lib/session-manager';
import { queryClient, queryKeys } from '@/api';
import type { User } from '@/types';

export type AuthContextType = {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (token: string) => void;
  logout: () => void;
};

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const routerState = useRouterState();
  const isPublicRoute = routerState.location.pathname === '/login' || routerState.location.pathname === '/register';

  const [isInitializing, setIsInitializing] = useState(!isPublicRoute);

  useEffect(() => {
    if (isPublicRoute) {
      setIsInitializing(false);
      return;
    }

    if (!sessionManager.getToken()) {
      setIsInitializing(true);
      sessionManager.refreshToken()
        .catch(() => {
          // Token refresh failed, route guard will redirect
        })
        .finally(() => {
          setIsInitializing(false);
        });
    } else {
      setIsInitializing(false);
    }
  }, [isPublicRoute]);

  const { data: meData, isPending: isMePending } = useMe({
    enabled: !isInitializing && !!sessionManager.getToken(),
  });

  const user = meData?.data?.user ?? null;
  const isAuthenticated = !!user;
  
  // Loading represents either session restoration OR initial ME fetch
  const isLoading = isInitializing || (isMePending && !!sessionManager.getToken());

  const login = useCallback((token: string) => {
    sessionManager.setToken(token);
    queryClient.invalidateQueries({ queryKey: queryKeys.auth.me() });
  }, []);

  const logout = useCallback(() => {
    sessionManager.clearSession();
  }, []);

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
