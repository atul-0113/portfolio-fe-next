"use client";

import { useCallback, useEffect, useState } from "react";
import { useAuth } from "@/app/auth/AuthContext";
import { getUsers } from "@/services/userService";
import { ApiUser } from "@/types/api";

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
