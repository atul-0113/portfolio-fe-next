"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useAuth } from "@/app/auth/AuthContext";
import { buildPaginationPages, buildPaginationRangeSummary } from "@/components/Pagination";
import { getUsers } from "@/services/userService";
import { badgeColorClasses } from "@/styles/theme";
import { ApiUser } from "@/types/api";

export interface UserManagementRow {
  id: string;
  name: string;
  email: string;
  initials: string;
  role: "Admin" | "User";
  plan: "SUBSCRIBED" | "FREE";
  status: "Active" | "Suspended";
  createdOn: string;
  avatarSrc?: string;
  avatarClassName: string;
}

export interface UserMetric {
  label: string;
  value: string;
  change: string;
  tone: "positive" | "neutral" | "negative";
}

const PAGE_SIZE = 4;

const avatarClassNames = [
  "bg-[#ddd6ff] text-[#2400d8]",
  badgeColorClasses.info,
  badgeColorClasses.neutral,
  badgeColorClasses.error,
];

const getInitials = (name: string) =>
  name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase() || "U";

const formatCreatedOn = (createdAt?: string) => {
  if (!createdAt) {
    return "N/A";
  }

  const createdDate = new Date(createdAt);
  if (Number.isNaN(createdDate.getTime())) {
    return "N/A";
  }

  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(createdDate);
};

const toUserManagementRows = (users: ApiUser[], currentPage: number): UserManagementRow[] => {
  const startIndex = (currentPage - 1) * PAGE_SIZE;

  return users.slice(startIndex, startIndex + PAGE_SIZE).map((user, index) => ({
    id: user.id,
    name: user.name || "Unnamed User",
    email: user.email || "No email provided",
    initials: getInitials(user.name || user.email || "User"),
    role: user.role === "ADMIN" ? "Admin" : "User",
    plan: user.isSubscribed ? "SUBSCRIBED" : "FREE",
    status: user.isActive === false ? "Suspended" : "Active",
    createdOn: formatCreatedOn(user.createdAt),
    avatarClassName: avatarClassNames[index % avatarClassNames.length],
  }));
};

export const useUsers = () => {
  const { user } = useAuth();
  const [users, setUsers] = useState<ApiUser[]>([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const refreshUsers = useCallback(async () => {
    if (!user?.token) {
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const response = await getUsers();
      setUsers(response);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error fetching users.");
    } finally {
      setIsLoading(false);
    }
  }, [user?.token]);

  useEffect(() => {
    refreshUsers();
  }, [refreshUsers]);

  return {
    users,
    error,
    isLoading,
    refreshUsers,
  };
};

export const useUserManagement = () => {
  const { users, error, isLoading, refreshUsers } = useUsers();
  const [currentPage, setCurrentPage] = useState(1);
  const totalUsers = users.length;
  const totalPages = Math.max(Math.ceil(totalUsers / PAGE_SIZE), 1);
  const userRows = useMemo(() => toUserManagementRows(users, currentPage), [currentPage, users]);
  const subscribedAccounts = users.filter((user) => user.isSubscribed).length;
  const activeUsers = users.filter((user) => user.isActive !== false).length;
  const suspendedUsers = users.filter((user) => user.isActive === false).length;
  const paginationPages = buildPaginationPages(totalUsers, PAGE_SIZE);
  const resultSummary = buildPaginationRangeSummary(totalUsers, PAGE_SIZE, currentPage, "results");

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const handlePageChange = useCallback(
    (page: string) => {
      const nextPage = Number(page);

      if (!Number.isFinite(nextPage)) {
        return;
      }

      setCurrentPage(Math.min(Math.max(nextPage, 1), totalPages));
    },
    [totalPages],
  );

  const metrics: UserMetric[] = [
    { label: "Total Users", value: totalUsers.toLocaleString(), change: "Live", tone: "neutral" },
    { label: "Subscribed", value: subscribedAccounts.toLocaleString(), change: "Current", tone: "positive" },
    { label: "Active Today", value: activeUsers.toLocaleString(), change: "Stable", tone: "neutral" },
    { label: "Suspended", value: suspendedUsers.toLocaleString(), change: "Review", tone: "negative" },
  ];

  return {
    error,
    isLoading,
    metrics,
    currentPage: String(currentPage),
    handlePageChange,
    paginationPages,
    refreshUsers,
    resultSummary,
    userRows,
  };
};
