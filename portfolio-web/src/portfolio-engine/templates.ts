import { PortfolioData, PortfolioPaletteItem, PortfolioTemplateSchema } from "./types";

export const demoPortfolioData: PortfolioData = {
  profile: {
    name: "Atul Sharma",
    role: "Senior Frontend Engineer",
    location: "Noida, India",
    email: "atul@example.com",
    bio: "I build scalable product interfaces, design systems, and polished web experiences for fast-moving teams.",
    avatar: "/images/user/user-01.png",
    socialLinks: [
      { label: "LinkedIn", url: "https://linkedin.com/in/atul" },
      { label: "GitHub", url: "https://github.com/atul" },
    ],
  },
  stats: [
    { label: "Years Experience", value: "6+" },
    { label: "Products Shipped", value: "24" },
    { label: "Performance Gains", value: "35%" },
  ],
  skills: ["React", "Next.js", "TypeScript", "Design Systems", "Node.js", "PostgreSQL"],
  projects: [
    {
      title: "PortfolioPro",
      description: "AI-powered portfolio and resume SaaS with drag-drop authoring and ATS tooling.",
      image: "/images/cards/cards-01.png",
      tags: ["Next.js", "Node.js", "PostgreSQL"],
      url: "#",
    },
    {
      title: "DesignOps Console",
      description: "A dashboard for managing reusable UI kits, reviews, and design handoff workflows.",
      image: "/images/cards/cards-05.png",
      tags: ["React", "Tailwind", "Analytics"],
      url: "#",
    },
    {
      title: "Commerce Studio",
      description: "A storefront builder with live preview, media handling, and theme controls.",
      image: "/images/cards/cards-06.png",
      tags: ["Next.js", "CMS", "Payments"],
      url: "#",
    },
  ],
  experiences: [
    {
      company: "ABC Technologies",
      role: "Senior Frontend Engineer",
      period: "2023 - 2025",
      summary: "Led frontend architecture, component libraries, and performance improvements across product teams.",
    },
    {
      company: "PortfolioPro",
      role: "Lead Developer",
      period: "2025 - Present",
      summary: "Built schema-driven resume and portfolio tooling with reusable rendering systems.",
    },
  ],
};

export const modernPortfolioTemplate: PortfolioTemplateSchema = {
  id: "template-modern-engineer",
  name: "Modern Engineer Portfolio",
  version: 1,
  category: "Software Engineering",
  description: "A clean, animated portfolio schema for engineers, designers, and builders.",
  theme: {
    name: "Graphite Blue",
    fontFamily: "Inter, Arial, sans-serif",
    backgroundColor: "#f8f9fa",
    surfaceColor: "#ffffff",
    textColor: "#090a0b",
    mutedTextColor: "#464555",
    accentColor: "#3525cd",
    borderColor: "#d9d7e8",
  },
  root: {
    id: "root",
    type: "root",
    label: "Portfolio",
    children: [
      {
        id: "section-hero",
        type: "section",
        label: "Hero Section",
        style: {
          paddingY: "xl",
          paddingX: "lg",
          backgroundColor: "#ffffff",
          radius: "lg",
          shadow: "md",
          maxWidth: "xl",
        },
        animation: "fade-up",
        children: [
          {
            id: "hero-main",
            type: "hero",
            label: "Hero",
            props: {
              eyebrow: "{{profile.role}}",
              headline: "{{profile.name}}",
              body: "{{profile.bio}}",
              ctaLabel: "View Projects",
              ctaHref: "#projects",
              imageSrc: "{{profile.avatar}}",
            },
            style: { layout: "split", align: "left", accentColor: "#3525cd" },
            animation: "fade-up",
          },
        ],
      },
      {
        id: "section-stats",
        type: "section",
        label: "Stats Section",
        style: { paddingY: "md", paddingX: "lg", maxWidth: "xl" },
        animation: "fade-up",
        children: [
          {
            id: "stats-main",
            type: "stats",
            label: "Stats",
            props: { source: "stats" },
            style: { layout: "grid", columns: 3, gap: "md" },
          },
        ],
      },
      {
        id: "section-projects",
        type: "section",
        label: "Projects Section",
        style: { paddingY: "lg", paddingX: "lg", maxWidth: "xl" },
        animation: "fade-up",
        children: [
          {
            id: "projects-heading",
            type: "text",
            label: "Projects Heading",
            props: {
              eyebrow: "Selected Work",
              headline: "Products and platforms built with care.",
              body: "Reusable templates are saved as JSON schema, then rendered with live portfolio data.",
            },
            style: { align: "left", maxWidth: "md" },
          },
          {
            id: "projects-grid",
            type: "projectGrid",
            label: "Project Grid",
            props: { source: "projects", limit: 3 },
            style: { columns: 3, gap: "lg" },
          },
        ],
      },
      {
        id: "section-skills",
        type: "section",
        label: "Skills Section",
        style: { paddingY: "lg", paddingX: "lg", maxWidth: "xl", backgroundColor: "#eef1ff", radius: "lg" },
        animation: "slide-in",
        children: [
          {
            id: "skills-cloud",
            type: "skillCloud",
            label: "Skill Cloud",
            props: { source: "skills", headline: "Core skills" },
            style: { gap: "sm", accentColor: "#3525cd" },
          },
        ],
      },
      {
        id: "section-experience",
        type: "section",
        label: "Experience Section",
        style: { paddingY: "lg", paddingX: "lg", maxWidth: "xl" },
        animation: "fade-up",
        children: [
          {
            id: "experience-timeline",
            type: "timeline",
            label: "Timeline",
            props: { source: "experiences", headline: "Experience" },
          },
        ],
      },
      {
        id: "section-contact",
        type: "section",
        label: "Contact Section",
        style: { paddingY: "lg", paddingX: "lg", maxWidth: "xl", backgroundColor: "#090a0b", textColor: "#ffffff", radius: "lg" },
        animation: "scale-in",
        children: [
          {
            id: "contact-main",
            type: "contact",
            label: "Contact",
            props: {
              headline: "Let us build something useful.",
              body: "Available for product engineering, design systems, and frontend architecture work.",
            },
          },
        ],
      },
    ],
  },
};

export const editorialPortfolioTemplate: PortfolioTemplateSchema = {
  ...modernPortfolioTemplate,
  id: "template-editorial-builder",
  name: "Editorial Builder Portfolio",
  category: "Creative",
  description: "A spacious editorial schema with a strong hero and project-focused rhythm.",
  theme: {
    name: "Ink Warmth",
    fontFamily: "Georgia, serif",
    backgroundColor: "#fbfbf8",
    surfaceColor: "#ffffff",
    textColor: "#111111",
    mutedTextColor: "#5f5b53",
    accentColor: "#a43f2d",
    borderColor: "#ddd8cf",
  },
};

export const starterPortfolioTemplates = [
  modernPortfolioTemplate,
  editorialPortfolioTemplate,
];

export const portfolioComponentPalette: PortfolioPaletteItem[] = [
  {
    id: "section-blank",
    label: "Blank Section",
    description: "A responsive section container for nested components.",
    group: "Sections",
    blueprint: {
      id: "section-blueprint",
      type: "section",
      label: "New Section",
      style: { paddingY: "lg", paddingX: "lg", maxWidth: "xl", backgroundColor: "#ffffff", radius: "lg" },
      animation: "fade-up",
      children: [],
    },
  },
  {
    id: "component-hero",
    label: "Hero",
    description: "Profile headline, summary, action, and media.",
    group: "Components",
    blueprint: {
      id: "hero-blueprint",
      type: "hero",
      label: "Hero",
      props: {
        eyebrow: "{{profile.role}}",
        headline: "{{profile.name}}",
        body: "{{profile.bio}}",
        ctaLabel: "Contact Me",
        ctaHref: "mailto:{{profile.email}}",
        imageSrc: "{{profile.avatar}}",
      },
      style: { layout: "split", align: "left" },
      animation: "fade-up",
    },
  },
  {
    id: "component-text",
    label: "Text Block",
    description: "Reusable eyebrow, heading, and body content.",
    group: "Components",
    blueprint: {
      id: "text-blueprint",
      type: "text",
      label: "Text Block",
      props: {
        eyebrow: "Section",
        headline: "Add a strong section headline.",
        body: "Use data bindings like {{profile.name}} or write custom copy.",
      },
      style: { align: "left", maxWidth: "md" },
      animation: "fade-up",
    },
  },
  {
    id: "component-projects",
    label: "Project Grid",
    description: "Dynamic cards bound to portfolio projects.",
    group: "Components",
    blueprint: {
      id: "project-grid-blueprint",
      type: "projectGrid",
      label: "Project Grid",
      props: { source: "projects", limit: 3 },
      style: { columns: 3, gap: "lg" },
      animation: "fade-up",
    },
  },
  {
    id: "component-skills",
    label: "Skill Cloud",
    description: "Dynamic skill chips bound to portfolio data.",
    group: "Components",
    blueprint: {
      id: "skill-cloud-blueprint",
      type: "skillCloud",
      label: "Skill Cloud",
      props: { source: "skills", headline: "Skills" },
      style: { gap: "sm" },
    },
  },
  {
    id: "component-stats",
    label: "Stats",
    description: "Metric cards bound to profile stats.",
    group: "Components",
    blueprint: {
      id: "stats-blueprint",
      type: "stats",
      label: "Stats",
      props: { source: "stats" },
      style: { columns: 3, gap: "md" },
    },
  },
  {
    id: "component-timeline",
    label: "Timeline",
    description: "Experience timeline bound to work history.",
    group: "Components",
    blueprint: {
      id: "timeline-blueprint",
      type: "timeline",
      label: "Timeline",
      props: { source: "experiences", headline: "Experience" },
    },
  },
  {
    id: "component-contact",
    label: "Contact",
    description: "Email and social links from portfolio data.",
    group: "Components",
    blueprint: {
      id: "contact-blueprint",
      type: "contact",
      label: "Contact",
      props: {
        headline: "Let us work together.",
        body: "Send a message and I will get back to you soon.",
      },
      animation: "scale-in",
    },
  },
];
