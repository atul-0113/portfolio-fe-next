"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useAuth } from "@/app/auth/AuthContext";
import { buildPaginationPages, buildPaginationSummary } from "@/components/Pagination";
import { getTemplates } from "@/services/templateService";
import { TemplateResponse } from "@/types/api";

export interface TemplateLibraryItem {
  id: string;
  name: string;
  category: string;
  usage: string;
  imageSrc: string;
  source?: TemplateResponse;
}

const fallbackTemplateItems: TemplateLibraryItem[] = [
  {
    id: "minimalist-architect",
    name: "Minimalist Architect",
    category: "Design",
    usage: "Used by 1.2k users",
    imageSrc: "/images/cards/cards-01.png",
  },
  {
    id: "modern-executive",
    name: "Modern Executive",
    category: "Marketing",
    usage: "Used by 840 users",
    imageSrc: "/images/cards/cards-05.png",
  },
  {
    id: "creative-showcase",
    name: "Creative Showcase",
    category: "Engineering",
    usage: "Used by 2.1k users",
    imageSrc: "/images/product/product-04.png",
  },
  {
    id: "brand-storyteller",
    name: "Brand Storyteller",
    category: "Marketing",
    usage: "Used by 450 users",
    imageSrc: "/images/cards/cards-06.png",
  },
  {
    id: "data-narrative",
    name: "Data Narrative",
    category: "Engineering",
    usage: "Used by 620 users",
    imageSrc: "/images/product/product-03.png",
  },
];

const templateImages = [
  "/images/cards/cards-01.png",
  "/images/cards/cards-05.png",
  "/images/product/product-04.png",
  "/images/cards/cards-06.png",
  "/images/product/product-03.png",
];

const templateUsage = [
  "Used by 1.2k users",
  "Used by 840 users",
  "Used by 2.1k users",
  "Used by 450 users",
  "Used by 620 users",
];

const TEMPLATE_PAGE_SIZE = 6;

const toTemplateLibraryItems = (templates: TemplateResponse[]): TemplateLibraryItem[] => {
  if (templates.length === 0) {
    return fallbackTemplateItems;
  }

  return templates.slice(0, 5).map((template, index) => ({
    id: template.id,
    name: template.templateName,
    category: template.categoryType || "Design",
    usage: templateUsage[index] || "Used by 120 users",
    imageSrc: templateImages[index] || templateImages[0],
    source: template,
  }));
};

export const useTemplates = () => {
  const { user } = useAuth();
  const [templates, setTemplates] = useState<TemplateResponse[]>([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const refreshTemplates = useCallback(async () => {
    if (!user?.token) {
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const response = await getTemplates();
      setTemplates(response);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error fetching templates.");
    } finally {
      setIsLoading(false);
    }
  }, [user?.token]);

  useEffect(() => {
    refreshTemplates();
  }, [refreshTemplates]);

  return {
    templates,
    error,
    isLoading,
    refreshTemplates,
  };
};

export const useTemplateLibrary = () => {
  const { templates, error, isLoading, refreshTemplates } = useTemplates();
  const templateItems = useMemo(() => toTemplateLibraryItems(templates), [templates]);
  const templateTotal = templates.length || fallbackTemplateItems.length;
  const filters = ["All Templates", "Design", "Engineering", "Marketing", "Executive"];
  const paginationPages = buildPaginationPages(templateTotal, TEMPLATE_PAGE_SIZE);
  const resultSummary = buildPaginationSummary(templateTotal, TEMPLATE_PAGE_SIZE, "templates");

  return {
    error,
    filters,
    isLoading,
    paginationPages,
    refreshTemplates,
    resultSummary,
    templateItems,
  };
};
