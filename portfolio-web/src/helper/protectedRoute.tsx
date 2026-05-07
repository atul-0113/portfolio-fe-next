// components/ProtectedRoute.tsx
"use client";
import React, { useEffect } from "react";
import { useAuth } from "@/app/auth/AuthContext";
import { useRouter } from "next/navigation";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRoles: string[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requiredRoles }) => {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) {
      return;
    }

    if (!user) {
      router.replace("/auth/signin");
      return;
    }

    if (!requiredRoles.includes(user.role)) {
      router.replace("/");
    }
  }, [isLoading, requiredRoles, router, user]);

  if (isLoading || !user || !requiredRoles.includes(user.role)) {
    return null;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
