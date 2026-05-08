"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import DefaultLayout from "@/components/Layouts/DefaultLaout";
import { useResumeBuilder } from "@/hooks/useResumeBuilder";
import { colorClasses } from "@/styles/theme";
import { componentStyles, cx, layoutStyles, typographyStyles } from "@/styles/ui";
import { Resume, ResumeSection } from "@/types/api";
import {
  FiCheckCircle,
  FiChevronLeft,
  FiChevronRight,
  FiEdit3,
  FiEye,
  FiEyeOff,
  FiSave,
  FiSearch,
  FiX,
} from "react-icons/fi";

type BuilderStep =
  | {
      type: "personal";
      title: string;
    }
  | {
      type: "section";
      title: string;
      section: ResumeSection;
    };

const getString = (value: unknown) => (typeof value === "string" ? value : "");

const toList = (value: string) =>
  value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);

const getStringList = (value: unknown) =>
  Array.isArray(value) ? value.filter((item) => typeof item === "string") : [];

const getSkillNames = (value: unknown) =>
  Array.isArray(value)
    ? value
        .map((skill) =>
          typeof skill === "object" && skill && "name" in skill
            ? String(skill.name)
            : "",
        )
        .filter(Boolean)
    : [];

const formatKey = (key: string) =>
  key
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (character) => character.toUpperCase());

const editableFrame =
  "group relative -mx-3 rounded-md border border-transparent px-3 py-2 transition hover:border-dashed hover:border-[#3525cd] hover:bg-[#f8f9fa]";

const editButton =
  "absolute right-3 top-3 hidden h-11 w-11 items-center justify-center rounded-md border border-[#c7c4d8] bg-white text-[#303041] shadow-lg transition hover:border-[#3525cd] hover:text-[#3525cd] group-hover:flex";

const EditableBlock = ({
  children,
  label,
  onEdit,
}: {
  children: React.ReactNode;
  label: string;
  onEdit: () => void;
}) => (
  <div className={editableFrame}>
    {children}
    <button type="button" onClick={onEdit} className={editButton} aria-label={`Edit ${label}`}>
      <FiEdit3 size={22} />
    </button>
  </div>
);

const ResumeDivider = () => <div className="my-7 border-t border-[#c9c9c9]" />;

const ResumeSectionView = ({
  section,
  onEdit,
}: {
  section: ResumeSection;
  onEdit: () => void;
}) => {
  const content = section.items[0]?.content || {};

  if (!section.isVisible) {
    return null;
  }

  if (section.type === "summary") {
    return (
      <EditableBlock label={section.title} onEdit={onEdit}>
        <h2 className="mb-4 text-[18px] font-black leading-tight text-black">Summary</h2>
        <p className="font-serif text-[18px] leading-8 text-[#6f6f6f]">
          {getString(content.text) ||
            "Enter a brief description of your professional background."}
        </p>
      </EditableBlock>
    );
  }

  if (section.type === "education") {
    return (
      <>
        <EditableBlock label={section.title} onEdit={onEdit}>
          <h2 className="mb-7 text-[18px] font-black leading-tight text-black">Education</h2>
          <div className="flex items-start justify-between gap-8">
            <div>
              <h3 className="text-[22px] font-black text-[#707070]">
                {getString(content.institutionName) || "Graduated school"}
              </h3>
              <p className="mt-1 text-[16px] text-[#707070]">
                {getString(content.fieldOfStudy) || "Field of study"} ·{" "}
                {getString(content.degree) || "Location"}
              </p>
            </div>
            <p className="shrink-0 text-[16px] text-[#707070]">
              {getString(content.endDate) || "Graduation Date"}
            </p>
          </div>
          <p className="mt-4 font-serif text-[18px] leading-8 text-[#6f6f6f]">
            {getString(content.description) ||
              "Enter any colleges, universities, or training programs that you have attended."}
          </p>
        </EditableBlock>
        <ResumeDivider />
      </>
    );
  }

  if (section.type === "skills") {
    const skills = getSkillNames(content.skills);

    return (
      <>
        <EditableBlock label={section.title} onEdit={onEdit}>
          <h2 className="mb-5 text-[18px] font-black leading-tight text-black">Skills</h2>
          <p className="font-serif text-[18px] leading-8 text-[#6f6f6f]">
            {skills.length > 0 ? skills.join(", ") : "List 3-4 special, work-related, talents skills."}
          </p>
        </EditableBlock>
        <ResumeDivider />
      </>
    );
  }

  if (section.type === "experience") {
    return (
      <EditableBlock label={section.title} onEdit={onEdit}>
        <h2 className="mb-7 text-[18px] font-black leading-tight text-black">Experience</h2>
        <div className="space-y-7">
          <div>
            <div className="flex items-start justify-between gap-8">
              <div>
                <h3 className="text-[22px] font-black text-[#707070]">
                  {getString(content.companyName) || "Company A"}
                </h3>
                <p className="mt-1 text-[16px] text-[#707070]">
                  {getString(content.jobTitle) || "Sales Representative"} ·{" "}
                  {typeof content.location === "object" && content.location
                    ? getString((content.location as { city?: string }).city) || "Location"
                    : "Location"}
                </p>
              </div>
              <p className="shrink-0 text-[16px] text-[#707070]">
                {[getString(content.startDate), getString(content.endDate)].filter(Boolean).join(" - ") ||
                  "Start and end date"}
              </p>
            </div>
            <p className="mt-4 font-serif text-[18px] leading-8 text-[#6f6f6f]">
              {getString(content.description) || "Enter key responsibilities and accomplishments."}
            </p>
          </div>
          {getStringList(content.achievements).length > 0 && (
            <ul className="list-disc space-y-2 pl-6 font-serif text-[17px] leading-7 text-[#6f6f6f]">
              {getStringList(content.achievements).map((achievement) => (
                <li key={achievement}>{achievement}</li>
              ))}
            </ul>
          )}
        </div>
      </EditableBlock>
    );
  }

  if (section.type === "projects") {
    return (
      <>
        <EditableBlock label={section.title} onEdit={onEdit}>
          <h2 className="mb-5 text-[18px] font-black leading-tight text-black">Projects</h2>
          <h3 className="text-[22px] font-black text-[#707070]">
            {getString(content.projectName) || "Project name"}
          </h3>
          <p className="mt-2 font-serif text-[18px] leading-8 text-[#6f6f6f]">
            {getString(content.description) || "Describe your project impact."}
          </p>
          <p className="mt-3 text-[15px] text-[#707070]">
            {getStringList(content.technologies).join(" · ")}
          </p>
        </EditableBlock>
        <ResumeDivider />
      </>
    );
  }

  return (
    <>
      <EditableBlock label={section.title} onEdit={onEdit}>
        <h2 className="mb-5 text-[18px] font-black leading-tight text-black">{section.title}</h2>
        <div className="font-serif text-[18px] leading-8 text-[#6f6f6f]">
          {Object.entries(content)
            .filter(([, value]) => typeof value === "string" && value)
            .slice(0, 3)
            .map(([key, value]) => (
              <p key={key}>
                <span className="font-sans text-[16px] font-black text-[#707070]">{formatKey(key)}:</span>{" "}
                {String(value)}
              </p>
            ))}
        </div>
      </EditableBlock>
      <ResumeDivider />
    </>
  );
};

const PersonalFields = ({
  resume,
  updatePersonalInformation,
  updateLocation,
}: {
  resume: Resume;
  updatePersonalInformation: (key: keyof Resume["personalInformation"], value: string) => void;
  updateLocation: (key: string, value: string) => void;
}) => (
  <div className="grid gap-4 md:grid-cols-2">
    {[
      ["firstName", "First Name"],
      ["lastName", "Last Name"],
      ["headline", "Headline"],
      ["email", "Email"],
      ["phone", "Phone"],
    ].map(([key, label]) => (
      <label key={key}>
        <span className={typographyStyles.label}>{label}</span>
        <input
          value={String(resume.personalInformation[key as keyof Resume["personalInformation"]])}
          onChange={(event) =>
            updatePersonalInformation(key as keyof Resume["personalInformation"], event.target.value)
          }
          className={`mt-1.5 h-11 w-full px-3 ${componentStyles.input}`}
        />
      </label>
    ))}

    {[
      ["city", "City"],
      ["state", "State"],
      ["country", "Country"],
    ].map(([key, label]) => (
      <label key={key}>
        <span className={typographyStyles.label}>{label}</span>
        <input
          value={String(resume.personalInformation.location[key as keyof Resume["personalInformation"]["location"]] || "")}
          onChange={(event) => updateLocation(key, event.target.value)}
          className={`mt-1.5 h-11 w-full px-3 ${componentStyles.input}`}
        />
      </label>
    ))}
  </div>
);

const SectionFields = ({
  section,
  onToggle,
  onUpdateContent,
}: {
  section: ResumeSection;
  onToggle: (sectionId: string) => void;
  onUpdateContent: (sectionId: string, key: string, value: unknown) => void;
}) => {
  const content = section.items[0]?.content || {};

  return (
    <div className="space-y-5">
      <label className="flex w-fit items-center gap-2 rounded-md bg-[#f8f9fa] px-3 py-2 text-sm font-semibold text-[#191c1d]">
        <input
          type="checkbox"
          checked={section.isVisible}
          onChange={() => onToggle(section.id)}
          className="h-4 w-4 rounded border-[#c7c4d8]"
        />
        Visible on resume
      </label>

      {section.type === "summary" && (
        <textarea
          rows={12}
          value={getString(content.text)}
          onChange={(event) => onUpdateContent(section.id, "text", event.target.value)}
          className={`w-full resize-none px-4 py-4 text-lg leading-8 ${componentStyles.input}`}
          placeholder="e.g. Experience working closely and efficiently with clients..."
        />
      )}

      {section.type === "experience" && (
        <div className="grid gap-4 md:grid-cols-2">
          {[
            ["companyName", "Company"],
            ["jobTitle", "Job Title"],
            ["startDate", "Start Date"],
            ["endDate", "End Date"],
          ].map(([key, label]) => (
            <label key={key}>
              <span className={typographyStyles.label}>{label}</span>
              <input
                value={getString(content[key])}
                onChange={(event) => onUpdateContent(section.id, key, event.target.value)}
                className={`mt-1.5 h-11 w-full px-3 ${componentStyles.input}`}
              />
            </label>
          ))}
          <label className="md:col-span-2">
            <span className={typographyStyles.label}>Description</span>
            <textarea
              rows={5}
              value={getString(content.description)}
              onChange={(event) => onUpdateContent(section.id, "description", event.target.value)}
              className={`mt-1.5 w-full resize-none px-3 py-3 ${componentStyles.input}`}
            />
          </label>
          <label>
            <span className={typographyStyles.label}>Achievements</span>
            <input
              value={getStringList(content.achievements).join(", ")}
              onChange={(event) => onUpdateContent(section.id, "achievements", toList(event.target.value))}
              className={`mt-1.5 h-11 w-full px-3 ${componentStyles.input}`}
            />
          </label>
          <label>
            <span className={typographyStyles.label}>Technologies</span>
            <input
              value={getStringList(content.technologies).join(", ")}
              onChange={(event) => onUpdateContent(section.id, "technologies", toList(event.target.value))}
              className={`mt-1.5 h-11 w-full px-3 ${componentStyles.input}`}
            />
          </label>
        </div>
      )}

      {section.type === "education" && (
        <div className="grid gap-4 md:grid-cols-2">
          {[
            ["institutionName", "Institution"],
            ["degree", "Degree"],
            ["fieldOfStudy", "Field of Study"],
            ["grade", "Grade"],
            ["startDate", "Start Date"],
            ["endDate", "Graduation Date"],
          ].map(([key, label]) => (
            <label key={key}>
              <span className={typographyStyles.label}>{label}</span>
              <input
                value={getString(content[key])}
                onChange={(event) => onUpdateContent(section.id, key, event.target.value)}
                className={`mt-1.5 h-11 w-full px-3 ${componentStyles.input}`}
              />
            </label>
          ))}
          <label className="md:col-span-2">
            <span className={typographyStyles.label}>Description</span>
            <textarea
              rows={4}
              value={getString(content.description)}
              onChange={(event) => onUpdateContent(section.id, "description", event.target.value)}
              className={`mt-1.5 w-full resize-none px-3 py-3 ${componentStyles.input}`}
            />
          </label>
        </div>
      )}

      {section.type === "skills" && (
        <div className="grid gap-4 md:grid-cols-[220px_1fr]">
          <label>
            <span className={typographyStyles.label}>Category</span>
            <input
              value={getString(content.category)}
              onChange={(event) => onUpdateContent(section.id, "category", event.target.value)}
              className={`mt-1.5 h-11 w-full px-3 ${componentStyles.input}`}
            />
          </label>
          <label>
            <span className={typographyStyles.label}>Skills</span>
            <input
              value={getSkillNames(content.skills).join(", ")}
              onChange={(event) =>
                onUpdateContent(
                  section.id,
                  "skills",
                  toList(event.target.value).map((name) => ({
                    name,
                    proficiency: "advanced",
                    yearsOfExperience: 1,
                  })),
                )
              }
              className={`mt-1.5 h-11 w-full px-3 ${componentStyles.input}`}
            />
          </label>
        </div>
      )}

      {(section.type === "projects" || section.type === "certifications" || section.type === "languages" || section.type === "custom") && (
        <div className="grid gap-4 md:grid-cols-2">
          {Object.entries(content)
            .filter(([, value]) => typeof value === "string")
            .slice(0, 8)
            .map(([key, value]) => (
              <label key={key} className={key === "description" ? "md:col-span-2" : ""}>
                <span className={typographyStyles.label}>{formatKey(key)}</span>
                {key === "description" ? (
                  <textarea
                    rows={4}
                    value={String(value)}
                    onChange={(event) => onUpdateContent(section.id, key, event.target.value)}
                    className={`mt-1.5 w-full resize-none px-3 py-3 ${componentStyles.input}`}
                  />
                ) : (
                  <input
                    value={String(value)}
                    onChange={(event) => onUpdateContent(section.id, key, event.target.value)}
                    className={`mt-1.5 h-11 w-full px-3 ${componentStyles.input}`}
                  />
                )}
              </label>
            ))}
        </div>
      )}
    </div>
  );
};

const examples = [
  "Caring, creative professional with [x] years of experience and a track record of high-quality delivery.",
  "Skilled specialist with [x] years of experience helping teams meet customer and business needs.",
  "In-depth experience building, leading, and improving systems while following company standards.",
];

const EditModal = ({
  step,
  stepNumber,
  totalSteps,
  resume,
  onClose,
  onNext,
  onPrevious,
  onToggle,
  onUpdateContent,
  updatePersonalInformation,
  updateLocation,
}: {
  step: BuilderStep;
  stepNumber: number;
  totalSteps: number;
  resume: Resume;
  onClose: () => void;
  onNext: () => void;
  onPrevious: () => void;
  onToggle: (sectionId: string) => void;
  onUpdateContent: (sectionId: string, key: string, value: unknown) => void;
  updatePersonalInformation: (key: keyof Resume["personalInformation"], value: string) => void;
  updateLocation: (key: string, value: string) => void;
}) => (
  <div className="fixed inset-0 z-99999 flex items-center justify-center bg-[#090a0b]/55 px-4 py-6">
    <button
      type="button"
      onClick={onPrevious}
      aria-label="Previous step"
      className="absolute left-5 hidden h-13 w-13 items-center justify-center rounded-full bg-white text-[#303041] shadow-xl transition hover:text-[#3525cd] md:flex"
    >
      <FiChevronLeft size={28} />
    </button>

    <div className="flex max-h-[calc(100vh-3rem)] w-full max-w-[1080px] flex-col overflow-hidden rounded-lg bg-white shadow-2xl">
      <div className={`flex items-center justify-between border-b ${colorClasses.border} px-6 py-5`}>
        <div className="w-24 text-sm font-semibold text-[#777587]">
          {stepNumber}/{totalSteps}
        </div>
        <h2 className="text-center text-[24px] font-black text-[#303041]">{step.title}</h2>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close editor"
          className="flex w-24 justify-end text-[#303041] transition hover:text-[#3525cd]"
        >
          <FiX size={26} />
        </button>
      </div>

      <div className="grid min-h-0 flex-1 overflow-y-auto lg:grid-cols-[minmax(0,1fr)_390px]">
        <div className="px-6 py-8 md:px-10">
          <h3 className="mb-5 text-[20px] font-black text-[#303041]">
            {step.type === "personal" ? "How should your header appear?" : `Edit ${step.title.toLowerCase()}`}
          </h3>
          {step.type === "personal" ? (
            <PersonalFields
              resume={resume}
              updatePersonalInformation={updatePersonalInformation}
              updateLocation={updateLocation}
            />
          ) : (
            <SectionFields
              section={step.section}
              onToggle={onToggle}
              onUpdateContent={onUpdateContent}
            />
          )}
        </div>

        <aside className="border-t border-[#ececec] bg-[#f8f9fa] px-6 py-8 lg:border-l lg:border-t-0">
          <div className="flex gap-8 border-b border-[#dcdde0] text-[18px] font-black">
            <span className="pb-3 text-[#707070]">Tips</span>
            <span className="border-b-2 border-[#2d5bb3] pb-3 text-[#2d5bb3]">Examples</span>
          </div>
          <label className="mt-6 flex h-12 items-center gap-3 rounded-lg bg-white px-4 text-[#707070]">
            <input
              placeholder="Search job titles"
              className="min-w-0 flex-1 bg-transparent text-base outline-none"
            />
            <FiSearch size={22} />
          </label>
          <div className="mt-5 space-y-4">
            {examples.map((example) => (
              <button
                key={example}
                type="button"
                className="grid w-full grid-cols-[38px_1fr] items-center gap-4 rounded-lg bg-white px-5 py-5 text-left text-[16px] leading-6 text-[#303041] transition hover:text-[#2d5bb3]"
              >
                <span className="text-[34px] leading-none">+</span>
                <span>{example}</span>
              </button>
            ))}
          </div>
        </aside>
      </div>

      <div className={`flex items-center justify-between border-t ${colorClasses.border} px-6 py-5`}>
        <div className="flex gap-3 md:hidden">
          <button type="button" onClick={onPrevious} className={componentStyles.buttonSecondary}>
            Prev
          </button>
          <button type="button" onClick={onNext} className={componentStyles.buttonSecondary}>
            Next
          </button>
        </div>
        <div className="ml-auto flex gap-3">
          <button type="button" onClick={onClose} className={componentStyles.buttonSecondary}>
            Cancel
          </button>
          <button type="button" onClick={onClose} className={componentStyles.buttonPrimaryCompact}>
            Save
          </button>
        </div>
      </div>
    </div>

    <button
      type="button"
      onClick={onNext}
      aria-label="Next step"
      className="absolute right-5 hidden h-13 w-13 items-center justify-center rounded-full bg-white text-[#303041] shadow-xl transition hover:text-[#3525cd] md:flex"
    >
      <FiChevronRight size={28} />
    </button>
  </div>
);

const ResumeBuilder = () => {
  const {
    error,
    isSaving,
    resume,
    saveResume,
    successMessage,
    toggleSection,
    updateLocation,
    updateMetadata,
    updatePersonalInformation,
    updateSectionItemContent,
    updateTags,
  } = useResumeBuilder();
  const router = useRouter();
  const [activeStepIndex, setActiveStepIndex] = useState<number | null>(null);

  const steps = useMemo<BuilderStep[]>(
    () => [
      { type: "personal", title: "Contact Information" },
      ...resume.sections.map((section) => ({
        type: "section" as const,
        title: section.title,
        section,
      })),
    ],
    [resume.sections],
  );

  const startedSections = resume.sections.filter((section) => section.isVisible).length;
  const activeStep = activeStepIndex === null ? null : steps[activeStepIndex];

  const openStepBySection = (sectionId: string) => {
    const nextStepIndex = steps.findIndex(
      (step) => step.type === "section" && step.section.id === sectionId,
    );
    setActiveStepIndex(nextStepIndex >= 0 ? nextStepIndex : 0);
  };

  const moveStep = (direction: number) => {
    setActiveStepIndex((current) => {
      if (current === null) {
        return 0;
      }

      return (current + direction + steps.length) % steps.length;
    });
  };
  return (
    <DefaultLayout>
      <section className={cx(layoutStyles.page, "max-w-[1320px]")}>
        <div className={layoutStyles.sectionHeader}>
          <div className="max-w-[760px]">
            <h1 className={typographyStyles.pageTitleLarge}>Resume Builder</h1>
            <p className={`mt-2 ${typographyStyles.bodyLarge}`}>
              Hover on any resume area to edit it in a guided step modal.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => {
                setActiveStepIndex(null);
                router.push("/resume-builder");
              }}
              className={componentStyles.buttonSecondary}
            >
              <FiChevronLeft size={18} />
              Go Back
            </button>
            <button
              type="button"
              onClick={saveResume}
              disabled={isSaving}
              className={componentStyles.buttonPrimary}
            >
              <FiSave size={18} />
              {isSaving ? "Saving" : "Save Resume"}
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-6 rounded-lg border border-red bg-red/10 px-4 py-3 text-sm text-red">
            {error}
          </div>
        )}

        {successMessage && (
          <div className="mb-6 flex items-center gap-2 rounded-lg border border-[#0b7a2a] bg-[#dff8e7] px-4 py-3 text-sm font-medium text-[#0b7a2a]">
            <FiCheckCircle size={18} />
            {successMessage}
          </div>
        )}

        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
          <div className="overflow-x-auto rounded-lg bg-[#f3f4f5] px-4 py-8 shadow-inner">
            <article className="mx-auto min-h-[1120px] w-[920px] bg-white px-[62px] py-[54px] text-black shadow-xl">
              <div className="mb-14 flex items-start justify-between gap-12">
                <EditableBlock label="contact information" onEdit={() => setActiveStepIndex(0)}>
                  <h2 className="text-[50px] font-black leading-none tracking-normal text-black">
                    {resume.personalInformation.fullName || "Atul Sharma"}
                  </h2>
                  <div className="mt-9 space-y-2 font-serif text-[19px] leading-7 text-[#6f6f6f]">
                    <p>
                      {[resume.personalInformation.location.city, resume.personalInformation.location.state]
                        .filter(Boolean)
                        .join(", ") || "City, State"}
                    </p>
                    <p>{resume.personalInformation.email || "Email@example.com"}</p>
                    <p>{resume.personalInformation.phone || "Phone Number"}</p>
                  </div>
                </EditableBlock>
                <div className="mt-1 h-2 w-[540px] shrink-0 bg-black" />
              </div>

              {resume.sections.map((section) => (
                <ResumeSectionView
                  key={section.id}
                  section={section}
                  onEdit={() => openStepBySection(section.id)}
                />
              ))}
            </article>
          </div>

          <aside className="space-y-4">
            <section className={componentStyles.cardCompact}>
              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-full border-4 border-[#c3c0ff] text-sm font-black text-[#3525cd]">
                  {startedSections}/{resume.sections.length}
                </div>
                <div>
                  <h2 className="text-lg font-black text-[#303041]">Sections started</h2>
                  <p className={typographyStyles.bodySmall}>Visible sections are included in the payload.</p>
                </div>
              </div>
            </section>

            <section className={componentStyles.cardCompact}>
              <h2 className={typographyStyles.sectionTitle}>Resume Settings</h2>
              <div className="mt-5 space-y-4">
                <label>
                  <span className={typographyStyles.label}>Title</span>
                  <input
                    value={resume.metadata.title}
                    onChange={(event) => updateMetadata("title", event.target.value)}
                    className={`mt-1.5 h-10 w-full px-3 ${componentStyles.input}`}
                  />
                </label>
                <label>
                  <span className={typographyStyles.label}>Tags</span>
                  <input
                    value={resume.metadata.tags.join(", ")}
                    onChange={updateTags}
                    className={`mt-1.5 h-10 w-full px-3 ${componentStyles.input}`}
                  />
                </label>
                <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
                  <label>
                    <span className={typographyStyles.label}>Status</span>
                    <select
                      value={resume.metadata.status}
                      onChange={(event) => updateMetadata("status", event.target.value)}
                      className={`mt-1.5 h-10 w-full px-3 ${componentStyles.input}`}
                    >
                      <option value="draft">Draft</option>
                      <option value="published">Published</option>
                      <option value="archived">Archived</option>
                    </select>
                  </label>
                  <label>
                    <span className={typographyStyles.label}>Visibility</span>
                    <select
                      value={resume.metadata.visibility}
                      onChange={(event) => updateMetadata("visibility", event.target.value)}
                      className={`mt-1.5 h-10 w-full px-3 ${componentStyles.input}`}
                    >
                      <option value="private">Private</option>
                      <option value="public">Public</option>
                    </select>
                  </label>
                </div>
              </div>
            </section>

            <section className={componentStyles.cardCompact}>
              <h2 className={typographyStyles.sectionTitle}>Sections</h2>
              <div className="mt-4 space-y-2">
                {resume.sections.map((section) => (
                  <button
                    key={section.id}
                    type="button"
                    onClick={() => openStepBySection(section.id)}
                    className="flex w-full items-center justify-between rounded-md border border-[#c7c4d8] px-3 py-2 text-left text-sm font-semibold text-[#303041] transition hover:border-[#3525cd] hover:text-[#3525cd]"
                  >
                    <span>{section.title}</span>
                    {section.isVisible ? <FiEye size={16} /> : <FiEyeOff size={16} />}
                  </button>
                ))}
              </div>
            </section>
          </aside>
        </div>

        {activeStep && (
          <EditModal
            step={activeStep}
            stepNumber={(activeStepIndex ?? 0) + 1}
            totalSteps={steps.length}
            resume={resume}
            onClose={() => setActiveStepIndex(null)}
            onNext={() => moveStep(1)}
            onPrevious={() => moveStep(-1)}
            onToggle={toggleSection}
            onUpdateContent={updateSectionItemContent}
            updatePersonalInformation={updatePersonalInformation}
            updateLocation={updateLocation}
          />
        )}
      </section>
    </DefaultLayout>
  );
};

export default ResumeBuilder;
