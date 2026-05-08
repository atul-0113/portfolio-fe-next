"use client";

import AuthGuard from "@/app/auth/authGuard";
import DefaultLayout from "@/components/Layouts/DefaultLaout";
import ECommerce from "@/components/Dashboard/E-commerce";
import { useAuth } from "@/app/auth/AuthContext";

const UserDashboard = () => {
  return (
    <div className="mx-auto max-w-5xl">
      <section className="rounded-sm border border-stroke bg-white p-6 shadow-default dark:border-strokedark dark:bg-boxdark md:p-8">
        <h1 className="text-2xl font-bold text-black dark:text-white">
          Dashboard
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-6">
          Use the left panel to open Resume Builder, Template, or Portfolio.
        </p>
      </section>
    </div>
  );
};

const DashboardPage = () => {
  const { user } = useAuth();

  return (
    <AuthGuard>
      <DefaultLayout>
        {user?.role === "ADMIN" ? <ECommerce /> : <UserDashboard />}
      </DefaultLayout>
    </AuthGuard>
  );
};

export default DashboardPage;
