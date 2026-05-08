"use client";

import DefaultLayout from "@/components/Layouts/DefaultLaout";
import Pagination from "@/components/Pagination";
import { UserManagementRow, UserMetric, useUserManagement } from "@/hooks/useUsers";
import { badgeColorClasses, colorClasses } from "@/styles/theme";
import { componentStyles, layoutStyles, typographyStyles } from "@/styles/ui";
import Image from "next/image";
import {
  FiDownload,
  FiFilter,
  FiMoreHorizontal,
} from "react-icons/fi";

const metricToneClassNames: Record<UserMetric["tone"], string> = {
  positive: colorClasses.primaryAccentText,
  neutral: colorClasses.text,
  negative: colorClasses.errorText,
};

const roleClassNames: Record<UserManagementRow["role"], string> = {
  Admin: badgeColorClasses.neutral,
  User: badgeColorClasses.neutral,
};

const planClassNames: Record<UserManagementRow["plan"], string> = {
  SUBSCRIBED: badgeColorClasses.primary,
  FREE: badgeColorClasses.muted,
};

const UserAvatar = ({ user }: { user: UserManagementRow }) => {
  if (user.avatarSrc) {
    return (
      <Image
        src={user.avatarSrc}
        alt={user.name}
        width={50}
        height={50}
        className="h-9 w-9 rounded-md object-cover"
      />
    );
  }

  return (
    <div
      className={`flex h-9 w-9 items-center justify-center rounded-md text-sm font-bold ${user.avatarClassName}`}
    >
      {user.initials}
    </div>
  );
};

const UserManagement = () => {
  const {
    currentPage,
    error,
    handlePageChange,
    isLoading,
    metrics,
    paginationPages,
    resultSummary,
    userRows,
  } = useUserManagement();

  return (
    <DefaultLayout>
      <section className={layoutStyles.page}>
        <div className="mb-8 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className={typographyStyles.pageTitleLarge}>
              User Management
            </h1>
            <p className={`mt-3 ${typographyStyles.bodyLarge}`}>
              Review, manage, and audit all platform users from a central console.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              className={componentStyles.buttonSecondary}
            >
              <FiFilter size={20} />
              Filters
            </button>
            <button
              type="button"
              className={componentStyles.buttonSecondary}
            >
              <FiDownload size={20} />
              Export CSV
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-6 rounded-lg border border-red bg-red/10 px-4 py-3 text-sm text-red">
            {error}
          </div>
        )}

        <div className={layoutStyles.metricGrid}>
          {metrics.map((metric) => (
            <div
              key={metric.label}
              className={`${componentStyles.card} px-8 py-7`}
            >
              <p className={`text-sm font-medium uppercase tracking-[0.12em] ${colorClasses.textMuted}`}>
                {metric.label}
              </p>
              <div className="mt-3 flex items-end gap-3">
                <span className={`text-[24px] font-bold leading-none ${colorClasses.textStrong}`}>
                  {metric.value}
                </span>
                <span className={`pb-1 text-sm ${metricToneClassNames[metric.tone]}`}>
                  {metric.change}
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className={componentStyles.tableShell}>
          <div className="min-w-[1040px]">
            <div className={`grid grid-cols-[320px_120px_120px_150px_150px_1fr] ${componentStyles.tableHeader}`}>
              <span>User</span>
              <span>Role</span>
              <span>Plan</span>
              <span>Status</span>
              <span>Created On</span>
              <span className="text-right">Actions</span>
            </div>

            {isLoading ? (
              <div className={`px-8 py-16 text-center text-sm ${colorClasses.textMuted}`}>
                Loading users...
              </div>
            ) : userRows.length ? (
              userRows.map((user) => (
                <div
                  key={user.id}
                  className={`grid grid-cols-[320px_120px_120px_150px_150px_1fr] ${componentStyles.tableRow}`}
                >
                  <div className="flex items-center gap-3">
                    <UserAvatar user={user} />
                    <div>
                      <h2
                        className={`text-base font-bold ${
                          user.status === "Suspended" ? "text-[#656577]" : colorClasses.textStrong
                        }`}
                      >
                        {user.name}
                      </h2>
                      <p className={`mt-0.5 text-xs ${colorClasses.textMuted}`}>{user.email}</p>
                    </div>
                  </div>

                  <span
                    className={`w-fit rounded px-2.5 py-0.5 text-xs ${roleClassNames[user.role]}`}
                  >
                    {user.role}
                  </span>

                  <span
                    className={`w-fit rounded px-2.5 py-0.5 text-xs font-semibold ${planClassNames[user.plan]}`}
                  >
                    {user.plan}
                  </span>

                  <span
                    className={`flex items-center gap-2 text-xs ${
                      user.status === "Suspended" ? colorClasses.errorText : colorClasses.text
                    }`}
                  >
                    <span
                      className={`h-2 w-2 rounded-full ${
                        user.status === "Suspended" ? "bg-[#ba1a1a]" : "bg-[#3525cd]"
                      }`}
                    />
                    {user.status}
                  </span>

                  <span className={`text-xs ${colorClasses.textMuted}`}>{user.createdOn}</span>

                  <div className="flex justify-end">
                    <button
                      type="button"
                      aria-label={`Open actions for ${user.name}`}
                      className={`${colorClasses.textMuted} transition ${colorClasses.hoverText}`}
                    >
                      <FiMoreHorizontal size={20} />
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className={`px-8 py-12 text-center text-sm ${colorClasses.textMuted}`}>
                No users found.
              </div>
            )}

            <Pagination
              summary={resultSummary}
              pages={paginationPages}
              variant="table"
              currentPage={currentPage}
              onPageChange={handlePageChange}
            />
          </div>
        </div>
      </section>
    </DefaultLayout>
  );
};

export default UserManagement;
