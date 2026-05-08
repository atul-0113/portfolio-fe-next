import type { CSSProperties } from "react";
import {
  PortfolioData,
  PortfolioExperience,
  PortfolioProject,
  PortfolioTemplateNode,
  PortfolioTemplateSchema,
} from "./types";
import { asArray, resolvePath, resolveText } from "./schemaUtils";

const cx = (...classes: Array<string | false | null | undefined>) =>
  classes.filter(Boolean).join(" ");

const paddingYClasses = {
  none: "py-0",
  sm: "py-6",
  md: "py-10",
  lg: "py-14",
  xl: "py-20",
} as const;

const paddingXClasses = {
  none: "px-0",
  sm: "px-4",
  md: "px-5",
  lg: "px-6 sm:px-8",
  xl: "px-8 sm:px-12",
} as const;

const gapClasses = {
  none: "gap-0",
  sm: "gap-3",
  md: "gap-5",
  lg: "gap-8",
  xl: "gap-12",
} as const;

const radiusClasses = {
  none: "rounded-none",
  sm: "rounded",
  md: "rounded-md",
  lg: "rounded-lg",
  xl: "rounded-2xl",
  full: "rounded-full",
} as const;

const shadowClasses = {
  none: "",
  sm: "shadow-sm",
  md: "shadow-lg",
  lg: "shadow-2xl",
} as const;

const maxWidthClasses = {
  sm: "max-w-[720px]",
  md: "max-w-[900px]",
  lg: "max-w-[1080px]",
  xl: "max-w-[1240px]",
  full: "max-w-none",
} as const;

const alignmentClasses = {
  left: "text-left items-start",
  center: "text-center items-center",
  right: "text-right items-end",
} as const;

const animationClasses = {
  none: "",
  "fade-up": "portfolio-animate-fade-up",
  "slide-in": "portfolio-animate-slide-in",
  "scale-in": "portfolio-animate-scale-in",
} as const;

const getNodeStyle = (
  node: PortfolioTemplateNode,
  template: PortfolioTemplateSchema,
): CSSProperties => ({
  backgroundColor: node.style?.backgroundColor,
  color: node.style?.textColor,
  "--portfolio-node-accent": node.style?.accentColor || template.theme.accentColor,
} as CSSProperties);

const getPropText = (
  node: PortfolioTemplateNode,
  key: string,
  data: PortfolioData,
  fallback = "",
) => resolveText(node.props?.[key] ?? fallback, data) || fallback;

const getNumberProp = (node: PortfolioTemplateNode, key: string, fallback: number) => {
  const value = node.props?.[key];
  const parsedValue = typeof value === "number" ? value : Number(value);

  return Number.isFinite(parsedValue) ? parsedValue : fallback;
};

const getSourceItems = <T,>(
  node: PortfolioTemplateNode,
  data: PortfolioData,
  fallbackPath: string,
) => asArray<T>(resolvePath(data, getPropText(node, "source", data, fallbackPath)));

export interface PortfolioRendererProps {
  template: PortfolioTemplateSchema;
  data: PortfolioData;
  mode?: "preview" | "builder";
  selectedNodeId?: string | null;
  onSelectNode?: (nodeId: string) => void;
  onDragNode?: (nodeId: string) => void;
  onDropNode?: (targetNodeId: string) => void;
}

export const PortfolioRenderer = ({
  template,
  data,
  mode = "preview",
  selectedNodeId,
  onSelectNode,
  onDragNode,
  onDropNode,
}: PortfolioRendererProps) => {
  const renderChildren = (node: PortfolioTemplateNode) =>
    node.children?.filter((child) => child.isVisible !== false).map((child) => renderNode(child));

  const renderSection = (node: PortfolioTemplateNode) => {
    const layout = node.style?.layout || "stack";
    const gap = node.style?.gap || "lg";
    const align = node.style?.align || "left";

    return (
      <section
        className={cx(
          "mx-auto w-full overflow-hidden",
          paddingYClasses[node.style?.paddingY || "lg"],
          paddingXClasses[node.style?.paddingX || "lg"],
          maxWidthClasses[node.style?.maxWidth || "xl"],
          radiusClasses[node.style?.radius || "none"],
          shadowClasses[node.style?.shadow || "none"],
          animationClasses[node.animation || "none"],
        )}
        style={getNodeStyle(node, template)}
      >
        <div
          className={cx(
            layout === "grid" && "grid md:grid-cols-2",
            layout === "split" && "grid lg:grid-cols-2",
            layout === "inline" && "flex flex-wrap",
            layout === "centered" && "flex flex-col text-center",
            layout === "stack" && "flex flex-col",
            gapClasses[gap],
            alignmentClasses[align],
          )}
        >
          {renderChildren(node)}
        </div>
      </section>
    );
  };

  const renderHero = (node: PortfolioTemplateNode) => {
    const imageSrc = getPropText(node, "imageSrc", data, data.profile.avatar);
    const layout = node.style?.layout || "split";

    return (
      <div className={cx("grid w-full gap-8", layout === "split" && "lg:grid-cols-[minmax(0,1fr)_360px] lg:items-center")}>
        <div className="min-w-0">
          <p className="text-sm font-black uppercase tracking-[0.18em] text-[var(--portfolio-node-accent)]">
            {getPropText(node, "eyebrow", data, data.profile.role)}
          </p>
          <h1 className="mt-4 max-w-[820px] text-[42px] font-black leading-[0.98] tracking-normal sm:text-[58px]">
            {getPropText(node, "headline", data, data.profile.name)}
          </h1>
          <p className="mt-6 max-w-[680px] text-lg leading-8 text-[var(--portfolio-muted)]">
            {getPropText(node, "body", data, data.profile.bio)}
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <a
              href={getPropText(node, "ctaHref", data, "#")}
              className="inline-flex h-11 items-center rounded-full bg-[var(--portfolio-accent)] px-6 text-sm font-bold text-white shadow-lg transition hover:-translate-y-0.5"
            >
              {getPropText(node, "ctaLabel", data, "View Work")}
            </a>
            <span className="text-sm font-semibold text-[var(--portfolio-muted)]">
              {data.profile.location}
            </span>
          </div>
        </div>
        <div
          className="min-h-[260px] rounded-2xl bg-cover bg-center shadow-2xl transition duration-500 hover:scale-[1.015]"
          style={{ backgroundImage: `url(${imageSrc})` }}
          aria-label={data.profile.name}
        />
      </div>
    );
  };

  const renderText = (node: PortfolioTemplateNode) => (
    <div className={cx("flex max-w-[760px] flex-col", alignmentClasses[node.style?.align || "left"])}>
      <p className="text-sm font-black uppercase tracking-[0.18em] text-[var(--portfolio-node-accent)]">
        {getPropText(node, "eyebrow", data, "Section")}
      </p>
      <h2 className="mt-3 text-[30px] font-black leading-tight sm:text-[38px]">
        {getPropText(node, "headline", data)}
      </h2>
      <p className="mt-4 text-base leading-7 text-[var(--portfolio-muted)]">
        {getPropText(node, "body", data)}
      </p>
    </div>
  );

  const renderButton = (node: PortfolioTemplateNode) => (
    <a
      href={getPropText(node, "href", data, "#")}
      className="inline-flex h-11 w-fit items-center rounded-full bg-[var(--portfolio-accent)] px-6 text-sm font-bold text-white transition hover:-translate-y-0.5"
    >
      {getPropText(node, "label", data, "Open")}
    </a>
  );

  const renderStats = (node: PortfolioTemplateNode) => {
    const stats = getSourceItems<{ label: string; value: string }>(node, data, "stats");

    return (
      <div className={cx("grid w-full", gapClasses[node.style?.gap || "md"], "md:grid-cols-3")}>
        {stats.map((stat) => (
          <div key={`${stat.label}-${stat.value}`} className="rounded-xl border border-[var(--portfolio-border)] bg-[var(--portfolio-surface)] p-6 transition hover:-translate-y-1 hover:shadow-lg">
            <p className="text-[32px] font-black text-[var(--portfolio-accent)]">{stat.value}</p>
            <p className="mt-2 text-sm font-semibold text-[var(--portfolio-muted)]">{stat.label}</p>
          </div>
        ))}
      </div>
    );
  };

  const renderProjectGrid = (node: PortfolioTemplateNode) => {
    const projects = getSourceItems<PortfolioProject>(node, data, "projects").slice(
      0,
      getNumberProp(node, "limit", 3),
    );

    return (
      <div className={cx("grid w-full", gapClasses[node.style?.gap || "lg"], "md:grid-cols-2 xl:grid-cols-3")}>
        {projects.map((project) => (
          <article key={project.title} className="group overflow-hidden rounded-xl border border-[var(--portfolio-border)] bg-[var(--portfolio-surface)] shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl">
            <div
              className="h-48 bg-cover bg-center transition duration-500 group-hover:scale-[1.03]"
              style={{ backgroundImage: `url(${project.image})` }}
            />
            <div className="p-6">
              <h3 className="text-xl font-black">{project.title}</h3>
              <p className="mt-3 text-sm leading-6 text-[var(--portfolio-muted)]">{project.description}</p>
              <div className="mt-5 flex flex-wrap gap-2">
                {project.tags.map((tag) => (
                  <span key={tag} className="rounded-full bg-[var(--portfolio-soft-accent)] px-3 py-1 text-xs font-bold text-[var(--portfolio-accent)]">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </article>
        ))}
      </div>
    );
  };

  const renderSkillCloud = (node: PortfolioTemplateNode) => {
    const skills = getSourceItems<string>(node, data, "skills");

    return (
      <div className="w-full">
        <h2 className="text-[30px] font-black">{getPropText(node, "headline", data, "Skills")}</h2>
        <div className={cx("mt-6 flex flex-wrap", gapClasses[node.style?.gap || "sm"])}>
          {skills.map((skill) => (
            <span key={skill} className="rounded-full border border-[var(--portfolio-border)] bg-[var(--portfolio-surface)] px-4 py-2 text-sm font-bold text-[var(--portfolio-text)] transition hover:border-[var(--portfolio-accent)] hover:text-[var(--portfolio-accent)]">
              {skill}
            </span>
          ))}
        </div>
      </div>
    );
  };

  const renderTimeline = (node: PortfolioTemplateNode) => {
    const experiences = getSourceItems<PortfolioExperience>(node, data, "experiences");

    return (
      <div className="w-full">
        <h2 className="text-[30px] font-black">{getPropText(node, "headline", data, "Experience")}</h2>
        <div className="mt-7 space-y-5">
          {experiences.map((experience) => (
            <article key={`${experience.company}-${experience.period}`} className="border-l-4 border-[var(--portfolio-accent)] bg-[var(--portfolio-surface)] py-1 pl-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h3 className="text-lg font-black">{experience.role}</h3>
                  <p className="mt-1 text-sm font-bold text-[var(--portfolio-accent)]">{experience.company}</p>
                </div>
                <p className="text-sm font-semibold text-[var(--portfolio-muted)]">{experience.period}</p>
              </div>
              <p className="mt-3 text-sm leading-6 text-[var(--portfolio-muted)]">{experience.summary}</p>
            </article>
          ))}
        </div>
      </div>
    );
  };

  const renderContact = (node: PortfolioTemplateNode) => (
    <div className="grid w-full gap-8 md:grid-cols-[minmax(0,1fr)_auto] md:items-end">
      <div>
        <h2 className="text-[34px] font-black leading-tight">
          {getPropText(node, "headline", data, "Let us work together.")}
        </h2>
        <p className="mt-4 max-w-[680px] text-base leading-7 opacity-80">
          {getPropText(node, "body", data)}
        </p>
      </div>
      <div className="flex flex-col gap-3 text-sm font-bold">
        <a href={`mailto:${data.profile.email}`} className="rounded-full bg-white px-5 py-3 text-[#090a0b] transition hover:-translate-y-0.5">
          {data.profile.email}
        </a>
        {data.profile.socialLinks.map((link) => (
          <a key={link.label} href={link.url} className="opacity-80 transition hover:opacity-100">
            {link.label}
          </a>
        ))}
      </div>
    </div>
  );

  const renderNodeContent = (node: PortfolioTemplateNode) => {
    switch (node.type) {
      case "section":
        return renderSection(node);
      case "hero":
        return renderHero(node);
      case "text":
        return renderText(node);
      case "button":
        return renderButton(node);
      case "stats":
        return renderStats(node);
      case "projectGrid":
        return renderProjectGrid(node);
      case "skillCloud":
        return renderSkillCloud(node);
      case "timeline":
        return renderTimeline(node);
      case "contact":
        return renderContact(node);
      default:
        return null;
    }
  };

  const renderNode = (node: PortfolioTemplateNode) => {
    if (node.isVisible === false || node.type === "root") {
      return null;
    }

    const content = renderNodeContent(node);

    if (mode !== "builder") {
      return <div key={node.id}>{content}</div>;
    }

    return (
      <div
        key={node.id}
        role="button"
        tabIndex={0}
        draggable={node.type === "section"}
        onClick={(event) => {
          event.stopPropagation();
          onSelectNode?.(node.id);
        }}
        onKeyDown={(event) => {
          if (event.key === "Enter") {
            onSelectNode?.(node.id);
          }
        }}
        onDragStart={() => onDragNode?.(node.id)}
        onDragOver={(event) => event.preventDefault()}
        onDrop={(event) => {
          event.preventDefault();
          event.stopPropagation();
          onDropNode?.(node.id);
        }}
        className={cx(
          "group relative rounded-lg border border-dashed border-transparent transition",
          selectedNodeId === node.id
            ? "border-[#3525cd] ring-2 ring-[#c3c0ff]"
            : "hover:border-[#3525cd]",
        )}
      >
        <span className="absolute left-3 top-3 z-10 rounded bg-[#090a0b] px-2 py-1 text-[11px] font-bold uppercase tracking-[0.12em] text-white opacity-0 transition group-hover:opacity-100">
          {node.label}
        </span>
        {content}
      </div>
    );
  };

  return (
    <div
      className="portfolio-engine min-h-full bg-[var(--portfolio-bg)] text-[var(--portfolio-text)]"
      style={{
        "--portfolio-bg": template.theme.backgroundColor,
        "--portfolio-surface": template.theme.surfaceColor,
        "--portfolio-text": template.theme.textColor,
        "--portfolio-muted": template.theme.mutedTextColor,
        "--portfolio-accent": template.theme.accentColor,
        "--portfolio-soft-accent": `${template.theme.accentColor}18`,
        "--portfolio-border": template.theme.borderColor,
        fontFamily: template.theme.fontFamily,
      } as CSSProperties}
      onClick={() => mode === "builder" && onSelectNode?.("")}
    >
      <style jsx global>{`
        @keyframes portfolioFadeUp {
          from { opacity: 0; transform: translateY(18px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes portfolioSlideIn {
          from { opacity: 0; transform: translateX(-18px); }
          to { opacity: 1; transform: translateX(0); }
        }

        @keyframes portfolioScaleIn {
          from { opacity: 0; transform: scale(0.96); }
          to { opacity: 1; transform: scale(1); }
        }

        .portfolio-animate-fade-up { animation: portfolioFadeUp 600ms ease both; }
        .portfolio-animate-slide-in { animation: portfolioSlideIn 600ms ease both; }
        .portfolio-animate-scale-in { animation: portfolioScaleIn 520ms ease both; }
      `}</style>
      <main className="space-y-6 px-4 py-6 sm:px-6">{template.root.children?.map((node) => renderNode(node))}</main>
    </div>
  );
};
