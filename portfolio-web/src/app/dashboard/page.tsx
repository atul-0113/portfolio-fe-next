"use client";

import AuthGuard from "@/app/auth/authGuard";
import { useAuth } from "@/app/auth/AuthContext";
import DefaultLayout from "@/components/Layouts/DefaultLaout";
import AdminDashboard from "@/components/Dashboard/AdminDashboard";
import UserDashboard from "@/components/Dashboard/UserDashboard";
import { useDashboard } from "@/hooks/useDashboard";

const DashboardPage = () => {
  const { user } = useAuth();
  const { adminDashboard, error, isLoading, userDashboard } = useDashboard();

  return (
    <AuthGuard>
      <DefaultLayout>
        {error && (
          <div className="mb-6 rounded-lg border border-red bg-red/10 px-4 py-3 text-sm text-red">
            {error}
          </div>
        )}
        {isLoading && (
          <div className="mb-6 rounded-lg border border-[#c7c4d8] bg-white px-5 py-4 text-sm text-[#464555]">
            Loading dashboard...
          </div>
        )}
        {user?.role === "ADMIN" ? (
          <AdminDashboard dashboard={adminDashboard} />
        ) : (
          <UserDashboard dashboard={userDashboard} />
        )}
      </DefaultLayout>
    </AuthGuard>
  );
};

export default DashboardPage;
