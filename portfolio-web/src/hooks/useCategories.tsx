"use client";

import { ChangeEvent, FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/auth/AuthContext";
import { buildPaginationPages, buildPaginationSummary } from "@/components/Pagination";
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

export interface CategoryTableRow {
  id: string;
  name: string;
  description: string;
  count: string;
  imageSrc: string;
  source: Category;
}

const categoryDescriptions = [
  "Visual artists, UI/UX designers, and brand specialists showcasing visual portfolios.",
  "Software engineers, frontend specialists, and fullstack devs with GitHub integrations.",
  "Agents and agencies listing properties with immersive gallery layouts.",
  "Professional shooters focused on high-resolution image delivery and grid views.",
];

const CATEGORY_PAGE_SIZE = 4;
const categoryCounts = ["1,284", "3,492", "854", "2,110"];
const categoryImageSrcs = [
  "/images/category/finearts.jpeg",
  "/images/category/animation.png",
  "/images/category/digital_marketing.jpeg",
  "/images/category/photo.jpeg",
];

const fallbackCategories: CategoryResponse[] = [
  {
    id: "designer",
    categoryName: "Designer",
    isActive: true,
    categoryImagePath: null,
    createdOn: "",
    createdById: "",
  },
  {
    id: "developer",
    categoryName: "Developer",
    isActive: true,
    categoryImagePath: null,
    createdOn: "",
    createdById: "",
  },
  {
    id: "real-estate",
    categoryName: "Real Estate",
    isActive: true,
    categoryImagePath: null,
    createdOn: "",
    createdById: "",
  },
  {
    id: "photographer",
    categoryName: "Photographer",
    isActive: true,
    categoryImagePath: null,
    createdOn: "",
    createdById: "",
  },
];

const toCategoryTableRows = (categories: CategoryResponse[]): CategoryTableRow[] => {
  const sourceCategories = categories.length > 0 ? categories : fallbackCategories;

  return sourceCategories.slice(0, CATEGORY_PAGE_SIZE).map((category, index) => ({
    id: category.id,
    name: category.categoryName,
    description: categoryDescriptions[index] || "Portfolio category available for platform showcase grouping.",
    count: categoryCounts[index] || "0",
    imageSrc: categoryImageSrcs[index] || categoryImageSrcs[0],
    source: category,
  }));
};

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
  const [materialIconName, setMaterialIconName] = useState("");
  const [description, setDescription] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState("");
  const [isActive, setIsActive] = useState(true);

  const handleCategoryNameChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    setCategoryName(event.target.value);
  }, []);

  const handleMaterialIconNameChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    setMaterialIconName(event.target.value);
  }, []);

  const handleDescriptionChange = useCallback((event: ChangeEvent<HTMLTextAreaElement>) => {
    setDescription(event.target.value);
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
    description,
    error,
    imagePreview,
    isActive,
    isSaving,
    materialIconName,
    handleActiveChange,
    handleBack,
    handleCategoryNameChange,
    handleDescriptionChange,
    handleImageUpload,
    handleMaterialIconNameChange,
    handleSubmit,
  };
};

export const useCategoryPage = () => {
  const { categories, error, isLoading, isSaving, saveCategory } = useCategories();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [categoryFormData, setCategoryFormData] = useState<Partial<Category>>({});
  const [materialIconName, setMaterialIconName] = useState("");
  const [description, setDescription] = useState("");
  const [selectedIconFile, setSelectedIconFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState("");
  const categoryRows = useMemo(() => toCategoryTableRows(categories), [categories]);
  const categoryTotal = categories.length || fallbackCategories.length;
  const categorySummary = buildPaginationSummary(categoryTotal, CATEGORY_PAGE_SIZE, "categories");
  const categoryPaginationPages = buildPaginationPages(categoryTotal, CATEGORY_PAGE_SIZE);
  const modalTitle = categoryFormData.id ? "Update Category" : "Create New Category";
  const modalSubmitLabel = categoryFormData.id ? "Update Category" : "Create Category";

  const handleCreateCategory = useCallback(() => {
    setCategoryFormData({ isActive: true });
    setMaterialIconName("");
    setDescription("");
    setSelectedIconFile(null);
    setImagePreview("");
    setIsModalOpen(true);
  }, []);

  const openModal = useCallback(() => {
    setIsModalOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
    setCategoryFormData({});
    setMaterialIconName("");
    setDescription("");
    setSelectedIconFile(null);
    setImagePreview("");
  }, []);

  const handleIconFileChange = useCallback((file: File | null) => {
    setSelectedIconFile(file);
    setImagePreview(file ? URL.createObjectURL(file) : "");
  }, []);

  const handleModalImageUpload = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    handleIconFileChange(file);
  }, [handleIconFileChange]);

  const handleCategoryNameChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    setCategoryFormData((currentCategory) => ({
      ...currentCategory,
      categoryName: event.target.value,
    }));
  }, []);

  const handleMaterialIconNameChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    setMaterialIconName(event.target.value);
  }, []);

  const handleDescriptionChange = useCallback((event: ChangeEvent<HTMLTextAreaElement>) => {
    setDescription(event.target.value);
  }, []);

  const handleActiveChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    setCategoryFormData((currentCategory) => ({
      ...currentCategory,
      isActive: event.target.checked,
    }));
  }, []);

  const handleEdit = useCallback((category: Category) => {
    setCategoryFormData(category);
    setMaterialIconName("");
    setDescription("");
    setSelectedIconFile(null);
    setImagePreview("");
    setIsModalOpen(true);
  }, []);

  const handleSubmit = useCallback(async (event?: FormEvent<HTMLFormElement>) => {
    event?.preventDefault();

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
    categoryRows,
    categorySummary,
    categoryPaginationPages,
    description,
    error,
    imagePreview,
    isLoading,
    isModalOpen,
    isSaving,
    materialIconName,
    modalSubmitLabel,
    modalTitle,
    closeModal,
    handleActiveChange,
    handleCategoryNameChange,
    handleCreateCategory,
    handleDescriptionChange,
    handleEdit,
    handleIconFileChange,
    handleMaterialIconNameChange,
    handleModalImageUpload,
    handleSubmit,
    openModal,
  };
};
