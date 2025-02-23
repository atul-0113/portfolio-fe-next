// pages/category/index.tsx
"use client";
import { useEffect, useState } from "react";
import DefaultLayout from "@/components/Layouts/DefaultLaout";
import CategoryCard from "@/components/Cards";
import Modal from "@/components/Modal";
import FileUpload from "@/components/UploadLabel";
import * as ApiCall from "@/helper/apiRequest";
import { useAuth } from "../auth/AuthContext";
import { Category } from "@/types/category";

const CategoryPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [categoryFormData, setCategoryFormData] = useState<Partial<Category>>({});
  const [selectedIconFile, setSelectedIconFile] = useState<File | null>(null);
  const [allCategories, setAllCategories] = useState<Category[]>([]);
  const { user }: any = useAuth();

  const getCategory = async () => {
    try {
      const response = await ApiCall.get("categories", { token: user.token });
      setAllCategories(response);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => {
    setIsModalOpen(false);
    setCategoryFormData({});
    setSelectedIconFile(null);
  };

  const handleIconFileChange = (file: File | null) => {
    setSelectedIconFile(file);
  };

  const handleEdit = (category: Category) => {
    setCategoryFormData(category);
    openModal();
  };

  const handleSubmit = async () => {
    try {
      let formData = new FormData();
      formData.append("categoryName", categoryFormData.categoryName || "");
      if (selectedIconFile) {
        formData.append("categoryImage", selectedIconFile);
      }
      formData.append("isActive", "true");
      if (categoryFormData._id) {
        // Edit existing category
        await ApiCall.put(`categories/${categoryFormData._id}`, formData, {
          token: user.token
        },true);
      } else {
        // Add new category
        await ApiCall.post("categories", formData, {
          token: user.token
        },true);
      }

      getCategory(); // Refresh category list
      closeModal();
    } catch (error) {
      console.error("Error submitting category:", error);
    }
  };

  useEffect(() => {
    getCategory();
  }, []);

  return (
    <DefaultLayout>
      <div className="mx-auto">
        <div className="mb-4 flex items-center justify-between">
          <h1 className="text-3xl font-bold">Category</h1>
          <button
            onClick={openModal}
            className="inline-flex items-center justify-center rounded-md bg-graydark px-10 py-2 text-center font-medium text-white hover:bg-opacity-90 lg:px-8 xl:px-10"
          >
            Add Category
          </button>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {allCategories.map((category) => (
            <CategoryCard key={category._id} category={category} handleEditClick={() => handleEdit(category)} />
          ))}
        </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={closeModal} title={categoryFormData._id ? "Edit Category" : "Add New Category"}>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Category Name</label>
          <input
            type="text"
            value={categoryFormData.categoryName || ""}
            onChange={(e) => setCategoryFormData({ ...categoryFormData, categoryName: e.target.value })}
            className="mt-1 p-2 border rounded-md w-full"
          />
        </div>
        <div className="mb-4">
          <FileUpload onFileChange={handleIconFileChange} fileUrl={`${ApiCall.BASE_URL}${categoryFormData.categoryImagePath}`} />
        </div>
        <div className="flex justify-end mt-6">
          <button
            onClick={handleSubmit}
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
          >
            {categoryFormData._id ? "Update" : "Submit"}
          </button>
        </div>
      </Modal>
    </DefaultLayout>
  );
};

export default CategoryPage;