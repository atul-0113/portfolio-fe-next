import api from "@/helper/apiRequest";
import { TemplateResponse } from "@/types/api";

export const getTemplates = () => {
  return api.get("templates") as Promise<TemplateResponse[]>;
};
