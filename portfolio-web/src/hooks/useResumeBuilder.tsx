"use client";

import { ChangeEvent, FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import { useAuth } from "@/app/auth/AuthContext";
import { createResume, getResumes } from "@/services/resumeService";
import { Resume, ResumeResponse, ResumeSection } from "@/types/api";

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
    config: { layout: "default", showDivider: true },
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
    config: { layout: "timeline", showIcons: true },
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
    config: { layout: "list" },
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
    config: { layout: "tags" },
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
    config: { layout: "cards" },
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
    config: { layout: "list" },
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
    config: { layout: "chips" },
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
    config: { layout: "list" },
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
  },
  personalInformation: {
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
      twitter: "",
      behance: "",
      dribbble: "",
      medium: "",
      youtube: "",
    },
  },
  sections: initialSections,
  themeSettings: {
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
  },
  exportConfigurations: {
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
  },
};

export const useResumeBuilder = () => {
  const { user } = useAuth();
  const [resume, setResume] = useState<Resume>(initialResume);
  const [savedResumes, setSavedResumes] = useState<ResumeResponse[]>([]);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isFetching, setIsFetching] = useState(false);

  const sectionSummary = useMemo(
    () => resume.sections.map((section) => `${section.title} (${section.items.length})`),
    [resume.sections],
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
      setResume((current) => ({
        ...current,
        personalInformation: {
          ...current.personalInformation,
          [key]: value,
          ...(key === "firstName" || key === "lastName"
            ? {
                fullName: `${key === "firstName" ? value : current.personalInformation.firstName} ${
                  key === "lastName" ? value : current.personalInformation.lastName
                }`.trim(),
              }
            : {}),
        },
      }));
    },
    [],
  );

  const updateLocation = useCallback((key: string, value: string) => {
    setResume((current) => ({
      ...current,
      personalInformation: {
        ...current.personalInformation,
        location: {
          ...current.personalInformation.location,
          [key]: value,
        },
      },
    }));
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
    setResume((current) => ({
      ...current,
      sections: current.sections.map((section) =>
        section.id === sectionId ? { ...section, isVisible: !section.isVisible } : section,
      ),
    }));
  }, []);

  const updateSectionItemContent = useCallback((sectionId: string, key: string, value: unknown) => {
    setResume((current) => ({
      ...current,
      sections: current.sections.map((section) => {
        if (section.id !== sectionId) {
          return section;
        }

        return {
          ...section,
          items: section.items.map((item, index) =>
            index === 0 ? { ...item, content: { ...item.content, [key]: value } } : item,
          ),
        };
      }),
    }));
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

  const saveResume = useCallback(async () => {
    setIsSaving(true);
    setError("");
    setSuccessMessage("");

    try {
      const response = await createResume(resume);
      setSuccessMessage("Resume saved successfully.");
      setSavedResumes((current) => [response, ...current]);
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
    isSaving,
    resume,
    savedResumes,
    sectionSummary,
    successMessage,
    fetchResumes,
    handleSubmit,
    saveResume,
    setActiveSavedResume,
    toggleSection,
    updateLocation,
    updateMetadata,
    updatePersonalInformation,
    updateSectionItemContent,
    updateTags,
  };
};
