"use client";

import DefaultLayout from "@/components/Layouts/DefaultLaout";
import { FaArrowLeft } from "react-icons/fa";
import { useAddCategoryForm } from "@/hooks/useCategories";

export default function AddCategory() {
  const {
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
  } = useAddCategoryForm();

  return (
    <DefaultLayout>
      <div className="flex items-center space-x-4">
        <button
          type="button"
          onClick={handleBack}
          className="mb-4 flex items-center text-black-500"
        >
          <FaArrowLeft className="mr-2" />
        </button>
        <h2 className="mb-4 text-2xl font-semibold">Add Category</h2>
      </div>

      {error && (
        <div className="mb-4 rounded-md border border-red bg-red/10 px-4 py-3 text-sm text-red">
          {error}
        </div>
      )}

      <div className="flex min-h-132.5 justify-center">
        <form onSubmit={handleSubmit} className="w-80 space-y-4 pt-10">
          <div>
            <label className="block text-sm font-medium">Category Name</label>
            <input
              type="text"
              value={categoryName}
              onChange={handleCategoryNameChange}
              className="w-full rounded-md border p-2"
              placeholder="Enter category name"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Upload Image</label>
            <input type="file" accept="image/*" onChange={handleImageUpload} className="w-full" />
            {imagePreview && (
              <img
                src={imagePreview}
                alt="Category preview"
                className="mt-2 h-32 w-32 rounded-md object-cover"
              />
            )}
          </div>

          <div className="flex items-center gap-2">
            <input
              id="add-category-active"
              type="checkbox"
              checked={isActive}
              onChange={handleActiveChange}
              className="h-4 w-4"
            />
            <label htmlFor="add-category-active" className="text-sm font-medium">
              Active
            </label>
          </div>

          <button
            type="submit"
            disabled={isSaving}
            className="w-full rounded-md bg-blue-500 py-2 text-white disabled:cursor-not-allowed disabled:bg-opacity-70"
          >
            {isSaving ? "Saving..." : "Add Category"}
          </button>
        </form>
      </div>
    </DefaultLayout>
  );
}
