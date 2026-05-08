"use client";

import Image from "next/image";
import Link from "next/link";
import {
  FiBarChart2,
  FiCloud,
  FiDatabase,
  FiServer,
} from "react-icons/fi";

const growthBars = [38, 52, 44, 66, 56, 80, 70, 90, 94];

const healthRows = [
  { label: "API Infrastructure", value: "12ms", icon: <FiServer size={22} /> },
  { label: "AI Training Cluster", value: "94% load", danger: true, icon: <FiDatabase size={22} /> },
  { label: "CDN Delivery", value: "100% up", icon: <FiCloud size={22} /> },
];

const adminActions = [
  { admin: "Marcus K.", initials: "MK", action: "Update Permissions", target: "User ID: 829-X", time: "2m ago" },
  { admin: "Sarah L.", initials: "SL", action: "Flush Cache", target: "Global CDN", time: "14m ago" },
  { admin: "Alex J.", initials: "AJ", action: "Ban Account", target: "User: SpamBot22", time: "32m ago", danger: true },
  { admin: "Marcus K.", initials: "MK", action: "Modify Tier", target: "Enterprise #04", time: "1h ago" },
  { admin: "Sarah L.", initials: "SL", action: "Deploy Build", target: "Production v4.2", time: "2h ago" },
];

const AdminDashboard = () => {
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
              <p className="mt-2 text-4xl font-semibold text-[#191c1d]">124,592</p>
            </div>
            <span className="rounded bg-[#e2dfff] px-4 py-2 text-sm font-medium text-[#3525cd]">
              ↗ +12%
            </span>
          </div>
          <div className="flex h-44 items-end gap-2">
            {growthBars.map((height, index) => (
              <div
                key={`${height}-${index}`}
                className="flex-1 rounded-t bg-[#3525cd]"
                style={{ height: `${height}%`, opacity: 0.18 + index * 0.09 }}
              />
            ))}
          </div>
        </article>

        <article className="flex flex-col justify-between rounded-lg border border-[#c7c4d8] bg-white p-8">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.12em] text-[#191c1d]">
              Active Portfolios
            </p>
            <p className="mt-2 text-3xl font-semibold text-[#191c1d]">84,203</p>
          </div>
          <div>
            <div className="mb-3 flex justify-between text-sm text-[#191c1d]">
              <span>Capacity Used</span>
              <span>68%</span>
            </div>
            <div className="h-2 rounded bg-[#e1e3e4]">
              <div className="h-2 w-[68%] rounded bg-[#3525cd]" />
            </div>
          </div>
        </article>

        <article className="flex flex-col justify-between rounded-lg border border-[#c7c4d8] bg-white p-8">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.12em] text-[#191c1d]">
              Resumes Built
            </p>
            <p className="mt-2 text-3xl font-semibold text-[#191c1d]">312.4k</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex -space-x-3">
              <span className="h-9 w-9 rounded-lg bg-[#dae2fd]" />
              <span className="h-9 w-9 rounded-lg bg-[#a44100]" />
              <span className="h-9 w-9 rounded-lg bg-[#4f46e5]" />
            </div>
            <span className="text-sm text-[#464555]">+4k today</span>
          </div>
        </article>
      </section>

      <section className="grid gap-6 xl:grid-cols-[0.9fr_1.9fr]">
        <div className="space-y-6">
          <article className="rounded-lg border border-[#c7c4d8] bg-white p-8">
            <div className="mb-8 flex items-start justify-between">
              <h2 className="text-2xl font-semibold text-[#191c1d]">Platform Health</h2>
              <p className="max-w-28 text-sm font-medium text-[#3525cd]">
                ● All systems nominal
              </p>
            </div>
            <div className="divide-y divide-[#c7c4d8]">
              {healthRows.map((row) => (
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

          <div className="divide-y divide-[#c7c4d8]">
            {adminActions.map((item, index) => (
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
                    {item.initials}
                  </span>
                  <span className="text-base text-[#191c1d]">{item.admin}</span>
                </div>
                <span>
                  <span className="rounded bg-[#e1e3e4] px-3 py-1 text-sm text-[#464555]">
                    {item.action}
                  </span>
                </span>
                <span className={item.danger ? "text-[#ba1a1a]" : "text-[#191c1d]"}>
                  {item.target}
                </span>
                <span className="text-sm text-[#464555]">{item.time}</span>
              </div>
            ))}
          </div>
        </article>
      </section>
    </>
  );
};

export default AdminDashboard;
