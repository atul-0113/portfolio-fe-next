import api from "@/helper/apiRequest";
import { AuthResponse } from "@/types/api";

export const login = (email: string, password: string) => {
  return api.post("auth/login", { email, password }) as Promise<AuthResponse>;
};

export const register = (name: string, email: string, password: string) => {
  return api.post("auth/register", { name, email, password }) as Promise<AuthResponse>;
};

export const logout = () => {
  return api.post("auth/logout");
};
