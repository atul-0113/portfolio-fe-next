import type { PortfolioData, PortfolioTemplateSchema } from "./types";

export const PORTFOLIO_PREVIEW_STORAGE_PREFIX = "portfolio-builder-preview:";

export interface PortfolioPreviewPayload {
  template: PortfolioTemplateSchema;
  data: PortfolioData;
  createdAt: string;
}

export const createPortfolioPreviewId = () => {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
};

export const getPortfolioPreviewStorageKey = (previewId: string) =>
  `${PORTFOLIO_PREVIEW_STORAGE_PREFIX}${previewId}`;
