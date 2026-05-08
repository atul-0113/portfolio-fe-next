"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import DefaultLayout from "@/components/Layouts/DefaultLaout";
import { useResumeBuilder } from "@/hooks/useResumeBuilder";
import { badgeColorClasses, colorClasses } from "@/styles/theme";
import { componentStyles, cx, layoutStyles, typographyStyles } from "@/styles/ui";
import { Resume, ResumeSection } from "@/types/api";
import {
  FiEdit3,
  FiFileText,
  FiPlus,
  FiRefreshCw,
  FiTrash2,
  FiX,
} from "react-icons/fi";

const formatLastUpdated = (value?: string) => {
  if (!value) {
    return "Not available";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Not available";
  }

  return new Intl.DateTimeFormat("en", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
};

const getString = (value: unknown) => (typeof value === "string" ? value : "");

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

const ResumePreviewSection = ({ section }: { section: ResumeSection }) => {
  const content = section.items[0]?.content || {};

  if (!section.isVisible) {
    return null;
  }

  if (section.type === "summary") {
    return (
      <section>
        <h3 className="mb-3 text-[18px] font-black text-black">Summary</h3>
        <p className="font-serif text-[18px] leading-8 text-[#6f6f6f]">
          {getString(content.text) || "No summary added."}
        </p>
      </section>
    );
  }

  if (section.type === "experience") {
    return (
      <section>
        <h3 className="mb-4 text-[18px] font-black text-black">Experience</h3>
        <div className="flex items-start justify-between gap-8">
          <div>
            <p className="text-[22px] font-black text-[#707070]">
              {getString(content.companyName) || "Company"}
            </p>
            <p className="mt-1 text-[16px] text-[#707070]">
              {getString(content.jobTitle) || "Role"}
            </p>
          </div>
          <p className="shrink-0 text-[16px] text-[#707070]">
            {[getString(content.startDate), getString(content.endDate)].filter(Boolean).join(" - ")}
          </p>
        </div>
        <p className="mt-4 font-serif text-[18px] leading-8 text-[#6f6f6f]">
          {getString(content.description)}
        </p>
      </section>
    );
  }

  if (section.type === "education") {
    return (
      <section>
        <h3 className="mb-4 text-[18px] font-black text-black">Education</h3>
        <p className="text-[22px] font-black text-[#707070]">
          {getString(content.institutionName) || "Institution"}
        </p>
        <p className="mt-1 text-[16px] text-[#707070]">
          {[getString(content.degree), getString(content.fieldOfStudy)].filter(Boolean).join(" · ")}
        </p>
      </section>
    );
  }

  if (section.type === "skills") {
    const skills = getSkillNames(content.skills);

    return (
      <section>
        <h3 className="mb-3 text-[18px] font-black text-black">Skills</h3>
        <p className="font-serif text-[18px] leading-8 text-[#6f6f6f]">
          {skills.join(", ") || getString(content.category) || "No skills added."}
        </p>
      </section>
    );
  }

  if (section.type === "projects") {
    return (
      <section>
        <h3 className="mb-3 text-[18px] font-black text-black">Projects</h3>
        <p className="text-[22px] font-black text-[#707070]">
          {getString(content.projectName) || "Project"}
        </p>
        <p className="mt-2 font-serif text-[18px] leading-8 text-[#6f6f6f]">
          {getString(content.description)}
        </p>
        <p className="mt-2 text-[15px] text-[#707070]">
          {getStringList(content.technologies).join(" · ")}
        </p>
      </section>
    );
  }

  return (
    <section>
      <h3 className="mb-3 text-[18px] font-black text-black">{section.title}</h3>
      <div className="font-serif text-[18px] leading-8 text-[#6f6f6f]">
        {Object.entries(content)
          .filter(([, value]) => typeof value === "string" && value)
          .slice(0, 3)
          .map(([key, value]) => (
            <p key={key}>{String(value)}</p>
          ))}
      </div>
    </section>
  );
};

const ResumePreviewModal = ({
  isLoading,
  resume,
  onClose,
  onEdit,
  onDelete,
  isDeleting,
}: {
  isLoading: boolean;
  resume: Resume | null;
  onClose: () => void;
  onEdit: (resume: Resume) => void;
  onDelete: (resumeId: string) => void;
  isDeleting: boolean;
}) => (
  <div className="fixed inset-0 z-99999 flex items-center justify-center bg-[#090a0b]/55 px-4 py-6">
    <div className="max-h-[calc(100vh-3rem)] w-full max-w-[980px] overflow-hidden rounded-lg bg-white shadow-2xl">
      <div className={`flex items-center justify-between border-b ${colorClasses.border} px-6 py-4`}>
        <h2 className="text-xl font-black text-[#090a0b]">Resume Preview</h2>
        <button
          type="button"
          onClick={onClose}
          className={`${colorClasses.textMuted} transition ${colorClasses.hoverText}`}
          aria-label="Close resume preview"
        >
          <FiX size={24} />
        </button>
      </div>

      <div className="max-h-[calc(100vh-12rem)] overflow-y-auto bg-[#f3f4f5] px-4 py-6">
        {isLoading && (
          <div className="mx-auto max-w-[760px] rounded-lg bg-white px-6 py-10 text-center text-sm text-[#464555]">
            Loading resume...
          </div>
        )}

        {!isLoading && resume && (
          <article className="mx-auto min-h-[920px] max-w-[760px] bg-white px-12 py-12 text-black shadow-xl">
            <div className="mb-12 flex items-start justify-between gap-10">
              <div>
                <h1 className="text-[44px] font-black leading-none text-black">
                  {resume.personalInformation.fullName ||
                    resume.user?.name ||
                    "Untitled Candidate"}
                </h1>
                <div className="mt-7 space-y-1 font-serif text-[18px] text-[#6f6f6f]">
                  <p>
                    {[resume.personalInformation.location.city, resume.personalInformation.location.state]
                      .filter(Boolean)
                      .join(", ") || "Location not added"}
                  </p>
                  <p>{resume.personalInformation.email || resume.user?.email || "Email not added"}</p>
                  <p>{resume.personalInformation.phone || "Phone not added"}</p>
                </div>
              </div>
              <div className="mt-1 h-2 w-[280px] shrink-0 bg-black" />
            </div>

            <div className="space-y-8 divide-y divide-[#c9c9c9]">
              {resume.sections.map((section) => (
                <div key={section.id} className="pt-8 first:pt-0">
                  <ResumePreviewSection section={section} />
                </div>
              ))}
            </div>
          </article>
        )}
      </div>

      {resume && (
        <div className={`flex items-center justify-end gap-3 border-t ${colorClasses.border} px-6 py-4`}>
          <button
            type="button"
            onClick={() => onEdit(resume)}
            className={componentStyles.buttonSecondary}
          >
            <FiEdit3 size={18} />
            Edit
          </button>
          <button
            type="button"
            onClick={() => resume.id && onDelete(resume.id)}
            disabled={!resume.id || isDeleting}
            className="inline-flex h-10 items-center gap-3 rounded-md border border-[#ffdad6] bg-white px-6 text-base font-medium text-[#ba1a1a] transition hover:bg-[#ffdad6] disabled:cursor-not-allowed disabled:opacity-60"
          >
            <FiTrash2 size={18} />
            {isDeleting ? "Deleting" : "Delete"}
          </button>
        </div>
      )}
    </div>
  </div>
);

const ResumeListingPage = () => {
  const {
    error,
    isDeleting,
    isFetching,
    isPreviewLoading,
    previewResume,
    savedResumes,
    closeResumePreview,
    fetchResumes,
    openResumePreview,
    removeSavedResume,
    setActiveSavedResume,
  } = useResumeBuilder();
  const router = useRouter();

  const activeResumeId =
    savedResumes.find((item) => item.resume.metadata.isPrimary)?.resume.id ||
    savedResumes[0]?.resume.id ||
    "";

  return (
    <DefaultLayout>
      <section className={cx(layoutStyles.page, "max-w-[1320px]")}>
        <div className={layoutStyles.sectionHeader}>
          <div className="max-w-[760px]">
            <h1 className={typographyStyles.pageTitleLarge}>Resumes</h1>
            <p className={`mt-2 ${typographyStyles.bodyLarge}`}>
              Select the active resume for this user, or create a new resume.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={fetchResumes}
              disabled={isFetching}
              className={componentStyles.buttonSecondary}
            >
              <FiRefreshCw size={18} />
              {isFetching ? "Loading" : "Refresh"}
            </button>
            <Link href="/resume-builder/create" className={componentStyles.buttonPrimary}>
              <FiPlus size={18} />
              Create Resume
            </Link>
          </div>
        </div>

        {error && (
          <div className="mb-6 rounded-lg border border-red bg-red/10 px-4 py-3 text-sm text-red">
            {error}
          </div>
        )}

        {isFetching && (
          <div className={`rounded-lg border ${colorClasses.border} bg-white px-5 py-4 text-sm ${colorClasses.textMuted}`}>
            Loading resumes...
          </div>
        )}

        {savedResumes.length > 0 && (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {savedResumes.map((item, index) => {
              const itemId = item.resume.id || `${item.resume.metadata.slug}-${index}`;
              const isActive = item.resume.id === activeResumeId;
              const lastUpdated = formatLastUpdated(item.resume.metadata.updatedAt);

              return (
                <article
                  key={itemId}
                  role="button"
                  tabIndex={0}
                  onClick={() => item.resume.id && openResumePreview(item.resume.id)}
                  onKeyDown={(event) => {
                    if ((event.key === "Enter" || event.key === " ") && item.resume.id) {
                      event.preventDefault();
                      openResumePreview(item.resume.id);
                    }
                  }}
                  className={cx(
                    componentStyles.cardCompact,
                    "cursor-pointer transition",
                    isActive ? "border-[#3525cd] shadow-lg" : "hover:border-[#3525cd]",
                  )}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex min-w-0 gap-3">
                      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md bg-[#e2dfff] text-[#3525cd]">
                        <FiFileText size={22} />
                      </span>
                      <div className="min-w-0">
                        <h2 className="truncate text-lg font-black text-[#090a0b]">
                          {item.resume.metadata.title}
                        </h2>
                        <p className={typographyStyles.bodySmall}>
                          {item.resume.personalInformation.fullName ||
                            item.resume.user?.name ||
                            item.resume.user?.email ||
                            "Untitled Candidate"}
                        </p>
                      </div>
                    </div>
                    <span
                      className={cx(
                        "shrink-0 rounded px-2.5 py-1 text-xs font-semibold",
                        isActive ? badgeColorClasses.primary : badgeColorClasses.neutral,
                      )}
                    >
                      {isActive ? "Active" : item.resume.metadata.status}
                    </span>
                  </div>

                  <div className="mt-6 grid grid-cols-2 gap-3 text-sm">
                    <div className={`rounded-md ${colorClasses.appBackground} px-3 py-2`}>
                      <p className={typographyStyles.bodySmall}>Visibility</p>
                      <p className="font-semibold capitalize text-[#303041]">
                        {item.resume.metadata.visibility}
                      </p>
                    </div>
                    <div className={`rounded-md ${colorClasses.appBackground} px-3 py-2`}>
                      <p className={typographyStyles.bodySmall}>Last Updated</p>
                      <p className="font-semibold text-[#303041]">
                        {lastUpdated}
                      </p>
                    </div>
                  </div>

                  <div className="mt-6 flex flex-wrap gap-2">
                    {item.resume.metadata.tags.slice(0, 3).map((tag) => (
                      <span key={tag} className={`rounded px-2 py-1 text-xs ${badgeColorClasses.info}`}>
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="mt-6 grid gap-2 sm:grid-cols-3">
                    <button
                      type="button"
                      onClick={(event) => {
                        event.stopPropagation();
                        item.resume.id && setActiveSavedResume(item.resume.id);
                      }}
                      disabled={!item.resume.id || isActive}
                      className={cx(
                        "inline-flex h-10 items-center justify-center rounded-md px-4 text-sm font-semibold transition",
                        isActive
                          ? "cursor-default bg-[#e2dfff] text-[#3525cd]"
                          : "border border-[#c7c4d8] bg-white text-[#303041] hover:border-[#3525cd] hover:text-[#3525cd]",
                      )}
                    >
                      {isActive ? "Active" : "Set Active"}
                    </button>
                    <button
                      type="button"
                      onClick={(event) => {
                        event.stopPropagation();
                        item.resume.id && router.push(`/resume-builder/create?id=${item.resume.id}`);
                      }}
                      className="inline-flex h-10 items-center justify-center gap-2 rounded-md border border-[#c7c4d8] bg-white px-4 text-sm font-semibold text-[#303041] transition hover:border-[#3525cd] hover:text-[#3525cd]"
                    >
                      <FiEdit3 size={16} />
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={(event) => {
                        event.stopPropagation();
                        item.resume.id && removeSavedResume(item.resume.id);
                      }}
                      disabled={!item.resume.id || isDeleting}
                      className="inline-flex h-10 items-center justify-center gap-2 rounded-md border border-[#ffdad6] bg-white px-4 text-sm font-semibold text-[#ba1a1a] transition hover:bg-[#ffdad6] disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      <FiTrash2 size={16} />
                      Delete
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        )}

        {(isPreviewLoading || previewResume) && (
          <ResumePreviewModal
            isLoading={isPreviewLoading}
            resume={previewResume}
            onClose={closeResumePreview}
            onEdit={(resume) => {
              closeResumePreview();
              resume.id && router.push(`/resume-builder/create?id=${resume.id}`);
            }}
            onDelete={removeSavedResume}
            isDeleting={isDeleting}
          />
        )}
      </section>
    </DefaultLayout>
  );
};

export default ResumeListingPage;
