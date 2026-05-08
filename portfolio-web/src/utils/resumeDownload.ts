import { Resume, ResumeSection } from "@/types/api";

const socialLinkFields = [
  ["portfolio", "Portfolio"],
  ["linkedin", "LinkedIn"],
  ["github", "GitHub"],
  ["instagram", "Instagram"],
  ["twitter", "Twitter / X"],
  ["facebook", "Facebook"],
  ["youtube", "YouTube"],
  ["medium", "Medium"],
  ["behance", "Behance"],
  ["dribbble", "Dribbble"],
];

const escapeHtml = (value: string) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");

const getString = (value: unknown) => (typeof value === "string" ? value : "");

const getStringList = (value: unknown) =>
  Array.isArray(value) ? value.filter((item): item is string => typeof item === "string") : [];

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

export const getResumeContactParts = (resume: Resume) => {
  const location = [
    resume.personalInformation.location.city,
    resume.personalInformation.location.state,
  ]
    .filter(Boolean)
    .join(", ");

  return [
    location,
    resume.personalInformation.email || resume.user?.email || "",
    resume.personalInformation.phone,
  ].filter(Boolean);
};

export const getVisibleResumeSocialLinks = (resume: Resume) =>
  socialLinkFields
    .map(([key, label]) => ({
      key,
      label,
      url: resume.personalInformation.socialLinks?.[key] || "",
    }))
    .filter((item) => item.url.trim());

const renderSocialLinkIcon = (type: string, label: string) => {
  const iconPath = (() => {
    switch (type) {
      case "linkedin":
        return '<path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle>';
      case "github":
        return '<path d="M9 19c-5 1.5-5-2.5-7-3"></path><path d="M15 22v-3.9a3.4 3.4 0 0 0-1-2.6c3.2-.4 6.5-1.6 6.5-7A5.4 5.4 0 0 0 19 4.8 5 5 0 0 0 18.9 1S17.7.6 15 2.5a13.4 13.4 0 0 0-7 0C5.3.6 4.1 1 4.1 1A5 5 0 0 0 4 4.8a5.4 5.4 0 0 0-1.5 3.7c0 5.4 3.3 6.6 6.5 7a3.4 3.4 0 0 0-1 2.6V22"></path>';
      case "instagram":
        return '<rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.4a4 4 0 1 1-7.9 1.2 4 4 0 0 1 7.9-1.2z"></path><line x1="17.5" y1="6.5" x2="17.5" y2="6.5"></line>';
      case "twitter":
        return '<path d="M23 3a10.9 10.9 0 0 1-3.1 1.5 4.5 4.5 0 0 0-7.7 4.1A12.9 12.9 0 0 1 3 4s-4 9 5 13a13.2 13.2 0 0 1-8 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.1-.8A7.7 7.7 0 0 0 23 3z"></path>';
      case "facebook":
        return '<path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>';
      case "youtube":
        return '<path d="M22.5 6.4a2.8 2.8 0 0 0-2-2C18.8 4 12 4 12 4s-6.8 0-8.5.5a2.8 2.8 0 0 0-2 2A29 29 0 0 0 1 12a29 29 0 0 0 .5 5.6 2.8 2.8 0 0 0 2 2C5.2 20 12 20 12 20s6.8 0 8.5-.5a2.8 2.8 0 0 0 2-2A29 29 0 0 0 23 12a29 29 0 0 0-.5-5.6z"></path><polygon points="10 15 15 12 10 9 10 15"></polygon>';
      case "portfolio":
        return '<circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>';
      default:
        return '<path d="M10 13a5 5 0 0 0 7 0l3-3a5 5 0 0 0-7-7l-1.7 1.7"></path><path d="M14 11a5 5 0 0 0-7 0l-3 3a5 5 0 0 0 7 7l1.7-1.7"></path>';
    }
  })();

  return `<span class="social-icon" aria-label="${escapeHtml(label)}"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round">${iconPath}</svg></span>`;
};

const renderSection = (section: ResumeSection) => {
  if (!section.isVisible) {
    return "";
  }

  const content = section.items[0]?.content || {};

  if (section.type === "summary") {
    return `<section><h2>Summary</h2><p>${escapeHtml(getString(content.text) || "No summary added.")}</p></section>`;
  }

  if (section.type === "experience") {
    const dates = [getString(content.startDate), getString(content.endDate)].filter(Boolean).join(" - ");
    return `<section><h2>Experience</h2><div class="row"><div><h3>${escapeHtml(getString(content.companyName) || "Company")}</h3><p class="muted">${escapeHtml(getString(content.jobTitle) || "Role")}</p></div><p class="muted">${escapeHtml(dates)}</p></div><p>${escapeHtml(getString(content.description))}</p></section>`;
  }

  if (section.type === "education") {
    const details = [getString(content.degree), getString(content.fieldOfStudy)].filter(Boolean).join(" | ");
    return `<section><h2>Education</h2><h3>${escapeHtml(getString(content.institutionName) || "Institution")}</h3><p class="muted">${escapeHtml(details)}</p></section>`;
  }

  if (section.type === "skills") {
    const skills = getSkillNames(content.skills).join(", ") || getString(content.category);
    return `<section><h2>Skills</h2><p>${escapeHtml(skills || "No skills added.")}</p></section>`;
  }

  if (section.type === "projects") {
    return `<section><h2>Projects</h2><h3>${escapeHtml(getString(content.projectName) || "Project")}</h3><p>${escapeHtml(getString(content.description))}</p><p class="muted">${escapeHtml(getStringList(content.technologies).join(" | "))}</p></section>`;
  }

  const lines = Object.entries(content)
    .filter(([, value]) => typeof value === "string" && value)
    .slice(0, 3)
    .map(([, value]) => `<p>${escapeHtml(String(value))}</p>`)
    .join("");

  return `<section><h2>${escapeHtml(section.title)}</h2>${lines}</section>`;
};

export const downloadResumePdf = (resume: Resume) => {
  const printWindow = window.open("", "_blank", "width=900,height=1200");

  if (!printWindow) {
    return;
  }

  const fullName =
    resume.personalInformation.fullName ||
    resume.user?.name ||
    "Untitled Candidate";
  const contacts = getResumeContactParts(resume).map(escapeHtml).join(" | ");
  const socialLinks = getVisibleResumeSocialLinks(resume)
    .map(
      (link) =>
        `<span class="social-item">${renderSocialLinkIcon(link.key, link.label)}<span>${escapeHtml(link.url)}</span></span>`,
    )
    .join("");
  const sections = resume.sections.map(renderSection).join("");

  printWindow.document.write(`<!doctype html>
<html>
  <head>
    <title></title>
    <style>
      @page { size: A4; margin: 0; }
      * { box-sizing: border-box; }
      html, body { width: 100%; min-height: 100%; }
      body { margin: 0; background: #f3f4f5; color: #000; font-family: Arial, sans-serif; }
      .page { width: 8.27in; min-height: 11.69in; margin: 0 auto; background: #fff; padding: 0.65in; }
      h1 { margin: 0; font-size: 42px; line-height: 1; font-weight: 900; }
      h2 { margin: 0 0 12px; font-size: 18px; font-weight: 900; }
      h3 { margin: 0; font-size: 20px; color: #707070; font-weight: 900; }
      p { margin: 8px 0 0; color: #666; font-family: Georgia, serif; font-size: 16px; line-height: 1.55; }
      .contact { margin-top: 28px; color: #666; font-family: Georgia, serif; font-size: 17px; }
      .bar { margin-top: 22px; height: 7px; background: #000; }
      .social { display: flex; flex-wrap: wrap; gap: 8px 18px; margin-top: 14px; color: #707070; font-size: 13px; font-weight: 700; line-height: 1.6; word-break: break-word; }
      .social-item { display: inline-flex; min-width: 0; align-items: center; gap: 7px; }
      .social-icon { display: inline-flex; width: 16px; height: 16px; flex: 0 0 auto; color: #4d4d4d; }
      .social-icon svg { width: 16px; height: 16px; stroke-width: 2.1; }
      section { padding-top: 26px; margin-top: 26px; border-top: 1px solid #c9c9c9; }
      section:first-of-type { border-top: 0; }
      .row { display: flex; justify-content: space-between; gap: 24px; }
      .muted { color: #707070; font-family: Arial, sans-serif; }
      @media print {
        html, body { width: 210mm; min-height: 297mm; background: #fff; }
        body { print-color-adjust: exact; -webkit-print-color-adjust: exact; }
        .page { margin: 0; width: 210mm; min-height: 297mm; box-shadow: none; }
      }
    </style>
  </head>
  <body>
    <main class="page">
      <header>
        <h1>${escapeHtml(fullName)}</h1>
        <div class="contact">${contacts || "Location | Email | Phone"}</div>
        <div class="bar"></div>
        ${socialLinks ? `<div class="social">${socialLinks}</div>` : ""}
      </header>
      ${sections}
    </main>
    <script>
      window.onload = function () {
        window.focus();
        window.print();
      };
    </script>
  </body>
</html>`);

  printWindow.document.close();
};
