// pages/category/index.tsx
"use client";
import DefaultLayout from "@/components/Layouts/DefaultLaout";
import CategoryCard from "@/components/Cards";
import Modal from "@/components/Modal";
import FileUpload from "@/components/UploadLabel";
import { resolveAssetUrl } from "@/helper/apiRequest";
import { useCategoryPage } from "@/hooks/useCategories";

const CategoryPage = () => {
  const {
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
  } = useCategoryPage();

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
        {error && (
          <div className="mb-4 rounded-md border border-red bg-red/10 px-4 py-3 text-sm text-red">
            {error}
          </div>
        )}
        {isLoading && <p className="mb-4 text-sm">Loading categories...</p>}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {categories.map((category) => (
            <CategoryCard key={category.id} category={category} handleEditClick={() => handleEdit(category)} />
          ))}
        </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={closeModal} title={categoryFormData.id ? "Edit Category" : "Add New Category"}>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Category Name</label>
          <input
            type="text"
            value={categoryFormData.categoryName || ""}
            onChange={handleCategoryNameChange}
            className="mt-1 p-2 border rounded-md w-full"
          />
        </div>
        <div className="mb-4 flex items-center gap-3">
          <input
            id="category-active"
            type="checkbox"
            checked={categoryFormData.isActive ?? true}
            onChange={handleActiveChange}
            className="h-4 w-4"
          />
          <label htmlFor="category-active" className="text-sm font-medium text-gray-700">
            Active
          </label>
        </div>
        <div className="mb-4">
          <FileUpload onFileChange={handleIconFileChange} fileUrl={resolveAssetUrl(categoryFormData.categoryImagePath)} />
        </div>
        <div className="flex justify-end mt-6">
          <button
            onClick={handleSubmit}
            disabled={isSaving}
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 disabled:cursor-not-allowed disabled:bg-opacity-70"
          >
            {isSaving ? "Saving..." : categoryFormData.id ? "Update" : "Submit"}
          </button>
        </div>
      </Modal>
    </DefaultLayout>
  );
};

export default CategoryPage;
