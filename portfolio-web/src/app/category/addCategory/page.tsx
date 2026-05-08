"use client";

import DefaultLayout from "@/components/Layouts/DefaultLaout";
import { useAddCategoryForm } from "@/hooks/useCategories";
import Image from "next/image";
import { FiArrowLeft, FiImage, FiSave, FiSliders } from "react-icons/fi";

export default function AddCategory() {
  const {
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
  } = useAddCategoryForm();

  return (
    <DefaultLayout>
      <section className="mx-auto w-full max-w-[1130px] px-4 py-10 sm:px-6 lg:px-0">
        <div className="mb-10 flex items-start justify-between gap-6">
          <div>
            <button
              type="button"
              onClick={handleBack}
              className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-[#3525cd]"
            >
              <FiArrowLeft size={18} />
              Back to Categories
            </button>
            <h1 className="text-[34px] font-bold leading-tight text-[#090a0b]">
              Create New Category
            </h1>
            <p className="mt-3 max-w-[690px] text-base leading-7 text-[#303041]">
              Configure a category users can select while creating portfolios and resumes.
            </p>
          </div>
        </div>

        {error && (
          <div className="mb-6 rounded-lg border border-red bg-red/10 px-4 py-3 text-sm text-red">
            {error}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="grid gap-8 lg:grid-cols-[420px_1fr]"
        >
          <div className="rounded-lg border border-[#c7c4d8] bg-white p-7">
            <div className="mb-7 flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#ece9ff] text-[#3525cd]">
                <FiSliders size={20} />
              </span>
              <h2 className="text-lg font-bold text-[#191c1d]">Quick Configuration</h2>
            </div>

            <div className="space-y-5">
              <label className="block">
                <span className="text-sm font-semibold text-[#656577]">Category Name</span>
                <input
                  type="text"
                  value={categoryName}
                  onChange={handleCategoryNameChange}
                  className="mt-2 h-12 w-full rounded-md border border-[#c7c4d8] bg-[#f8f9fa] px-4 text-sm text-[#191c1d] outline-none focus:border-[#3525cd] focus:bg-white"
                  placeholder="e.g. Interior Designer"
                  required
                />
              </label>

              <label className="block">
                <span className="text-sm font-semibold text-[#656577]">Material Icon Name</span>
                <input
                  type="text"
                  value={materialIconName}
                  onChange={handleMaterialIconNameChange}
                  className="mt-2 h-12 w-full rounded-md border border-[#c7c4d8] bg-[#f8f9fa] px-4 text-sm text-[#191c1d] outline-none focus:border-[#3525cd] focus:bg-white"
                  placeholder="e.g. palette"
                />
              </label>

              <label className="block">
                <span className="text-sm font-semibold text-[#656577]">Description</span>
                <textarea
                  value={description}
                  onChange={handleDescriptionChange}
                  rows={4}
                  className="mt-2 w-full resize-none rounded-md border border-[#c7c4d8] bg-[#f8f9fa] px-4 py-3 text-sm text-[#191c1d] outline-none focus:border-[#3525cd] focus:bg-white"
                  placeholder="Describe the target audience..."
                />
              </label>

              <label className="flex items-center gap-3 rounded-md border border-[#c7c4d8] bg-[#f8f9fa] px-4 py-3 text-sm font-semibold text-[#303041]">
                <input
                  type="checkbox"
                  checked={isActive}
                  onChange={handleActiveChange}
                  className="h-4 w-4 accent-[#3525cd]"
                />
                Active category
              </label>

              <button
                type="submit"
                disabled={isSaving}
                className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-md bg-[#3525cd] text-sm font-semibold text-white transition hover:bg-[#4f46e5] disabled:cursor-not-allowed disabled:bg-[#dcdde0] disabled:text-[#3525cd]"
              >
                <FiSave size={18} />
                {isSaving ? "Saving Category..." : "Save Category"}
              </button>
            </div>
          </div>

          <div className="rounded-lg border border-[#c7c4d8] bg-white p-7">
            <div className="mb-7 flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#e5e7e9] text-[#303041]">
                <FiImage size={20} />
              </span>
              <h2 className="text-lg font-bold text-[#191c1d]">Category Asset</h2>
            </div>

            <label className="flex min-h-[220px] cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed border-[#c7c4d8] bg-[#f8f9fa] px-6 py-8 text-center transition hover:border-[#3525cd]">
              <input type="file" accept="image/*" onChange={handleImageUpload} className="sr-only" />
              {imagePreview ? (
                <Image
                  src={imagePreview}
                  alt="Category preview"
                  width={144}
                  height={144}
                  unoptimized
                  className="h-36 w-36 rounded-lg object-cover"
                />
              ) : (
                <>
                  <span className="mb-4 flex h-14 w-14 items-center justify-center rounded-lg bg-[#ece9ff] text-[#3525cd]">
                    <FiImage size={24} />
                  </span>
                  <span className="text-sm font-semibold text-[#191c1d]">Upload category image</span>
                  <span className="mt-2 text-xs text-[#656577]">PNG, JPG, or WEBP. Optional for now.</span>
                </>
              )}
            </label>
          </div>
        </form>
      </section>
    </DefaultLayout>
  );
}
