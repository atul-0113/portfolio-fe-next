"use client";

import Image from "next/image";
import Link from "next/link";
import {
  FiBox,
  FiFileText,
  FiMoreHorizontal,
  FiShield,
  FiZap,
} from "react-icons/fi";
import { useAuth } from "@/app/auth/AuthContext";

const quickActions = [
  {
    title: "New Portfolio",
    description: "Launch a stunning personal site with AI-driven layout suggestions.",
    icon: <FiBox size={24} />,
    tone: "bg-[#e2dfff] text-[#3525cd]",
  },
  {
    title: "New Resume",
    description: "Create a professional ATS-optimized resume in minutes.",
    icon: <FiFileText size={24} />,
    tone: "bg-[#dae2fd] text-[#3f465c]",
  },
  {
    title: "AI Analysis",
    description: "Review your current portfolio performance and SEO scores.",
    icon: <FiZap size={24} />,
    tone: "bg-[#ffdbcc] text-[#7b2f00]",
  },
];

const bars = [42, 56, 49, 70, 63, 78, 86];

const recentItems = [
  {
    name: "Product Design Portfolio 2024",
    type: "Portfolio",
    status: "LIVE",
    edited: "2 hours ago",
    image: "/images/product/product-01.png",
  },
  {
    name: "Senior Engineer Resume",
    type: "Resume",
    status: "DRAFT",
    edited: "Yesterday",
    image: "",
  },
  {
    name: "Freelance Showcase v2",
    type: "Portfolio",
    status: "LIVE",
    edited: "3 days ago",
    image: "/images/product/product-02.png",
  },
];

const UserDashboard = () => {
  const { user } = useAuth();
  const displayName = user?.name || "Alex Rivera";
  const firstName = displayName.split(" ")[0] || "there";

  return (
    <>
      <section className="mb-10 flex flex-col justify-between gap-6 xl:flex-row xl:items-start">
        <div>
          <h1 className="text-4xl font-semibold tracking-[-0.02em] text-[#191c1d]">
            Welcome back, {firstName}.
          </h1>
          <p className="mt-4 text-base text-[#464555]">
            You have 3 new portfolio insights and 1 job application update today.
          </p>
        </div>

        <div className="flex w-full max-w-xs items-center justify-between rounded-lg border border-[#c7c4d8] bg-white px-6 py-5">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.12em] text-[#464555]">
              Subscription
            </p>
            <p className="mt-1 text-xl font-semibold text-[#3525cd]">
              Pro Plan - Active
            </p>
          </div>
          <FiShield size={34} className="text-[#3525cd]" />
        </div>
      </section>

      <section className="mb-12 grid gap-6 xl:grid-cols-3">
        {quickActions.map((action) => (
          <article
            key={action.title}
            className="rounded-lg border border-[#c7c4d8] bg-white p-8"
          >
            <div className={`mb-8 flex h-15 w-15 items-center justify-center rounded-lg ${action.tone}`}>
              {action.icon}
            </div>
            <h2 className="text-xl font-semibold text-[#191c1d]">{action.title}</h2>
            <p className="mt-3 text-base leading-6 text-[#464555]">{action.description}</p>
          </article>
        ))}
      </section>

      <section className="mb-12 grid gap-6 xl:grid-cols-[2fr_1fr]">
        <article className="rounded-lg border border-[#c7c4d8] bg-white p-8">
          <div className="mb-8 flex items-start justify-between">
            <div>
              <h2 className="text-xl font-semibold text-[#191c1d]">Portfolio Analytics</h2>
              <p className="mt-2 text-base text-[#464555]">Views over the last 30 days</p>
            </div>
            <span className="rounded bg-[#f3f4f5] px-4 py-1 text-sm text-[#191c1d]">
              +12.5%
            </span>
          </div>

          <div className="flex h-72 items-end gap-10 border-b border-[#e1e3e4] px-6">
            {bars.map((height, index) => (
              <div
                key={height}
                className="w-6 rounded-t bg-[#3525cd]"
                style={{ height: `${height}%`, opacity: 0.35 + index * 0.09 }}
              />
            ))}
          </div>
        </article>

        <article className="rounded-lg bg-[#4f46e5] p-8 text-white">
          <div className="mb-6 flex items-center gap-4">
            <FiZap size={26} />
            <h2 className="text-xl font-semibold">AI Tips</h2>
          </div>
          <p className="text-base leading-7 text-[#f0f1f2]">
            &quot;Improve your reach by adding a Skills section with Cloud Architecture - it&apos;s
            trending in your field.&quot;
          </p>
          <ul className="mt-8 space-y-4 text-base text-[#f0f1f2]">
            <li>Update project thumbnails</li>
            <li>Add 3 new case studies</li>
          </ul>
          <button
            type="button"
            className="mt-14 h-12 w-full rounded-lg bg-[#dad7ff] text-base font-semibold text-[#3525cd]"
          >
            Execute Suggestions
          </button>
        </article>
      </section>

      <section className="rounded-lg border border-[#c7c4d8] bg-white">
        <div className="flex items-center justify-between px-8 py-6">
          <h2 className="text-xl font-semibold text-[#191c1d]">Recent Items</h2>
          <Link href="/portfolios" className="text-base font-semibold text-[#3525cd]">
            View all
          </Link>
        </div>

        <div className="hidden grid-cols-[1.7fr_0.5fr_0.5fr_0.7fr_0.3fr] border-y border-[#c7c4d8] bg-[#f3f4f5] px-8 py-4 text-sm font-medium tracking-[0.08em] text-[#464555] md:grid">
          <span>Name</span>
          <span>Type</span>
          <span>Status</span>
          <span>Last Edited</span>
          <span>Actions</span>
        </div>

        <div>
          {recentItems.map((item) => (
            <div
              key={item.name}
              className="grid gap-4 border-b border-[#c7c4d8] px-8 py-5 last:border-b-0 md:grid-cols-[1.7fr_0.5fr_0.5fr_0.7fr_0.3fr] md:items-center"
            >
              <div className="flex items-center gap-5">
                <div className="relative flex h-12 w-12 items-center justify-center overflow-hidden rounded border border-[#c7c4d8] bg-[#f3f4f5]">
                  {item.image ? (
                    <Image src={item.image} alt={item.name} fill className="object-cover" />
                  ) : (
                    <FiFileText size={24} />
                  )}
                </div>
                <span className="text-base font-medium text-[#191c1d]">{item.name}</span>
              </div>
              <span className="text-sm text-[#464555]">{item.type}</span>
              <span>
                <span
                  className={`rounded px-3 py-1 text-xs font-semibold ${
                    item.status === "LIVE"
                      ? "bg-[#e2dfff] text-[#3525cd]"
                      : "bg-[#e1e3e4] text-[#191c1d]"
                  }`}
                >
                  {item.status}
                </span>
              </span>
              <span className="text-sm text-[#464555]">{item.edited}</span>
              <button type="button" className="text-[#464555]">
                <FiMoreHorizontal size={22} />
              </button>
            </div>
          ))}
        </div>
      </section>
    </>
  );
};

export default UserDashboard;
