// components/ProtectedRoute.tsx
"use client";
import React from "react";
import { useAuth } from "@/app/auth/AuthContext";
import { useRouter } from "next/navigation";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRoles: string[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requiredRoles }) => {
  const { user } = useAuth();
  const router = useRouter();

  if (!user) {
    router.push("/auth/signin");
    return null;
  }

  if (!requiredRoles.includes(user.role)) {
    router.push("/");
    return null;
  }

  return <>{children}</>;
};

export default ProtectedRoute;