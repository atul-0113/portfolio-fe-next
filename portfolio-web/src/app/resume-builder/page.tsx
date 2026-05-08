"use client";

import Link from "next/link";
import DefaultLayout from "@/components/Layouts/DefaultLaout";
import { useResumeBuilder } from "@/hooks/useResumeBuilder";
import { badgeColorClasses, colorClasses } from "@/styles/theme";
import { componentStyles, cx, layoutStyles, typographyStyles } from "@/styles/ui";
import { FiFileText, FiPlus, FiRefreshCw } from "react-icons/fi";

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

const ResumeListingPage = () => {
  const {
    error,
    isFetching,
    savedResumes,
    fetchResumes,
    setActiveSavedResume,
  } = useResumeBuilder();

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
                  className={cx(
                    componentStyles.cardCompact,
                    "transition",
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

                  <button
                    type="button"
                    onClick={() => item.resume.id && setActiveSavedResume(item.resume.id)}
                    disabled={!item.resume.id || isActive}
                    className={cx(
                      "mt-6 inline-flex h-10 w-full items-center justify-center rounded-md px-4 text-sm font-semibold transition",
                      isActive
                        ? "cursor-default bg-[#e2dfff] text-[#3525cd]"
                        : "border border-[#c7c4d8] bg-white text-[#303041] hover:border-[#3525cd] hover:text-[#3525cd]",
                    )}
                  >
                    {isActive ? "Active Resume" : "Set Active"}
                  </button>
                </article>
              );
            })}
          </div>
        )}
      </section>
    </DefaultLayout>
  );
};

export default ResumeListingPage;
