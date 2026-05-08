"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useAuth } from "@/app/auth/AuthContext";
import { getDashboard } from "@/services/dashboardService";
import { DashboardResponse } from "@/types/api";

const EMPTY_VALUE = "--";

const formatCount = (
  value: number | string | undefined,
  fallback = EMPTY_VALUE,
) => {
  if (typeof value === "number") {
    return value.toLocaleString();
  }

  return value || fallback;
};

export const useDashboard = () => {
  const { user } = useAuth();
  const [dashboard, setDashboard] = useState<DashboardResponse | null>(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const refreshDashboard = useCallback(async () => {
    if (!user?.token) {
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const response = await getDashboard();
      setDashboard(response);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error fetching dashboard.");
    } finally {
      setIsLoading(false);
    }
  }, [user?.token]);

  useEffect(() => {
    refreshDashboard();
  }, [refreshDashboard]);

  const adminDashboard = useMemo(
    () => ({
      totalUsers: formatCount(dashboard?.users?.total ?? dashboard?.totalUsers),
      activeUsers: formatCount(dashboard?.users?.active),
      adminUsers: formatCount(dashboard?.users?.admins),
      totalCategories: formatCount(dashboard?.categories?.total),
      activeCategories: formatCount(dashboard?.categories?.active),
      inactiveCategories: formatCount(dashboard?.categories?.inactive),
      totalTemplates: formatCount(dashboard?.templates?.total),
      activeTemplates: formatCount(dashboard?.templates?.active),
      activePortfolios: formatCount(dashboard?.activePortfolios),
      resumesBuilt: formatCount(dashboard?.resumesBuilt),
      capacityUsed: dashboard?.capacityUsed ?? 0,
      usersGrowth: dashboard?.usersGrowth || EMPTY_VALUE,
      portfoliosToday: dashboard?.portfoliosToday || EMPTY_VALUE,
      growthBars: dashboard?.analyticsBars ?? [],
      platformStatus: dashboard?.platformHealth?.status || EMPTY_VALUE,
      apiInfrastructure: dashboard?.platformHealth?.apiInfrastructure || EMPTY_VALUE,
      aiTrainingCluster: dashboard?.platformHealth?.aiTrainingCluster || EMPTY_VALUE,
      cdnDelivery: dashboard?.platformHealth?.cdnDelivery || EMPTY_VALUE,
      recentAdminActions: dashboard?.recentAdminActions ?? [],
    }),
    [dashboard],
  );

  const userDashboard = useMemo(
    () => ({
      portfolioInsights: formatCount(dashboard?.portfolioInsights),
      jobApplicationUpdates: formatCount(dashboard?.jobApplicationUpdates),
      subscriptionLabel: dashboard?.subscriptionLabel || EMPTY_VALUE,
      analyticsChange: dashboard?.analyticsChange || EMPTY_VALUE,
      analyticsBars: dashboard?.analyticsBars ?? [],
      recentItems: dashboard?.recentItems ?? [],
    }),
    [dashboard],
  );

  return {
    adminDashboard,
    dashboard,
    error,
    isLoading,
    refreshDashboard,
    userDashboard,
  };
};
