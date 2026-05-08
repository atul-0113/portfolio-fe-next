import type { CSSProperties } from "react";
import type { ResumeSection } from "@/types/api";

export type SectionFontSizeKey =
  | "headingFontSize"
  | "itemTitleFontSize"
  | "metaFontSize"
  | "paragraphFontSize";

export const defaultSectionFontSizes: Record<SectionFontSizeKey, number> = {
  headingFontSize: 18,
  itemTitleFontSize: 22,
  metaFontSize: 16,
  paragraphFontSize: 18,
};

export const sectionTypographyControls: Array<{
  key: SectionFontSizeKey;
  label: string;
}> = [
  { key: "headingFontSize", label: "Heading" },
  { key: "itemTitleFontSize", label: "Title" },
  { key: "metaFontSize", label: "Details" },
  { key: "paragraphFontSize", label: "Paragraph" },
];

export const sectionFontSizeOptions = [12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 24, 26, 28, 30];

export const getSectionFontSize = (section: ResumeSection, key: SectionFontSizeKey) => {
  const value = section.config?.[key];
  const parsedValue = typeof value === "number" ? value : Number(value);

  if (Number.isFinite(parsedValue) && parsedValue >= 10 && parsedValue <= 48) {
    return parsedValue;
  }

  return defaultSectionFontSizes[key];
};

export const getSectionFontSizeStyle = (
  section: ResumeSection,
  key: SectionFontSizeKey,
): CSSProperties => ({
  fontSize: `${getSectionFontSize(section, key)}px`,
});
