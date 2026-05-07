import api from "@/helper/apiRequest";
import { CategoryResponse } from "@/types/api";

export const getCategories = () => {
  return api.get("categories") as Promise<CategoryResponse[]>;
};

export const createCategory = (formData: FormData) => {
  return api.post("categories", formData, undefined, true) as Promise<{
    message: string;
    category: CategoryResponse;
  }>;
};

export const updateCategory = (id: string, formData: FormData) => {
  return api.patch(`categories/${id}`, formData, undefined, true) as Promise<{
    message: string;
    category: CategoryResponse;
  }>;
};
