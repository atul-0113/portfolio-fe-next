"use client";

import DefaultLayout from "@/components/Layouts/DefaultLaout";

const ResumeBuilder = () => {
  return (
    <DefaultLayout>
      <div className="mx-auto max-w-5xl">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-black dark:text-white">
            Resume Builder
          </h1>
        </div>

        <section className="rounded-sm border border-stroke bg-white p-6 shadow-default dark:border-strokedark dark:bg-boxdark md:p-8">
          <h2 className="text-xl font-semibold text-black dark:text-white">
            Build an ATS-friendly resume
          </h2>
          <p className="mt-3 max-w-2xl text-sm leading-6">
            Start with your profile, projects, skills, and experience. The
            builder workflow will live here as the resume feature expands.
          </p>
          <button
            type="button"
            className="mt-6 inline-flex items-center justify-center rounded-md bg-primary px-5 py-3 text-sm font-medium text-white hover:bg-opacity-90"
          >
            Create Resume
          </button>
        </section>
      </div>
    </DefaultLayout>
  );
};

export default ResumeBuilder;
