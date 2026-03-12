"use client";
import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";
import { api, User } from "@/lib/api";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, otp: string) => Promise<void>;
  logout: () => Promise<void>;
  isRole: (...roles: string[]) => boolean;
  canAccess: (module: string) => boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

// Module access by role
const MODULE_ACCESS: Record<string, string[]> = {
  dashboard: ['EMPLOYEE', 'MANAGER', 'HR', 'ADMIN'],
  attendance: ['EMPLOYEE', 'MANAGER', 'HR', 'ADMIN'],
  directory: ['EMPLOYEE', 'MANAGER', 'HR', 'ADMIN'],
  leaves: ['EMPLOYEE', 'MANAGER', 'HR', 'ADMIN'],
  approvals: ['MANAGER', 'HR', 'ADMIN'],
  documents: ['EMPLOYEE', 'MANAGER', 'HR', 'ADMIN'],
  users: ['ADMIN'],
  onboarding: ['EMPLOYEE', 'MANAGER', 'HR', 'ADMIN'],
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (stored) {
      try { setUser(JSON.parse(stored)); } catch {}
    }
    const { accessToken } = api.getTokens();
    if (accessToken) {
      api.getMe().then((u) => {
        setUser(u);
        localStorage.setItem('user', JSON.stringify(u));
      }).catch(() => {
        api.clearTokens();
        setUser(null);
      }).finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = useCallback(async (email: string, otp: string) => {
    const result = await api.verifyOtp(email, otp);
    api.setTokens(result.accessToken, result.refreshToken);
    localStorage.setItem('user', JSON.stringify(result.user));
    setUser(result.user);
  }, []);

  const logout = useCallback(async () => {
    await api.logout();
    setUser(null);
    window.location.href = '/login';
  }, []);

  const isRole = useCallback((...roles: string[]) => {
    if (!user) return false;
    return roles.includes(user.role);
  }, [user]);

  const canAccess = useCallback((module: string) => {
    if (!user) return false;
    const allowed = MODULE_ACCESS[module] || [];
    return allowed.includes(user.role);
  }, [user]);

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, isRole, canAccess }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}
