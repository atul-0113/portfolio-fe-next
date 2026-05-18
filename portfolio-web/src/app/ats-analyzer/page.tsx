"use client";

import { FiUpload, FiMail, FiChevronDown, FiFileText } from "react-icons/fi";

import DefaultLayout from "@/components/Layouts/DefaultLaout";
import { useAtsAnalyser } from "@/hooks/useAtsAnalyser";

import {
  layoutStyles,
  typographyStyles,
  componentStyles,
  cx,
} from "@/styles/ui";

const steps = [
  {
    id: 1,
    title: "Upload Resume",
    subtitle: "Drop your PDF resume",
  },
  {
    id: 2,
    title: "Select Role",
    subtitle: "Choose target job role",
  },
  {
    id: 3,
    title: "Get Analysis",
    subtitle: "Receive AI feedback",
  },
];

const AtsAnalyser = () => {
  const {
    selectedFile,
    email,
    role,
    jobDescription,
    setRole,
    setEmail,
    setJobDescription,
    analyse,
    handleDrop,
    handleDragOver,
    openFilePicker,
  } = useAtsAnalyser();

  return (
    <DefaultLayout>
      <section className={layoutStyles.page}>
        <div className="mb-10 text-center">
          <h1 className={typographyStyles.pageTitleLarge}>
            Get Your Resume Analyzed by AI
          </h1>
          <p
            className={cx(typographyStyles.bodyLarge, "mx-auto mt-4 max-w-3xl")}
          >
            Upload your resume, select a job role and receive AI-powered
            feedback with detailed ATS score and improvement suggestions.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[500px_1fr]">
          {/* LEFT SIDE */}
          <div className="space-y-6">
            {/* Upload */}
            <div className={cx(componentStyles.card, "p-6")}>
              <h3 className={cx(typographyStyles.cardTitle, "mb-5")}>
                Upload Resume
              </h3>
              <div
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onClick={openFilePicker}
                className="
                hover:bg-gray-50
                flex
                h-[250px]
                cursor-pointer
                flex-col
                items-center
                justify-center
                rounded-xl
                border-2
                border-dashed
                px-6
                transition
              ">
                <div className="bg-gray-100 mb-4 rounded-full p-4">
                  <FiUpload size={26} />
                </div>

                <h3 className="text-center text-base font-semibold">
                  {selectedFile
                    ? selectedFile.name
                    : "Drag and drop your resume"}
                </h3>
                <p
                  className={cx(typographyStyles.bodySmall, "mt-2 text-center")}
                >
                  click to browse (PDF only)
                </p>
              </div>
            </div>

            {/* bottom cards */}
            <div className="grid gap-4">
              {/* HOW IT WORKS */}
              <div className={cx(componentStyles.card, "p-6")}>
                <h3 className={cx(typographyStyles.cardTitle, "mb-6")}>
                  How it works
                </h3>
                <div className="space-y-5">
                  {steps.map((step) => (
                    <div key={step.id} className="flex gap-3">
                      <div
                        className="
                        flex
                        h-8
                        w-8
                        shrink-0
                        items-center
                        justify-center
                        rounded-full
                        bg-blue-500
                        text-sm
                        font-semibold
                        text-white
                      ">
                        {step.id}
                      </div>
                      <div>
                        <p className="font-medium">{step.title}</p>
                        <p className={typographyStyles.bodySmall}>
                          {step.subtitle}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* EMAIL REPORT */}
              <div className={cx(componentStyles.card, "bg-blue-50 p-6")}>
                <div className="flex gap-3">
                  <FiMail className="mt-1" size={20} />
                  <div>
                    <h3 className={typographyStyles.cardTitle}>Email Report</h3>
                    <p className={cx(typographyStyles.bodySmall, "mt-2")}>
                      Receive ATS score and detailed AI suggestions directly in
                      your inbox.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT SIDE */}

          <div className={cx(componentStyles.card, "p-8")}>
            <div className="space-y-6">
              <div>
                <label className={cx(typographyStyles.cardTitle, "mb-3 block")}>
                  Target Job Role
                </label>
                <div className="relative">
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className={cx(
                      componentStyles.input,
                      "h-12 w-full appearance-none px-4",
                    )}
                  >
                    <option>Select role</option>
                    <option>Frontend Developer</option>
                    <option>Backend Developer</option>
                    <option>Full Stack Developer</option>
                  </select>

                  <FiChevronDown
                    className="
                    text-gray-400
                    absolute
                    right-4
                    top-1/2
                    -translate-y-1/2
                  "
                  />
                </div>
              </div>

              <div>
                <label className={cx(typographyStyles.cardTitle, "mb-3 block")}>
                  Email Address
                </label>

                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter email"
                  className={cx(componentStyles.input, "h-12 w-full px-4")}
                />
              </div>

              <div>
                <label className={cx(typographyStyles.cardTitle, "mb-3 block")}>
                  Job Description
                </label>

                <textarea
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  rows={8}
                  placeholder="Paste complete job description..."
                  className={cx(
                    componentStyles.input,
                    "min-h-[240px] w-full resize-none px-4 py-3",
                  )}
                />

                <div className="mt-2 flex justify-between">
                  <span className={typographyStyles.bodySmall}>
                    {jobDescription.length} characters
                  </span>
                </div>
              </div>

              <button
                onClick={analyse}
                className={cx(componentStyles.buttonPrimary, "mt-6 w-full")}
              >
                <FiFileText size={18} />
                Analyze My Resume
              </button>
            </div>
          </div>
        </div>
      </section>
    </DefaultLayout>
  );
};

export default AtsAnalyser;
