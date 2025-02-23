// authGuard.tsx (or authGuard.ts)
"use client";
import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from './AuthContext'; // Replace with your authentication context

const AuthGuard = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const pathname = usePathname();
  const { user, isLoading } = useAuth(); // Assuming your auth context provides user and isLoading
  useEffect(() => {
    if (!isLoading) {
      // Check if the current route is the sign-in or sign-up page
      const isAuthPage = pathname === '/signin' || pathname === '/signup';
        
      if (!user && !isAuthPage) {
        // Redirect to signin if not authenticated and not on signin/signup
        router.push('/auth/signin');
      } else if (user && isAuthPage) {
        // Redirect to dashboard if authenticated and on signin/signup
        router.push('/'); // Or your desired default route
      }
    }
  }, [user, isLoading, router, pathname]);
 
  // Render children only when authentication check is complete
  if (isLoading) {
    // Optionally render a loading indicator while authentication is in progress
    return <div>Loading...</div>;
  }

  // If user is null and path is signin/signup or user is not null and path is not signin/signup, render children
  return <>{children}</>;
};

export default AuthGuard;