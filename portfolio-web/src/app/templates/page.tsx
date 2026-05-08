"use client";

import DefaultLayout from "@/components/Layouts/DefaultLaout";
import Pagination from "@/components/Pagination";
import { useTemplateLibrary } from "@/hooks/useTemplates";
import { badgeColorClasses, colorClasses } from "@/styles/theme";
import { componentStyles, layoutStyles, typographyStyles } from "@/styles/ui";
import Image from "next/image";
import Link from "next/link";
import { FiEdit3, FiPlus, FiPlusCircle } from "react-icons/fi";

const Templates = () => {
  const { error, filters, isLoading, paginationPages, resultSummary, templateItems } = useTemplateLibrary();

  return (
    <DefaultLayout>
      <section className={layoutStyles.page}>
        <div className={layoutStyles.sectionHeader}>
          <div>
            <h1 className={typographyStyles.pageTitleLarge}>
              Template Library
            </h1>
            <p className={`mt-2 ${typographyStyles.bodyLarge}`}>
              Choose a starting point or build a custom layout for your next professional showcase.
            </p>
          </div>
          <Link
            href="/templates/builder"
            className={`${componentStyles.buttonPrimary} shrink-0`}
          >
            <FiPlus size={18} />
            Create Template
          </Link>
        </div>

        <div className="mb-12 flex flex-wrap gap-3">
          {filters.map((filter, index) => (
            <button
              key={filter}
              type="button"
              className={`h-10 min-w-[132px] rounded-full border px-6 text-sm transition ${
                index === 0
                  ? `border-[#2400d8] ${colorClasses.appBackground} ${colorClasses.primaryAccentText}`
                  : `${colorClasses.border} ${colorClasses.appBackground} ${colorClasses.textMuted} ${colorClasses.hoverBorder} ${colorClasses.hoverText}`
              }`}
            >
              {filter}
            </button>
          ))}
        </div>

        {error && (
          <div className="mb-6 rounded-lg border border-red bg-red/10 px-4 py-3 text-sm text-red">
            {error}
          </div>
        )}

        {isLoading && (
          <div className={`mb-6 rounded-lg border ${colorClasses.border} bg-white px-5 py-4 text-sm ${colorClasses.textMuted}`}>
            Loading templates...
          </div>
        )}

        <div className={layoutStyles.gridCards}>
          {templateItems.map((template) => (
            <article
              key={template.id}
              className={`overflow-hidden ${componentStyles.card}`}
            >
              <div className={`relative h-[245px] ${colorClasses.surfaceSubtle}`}>
                <Image
                  src={template.imageSrc}
                  alt={template.name}
                  fill
                  sizes="(min-width: 1280px) 350px, (min-width: 768px) 50vw, 100vw"
                  className="object-cover"
                />
              </div>

              <div className="px-8 py-7">
                <div className="mb-9 flex items-start justify-between gap-4">
                  <h2 className={typographyStyles.cardTitleLarge}>
                    {template.name}
                  </h2>
                  <span className={`shrink-0 rounded px-4 py-2 text-sm ${badgeColorClasses.neutral}`}>
                    {template.category}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className={`text-sm ${colorClasses.textMuted}`}>{template.usage}</span>
                  <button
                    type="button"
                    className={`inline-flex items-center gap-2 text-base font-semibold ${colorClasses.primaryAccentText}`}
                  >
                    <FiEdit3 size={18} />
                    Edit
                  </button>
                </div>
              </div>
            </article>
          ))}

          <Link
            href="/templates/builder"
            className={`flex min-h-[380px] flex-col items-center justify-center rounded-lg border-2 border-dashed ${colorClasses.border} bg-white px-10 text-center transition ${colorClasses.hoverBorder}`}
          >
            <span className={`mb-7 flex h-20 w-20 items-center justify-center rounded-xl ${colorClasses.surfaceSubtle} ${colorClasses.primaryAccentText}`}>
              <FiPlusCircle size={36} />
            </span>
            <span className={`text-[22px] font-bold ${colorClasses.textStrong}`}>Create New</span>
            <span className={`mt-3 max-w-[245px] text-base leading-6 ${colorClasses.textMuted}`}>
              Start with a blank canvas and build your own custom theme.
            </span>
          </Link>
        </div>

        <Pagination
          summary={resultSummary}
          pages={paginationPages}
          variant="grid"
        />
      </section>
    </DefaultLayout>
  );
};

export default Templates;
