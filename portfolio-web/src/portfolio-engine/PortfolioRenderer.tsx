import { useState, type CSSProperties } from "react";
import {
  PortfolioData,
  PortfolioCustomCollectionItem,
  PortfolioExperience,
  PortfolioMediaItem,
  PortfolioProject,
  PortfolioTemplateNode,
  PortfolioTemplateSchema,
  PortfolioViewport,
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

const builderPaddingYClasses = {
  none: "py-0",
  sm: "py-4",
  md: "py-6",
  lg: "py-8",
  xl: "py-10",
} as const;

const builderPaddingXClasses = {
  none: "px-0",
  sm: "px-3",
  md: "px-4",
  lg: "px-5",
  xl: "px-6",
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

const aspectRatioClasses = {
  auto: "min-h-[260px]",
  video: "aspect-video",
  square: "aspect-square",
  portrait: "aspect-[4/5]",
  wide: "aspect-[21/9]",
} as const;

const animationClasses = {
  none: "",
  "fade-up": "portfolio-animate-fade-up",
  "slide-in": "portfolio-animate-slide-in",
  "scale-in": "portfolio-animate-scale-in",
} as const;

const isRecord = (value: unknown): value is Record<string, unknown> =>
  value !== null && typeof value === "object" && !Array.isArray(value);

const getTextValue = (value: unknown, data: PortfolioData, fallback = "") =>
  resolveText(value ?? fallback, data) || fallback;

const getBackgroundLayerStyle = (
  style:
    | Pick<
        PortfolioTemplateSchema["theme"],
        | "backgroundImage"
        | "backgroundOverlay"
        | "backgroundBlur"
        | "backgroundSize"
        | "backgroundPosition"
      >
    | PortfolioTemplateNode["style"]
    | undefined,
  data: PortfolioData,
): CSSProperties | null => {
  const backgroundImage = getTextValue(style?.backgroundImage, data);

  if (!backgroundImage) {
    return null;
  }

  const backgroundOverlay = style?.backgroundOverlay || "transparent";
  const backgroundBlur = style?.backgroundBlur || "0px";
  const shouldBlur = backgroundBlur !== "0" && backgroundBlur !== "0px";

  return {
    backgroundImage: `linear-gradient(${backgroundOverlay}, ${backgroundOverlay}), url(${backgroundImage})`,
    backgroundSize: style?.backgroundSize || "cover",
    backgroundPosition: style?.backgroundPosition || "center",
    backgroundRepeat: "no-repeat",
    filter: shouldBlur ? `blur(${backgroundBlur})` : undefined,
    transform: shouldBlur ? "scale(1.04)" : undefined,
  };
};

const getNodeStyle = (
  node: PortfolioTemplateNode,
  template: PortfolioTemplateSchema,
): CSSProperties => {
  return {
    backgroundColor: node.style?.backgroundColor,
    minHeight: node.style?.minHeight,
    borderColor: node.style?.borderColor,
    borderWidth: node.style?.borderWidth,
    borderStyle: node.style?.borderStyle,
    backdropFilter: node.style?.backdropBlur ? `blur(${node.style.backdropBlur})` : undefined,
    color: node.style?.textColor,
    "--portfolio-node-accent": node.style?.accentColor || template.theme.accentColor,
  } as CSSProperties;
};

const shouldRenderNodeSurface = (node: PortfolioTemplateNode) =>
  node.type !== "section" &&
  node.type !== "hero" &&
  Boolean(
    node.style?.backgroundImage ||
      node.style?.backgroundColor ||
      node.style?.textColor ||
      node.style?.backdropBlur ||
      node.style?.minHeight ||
      node.style?.borderWidth,
  );

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

const isMediaItem = (value: unknown): value is PortfolioMediaItem =>
  value !== null && typeof value === "object" && "src" in value && "type" in value;

export interface PortfolioRendererProps {
  template: PortfolioTemplateSchema;
  data: PortfolioData;
  mode?: "preview" | "builder";
  selectedNodeId?: string | null;
  onSelectNode?: (nodeId: string) => void;
  onDragNode?: (nodeId: string) => void;
  onDropNode?: (targetNodeId: string) => void;
  viewport?: PortfolioViewport;
}

export const PortfolioRenderer = ({
  template,
  data,
  mode = "preview",
  selectedNodeId,
  onSelectNode,
  onDragNode,
  onDropNode,
  viewport = "desktop",
}: PortfolioRendererProps) => {
  const isBuilder = mode === "builder";
  const [activeTabs, setActiveTabs] = useState<Record<string, number>>({});

  const getResponsiveGridClass = (desktopColumns: string) => {
    if (!isBuilder) {
      return desktopColumns;
    }

    if (viewport === "mobile") {
      return "grid-cols-1";
    }

    if (viewport === "tablet") {
      return "grid-cols-2";
    }

    return desktopColumns.includes("3") ? "grid-cols-3" : "grid-cols-2";
  };

  const renderChildren = (node: PortfolioTemplateNode) =>
    node.children?.filter((child) => child.isVisible !== false).map((child) => renderNode(child));

  const renderSection = (node: PortfolioTemplateNode) => {
    const layout = node.style?.layout || "stack";
    const gap = node.style?.gap || "lg";
    const align = node.style?.align || "left";
    const backgroundLayerStyle = getBackgroundLayerStyle(node.style, data);

    return (
      <section
        className={cx(
          "relative mx-auto w-full overflow-hidden",
          (isBuilder ? builderPaddingYClasses : paddingYClasses)[node.style?.paddingY || "lg"],
          (isBuilder ? builderPaddingXClasses : paddingXClasses)[node.style?.paddingX || "lg"],
          maxWidthClasses[node.style?.maxWidth || "xl"],
          radiusClasses[node.style?.radius || "none"],
          shadowClasses[node.style?.shadow || "none"],
          animationClasses[node.animation || "none"],
        )}
        style={getNodeStyle(node, template)}
      >
        {backgroundLayerStyle && (
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 z-0"
            style={backgroundLayerStyle}
          />
        )}
        <div
          className={cx(
            "relative z-10",
            layout === "grid" && "grid",
            layout === "grid" && getResponsiveGridClass("md:grid-cols-2"),
            layout === "split" && "grid",
            layout === "split" && getResponsiveGridClass("lg:grid-cols-2"),
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
    const imagePlacement = node.style?.imagePlacement || "side";
    const isCoverImage = imagePlacement === "cover";
    const shouldSplit =
      imagePlacement === "side" && layout === "split" && (!isBuilder || viewport === "desktop");
    const shouldShowImage = imagePlacement !== "cover" && imagePlacement !== "none";
    const shouldShowTopImage = imagePlacement === "top";
    const imageWidth = node.style?.imageWidth || "300px";
    const imageHeight = node.style?.imageHeight;
    const imageAspectRatio = node.style?.aspectRatio || "portrait";
    const imageFit = node.style?.mediaFit || "cover";
    const imagePosition = node.style?.backgroundPosition || "center";
    const coverOverlay = node.style?.backgroundOverlay || "rgba(9, 10, 11, 0.38)";
    const coverBlur = node.style?.backgroundBlur || "0px";
    const shouldBlurCover = coverBlur !== "0" && coverBlur !== "0px";
    const heroBackgroundLayerStyle = !isCoverImage
      ? getBackgroundLayerStyle(node.style, data)
      : null;
    const shouldUseFallbackPadding = Boolean(node.style?.backgroundColor || isCoverImage);
    const heroPaddingYClass = node.style?.paddingY
      ? (isBuilder ? builderPaddingYClasses : paddingYClasses)[node.style.paddingY]
      : shouldUseFallbackPadding
        ? "py-6 sm:py-8"
        : "";
    const heroPaddingXClass = node.style?.paddingX
      ? (isBuilder ? builderPaddingXClasses : paddingXClasses)[node.style.paddingX]
      : shouldUseFallbackPadding
        ? "px-6 sm:px-8"
        : "";

    const imageHolder = (
      <div
        className={cx(
          "bg-[var(--portfolio-soft-accent)] bg-no-repeat transition duration-500 hover:scale-[1.015]",
          !imageHeight && aspectRatioClasses[imageAspectRatio],
          imageFit === "contain" ? "bg-contain" : "bg-cover",
          radiusClasses[node.style?.radius || "xl"],
          shadowClasses[node.style?.shadow || "lg"],
        )}
        style={{
          backgroundImage: `url(${imageSrc})`,
          backgroundPosition: imagePosition,
          borderColor: node.style?.borderColor,
          borderWidth: node.style?.borderWidth,
          borderStyle: node.style?.borderStyle,
          height: imageHeight || undefined,
        }}
        role="img"
        aria-label={data.profile.name}
      />
    );

    return (
      <div
        className={cx(
          "relative grid w-full gap-7 overflow-hidden",
          heroPaddingYClass,
          heroPaddingXClass,
          isCoverImage && "min-h-[520px] content-center text-white",
          shouldSplit && "items-center",
          shouldShowTopImage && "grid-cols-1",
          radiusClasses[node.style?.radius || "none"],
          shadowClasses[node.style?.shadow || "none"],
        )}
        style={{
          backgroundColor: node.style?.backgroundColor,
          borderColor: node.style?.borderColor,
          borderWidth: node.style?.borderWidth,
          borderStyle: node.style?.borderStyle,
          color: node.style?.textColor,
          minHeight: isCoverImage ? node.style?.minHeight || imageHeight || "520px" : node.style?.minHeight,
          backdropFilter: node.style?.backdropBlur ? `blur(${node.style.backdropBlur})` : undefined,
          gridTemplateColumns: shouldSplit ? `minmax(0, 1fr) ${imageWidth}` : undefined,
          "--portfolio-muted": isCoverImage ? "rgba(255, 255, 255, 0.78)" : undefined,
          "--portfolio-node-accent": node.style?.accentColor,
        } as CSSProperties}
      >
        {heroBackgroundLayerStyle && (
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 z-0"
            style={heroBackgroundLayerStyle}
          />
        )}
        {isCoverImage && (
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 z-0 bg-cover bg-no-repeat"
            style={{
              backgroundImage: `linear-gradient(${coverOverlay}, ${coverOverlay}), url(${imageSrc})`,
              backgroundPosition: imagePosition,
              backgroundSize: imageFit === "contain" ? "contain" : "cover",
              filter: shouldBlurCover ? `blur(${coverBlur})` : undefined,
              transform: shouldBlurCover ? "scale(1.04)" : undefined,
            }}
          />
        )}
        {shouldShowTopImage && <div className="relative z-10">{imageHolder}</div>}
        <div className="relative z-10 min-w-0">
          <p className="text-sm font-black uppercase tracking-[0.18em] text-[var(--portfolio-node-accent)]">
            {getPropText(node, "eyebrow", data, data.profile.role)}
          </p>
          <h1
            className={cx(
              "mt-4 max-w-[820px] font-black leading-[0.98] tracking-normal",
              isBuilder && viewport === "mobile" && "text-[34px]",
              isBuilder && viewport === "tablet" && "text-[42px]",
              isBuilder && viewport === "desktop" && "text-[48px]",
              !isBuilder && "text-[42px] sm:text-[58px]",
            )}
          >
            {getPropText(node, "headline", data, data.profile.name)}
          </h1>
          <p
            className={cx(
              "mt-6 max-w-[680px] leading-8 text-[var(--portfolio-muted)]",
              isBuilder ? "text-base" : "text-lg",
            )}
          >
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
        {shouldShowImage && !shouldShowTopImage && <div className="relative z-10">{imageHolder}</div>}
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

  const renderCTA = (node: PortfolioTemplateNode) => (
    <div
      className={cx(
        "flex w-full flex-col gap-5",
        alignmentClasses[node.style?.align || "left"],
      )}
    >
      <div className="max-w-[760px]">
        <p className="text-sm font-black uppercase tracking-[0.18em] text-[var(--portfolio-node-accent)]">
          {getPropText(node, "eyebrow", data, "CTA")}
        </p>
        <h2 className="mt-3 text-[30px] font-black leading-tight sm:text-[38px]">
          {getPropText(node, "headline", data, "Ready to start?")}
        </h2>
        <p className="mt-4 text-base leading-7 text-[var(--portfolio-muted)]">
          {getPropText(node, "body", data)}
        </p>
      </div>

      <div className="flex flex-wrap gap-3">
        <a
          href={getPropText(node, "primaryHref", data, "#")}
          className="inline-flex h-11 items-center rounded-full bg-[var(--portfolio-accent)] px-6 text-sm font-bold text-white shadow-lg transition hover:-translate-y-0.5"
        >
          {getPropText(node, "primaryLabel", data, "Get Started")}
        </a>
        <a
          href={getPropText(node, "secondaryHref", data, "#")}
          className="inline-flex h-11 items-center rounded-full border border-[var(--portfolio-border)] bg-[var(--portfolio-surface)] px-6 text-sm font-bold text-[var(--portfolio-text)] transition hover:-translate-y-0.5 hover:border-[var(--portfolio-accent)] hover:text-[var(--portfolio-accent)]"
        >
          {getPropText(node, "secondaryLabel", data, "Learn More")}
        </a>
      </div>
    </div>
  );

  const renderStats = (node: PortfolioTemplateNode) => {
    const stats = getSourceItems<{ label: string; value: string }>(node, data, "stats");

    return (
      <div className={cx("grid w-full", gapClasses[node.style?.gap || "md"], getResponsiveGridClass("md:grid-cols-3"))}>
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
      getNumberProp(node, "limit", data.projects.length),
    );
    const imageAspectRatio = node.style?.aspectRatio || "video";
    const imageFit = node.style?.mediaFit || "cover";
    const imagePosition = node.style?.backgroundPosition || "center";
    const imageHeight = node.style?.imageHeight;

    return (
      <div className={cx("grid w-full", gapClasses[node.style?.gap || "lg"], getResponsiveGridClass("md:grid-cols-2 xl:grid-cols-3"))}>
        {projects.map((project) => (
          <article
            key={project.title}
            className={cx(
              "group overflow-hidden border border-[var(--portfolio-border)] bg-[var(--portfolio-surface)] transition duration-300 hover:-translate-y-1 hover:shadow-xl",
              radiusClasses[node.style?.radius || "xl"],
              shadowClasses[node.style?.shadow || "sm"],
            )}
            style={{
              borderColor: node.style?.borderColor,
              borderWidth: node.style?.borderWidth,
              borderStyle: node.style?.borderStyle,
            }}
          >
            <div
              className={cx(
                "bg-[var(--portfolio-soft-accent)] bg-no-repeat transition duration-500 group-hover:scale-[1.03]",
                !imageHeight && aspectRatioClasses[imageAspectRatio],
                imageFit === "contain" ? "bg-contain" : "bg-cover",
              )}
              style={{
                backgroundImage: `url(${project.image})`,
                backgroundPosition: imagePosition,
                height: imageHeight || undefined,
              }}
              role="img"
              aria-label={project.title}
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

  const resolveMediaItem = (node: PortfolioTemplateNode) => {
    const sourcePath = getPropText(node, "source", data, "media.0");
    const resolvedMedia = resolvePath(data, sourcePath);
    const sourceMedia = isMediaItem(resolvedMedia) ? resolvedMedia : undefined;
    const typeText = getPropText(node, "type", data, sourceMedia?.type || "image");
    const mediaType: PortfolioMediaItem["type"] = typeText === "video" ? "video" : "image";

    return {
      type: mediaType,
      src: getPropText(node, "src", data, sourceMedia?.src || ""),
      title: getPropText(node, "title", data, sourceMedia?.title || ""),
      description: getPropText(node, "description", data, sourceMedia?.description || ""),
      alt: getPropText(node, "alt", data, sourceMedia?.alt || sourceMedia?.title || ""),
      poster: getPropText(node, "poster", data, sourceMedia?.poster || ""),
      url: getPropText(node, "url", data, sourceMedia?.url || ""),
    };
  };

  const renderMediaSurface = (mediaItem: PortfolioMediaItem, node: PortfolioTemplateNode) => {
    const aspectRatio = node.style?.aspectRatio || "video";
    const mediaFit = node.style?.mediaFit || "cover";
    const fitClass = mediaFit === "contain" ? "object-contain" : "object-cover";

    return (
      <div
        className={cx(
          "overflow-hidden border border-[var(--portfolio-border)] bg-[var(--portfolio-surface)]",
          aspectRatioClasses[aspectRatio],
          radiusClasses[node.style?.radius || "lg"],
          shadowClasses[node.style?.shadow || "sm"],
        )}
        style={{
          borderColor: node.style?.borderColor,
          borderWidth: node.style?.borderWidth,
          borderStyle: node.style?.borderStyle,
        }}
      >
        {mediaItem.type === "video" ? (
          mediaItem.src ? (
            <video
              controls
              playsInline
              preload="metadata"
              poster={mediaItem.poster || undefined}
              className={cx("h-full w-full", fitClass)}
            >
              <source src={mediaItem.src} />
            </video>
          ) : (
            <div className="flex h-full min-h-[220px] items-center justify-center px-5 text-center text-sm font-bold text-[var(--portfolio-muted)]">
              Add a video source in the Data tab.
            </div>
          )
        ) : mediaItem.src ? (
          <div
            role="img"
            aria-label={mediaItem.alt || mediaItem.title || "Portfolio media"}
            className={cx(
              "h-full w-full bg-center bg-no-repeat transition duration-500 hover:scale-[1.02]",
              mediaFit === "contain" ? "bg-contain" : "bg-cover",
            )}
            style={{ backgroundImage: `url(${mediaItem.src})` }}
          />
        ) : (
          <div className="flex h-full min-h-[220px] items-center justify-center px-5 text-center text-sm font-bold text-[var(--portfolio-muted)]">
            Add an image source in the Data tab.
          </div>
        )}
      </div>
    );
  };

  const renderMedia = (node: PortfolioTemplateNode) => {
    const mediaItem = resolveMediaItem(node);
    const showCaption = getPropText(node, "showCaption", data, "true") !== "false";
    const surface = renderMediaSurface(mediaItem, node);

    return (
      <figure className="w-full">
        {mediaItem.url ? (
          <a href={mediaItem.url} className="block transition hover:-translate-y-1">
            {surface}
          </a>
        ) : (
          surface
        )}
        {showCaption && (mediaItem.title || mediaItem.description) && (
          <figcaption className="mt-3">
            {mediaItem.title && <h3 className="text-base font-black">{mediaItem.title}</h3>}
            {mediaItem.description && (
              <p className="mt-1 text-sm leading-6 text-[var(--portfolio-muted)]">
                {mediaItem.description}
              </p>
            )}
          </figcaption>
        )}
      </figure>
    );
  };

  const renderMediaGallery = (node: PortfolioTemplateNode) => {
    const items = getSourceItems<PortfolioMediaItem>(node, data, "media").slice(
      0,
      getNumberProp(node, "limit", data.media?.length || 0),
    );
    const headline = getPropText(node, "headline", data, "");

    return (
      <div className="w-full">
        {headline && <h2 className="text-[30px] font-black">{headline}</h2>}
        <div
          className={cx(
            headline && "mt-6",
            "grid w-full",
            gapClasses[node.style?.gap || "md"],
            getResponsiveGridClass("md:grid-cols-2 xl:grid-cols-3"),
          )}
        >
          {items.map((mediaItem, index) => (
            <figure key={`${mediaItem.title}-${index}`} className="min-w-0">
              {renderMediaSurface(mediaItem, node)}
              {(mediaItem.title || mediaItem.description) && (
                <figcaption className="mt-3">
                  {mediaItem.title && (
                    <h3 className="truncate text-base font-black">{mediaItem.title}</h3>
                  )}
                  {mediaItem.description && (
                    <p className="mt-1 line-clamp-2 text-sm leading-6 text-[var(--portfolio-muted)]">
                      {mediaItem.description}
                    </p>
                  )}
                </figcaption>
              )}
            </figure>
          ))}
        </div>
      </div>
    );
  };

  const renderTabs = (node: PortfolioTemplateNode) => {
    const rawTabs = node.props?.tabs;
    const tabs = (Array.isArray(rawTabs) ? rawTabs : [])
      .filter(isRecord)
      .map((tab, index) => ({
        label: getTextValue(tab.label, data, `Tab ${index + 1}`),
        eyebrow: getTextValue(tab.eyebrow, data),
        headline: getTextValue(tab.headline, data),
        body: getTextValue(tab.body, data),
        ctaLabel: getTextValue(tab.ctaLabel, data),
        ctaHref: getTextValue(tab.ctaHref, data, "#"),
        mediaSource: getTextValue(tab.mediaSource, data),
      }));
    const safeTabs =
      tabs.length > 0
        ? tabs
        : [
            {
              label: "Overview",
              eyebrow: "Tabs",
              headline: "Add tabbed content",
              body: "Edit the tabs JSON in the inspector to add panels, CTAs, and media.",
              ctaLabel: "",
              ctaHref: "#",
              mediaSource: "",
            },
          ];
    const activeIndex = Math.min(activeTabs[node.id] ?? 0, safeTabs.length - 1);
    const activeTab = safeTabs[activeIndex];
    const mediaItem = isMediaItem(resolvePath(data, activeTab.mediaSource || ""))
      ? (resolvePath(data, activeTab.mediaSource) as PortfolioMediaItem)
      : null;

    return (
      <div className="w-full">
        <div className="flex flex-wrap gap-2 border-b border-[var(--portfolio-border)]">
          {safeTabs.map((tab, index) => (
            <button
              key={`${tab.label}-${index}`}
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                setActiveTabs((current) => ({ ...current, [node.id]: index }));
              }}
              className={cx(
                "border-b-2 px-4 py-3 text-sm font-black transition",
                activeIndex === index
                  ? "border-[var(--portfolio-accent)] text-[var(--portfolio-accent)]"
                  : "border-transparent text-[var(--portfolio-muted)] hover:text-[var(--portfolio-text)]",
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div
          className={cx(
            "mt-6 grid gap-6",
            mediaItem && getResponsiveGridClass("md:grid-cols-2"),
          )}
        >
          <div className="min-w-0">
            {activeTab.eyebrow && (
              <p className="text-sm font-black uppercase tracking-[0.18em] text-[var(--portfolio-node-accent)]">
                {activeTab.eyebrow}
              </p>
            )}
            {activeTab.headline && (
              <h3 className="mt-3 text-[28px] font-black leading-tight">
                {activeTab.headline}
              </h3>
            )}
            {activeTab.body && (
              <p className="mt-4 text-base leading-7 text-[var(--portfolio-muted)]">
                {activeTab.body}
              </p>
            )}
            {activeTab.ctaLabel && (
              <a
                href={activeTab.ctaHref}
                className="mt-5 inline-flex h-10 items-center rounded-full bg-[var(--portfolio-accent)] px-5 text-sm font-bold text-white transition hover:-translate-y-0.5"
              >
                {activeTab.ctaLabel}
              </a>
            )}
          </div>

          {mediaItem && renderMediaSurface(mediaItem, node)}
        </div>
      </div>
    );
  };

  const renderCustomList = (node: PortfolioTemplateNode) => {
    const items = getSourceItems<PortfolioCustomCollectionItem>(node, data, "collections.awards");
    const titleKey = getPropText(node, "titleKey", data, "title");
    const descriptionKey = getPropText(node, "descriptionKey", data, "description");
    const metaKey = getPropText(node, "metaKey", data, "meta");

    return (
      <div className="w-full">
        <h2 className="text-[30px] font-black">{getPropText(node, "headline", data, "Highlights")}</h2>
        <div className={cx("mt-6 grid w-full", gapClasses[node.style?.gap || "md"], getResponsiveGridClass("md:grid-cols-2"))}>
          {items.map((item, index) => (
            <article
              key={`${String(item[titleKey] || "item")}-${index}`}
              className="rounded-xl border border-[var(--portfolio-border)] bg-[var(--portfolio-surface)] p-5 transition hover:-translate-y-1 hover:shadow-lg"
            >
              {item[metaKey] && (
                <p className="text-xs font-black uppercase tracking-[0.16em] text-[var(--portfolio-accent)]">
                  {item[metaKey]}
                </p>
              )}
              <h3 className="mt-2 text-lg font-black">
                {item[titleKey] || `Item ${index + 1}`}
              </h3>
              {item[descriptionKey] && (
                <p className="mt-3 text-sm leading-6 text-[var(--portfolio-muted)]">
                  {item[descriptionKey]}
                </p>
              )}
              {item.url && (
                <a
                  href={item.url}
                  className="mt-4 inline-flex text-sm font-bold text-[var(--portfolio-accent)]"
                >
                  Open
                </a>
              )}
            </article>
          ))}
        </div>
      </div>
    );
  };

  const renderContact = (node: PortfolioTemplateNode) => (
    <div
      className={cx(
        "grid w-full gap-8",
        !isBuilder && "md:grid-cols-[minmax(0,1fr)_auto] md:items-end",
        isBuilder && viewport !== "mobile" && "grid-cols-[minmax(0,1fr)_auto] items-end",
      )}
    >
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
      case "cta":
        return renderCTA(node);
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
      case "media":
        return renderMedia(node);
      case "mediaGallery":
        return renderMediaGallery(node);
      case "tabs":
        return renderTabs(node);
      case "customList":
        return renderCustomList(node);
      default:
        return null;
    }
  };

  const renderNodeSurface = (node: PortfolioTemplateNode, content: ReturnType<typeof renderNodeContent>) => {
    if (!shouldRenderNodeSurface(node)) {
      return content;
    }

    const backgroundLayerStyle = getBackgroundLayerStyle(node.style, data);

    return (
      <div
        className={cx(
          "relative w-full overflow-hidden",
          node.style?.paddingY && (isBuilder ? builderPaddingYClasses : paddingYClasses)[node.style.paddingY],
          node.style?.paddingX && (isBuilder ? builderPaddingXClasses : paddingXClasses)[node.style.paddingX],
          node.style?.maxWidth && maxWidthClasses[node.style.maxWidth],
          radiusClasses[node.style?.radius || "none"],
          shadowClasses[node.style?.shadow || "none"],
        )}
        style={getNodeStyle(node, template)}
      >
        {backgroundLayerStyle && (
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 z-0"
            style={backgroundLayerStyle}
          />
        )}
        <div className="relative z-10">{content}</div>
      </div>
    );
  };

  const renderNode = (node: PortfolioTemplateNode) => {
    if (node.isVisible === false || node.type === "root") {
      return null;
    }

    const content = renderNodeSurface(node, renderNodeContent(node));

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

  const portfolioBackgroundLayerStyle = getBackgroundLayerStyle(template.theme, data);

  return (
    <div
      className="portfolio-engine relative min-h-full overflow-hidden bg-[var(--portfolio-bg)] text-[var(--portfolio-text)]"
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
      {portfolioBackgroundLayerStyle && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-0"
          style={portfolioBackgroundLayerStyle}
        />
      )}
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
      <main className={cx("relative z-10", isBuilder ? "space-y-4 px-3 py-4" : "space-y-6 px-4 py-6 sm:px-6")}>
        {template.root.children?.map((node) => renderNode(node))}
      </main>
    </div>
  );
};
