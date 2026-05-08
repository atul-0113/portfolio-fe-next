"use client";

import { ChangeEvent, FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import { useAuth } from "@/app/auth/AuthContext";
import {
  createResume,
  deleteResume,
  getResume,
  getResumes,
  updateResume,
} from "@/services/resumeService";
import {
  Resume,
  ResumeExportConfigurations,
  ResumePersonalInformation,
  ResumeResponse,
  ResumeSection,
  ResumeThemeSettings,
} from "@/types/api";
import { defaultSectionFontSizes } from "@/utils/resumeTypography";

const makeId = (prefix: string) => `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}`;

const makeSlug = (value: string) =>
  value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

const initialSections: ResumeSection[] = [
  {
    id: makeId("section"),
    type: "summary",
    title: "Professional Summary",
    position: 1,
    isVisible: true,
    config: { layout: "default", showDivider: true, ...defaultSectionFontSizes },
    items: [
      {
        id: makeId("item"),
        position: 1,
        isVisible: true,
        content: {
          text: "Frontend engineer with experience in React, Next.js, and scalable UI systems.",
          aiGenerated: false,
        },
      },
    ],
  },
  {
    id: makeId("section"),
    type: "experience",
    title: "Work Experience",
    position: 2,
    isVisible: true,
    config: { layout: "timeline", showIcons: true, ...defaultSectionFontSizes },
    items: [
      {
        id: makeId("item"),
        position: 1,
        isVisible: true,
        content: {
          companyName: "ABC Technologies",
          companyWebsite: "https://abc.com",
          jobTitle: "Senior Frontend Engineer",
          employmentType: "full-time",
          location: { city: "Noida", country: "India", remote: true },
          startDate: "2023-01",
          endDate: "2025-05",
          currentlyWorking: false,
          description: "Led scalable frontend development.",
          responsibilities: ["Built reusable UI systems", "Implemented scalable frontend architecture"],
          achievements: ["Improved app performance by 35%"],
          technologies: ["React", "Next.js", "TypeScript"],
          metrics: [{ label: "Performance Improvement", value: "35%" }],
        },
      },
    ],
  },
  {
    id: makeId("section"),
    type: "education",
    title: "Education",
    position: 3,
    isVisible: true,
    config: { layout: "list", ...defaultSectionFontSizes },
    items: [
      {
        id: makeId("item"),
        position: 1,
        isVisible: true,
        content: {
          institutionName: "XYZ University",
          degree: "Bachelor of Technology",
          fieldOfStudy: "Computer Science",
          grade: "8.5 CGPA",
          startDate: "2018",
          endDate: "2022",
          description: "",
        },
      },
    ],
  },
  {
    id: makeId("section"),
    type: "skills",
    title: "Skills",
    position: 4,
    isVisible: true,
    config: { layout: "tags", ...defaultSectionFontSizes },
    items: [
      {
        id: makeId("item"),
        position: 1,
        isVisible: true,
        content: {
          category: "Frontend",
          skills: [
            { name: "React", proficiency: "advanced", yearsOfExperience: 4 },
            { name: "Next.js", proficiency: "advanced", yearsOfExperience: 3 },
          ],
        },
      },
    ],
  },
  {
    id: makeId("section"),
    type: "projects",
    title: "Projects",
    position: 5,
    isVisible: true,
    config: { layout: "cards", ...defaultSectionFontSizes },
    items: [
      {
        id: makeId("item"),
        position: 1,
        isVisible: true,
        content: {
          projectName: "PortfolioPro",
          role: "Lead Developer",
          description: "AI-powered portfolio and resume SaaS platform.",
          technologies: ["Next.js", "Node.js", "PostgreSQL"],
          features: ["Drag-drop resume builder", "ATS optimization"],
          projectUrl: "",
          githubUrl: "",
          metrics: [{ label: "Users", value: "1000+" }],
          startDate: "2025-01",
          endDate: "2025-12",
          isOngoing: true,
        },
      },
    ],
  },
  {
    id: makeId("section"),
    type: "certifications",
    title: "Certifications",
    position: 6,
    isVisible: true,
    config: { layout: "list", ...defaultSectionFontSizes },
    items: [
      {
        id: makeId("item"),
        position: 1,
        isVisible: true,
        content: {
          name: "Advanced React Certification",
          issuer: "Scaler",
          credentialId: "",
          issueDate: "2024-01",
          expiryDate: null,
          credentialUrl: "",
        },
      },
    ],
  },
  {
    id: makeId("section"),
    type: "languages",
    title: "Languages",
    position: 7,
    isVisible: true,
    config: { layout: "chips", ...defaultSectionFontSizes },
    items: [
      {
        id: makeId("item"),
        position: 1,
        isVisible: true,
        content: { language: "English", proficiency: "professional" },
      },
    ],
  },
  {
    id: makeId("section"),
    type: "custom",
    title: "Volunteer Experience",
    position: 8,
    isVisible: true,
    config: { layout: "list", ...defaultSectionFontSizes },
    items: [
      {
        id: makeId("item"),
        position: 1,
        isVisible: true,
        content: {
          title: "NGO Volunteer",
          organization: "Helping Hands",
          description: "Conducted technical workshops.",
          startDate: "2024-01",
          endDate: "2024-06",
        },
      },
    ],
  },
];

const initialPersonalInformation: ResumePersonalInformation = {
  firstName: "Atul",
  lastName: "Sharma",
  fullName: "Atul Sharma",
  headline: "Senior Frontend Engineer",
  email: "atul@example.com",
  phone: "+91XXXXXXXXXX",
  location: {
    city: "Noida",
    state: "Uttar Pradesh",
    country: "India",
  },
  profilePhoto: "",
  summary: "Experienced frontend engineer specializing in scalable web applications.",
  socialLinks: {
    portfolio: "",
    linkedin: "",
    github: "",
    instagram: "",
    twitter: "",
    facebook: "",
    behance: "",
    dribbble: "",
    medium: "",
    youtube: "",
  },
};

const initialThemeSettings: ResumeThemeSettings = {
  fontFamily: "Inter",
  fontSize: 14,
  lineHeight: 1.5,
  primaryColor: "#111111",
  secondaryColor: "#666666",
  backgroundColor: "#FFFFFF",
  layout: "single-column",
  spacing: {
    sectionGap: 24,
    itemGap: 12,
    pagePadding: 32,
  },
  showIcons: true,
  showProfilePhoto: false,
  pageFormat: "A4",
};

const initialExportConfigurations: ResumeExportConfigurations = {
  allowPdfExport: true,
  allowDocxExport: true,
  allowPublicSharing: true,
  publicResumeUrl: "",
  pdfSettings: {
    pageSize: "A4",
    margin: 24,
    scale: 1,
  },
  privacy: {
    hideEmail: false,
    hidePhone: false,
    hideLocation: false,
  },
};

const initialResume: Resume = {
  metadata: {
    title: "Senior Frontend Engineer Resume",
    slug: "atul-sharma-resume",
    domain: "software-engineering",
    templateId: "",
    themeId: "",
    language: "en",
    status: "draft",
    visibility: "private",
    version: 1,
    isPrimary: false,
    tags: ["frontend", "react", "nextjs"],
    personalInformation: initialPersonalInformation,
    sections: initialSections,
    themeSettings: initialThemeSettings,
    exportConfigurations: initialExportConfigurations,
  },
  personalInformation: initialPersonalInformation,
  sections: initialSections,
  themeSettings: initialThemeSettings,
  exportConfigurations: initialExportConfigurations,
};

export const useResumeBuilder = () => {
  const { user } = useAuth();
  const [resume, setResume] = useState<Resume>(initialResume);
  const [savedResumes, setSavedResumes] = useState<ResumeResponse[]>([]);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [isPreviewLoading, setIsPreviewLoading] = useState(false);
  const [isEditorLoading, setIsEditorLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [previewResume, setPreviewResume] = useState<Resume | null>(null);

  const sectionSummary = useMemo(
    () => resume.metadata.sections.map((section) => `${section.title} (${section.items.length})`),
    [resume.metadata.sections],
  );

  const updateMetadata = useCallback((key: keyof Resume["metadata"], value: string | boolean | number | string[]) => {
    setResume((current) => ({
      ...current,
      metadata: {
        ...current.metadata,
        [key]: value,
        ...(key === "title" && typeof value === "string" ? { slug: makeSlug(value) } : {}),
      },
    }));
  }, []);

  const updatePersonalInformation = useCallback(
    (key: keyof Resume["personalInformation"], value: string) => {
      setResume((current) => {
        const currentPersonalInformation = current.metadata.personalInformation;
        const nextPersonalInformation = {
          ...currentPersonalInformation,
          [key]: value,
          ...(key === "firstName" || key === "lastName"
            ? {
                fullName: `${key === "firstName" ? value : currentPersonalInformation.firstName} ${
                  key === "lastName" ? value : currentPersonalInformation.lastName
                }`.trim(),
              }
            : {}),
        };

        return {
          ...current,
          metadata: {
            ...current.metadata,
            personalInformation: nextPersonalInformation,
          },
          personalInformation: nextPersonalInformation,
        };
      });
    },
    [],
  );

  const updateLocation = useCallback((key: string, value: string) => {
    setResume((current) => {
      const currentPersonalInformation = current.metadata.personalInformation;
      const nextPersonalInformation = {
        ...currentPersonalInformation,
        location: {
          ...currentPersonalInformation.location,
          [key]: value,
        },
      };

      return {
        ...current,
        metadata: {
          ...current.metadata,
          personalInformation: nextPersonalInformation,
        },
        personalInformation: nextPersonalInformation,
      };
    });
  }, []);

  const updateSocialLink = useCallback((key: string, value: string) => {
    setResume((current) => {
      const currentPersonalInformation = current.metadata.personalInformation;
      const nextPersonalInformation = {
        ...currentPersonalInformation,
        socialLinks: {
          ...currentPersonalInformation.socialLinks,
          [key]: value,
        },
      };

      return {
        ...current,
        metadata: {
          ...current.metadata,
          personalInformation: nextPersonalInformation,
        },
        personalInformation: nextPersonalInformation,
      };
    });
  }, []);

  const updateTags = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    updateMetadata(
      "tags",
      event.target.value
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean),
    );
  }, [updateMetadata]);

  const toggleSection = useCallback((sectionId: string) => {
    setResume((current) => {
      const nextSections = current.metadata.sections.map((section) =>
        section.id === sectionId ? { ...section, isVisible: !section.isVisible } : section,
      );

      return {
        ...current,
        metadata: {
          ...current.metadata,
          sections: nextSections,
        },
        sections: nextSections,
      };
    });
  }, []);

  const updateSectionItemContent = useCallback((sectionId: string, key: string, value: unknown) => {
    setResume((current) => {
      const nextSections = current.metadata.sections.map((section) => {
        if (section.id !== sectionId) {
          return section;
        }

        return {
          ...section,
          items: section.items.map((item, index) =>
            index === 0 ? { ...item, content: { ...item.content, [key]: value } } : item,
          ),
        };
      });

      return {
        ...current,
        metadata: {
          ...current.metadata,
          sections: nextSections,
        },
        sections: nextSections,
      };
    });
  }, []);

  const updateSectionConfig = useCallback((sectionId: string, key: string, value: unknown) => {
    setResume((current) => {
      const nextSections = current.metadata.sections.map((section) =>
        section.id === sectionId
          ? {
              ...section,
              config: {
                ...section.config,
                [key]: value,
              },
            }
          : section,
      );

      return {
        ...current,
        metadata: {
          ...current.metadata,
          sections: nextSections,
        },
        sections: nextSections,
      };
    });
  }, []);

  const fetchResumes = useCallback(async () => {
    if (!user?.token) {
      return;
    }

    setIsFetching(true);
    setError("");

    try {
      const response = await getResumes();
      setSavedResumes(response);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error fetching resumes.");
    } finally {
      setIsFetching(false);
    }
  }, [user?.token]);

  const setActiveSavedResume = useCallback((resumeId: string) => {
    setSavedResumes((current) =>
      current.map((item) => ({
        ...item,
        resume: {
          ...item.resume,
          metadata: {
            ...item.resume.metadata,
            isPrimary: item.resume.id === resumeId,
          },
        },
      })),
    );
  }, []);

  const openResumePreview = useCallback(async (resumeId: string) => {
    setIsPreviewLoading(true);
    setError("");

    try {
      const response = await getResume(resumeId);
      setPreviewResume(response.resume);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error loading resume preview.");
    } finally {
      setIsPreviewLoading(false);
    }
  }, []);

  const closeResumePreview = useCallback(() => {
    setPreviewResume(null);
  }, []);

  const loadResumeForEditing = useCallback(async (resumeId: string) => {
    setIsEditorLoading(true);
    setError("");
    setSuccessMessage("");

    try {
      const response = await getResume(resumeId);
      setResume(response.resume);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error loading resume.");
    } finally {
      setIsEditorLoading(false);
    }
  }, []);

  const patchSavedResume = useCallback(async (resumeToUpdate: Resume) => {
    if (!resumeToUpdate.id) {
      return;
    }

    setIsSaving(true);
    setError("");
    setSuccessMessage("");

    try {
      const response = await updateResume(resumeToUpdate.id, resumeToUpdate);
      setSuccessMessage("Resume updated successfully.");
      setPreviewResume(response.resume);
      setSavedResumes((current) =>
        current.map((item) =>
          item.resume.id === response.resume.id ? response : item,
        ),
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error updating resume.");
    } finally {
      setIsSaving(false);
    }
  }, []);

  const removeSavedResume = useCallback(async (resumeId: string) => {
    setIsDeleting(true);
    setError("");
    setSuccessMessage("");

    try {
      await deleteResume(resumeId);
      setSuccessMessage("Resume deleted successfully.");
      setPreviewResume((current) => (current?.id === resumeId ? null : current));
      setSavedResumes((current) => current.filter((item) => item.resume.id !== resumeId));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error deleting resume.");
    } finally {
      setIsDeleting(false);
    }
  }, []);

  const saveResume = useCallback(async () => {
    setIsSaving(true);
    setError("");
    setSuccessMessage("");

    try {
      const response = resume.id
        ? await updateResume(resume.id, resume)
        : await createResume(resume);
      setSuccessMessage(resume.id ? "Resume updated successfully." : "Resume saved successfully.");
      setResume(response.resume);
      setSavedResumes((current) => {
        if (!response.resume.id) {
          return [response, ...current];
        }

        const existingIndex = current.findIndex((item) => item.resume.id === response.resume.id);

        if (existingIndex === -1) {
          return [response, ...current];
        }

        return current.map((item) =>
          item.resume.id === response.resume.id ? response : item,
        );
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error saving resume.");
    } finally {
      setIsSaving(false);
    }
  }, [resume]);

  const handleSubmit = useCallback(async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await saveResume();
  }, [saveResume]);

  useEffect(() => {
    fetchResumes();
  }, [fetchResumes]);

  return {
    error,
    isFetching,
    isDeleting,
    isEditorLoading,
    isPreviewLoading,
    isSaving,
    previewResume,
    resume,
    savedResumes,
    sectionSummary,
    successMessage,
    fetchResumes,
    handleSubmit,
    saveResume,
    closeResumePreview,
    loadResumeForEditing,
    openResumePreview,
    patchSavedResume,
    removeSavedResume,
    setActiveSavedResume,
    toggleSection,
    updateLocation,
    updateMetadata,
    updatePersonalInformation,
    updateSectionConfig,
    updateSectionItemContent,
    updateSocialLink,
    updateTags,
  };
};
