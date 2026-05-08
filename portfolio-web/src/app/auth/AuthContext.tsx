// contexts/AuthContext.tsx
"use client";
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import * as authService from '@/services/authService';
import { ApiUser } from '@/types/api';

type User = ApiUser & { token: string };

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<User>;
  signUp: (name: string, email: string, password: string) => Promise<User>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        try {
          setUser(JSON.parse(storedUser));
        } catch {
          localStorage.removeItem('user');
          localStorage.removeItem('token');
        }
      }

      setIsLoading(false);
    };

    checkAuth();
  }, []);

  const signIn = async (email: string, password: string) => {
    const data = await authService.login(email, password);
    localStorage.setItem('user', JSON.stringify(data.user));
    localStorage.setItem('token', data.user.token);
    setUser(data.user);
    router.push('/dashboard');
    return data.user;
  };

  const signUp = async (name: string, email: string, password: string) => {
    const data = await authService.register(name, email, password);
    localStorage.setItem('user', JSON.stringify(data.user));
    localStorage.setItem('token', data.user.token);
    setUser(data.user);
    router.push('/dashboard');
    return data.user;
  };

  const signOut = async () => {
    try {
      await authService.logout();
    } catch {
      // Local sign-out should still complete if the backend is unavailable.
    }
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    setUser(null);

    if (typeof window !== 'undefined') {
      window.location.replace('/auth/signin');
      return;
    }

    router.replace('/auth/signin');
  };

  const value: AuthContextType = {
    user,
    isLoading,
    signIn,
    signUp,
    signOut,
  };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
