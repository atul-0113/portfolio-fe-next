"use client";

import DefaultLayout from "@/components/Layouts/DefaultLaout";
import Pagination from "@/components/Pagination";
import { useCategoryPage } from "@/hooks/useCategories";
import { badgeColorClasses, colorClasses } from "@/styles/theme";
import { componentStyles, layoutStyles, typographyStyles } from "@/styles/ui";
import Image from "next/image";
import {
  FiEdit3,
  FiImage,
  FiPlus,
  FiTrash2,
  FiX,
} from "react-icons/fi";

const CategoryPage = () => {
  const {
    categoryPaginationPages,
    categoryRows,
    categorySummary,
    categoryFormData,
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
    handleCategoryNameChange,
    handleCreateCategory,
    handleDescriptionChange,
    handleEdit,
    handleMaterialIconNameChange,
    handleModalImageUpload,
    handleSubmit,
  } = useCategoryPage();

  return (
    <DefaultLayout>
      <section className={layoutStyles.page}>
        <div className={layoutStyles.sectionHeader}>
          <div className="max-w-[690px]">
            <h1 className={typographyStyles.pageTitle}>
              Category Management
            </h1>
            <p className={`mt-2 ${typographyStyles.body}`}>
              Manage and organize portfolio categories available for users. These tags help in search optimization
              and platform showcase grouping.
            </p>
          </div>

          <button
            type="button"
            onClick={handleCreateCategory}
            className={`${componentStyles.buttonPrimaryCompact} min-w-[205px]`}
          >
            <FiPlus size={20} />
            Create New Category
          </button>
        </div>

        {error && (
          <div className="mb-6 rounded-lg border border-red bg-red/10 px-4 py-3 text-sm text-red">
            {error}
          </div>
        )}

        <div className={componentStyles.tableShell}>
          <div className="min-w-[860px]">
            <div className={`grid grid-cols-[100px_1fr_150px_140px] ${componentStyles.tableHeader}`}>
              <span>Image</span>
              <span>Category Details</span>
              <span>Count</span>
              <span className="text-right">Actions</span>
            </div>

            {isLoading ? (
              <div className={`px-8 py-16 text-center text-sm ${colorClasses.textMuted}`}>
                Loading categories...
              </div>
            ) : (
              categoryRows.map((category) => (
                <div
                  key={category.id}
                  className={`grid grid-cols-[100px_1fr_150px_140px] ${componentStyles.tableRow} py-4`}
                >
                  <Image
                    src={category.imageSrc}
                    alt={category.name}
                    width={44}
                    height={44}
                    className="h-11 w-11 rounded-md object-cover"
                  />

                  <div>
                    <h2 className="text-sm font-bold text-[#090a0b]">
                      {category.name}
                    </h2>
                    <p className={`mt-1 max-w-[510px] ${typographyStyles.bodySmall}`}>
                      {category.description}
                    </p>
                  </div>

                  <div>
                    <span className={`inline-flex rounded px-2.5 py-0.5 text-xs font-medium ${badgeColorClasses.muted}`}>
                      {category.count}
                    </span>
                  </div>

                  <div className={`flex justify-end gap-5 ${colorClasses.textMuted}`}>
                    <button
                      type="button"
                      aria-label={`Edit ${category.name}`}
                      onClick={() => handleEdit(category.source)}
                      className={`transition ${colorClasses.hoverText}`}
                    >
                      <FiEdit3 size={20} />
                    </button>
                    <button
                      type="button"
                      aria-label={`Delete ${category.name}`}
                      className="transition hover:text-red"
                    >
                      <FiTrash2 size={20} />
                    </button>
                  </div>
                </div>
              ))
            )}

            <Pagination summary={categorySummary} pages={categoryPaginationPages} variant="table" />
          </div>
        </div>

        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-[#090a0b]/55 px-4 py-4 sm:items-center">
            <div className="max-h-[calc(100vh-2rem)] w-full max-w-[560px] overflow-y-auto rounded-lg bg-white shadow-2xl">
              <div className={`flex items-center justify-between border-b ${colorClasses.border} px-6 py-4`}>
                <h2 className="text-[22px] font-bold leading-tight text-[#090a0b]">
                  {modalTitle}
                </h2>
                <button
                  type="button"
                  onClick={closeModal}
                  aria-label="Close category modal"
                  className={`${colorClasses.textMuted} transition ${colorClasses.hoverText}`}
                >
                  <FiX size={22} />
                </button>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="space-y-3.5 px-6 py-5">
                  <label className="block">
                    <span className={typographyStyles.label}>
                      Category Name
                    </span>
                    <input
                      type="text"
                      value={categoryFormData.categoryName || ""}
                      onChange={handleCategoryNameChange}
                      className={`mt-1.5 h-10 w-full px-3 ${componentStyles.input}`}
                      placeholder="e.g. Graphic Designer"
                      required
                    />
                  </label>

                  <label className="block">
                    <span className={typographyStyles.label}>
                      Category Description
                    </span>
                    <textarea
                      value={description}
                      onChange={handleDescriptionChange}
                      rows={3}
                      className={`mt-1.5 w-full resize-none px-3 py-2.5 ${componentStyles.input}`}
                      placeholder="Brief description of this category..."
                    />
                  </label>

                  <label className="block">
                    <span className={typographyStyles.label}>
                      Material Icon Name
                    </span>
                    <input
                      type="text"
                      value={materialIconName}
                      onChange={handleMaterialIconNameChange}
                      className={`mt-1.5 h-10 w-full px-3 ${componentStyles.input}`}
                      placeholder="e.g. brush, code, domain"
                    />
                  </label>

                  <div>
                    <span className={typographyStyles.label}>
                      Category Image
                    </span>
                    <label className={`mt-1.5 flex min-h-[120px] cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed ${colorClasses.border} ${colorClasses.appBackground} px-5 py-4 text-center transition ${colorClasses.hoverBorder}`}>
                      <input
                        type="file"
                        accept="image/png,image/jpeg,image/jpg,image/svg+xml"
                        onChange={handleModalImageUpload}
                        className="sr-only"
                      />
                      {imagePreview ? (
                        <Image
                          src={imagePreview}
                          alt="Category preview"
                          width={88}
                          height={88}
                          unoptimized
                          className="h-[88px] w-[88px] rounded-lg object-cover"
                        />
                      ) : (
                        <>
                          <span className={`mb-2 flex h-8 w-8 items-center justify-center rounded-md border border-[#3525cd] ${colorClasses.primaryText}`}>
                            <FiImage size={20} />
                          </span>
                          <span className={`text-sm font-bold ${colorClasses.primaryAccentText}`}>
                            Upload Image
                          </span>
                          <span className={`mt-1 text-xs ${colorClasses.textMuted}`}>
                            Supported formats: PNG, JPG, SVG (max. 2MB)
                          </span>
                        </>
                      )}
                    </label>
                  </div>
                </div>

                <div className={`flex items-center justify-end gap-5 border-t ${colorClasses.border} ${colorClasses.appBackground} px-6 py-4`}>
                  <button
                    type="button"
                    onClick={closeModal}
                    className={`text-sm font-semibold ${colorClasses.textMuted} transition ${colorClasses.hoverText}`}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSaving}
                    className={`${componentStyles.buttonPrimaryCompact} min-w-[160px] disabled:cursor-not-allowed disabled:bg-[#dcdde0] disabled:text-[#3525cd]`}
                  >
                    {isSaving ? "Saving..." : modalSubmitLabel}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </section>
    </DefaultLayout>
  );
};

export default CategoryPage;
