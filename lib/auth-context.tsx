"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { User, RegisterData, LoginData } from "@/types/user";
import * as authService from "@/services/auth.service";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  login: (data: LoginData) => Promise<{ success: boolean; message: string }>;
  register: (data: RegisterData) => Promise<{ success: boolean; message: string }>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    loadUser();
  }, []);

  async function loadUser() {
    try {
      setLoading(true);
      const response = await authService.getCurrentUser();

      if (response.success && response.user) {
        setUser(response.user);
      } else {
        try {
          await authService.logout();
        } catch (e) {
          console.error("Error calling logout:", e);
        }
        setUser(null);
        router.replace("/login");
      }
    } catch (err) {
      console.error("Error loading user:", err);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }

  async function login(data: LoginData) {
    try {
      setError(null);
      const response = await authService.login(data);

      if (response.success && response.user) {
        setUser(response.user);
        return { success: true, message: response.message };
      } else {
        setError(response.message);
        return { success: false, message: response.message };
      }
    } catch (err) {
      const message = "Error al iniciar sesión";
      setError(message);
      return { success: false, message };
    }
  }

  async function register(data: RegisterData) {
    try {
      setError(null);
      const response = await authService.register(data);

      if (response.success) {
        return { success: true, message: response.message };
      } else {
        setError(response.message);
        return { success: false, message: response.message };
      }
    } catch (err) {
      const message = "Error al registrar usuario";
      setError(message);
      return { success: false, message };
    }
  }

  async function logout() {
    try {
      await authService.logout();
      setUser(null);
      router.push("/login");
    } catch (err) {
      console.error("Error logging out:", err);
    }
  }

  async function refreshUser() {
    await loadUser();
  }

  const value: AuthContextType = {
    user,
    loading,
    error,
    login,
    register,
    logout,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
