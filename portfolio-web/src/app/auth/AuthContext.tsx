// contexts/AuthContext.tsx
"use client";
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';

// Define the type for the user object
interface User {
  uid: string;
  email: string | null;
  // Add other user properties as needed
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  // Add other auth-related functions as needed
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
    // Check for authentication state on mount (e.g., from localStorage, cookies, or an API)
    const checkAuth = async () => {
      // Implement your authentication check here (e.g., using Firebase, Supabase, etc.)
      // Example using localStorage (replace with your actual auth logic):
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }

      setIsLoading(false);
    };

    checkAuth();
  }, []);

  const signIn = async (email: string, password: string) => {
    console.log(email,password,"Pass")
    // Implement your sign-in logic here (e.g., using Firebase, Supabase, etc.)
    // Example using localStorage (replace with your actual auth logic):
    const fakeUser = { uid: '1', email , password }; // Replace with actual user data
    localStorage.setItem('user', JSON.stringify(fakeUser));
    setUser(fakeUser);
    router.push('/'); // Redirect after sign-in
  };

  const signUp = async (email: string, password: string) => {
    // Implement your sign-up logic here (e.g., using Firebase, Supabase, etc.)
    // Example using localStorage (replace with your actual auth logic):
    const fakeUser = { uid: 'fakeUserId', email }; // Replace with actual user data
    // localStorage.setItem('user', JSON.stringify(fakeUser));
    // setUser(fakeUser);
    router.push('/'); // Redirect after sign-up
  };

  const signOut = async () => {
    // Implement your sign-out logic here (e.g., using Firebase, Supabase, etc.)
    // Example using localStorage (replace with your actual auth logic):
    localStorage.removeItem('user');
    setUser(null);
    router.push('/auth/signin'); // Redirect after sign-out
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