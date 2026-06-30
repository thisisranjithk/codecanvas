import { createContext, useState, useEffect, type ReactNode, useCallback } from "react";
import { mockAuth, type User } from "@/lib/mock-auth";

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const isAuthenticated = !!user;

  useEffect(() => {
    // Restore session
    try {
      const storedUser = localStorage.getItem("auth_user");
      const storedIsAuthenticated = localStorage.getItem("auth_isAuthenticated");

      if (storedUser && storedIsAuthenticated === "true") {
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error("Failed to restore session", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const authenticatedUser = await mockAuth.login(email, password);

    setUser(authenticatedUser);
    localStorage.setItem("auth_user", JSON.stringify(authenticatedUser));
    localStorage.setItem("auth_isAuthenticated", "true");
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem("auth_user");
    localStorage.removeItem("auth_isAuthenticated");
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated, isLoading, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}
