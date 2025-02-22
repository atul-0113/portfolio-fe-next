// pages/category/index.tsx
"use client";
import { useState } from "react";
import DefaultLayout from "@/components/Layouts/DefaultLaout";
import CategoryCard from "@/components/Cards";
import { categories as initialCategories } from "@/data/dummyData";
import Modal from "@/components/Modal";
import FileUpload from "@/components/UploadLabel"; // Import the FileUpload component

interface Category {
  name: string;
  icon: string;
}

const CategoryPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [newCategoryIcon, setNewCategoryIcon] = useState("");
  const [selectedIconFile, setSelectedIconFile] = useState<File | null>(null); // Add state for the file
  const [allCategories, setAllCategories] = useState<Category[]>(initialCategories);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const handleIconFileChange = (file: File | null) => {
    setSelectedIconFile(file);
  };
  const handleEdit = (data:any) => {
    setNewCategoryName(data?.name);
    setNewCategoryIcon(data?.icon);
    openModal()
  }
  const handleSubmit = () => {
    const iconFilename = selectedIconFile ? selectedIconFile.name : "";
    const newCategory: Category = {
      name: newCategoryName,
      icon: iconFilename, // Store the filename or URL
    };
    setAllCategories([...allCategories, newCategory]);
    closeModal();
    setNewCategoryName("");
    setSelectedIconFile(null);
  };

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
          {allCategories.map((category, index) => (
            <CategoryCard key={index} category={category} handleEditClick={handleEdit} />
          ))}
        </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={closeModal} title="Add New Category">
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Category Name</label>
          <input
            type="text"
            value={newCategoryName}
            onChange={(e) => setNewCategoryName(e.target.value)}
            className="mt-1 p-2 border rounded-md w-full"
          />
        </div>
        <div className="mb-4">
          <FileUpload onFileChange={handleIconFileChange} />
        </div>
        <div className="flex justify-end mt-6">
          <button
            onClick={handleSubmit}
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
          >
            Submit
          </button>
        </div>
      </Modal>
    </DefaultLayout>
  );
};

export default CategoryPage;