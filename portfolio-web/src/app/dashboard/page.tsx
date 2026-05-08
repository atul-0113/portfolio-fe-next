"use client";

import AuthGuard from "@/app/auth/authGuard";
import { useAuth } from "@/app/auth/AuthContext";
import DefaultLayout from "@/components/Layouts/DefaultLaout";
import AdminDashboard from "@/components/Dashboard/AdminDashboard";
import UserDashboard from "@/components/Dashboard/UserDashboard";

const DashboardPage = () => {
  const { user } = useAuth();

  return (
    <AuthGuard>
      <DefaultLayout>
        {user?.role === "ADMIN" ? <AdminDashboard /> : <UserDashboard />}
      </DefaultLayout>
    </AuthGuard>
  );
};

export default DashboardPage;
