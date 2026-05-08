"use client";

import DefaultLayout from "@/components/Layouts/DefaultLaout";
import Pagination, { buildPaginationPages, buildPaginationSummary } from "@/components/Pagination";
import { badgeColorClasses, colorClasses } from "@/styles/theme";
import { componentStyles, layoutStyles, typographyStyles } from "@/styles/ui";
import Image from "next/image";
import {
  FiCheckCircle,
  FiEye,
  FiFilter,
  FiMoreHorizontal,
  FiSlash,
  FiTrash2,
  FiX,
} from "react-icons/fi";

const metrics = [
  { label: "Total Portfolios", value: "12,482", note: "+12%", tone: "positive" },
  { label: "Pending Review", value: "143", note: "Action Required", tone: "danger" },
  { label: "Reported Items", value: "28", note: "Safe Zone", tone: "neutral" },
  { label: "Pro Conversions", value: "8.4%", note: "Top Tier", tone: "positive" },
];

const portfolios = [
  {
    id: "alex-rivera",
    title: "Alex Rivera Portfolio",
    category: "Design",
    image: "/images/cards/cards-01.png",
    status: "Verified",
    updated: "Updated 2h ago",
    owner: "Alex Rivera",
    ownerImage: "/images/user/user-01.png",
    primaryAction: "Approve",
    secondaryAction: "Suspend",
    secondaryTone: "default",
  },
  {
    id: "sara-chen",
    title: "Sara Chen - Fullstack",
    category: "Engineering",
    image: "/images/cards/cards-05.png",
    status: "Pending",
    updated: "Updated 5h ago",
    owner: "Sara Chen",
    ownerImage: "/images/user/user-03.png",
    primaryAction: "Approve",
    secondaryAction: "Flag",
    secondaryTone: "default",
  },
  {
    id: "marcus-thorne",
    title: "Marcus Thorne",
    category: "Marketing",
    image: "/images/cards/cards-06.png",
    status: "Reported",
    updated: "Updated 1d ago",
    owner: "Marcus Thorne",
    ownerImage: "/images/user/user-08.png",
    primaryAction: "Review Report",
    secondaryAction: "Delete",
    secondaryTone: "danger",
  },
];

const activityRows = [
  {
    id: "jane-doe",
    initials: "JD",
    name: "Jane Doe",
    action: "Created Portfolio",
    portfolio: "doe-design-2024",
    timestamp: "Nov 12, 14:20",
  },
  {
    id: "bob-knight",
    initials: "BK",
    name: "Bob Knight",
    action: "System Flag",
    portfolio: "finance-expert-pro",
    timestamp: "Nov 12, 13:45",
  },
];

const metricToneClassName = {
  positive: "text-[#008a00]",
  danger: colorClasses.errorText,
  neutral: colorClasses.text,
};

const statusClassName = {
  Verified: badgeColorClasses.success,
  Pending: badgeColorClasses.warning,
  Reported: badgeColorClasses.info,
};

const PortfolioModeration = () => {
  const portfolioPageSize = 6;
  const portfolioSummary = buildPaginationSummary(portfolios.length, portfolioPageSize, "portfolios");
  const portfolioPaginationPages = buildPaginationPages(portfolios.length, portfolioPageSize);

  return (
    <DefaultLayout>
      <section className={layoutStyles.page}>
        <div className={layoutStyles.sectionHeader}>
          <div>
            <h1 className={typographyStyles.pageTitle}>
              Portfolio Moderation
            </h1>
            <p className={`mt-2 ${typographyStyles.body}`}>
              Manage and review user-submitted portfolios for platform compliance.
            </p>
          </div>

          <div className={`flex overflow-hidden rounded-md border ${colorClasses.border} ${colorClasses.surfaceSubtle} text-sm`}>
            <button type="button" className={`bg-white px-5 py-2 font-semibold ${colorClasses.primaryAccentText}`}>
              Grid
            </button>
            <button type="button" className={`px-5 py-2 ${colorClasses.textMuted}`}>
              Table
            </button>
          </div>
        </div>

        <div className="mb-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {metrics.map((metric) => (
            <div
              key={metric.label}
              className={`${componentStyles.card} px-6 py-6`}
            >
              <p className={`text-xs font-medium uppercase tracking-[0.12em] ${colorClasses.text}`}>
                {metric.label}
              </p>
              <div className="mt-3 flex items-end justify-between gap-3">
                <span className={`text-[28px] font-bold leading-none ${colorClasses.textStrong}`}>
                  {metric.value}
                </span>
                <span
                  className={`max-w-[92px] text-sm font-semibold leading-5 ${metricToneClassName[metric.tone as keyof typeof metricToneClassName]}`}
                >
                  {metric.note}
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className={layoutStyles.toolbar}>
          <div className="flex flex-wrap items-center gap-4">
            <button
              type="button"
              className={`${componentStyles.buttonSecondary} gap-2 px-4 text-sm`}
            >
              <FiFilter size={16} />
              Filter By
            </button>
            <span className={`${componentStyles.chip} ${badgeColorClasses.info}`}>
              Status: All
            </span>
            <span className={`inline-flex h-9 items-center gap-2 rounded-full px-5 text-sm ${badgeColorClasses.neutral}`}>
              Category: Design <FiX size={14} />
            </span>
          </div>
          <button type="button" className={`text-sm font-semibold ${colorClasses.primaryAccentText}`}>
            Clear all filters
          </button>
        </div>

        <div className="mb-12 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {portfolios.map((portfolio) => (
            <article
              key={portfolio.id}
              className={`overflow-hidden ${componentStyles.card}`}
            >
              <div className={`relative h-[180px] ${colorClasses.surfaceSubtle}`}>
                <Image
                  src={portfolio.image}
                  alt={portfolio.title}
                  fill
                  className="object-cover"
                  sizes="(min-width: 1280px) 330px, (min-width: 768px) 50vw, 100vw"
                />
                <span className={`absolute left-5 top-5 rounded border ${colorClasses.border} bg-white px-5 py-1 text-xs font-semibold uppercase tracking-[0.12em] ${colorClasses.textStrong}`}>
                  {portfolio.category}
                </span>
              </div>

              <div className="px-6 py-5">
                <div className="mb-2 flex items-center gap-2">
                  <h2 className={`truncate text-lg font-bold ${colorClasses.textStrong}`}>
                    {portfolio.title}
                  </h2>
                  <span
                    className={`shrink-0 rounded px-2 py-1 text-xs uppercase ${statusClassName[portfolio.status as keyof typeof statusClassName]}`}
                  >
                    {portfolio.status}
                  </span>
                </div>
                <p className={`text-sm ${colorClasses.textMuted}`}>{portfolio.updated}</p>

                <div className="mt-5 flex items-center gap-3">
                  <Image
                    src={portfolio.ownerImage}
                    alt={portfolio.owner}
                    width={26}
                    height={26}
                    className="h-7 w-7 rounded-full object-cover"
                  />
                  <span className={`text-sm ${colorClasses.text}`}>{portfolio.owner}</span>
                </div>

                <div className={`mt-5 flex items-center justify-between border-t ${colorClasses.border} pt-4 text-sm`}>
                  <button
                    type="button"
                    className={`inline-flex items-center gap-2 font-medium ${
                      portfolio.secondaryTone === "danger" ? colorClasses.errorText : colorClasses.textMuted
                    }`}
                  >
                    {portfolio.secondaryTone === "danger" ? <FiTrash2 size={16} /> : <FiSlash size={16} />}
                    {portfolio.secondaryAction}
                  </button>
                  <button
                    type="button"
                    className={`inline-flex items-center gap-2 font-semibold ${colorClasses.primaryAccentText}`}
                  >
                    {portfolio.primaryAction === "Review Report" ? (
                      <FiEye size={16} />
                    ) : (
                      <FiCheckCircle size={16} />
                    )}
                    {portfolio.primaryAction}
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>

        <Pagination
          summary={portfolioSummary}
          pages={portfolioPaginationPages}
          variant="grid"
        />

        <div className={componentStyles.tableShell}>
          <div className="min-w-[860px]">
            <div className={`flex items-center justify-between border-b ${colorClasses.border} px-6 py-4`}>
              <h2 className={typographyStyles.sectionTitle}>Recent Activity</h2>
              <button type="button" className={`text-sm font-semibold ${colorClasses.primaryAccentText}`}>
                View full log
              </button>
            </div>
            <div className={`grid grid-cols-[190px_190px_1fr_180px_90px] ${componentStyles.tableHeader} font-medium`}>
              <span>User</span>
              <span>Action</span>
              <span>Portfolio</span>
              <span>Timestamp</span>
              <span>Details</span>
            </div>
            {activityRows.map((row) => (
              <div
                key={row.id}
                className={`grid grid-cols-[190px_190px_1fr_180px_90px] ${componentStyles.tableRow} py-4 text-sm`}
              >
                <div className="flex items-center gap-3">
                  <span className={`flex h-8 w-8 items-center justify-center rounded-full bg-[#ddd6ff] text-xs font-semibold ${colorClasses.primaryAccentText}`}>
                    {row.initials}
                  </span>
                  <span>{row.name}</span>
                </div>
                <span className={row.action === "System Flag" ? colorClasses.errorText : colorClasses.text}>
                  {row.action}
                </span>
                <span className={colorClasses.primaryAccentText}>{row.portfolio}</span>
                <span className={colorClasses.textMuted}>{row.timestamp}</span>
                <button type="button" aria-label={`View ${row.name} activity details`}>
                  <FiMoreHorizontal size={20} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>
    </DefaultLayout>
  );
};

export default PortfolioModeration;
