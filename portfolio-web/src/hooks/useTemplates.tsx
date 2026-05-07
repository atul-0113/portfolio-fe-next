"use client";

import { useCallback, useEffect, useState } from "react";
import { useAuth } from "@/app/auth/AuthContext";
import { getTemplates } from "@/services/templateService";
import { TemplateResponse } from "@/types/api";

export const useTemplates = () => {
  const { user } = useAuth();
  const [templates, setTemplates] = useState<TemplateResponse[]>([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const refreshTemplates = useCallback(async () => {
    if (!user?.token) {
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const response = await getTemplates();
      setTemplates(response);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error fetching templates.");
    } finally {
      setIsLoading(false);
    }
  }, [user?.token]);

  useEffect(() => {
    refreshTemplates();
  }, [refreshTemplates]);

  return {
    templates,
    error,
    isLoading,
    refreshTemplates,
  };
};
