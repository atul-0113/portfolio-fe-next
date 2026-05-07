"use client";

import { ChangeEvent, FormEvent, useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/auth/AuthContext";
import {
  createCategory,
  getCategories,
  updateCategory,
} from "@/services/categoryService";
import { CategoryResponse } from "@/types/api";
import { Category } from "@/types/category";

interface SaveCategoryPayload {
  categoryName: string;
  isActive: boolean;
  categoryImage?: File | null;
}

interface UseCategoriesOptions {
  autoFetch?: boolean;
}

export const useCategories = ({ autoFetch = true }: UseCategoriesOptions = {}) => {
  const { user } = useAuth();
  const [categories, setCategories] = useState<CategoryResponse[]>([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const refreshCategories = useCallback(async () => {
    if (!user?.token) {
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const response = await getCategories();
      setCategories(response);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error fetching categories.");
    } finally {
      setIsLoading(false);
    }
  }, [user?.token]);

  const saveCategory = useCallback(
    async (id: string | undefined, payload: SaveCategoryPayload) => {
      setIsSaving(true);
      setError("");

      try {
        const formData = new FormData();
        formData.append("categoryName", payload.categoryName);
        formData.append("isActive", String(payload.isActive));

        if (payload.categoryImage) {
          formData.append("categoryImage", payload.categoryImage);
        }

        if (id) {
          await updateCategory(id, formData);
        } else {
          await createCategory(formData);
        }

        await refreshCategories();
      } catch (err) {
        const message = err instanceof Error ? err.message : "Error saving category.";
        setError(message);
        throw new Error(message);
      } finally {
        setIsSaving(false);
      }
    },
    [refreshCategories],
  );

  useEffect(() => {
    if (autoFetch) {
      refreshCategories();
    }
  }, [autoFetch, refreshCategories]);

  return {
    categories,
    error,
    isLoading,
    isSaving,
    refreshCategories,
    saveCategory,
  };
};

export const useAddCategoryForm = () => {
  const router = useRouter();
  const { error, isSaving, saveCategory } = useCategories({ autoFetch: false });
  const [categoryName, setCategoryName] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState("");
  const [isActive, setIsActive] = useState(true);

  const handleCategoryNameChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    setCategoryName(event.target.value);
  }, []);

  const handleImageUpload = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    setImageFile(file);
    setImagePreview(file ? URL.createObjectURL(file) : "");
  }, []);

  const handleActiveChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    setIsActive(event.target.checked);
  }, []);

  const handleBack = useCallback(() => {
    router.back();
  }, [router]);

  const handleSubmit = useCallback(
    async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      try {
        await saveCategory(undefined, {
          categoryName,
          isActive,
          categoryImage: imageFile,
        });
        router.push("/category");
      } catch {
        // The feature hook owns the visible error state.
      }
    },
    [categoryName, imageFile, isActive, router, saveCategory],
  );

  return {
    categoryName,
    error,
    imagePreview,
    isActive,
    isSaving,
    handleActiveChange,
    handleBack,
    handleCategoryNameChange,
    handleImageUpload,
    handleSubmit,
  };
};

export const useCategoryPage = () => {
  const { categories, error, isLoading, isSaving, saveCategory } = useCategories();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [categoryFormData, setCategoryFormData] = useState<Partial<Category>>({});
  const [selectedIconFile, setSelectedIconFile] = useState<File | null>(null);

  const openModal = useCallback(() => {
    setIsModalOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
    setCategoryFormData({});
    setSelectedIconFile(null);
  }, []);

  const handleIconFileChange = useCallback((file: File | null) => {
    setSelectedIconFile(file);
  }, []);

  const handleCategoryNameChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    setCategoryFormData((currentCategory) => ({
      ...currentCategory,
      categoryName: event.target.value,
    }));
  }, []);

  const handleActiveChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    setCategoryFormData((currentCategory) => ({
      ...currentCategory,
      isActive: event.target.checked,
    }));
  }, []);

  const handleEdit = useCallback((category: Category) => {
    setCategoryFormData(category);
    setIsModalOpen(true);
  }, []);

  const handleSubmit = useCallback(async () => {
    try {
      await saveCategory(categoryFormData.id, {
        categoryName: categoryFormData.categoryName || "",
        isActive: categoryFormData.isActive ?? true,
        categoryImage: selectedIconFile,
      });
      closeModal();
    } catch {
      // The feature hook owns the visible error state.
    }
  }, [categoryFormData, closeModal, saveCategory, selectedIconFile]);

  return {
    categories,
    categoryFormData,
    error,
    isLoading,
    isModalOpen,
    isSaving,
    closeModal,
    handleActiveChange,
    handleCategoryNameChange,
    handleEdit,
    handleIconFileChange,
    handleSubmit,
    openModal,
  };
};
