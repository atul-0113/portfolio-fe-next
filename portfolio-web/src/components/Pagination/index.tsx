"use client";

import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { colorClasses } from "@/styles/theme";

type PaginationVariant = "table" | "grid";

interface PaginationProps {
  summary: string;
  pages: string[];
  variant?: PaginationVariant;
  currentPage?: string;
  onPageChange?: (page: string) => void;
}

export const buildPaginationPages = (totalItems: number, pageSize: number) => {
  const totalPages = Math.ceil(totalItems / pageSize);

  if (totalPages <= 0) {
    return [];
  }

  if (totalPages <= 5) {
    return Array.from({ length: totalPages }, (_, index) => String(index + 1));
  }

  return ["1", "2", "3", "...", String(totalPages)];
};

export const buildPaginationSummary = (
  totalItems: number,
  pageSize: number,
  itemLabel: string,
) => {
  if (totalItems <= 0) {
    return `Showing 0 of 0 ${itemLabel}`;
  }

  return `Showing 1 to ${Math.min(pageSize, totalItems)} of ${totalItems} ${itemLabel}`;
};

export const buildPaginationRangeSummary = (
  totalItems: number,
  pageSize: number,
  currentPage: number,
  itemLabel: string,
) => {
  if (totalItems <= 0) {
    return `Showing 0 of 0 ${itemLabel}`;
  }

  const start = (currentPage - 1) * pageSize + 1;
  const end = Math.min(currentPage * pageSize, totalItems);

  return `Showing ${start} to ${end} of ${totalItems} ${itemLabel}`;
};

const Pagination = ({
  summary,
  pages,
  variant = "table",
  currentPage = "1",
  onPageChange,
}: PaginationProps) => {
  const isGrid = variant === "grid";
  const currentPageNumber = Number(currentPage);
  const numericPages = pages
    .map((page) => Number(page))
    .filter((page) => Number.isFinite(page));
  const maxPage = numericPages.length ? Math.max(...numericPages) : 1;
  const canGoPrevious = currentPageNumber > 1;
  const canGoNext = currentPageNumber < maxPage;

  const handlePageChange = (page: string) => {
    if (page === "..." || page === currentPage) {
      return;
    }

    onPageChange?.(page);
  };

  const handlePrevious = () => {
    if (!canGoPrevious) {
      return;
    }

    onPageChange?.(String(currentPageNumber - 1));
  };

  const handleNext = () => {
    if (!canGoNext) {
      return;
    }

    onPageChange?.(String(currentPageNumber + 1));
  };

  return (
    <div
      className={`flex flex-col gap-3 ${colorClasses.textMuted} sm:flex-row sm:items-center sm:justify-between ${
        isGrid
          ? `mt-10 rounded-lg border ${colorClasses.border} bg-white px-6 py-4 text-sm`
          : `border-t ${colorClasses.border} px-6 py-3 text-xs`
      }`}
    >
      <span>{summary}</span>
      <div className={`flex items-center ${isGrid ? "gap-2" : "gap-4"}`}>
        <button
          type="button"
          aria-label="Previous page"
          disabled={!canGoPrevious}
          onClick={handlePrevious}
          className={
            isGrid
              ? `flex h-9 w-9 items-center justify-center rounded-md border ${colorClasses.border} ${
                  canGoPrevious ? `${colorClasses.textMuted} ${colorClasses.hoverText}` : `cursor-not-allowed ${colorClasses.border}`
                }`
              : canGoPrevious
                ? `${colorClasses.textMuted} transition ${colorClasses.hoverText}`
                : `cursor-not-allowed ${colorClasses.border}`
          }
        >
          <FiChevronLeft size={isGrid ? 18 : 22} />
        </button>

        {pages.map((item) => (
          <button
            key={item}
            type="button"
            disabled={item === "..."}
            onClick={() => handlePageChange(item)}
            className={
              isGrid
                ? `h-9 min-w-9 rounded-md px-3 text-sm ${
                    item === currentPage
                      ? `${colorClasses.primaryBg} text-white`
                      : item === "..."
                        ? `cursor-default border border-transparent bg-white ${colorClasses.textMuted}`
                        : `border ${colorClasses.border} bg-white ${colorClasses.textMuted} ${colorClasses.hoverBorder} ${colorClasses.hoverText}`
                  }`
                : `h-8 min-w-8 rounded-md px-2 text-xs ${
                    item === currentPage
                      ? `${colorClasses.primaryBg} text-white`
                      : item === "..."
                        ? `cursor-default ${colorClasses.textMuted}`
                        : `${colorClasses.textMuted} ${colorClasses.hoverText}`
                  }`
            }
          >
            {item}
          </button>
        ))}

        <button
          type="button"
          aria-label="Next page"
          disabled={!canGoNext}
          onClick={handleNext}
          className={
            isGrid
              ? `flex h-9 w-9 items-center justify-center rounded-md border ${colorClasses.border} ${
                  canGoNext ? `${colorClasses.textMuted} ${colorClasses.hoverText}` : `cursor-not-allowed ${colorClasses.border}`
                }`
              : canGoNext
                ? `${colorClasses.textMuted} transition ${colorClasses.hoverText}`
                : `cursor-not-allowed ${colorClasses.border}`
          }
        >
          <FiChevronRight size={isGrid ? 18 : 22} />
        </button>
      </div>
    </div>
  );
};

export default Pagination;
