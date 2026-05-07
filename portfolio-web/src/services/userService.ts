import api from "@/helper/apiRequest";
import { ApiUser } from "@/types/api";

export const getUsers = () => {
  return api.get("users") as Promise<ApiUser[]>;
};

export const getProfile = () => {
  return api.get("users/profile") as Promise<{ user: ApiUser }>;
};

export const updateProfile = (payload: Pick<ApiUser, "name" | "email">) => {
  return api.patch("users/profile", payload) as Promise<{
    message: string;
    user: ApiUser;
  }>;
};
