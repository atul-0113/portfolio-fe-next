"use client";

import Image from "next/image";
import Link from "next/link";
import {
  FiCloud,
  FiDatabase,
  FiServer,
} from "react-icons/fi";
import NoData from "@/components/NoData";
import { DashboardAdminAction } from "@/types/api";

interface AdminDashboardProps {
  dashboard?: {
    totalUsers: string;
    activeUsers: string;
    adminUsers: string;
    totalCategories: string;
    activeCategories: string;
    inactiveCategories: string;
    totalTemplates: string;
    activeTemplates: string;
    activePortfolios: string;
    resumesBuilt: string;
    capacityUsed: number;
    usersGrowth: string;
    portfoliosToday: string;
    growthBars: number[];
    platformStatus: string;
    apiInfrastructure: string;
    aiTrainingCluster: string;
    cdnDelivery: string;
    recentAdminActions?: DashboardAdminAction[];
  };
}

const AdminDashboard = ({ dashboard }: AdminDashboardProps) => {
  const dashboardGrowthBars = dashboard?.growthBars ?? [];
  const totalCategories = Number(dashboard?.totalCategories?.replace(/,/g, ""));
  const activeCategories = Number(dashboard?.activeCategories?.replace(/,/g, ""));
  const activeCategoryPercent =
    Number.isFinite(totalCategories) && totalCategories > 0 && Number.isFinite(activeCategories)
      ? (activeCategories / totalCategories) * 100
      : 0;
  const dashboardHealthRows = [
    { label: "Active Users", value: dashboard?.activeUsers || "--", icon: <FiServer size={22} /> },
    { label: "Admin Users", value: dashboard?.adminUsers || "--", icon: <FiDatabase size={22} /> },
    {
      label: "Inactive Categories",
      value: dashboard?.inactiveCategories || "--",
      danger: Number(dashboard?.inactiveCategories || 0) > 0,
      icon: <FiCloud size={22} />,
    },
  ];
  const dashboardAdminActions = dashboard?.recentAdminActions ?? [];

  return (
    <>
      <section className="mb-12">
        <h1 className="text-4xl font-semibold tracking-[-0.02em] text-[#191c1d]">
          Platform Overview
        </h1>
        <p className="mt-4 text-xl text-[#464555]">
          Real-time health and performance metrics for PortfolioPro.
        </p>
      </section>

      <section className="mb-12 grid gap-6 xl:grid-cols-[1.7fr_0.8fr_0.8fr]">
        <article className="rounded-lg border border-[#c7c4d8] bg-white p-8">
          <div className="mb-10 flex items-start justify-between">
            <div>
              <p className="text-sm font-medium uppercase tracking-[0.12em] text-[#191c1d]">
                Total Users
              </p>
              <p className="mt-2 text-4xl font-semibold text-[#191c1d]">{dashboard?.totalUsers || "--"}</p>
            </div>
            <span className="rounded bg-[#e2dfff] px-4 py-2 text-sm font-medium text-[#3525cd]">
              Active {dashboard?.activeUsers || "--"}
            </span>
          </div>
          {dashboardGrowthBars.length ? (
            <div className="flex h-44 items-end gap-2">
              {dashboardGrowthBars.map((height, index) => (
                <div
                  key={`${height}-${index}`}
                  className="flex-1 rounded-t bg-[#3525cd]"
                  style={{ height: `${height}%`, opacity: 0.18 + index * 0.09 }}
                />
              ))}
            </div>
          ) : (
            <NoData
              className="min-h-44"
              description="Analytics bars will appear when the dashboard API provides chart data."
              title="No chart data"
            />
          )}
        </article>

        <article className="flex flex-col justify-between rounded-lg border border-[#c7c4d8] bg-white p-8">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.12em] text-[#191c1d]">
              Categories
            </p>
            <p className="mt-2 text-3xl font-semibold text-[#191c1d]">{dashboard?.totalCategories || "--"}</p>
          </div>
          <div>
            <div className="mb-3 flex justify-between text-sm text-[#191c1d]">
              <span>Active</span>
              <span>{dashboard?.activeCategories || "--"}</span>
            </div>
            <div className="h-2 rounded bg-[#e1e3e4]">
              <div
                className="h-2 rounded bg-[#3525cd]"
                style={{ width: `${activeCategoryPercent}%` }}
              />
            </div>
          </div>
        </article>

        <article className="flex flex-col justify-between rounded-lg border border-[#c7c4d8] bg-white p-8">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.12em] text-[#191c1d]">
              Templates
            </p>
            <p className="mt-2 text-3xl font-semibold text-[#191c1d]">{dashboard?.totalTemplates || "--"}</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex -space-x-3">
              <span className="h-9 w-9 rounded-lg bg-[#dae2fd]" />
              <span className="h-9 w-9 rounded-lg bg-[#a44100]" />
              <span className="h-9 w-9 rounded-lg bg-[#4f46e5]" />
            </div>
            <span className="text-sm text-[#464555]">{dashboard?.activeTemplates || "--"} active</span>
          </div>
        </article>
      </section>

      <section className="grid gap-6 xl:grid-cols-[0.9fr_1.9fr]">
        <div className="space-y-6">
          <article className="rounded-lg border border-[#c7c4d8] bg-white p-8">
            <div className="mb-8 flex items-start justify-between">
              <h2 className="text-2xl font-semibold text-[#191c1d]">Platform Health</h2>
              <p className="max-w-28 text-sm font-medium text-[#3525cd]">
                ● {dashboard?.platformStatus || "--"}
              </p>
            </div>
            <div className="divide-y divide-[#c7c4d8]">
              {dashboardHealthRows.map((row) => (
                <div key={row.label} className="flex items-center justify-between py-5">
                  <div className="flex items-center gap-4">
                    {row.icon}
                    <span className="text-base text-[#191c1d]">{row.label}</span>
                  </div>
                  <span className={row.danger ? "text-[#7e3000]" : "text-[#191c1d]"}>
                    {row.value}
                  </span>
                </div>
              ))}
            </div>
          </article>

          <article className="relative overflow-hidden rounded-lg border border-[#c7c4d8] bg-[#191c1d]">
            <div className="relative h-60">
              <Image
                src="/images/product/product-02.png"
                alt="Infrastructure update"
                fill
                className="object-cover opacity-70"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#3525cd] to-transparent" />
              <div className="absolute bottom-7 left-7 right-7 text-white">
                <h2 className="text-2xl font-semibold">Infrastructure Update v4.2</h2>
                <p className="mt-1 text-base text-[#f0f1f2]">
                  New edge nodes deployed in SE Asia.
                </p>
              </div>
            </div>
          </article>
        </div>

        <article className="rounded-lg border border-[#c7c4d8] bg-white p-8">
          <div className="mb-8 flex items-center justify-between">
            <h2 className="text-2xl font-semibold text-[#191c1d]">Recent Admin Actions</h2>
            <Link href="/user-management" className="text-base font-medium text-[#3525cd]">
              View All Logs
            </Link>
          </div>

          <div className="grid grid-cols-[0.8fr_0.8fr_1fr_0.5fr] border-b border-[#c7c4d8] pb-4 text-sm font-semibold text-[#464555]">
            <span>Administrator</span>
            <span>Action</span>
            <span>Target</span>
            <span>Timestamp</span>
          </div>

          {dashboardAdminActions.length ? (
            <div className="divide-y divide-[#c7c4d8]">
              {dashboardAdminActions.map((item, index) => (
                <div
                  key={`${item.admin}-${item.action}-${index}`}
                  className="grid grid-cols-[0.8fr_0.8fr_1fr_0.5fr] items-center py-5"
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold ${
                        item.danger ? "bg-[#ffdbcc]" : "bg-[#e2dfff]"
                      }`}
                    >
                      {item.initials || "--"}
                    </span>
                    <span className="text-base text-[#191c1d]">{item.admin || "--"}</span>
                  </div>
                  <span>
                    <span className="rounded bg-[#e1e3e4] px-3 py-1 text-sm text-[#464555]">
                      {item.action || "--"}
                    </span>
                  </span>
                  <span className={item.danger ? "text-[#ba1a1a]" : "text-[#191c1d]"}>
                    {item.target || "--"}
                  </span>
                  <span className="text-sm text-[#464555]">{item.time || item.timestamp || "--"}</span>
                </div>
              ))}
            </div>
          ) : (
            <NoData
              className="mt-6 min-h-52"
              description="Admin activity will appear here when the dashboard API returns log data."
              title="No admin actions"
            />
          )}
        </article>
      </section>
    </>
  );
};

export default AdminDashboard;
