import api from "@/helper/apiRequest";
import { DashboardResponse } from "@/types/api";

export const getDashboard = () => {
  return api.get("admin/dashboard") as Promise<DashboardResponse>;
};
