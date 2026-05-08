// authGuard.tsx (or authGuard.ts)
"use client";
import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from './AuthContext';

const AuthGuard = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const pathname = usePathname();
  const { user, isLoading } = useAuth();
  useEffect(() => {
    if (!isLoading) {
      const isAuthPage = pathname === '/auth/signin' || pathname === '/auth/signup';
        
      if (!user && !isAuthPage) {
        // Redirect to signin if not authenticated and not on signin/signup
        router.replace('/auth/signin');
      } else if (user && isAuthPage) {
        router.replace('/dashboard');
      }
    }
  }, [user, isLoading, router, pathname]);
 
  // Render children only when authentication check is complete
  if (isLoading) {
    return <div>Loading...</div>;
  }

  return <>{children}</>;
};

export default AuthGuard;
