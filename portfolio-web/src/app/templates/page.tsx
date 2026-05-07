"use client";

import DefaultLayout from "@/components/Layouts/DefaultLaout";
import { useTemplates } from "@/hooks/useTemplates";

const Templates = () => {
  const { templates, error, isLoading } = useTemplates();

  return (
    <DefaultLayout>
      <div className="mx-auto">
        <div className="mb-4 flex items-center justify-between">
          <h1 className="text-3xl font-bold">Templates</h1>
          <button
            type="button"
            className="inline-flex items-center justify-center rounded-md bg-graydark px-10 py-2 text-center font-medium text-white hover:bg-opacity-90 lg:px-8 xl:px-10"
          >
            Add Template
          </button>
        </div>

        {error && (
          <div className="mb-4 rounded-md border border-red bg-red/10 px-4 py-3 text-sm text-red">
            {error}
          </div>
        )}

        {isLoading && <p className="mb-4 text-sm">Loading templates...</p>}

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {templates.map((template) => (
            <article
              key={template.id}
              className="rounded-sm border border-stroke bg-white p-5 shadow-default dark:border-strokedark dark:bg-boxdark"
            >
              <div className="mb-4 flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-lg font-semibold text-black dark:text-white">
                    {template.templateName}
                  </h2>
                  <p className="mt-1 text-sm">Category: {template.categoryType}</p>
                </div>
                <span
                  className={`rounded px-2 py-1 text-xs font-medium ${
                    template.isActive ? "bg-green-100 text-green-700" : "bg-red/10 text-red"
                  }`}
                >
                  {template.isActive ? "Active" : "Inactive"}
                </span>
              </div>
              <pre className="max-h-48 overflow-auto rounded bg-gray p-3 text-xs dark:bg-meta-4">
                {template.code || "No template code available."}
              </pre>
            </article>
          ))}
        </div>

        {!isLoading && templates.length === 0 && !error && (
          <p className="mt-8 text-center text-sm">No templates found.</p>
        )}
      </div>
    </DefaultLayout>
  );
};

export default Templates;
