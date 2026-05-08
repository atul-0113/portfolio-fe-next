import api from "@/helper/apiRequest";
import { Resume, ResumeResponse } from "@/types/api";

type ResumeRecord = Record<string, unknown>;
type ResumeApiResponse = ResumeResponse | Resume | null | undefined;

const isRecord = (value: unknown): value is ResumeRecord =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const getString = (source: ResumeRecord, key: string, fallback = "") => {
  const value = source[key];
  return typeof value === "string" ? value : fallback;
};

const getBoolean = (source: ResumeRecord, key: string, fallback = false) => {
  const value = source[key];
  return typeof value === "boolean" ? value : fallback;
};

const getNumber = (source: ResumeRecord, key: string, fallback: number) => {
  const value = source[key];
  return typeof value === "number" ? value : fallback;
};

const getStringArray = (source: ResumeRecord, key: string) => {
  const value = source[key];
  return Array.isArray(value)
    ? value.filter((item): item is string => typeof item === "string")
    : [];
};

const makeSlug = (value: string) =>
  value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

const normalizeResumeResponse = (response: ResumeApiResponse): ResumeResponse | null => {
  if (!isRecord(response)) {
    return null;
  }

  const resumeSource = isRecord(response.resume) ? response.resume : response;
  const metadataSource = isRecord(resumeSource.metadata) ? resumeSource.metadata : {};
  const userSource = isRecord(resumeSource.user) ? resumeSource.user : {};
  const personalSource = isRecord(resumeSource.personalInformation)
    ? resumeSource.personalInformation
    : {};
  const locationSource = isRecord(personalSource.location) ? personalSource.location : {};
  const themeSource = isRecord(resumeSource.themeSettings) ? resumeSource.themeSettings : {};
  const spacingSource = isRecord(themeSource.spacing) ? themeSource.spacing : {};
  const exportSource = isRecord(resumeSource.exportConfigurations)
    ? resumeSource.exportConfigurations
    : {};
  const pdfSource = isRecord(exportSource.pdfSettings) ? exportSource.pdfSettings : {};
  const privacySource = isRecord(exportSource.privacy) ? exportSource.privacy : {};
  const title =
    getString(metadataSource, "title") ||
    getString(resumeSource, "title") ||
    "Untitled Resume";
  const slug =
    getString(metadataSource, "slug") ||
    getString(resumeSource, "slug") ||
    makeSlug(title);
  const sections = Array.isArray(resumeSource.sections) ? resumeSource.sections : [];

  return {
    resume: {
      id: getString(resumeSource, "id") || undefined,
      userId: getString(resumeSource, "userId") || getString(userSource, "id") || undefined,
      workspaceId: getString(resumeSource, "workspaceId") || undefined,
      user: isRecord(resumeSource.user)
        ? {
            id: getString(userSource, "id"),
            name: getString(userSource, "name"),
            email: getString(userSource, "email"),
          }
        : undefined,
      metadata: {
        title,
        slug,
        domain: getString(metadataSource, "domain") || getString(resumeSource, "domain"),
        templateId: getString(metadataSource, "templateId") || getString(resumeSource, "templateId"),
        themeId: getString(metadataSource, "themeId") || getString(resumeSource, "themeId"),
        language: getString(metadataSource, "language") || getString(resumeSource, "language", "en"),
        status:
          getString(metadataSource, "status") === "published" ||
          getString(resumeSource, "status") === "published"
            ? "published"
            : getString(metadataSource, "status") === "archived" ||
                getString(resumeSource, "status") === "archived"
              ? "archived"
              : "draft",
        visibility:
          getString(metadataSource, "visibility") === "public" ||
          getString(resumeSource, "visibility") === "public"
            ? "public"
            : "private",
        version: getNumber(metadataSource, "version", getNumber(resumeSource, "version", 1)),
        isPrimary: getBoolean(metadataSource, "isPrimary", getBoolean(resumeSource, "isPrimary")),
        tags: getStringArray(metadataSource, "tags").length
          ? getStringArray(metadataSource, "tags")
          : getStringArray(resumeSource, "tags"),
        createdAt: getString(metadataSource, "createdAt") || getString(resumeSource, "createdAt") || undefined,
        updatedAt: getString(metadataSource, "updatedAt") || getString(resumeSource, "updatedAt") || undefined,
      },
      personalInformation: {
        firstName: getString(personalSource, "firstName"),
        lastName: getString(personalSource, "lastName"),
        fullName: getString(personalSource, "fullName") || getString(userSource, "name") || "Untitled Candidate",
        headline: getString(personalSource, "headline"),
        email: getString(personalSource, "email") || getString(userSource, "email"),
        phone: getString(personalSource, "phone"),
        location: {
          city: getString(locationSource, "city"),
          state: getString(locationSource, "state"),
          country: getString(locationSource, "country"),
          remote: getBoolean(locationSource, "remote"),
        },
        profilePhoto: getString(personalSource, "profilePhoto"),
        summary: getString(personalSource, "summary"),
        socialLinks: isRecord(personalSource.socialLinks)
          ? Object.fromEntries(
              Object.entries(personalSource.socialLinks).map(([key, value]) => [
                key,
                typeof value === "string" ? value : "",
              ]),
            )
          : {},
      },
      sections: sections as Resume["sections"],
      themeSettings: {
        fontFamily: getString(themeSource, "fontFamily", "Inter"),
        fontSize: getNumber(themeSource, "fontSize", 14),
        lineHeight: getNumber(themeSource, "lineHeight", 1.5),
        primaryColor: getString(themeSource, "primaryColor", "#111111"),
        secondaryColor: getString(themeSource, "secondaryColor", "#666666"),
        backgroundColor: getString(themeSource, "backgroundColor", "#FFFFFF"),
        layout: getString(themeSource, "layout", "single-column"),
        spacing: {
          sectionGap: getNumber(spacingSource, "sectionGap", 24),
          itemGap: getNumber(spacingSource, "itemGap", 12),
          pagePadding: getNumber(spacingSource, "pagePadding", 32),
        },
        showIcons: getBoolean(themeSource, "showIcons", true),
        showProfilePhoto: getBoolean(themeSource, "showProfilePhoto"),
        pageFormat: getString(themeSource, "pageFormat", "A4"),
      },
      exportConfigurations: {
        allowPdfExport: getBoolean(exportSource, "allowPdfExport", true),
        allowDocxExport: getBoolean(exportSource, "allowDocxExport", true),
        allowPublicSharing: getBoolean(exportSource, "allowPublicSharing", true),
        publicResumeUrl: getString(exportSource, "publicResumeUrl"),
        pdfSettings: {
          pageSize: getString(pdfSource, "pageSize", "A4"),
          margin: getNumber(pdfSource, "margin", 24),
          scale: getNumber(pdfSource, "scale", 1),
        },
        privacy: {
          hideEmail: getBoolean(privacySource, "hideEmail"),
          hidePhone: getBoolean(privacySource, "hidePhone"),
          hideLocation: getBoolean(privacySource, "hideLocation"),
        },
      },
    },
  };
};

const normalizeResumeList = (response: unknown) => {
  const list =
    Array.isArray(response)
      ? response
      : isRecord(response) && Array.isArray(response.resumes)
        ? response.resumes
        : isRecord(response) && Array.isArray(response.data)
          ? response.data
          : [];

  return list
    .map((item) => normalizeResumeResponse(item as ResumeApiResponse))
    .filter((item): item is ResumeResponse => Boolean(item));
};

export const getResumes = async () => {
  const response = await api.get("resumes");
  return normalizeResumeList(response);
};

const ensureResume = (response: ResumeApiResponse): ResumeResponse => {
  const normalized = normalizeResumeResponse(response);

  if (!normalized) {
    throw new Error("Invalid resume response.");
  }

  return normalized;
};

export const createResume = async (resume: Resume) => {
  const { metadata } = resume;
  const payload = {
    title: metadata.title,
    slug: metadata.slug,
    domain: metadata.domain,
    templateId: metadata.templateId,
    themeId: metadata.themeId,
    language: metadata.language,
    status: metadata.status,
    visibility: metadata.visibility,
    version: metadata.version,
    isPrimary: metadata.isPrimary,
    tags: metadata.tags,
    metadata,
    personalInformation: resume.personalInformation,
    sections: resume.sections,
    themeSettings: resume.themeSettings,
    exportConfigurations: resume.exportConfigurations,
  };

  const response = (await api.post("resumes", payload)) as ResumeApiResponse;
  return ensureResume(response);
};

export const getResume = async (id: string) => {
  const response = (await api.get(`resumes/${id}`)) as ResumeApiResponse;
  return ensureResume(response);
};

export type SaveResumePayload = Resume;
