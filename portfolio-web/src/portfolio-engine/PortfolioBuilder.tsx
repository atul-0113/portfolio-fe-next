"use client";

import { useMemo, useState } from "react";
import {
  FiCode,
  FiCopy,
  FiDatabase,
  FiEye,
  FiExternalLink,
  FiLayers,
  FiMonitor,
  FiMove,
  FiPlus,
  FiSettings,
  FiSmartphone,
  FiTablet,
  FiTrash2,
} from "react-icons/fi";
import { PortfolioRenderer } from "./PortfolioRenderer";
import { NodeStyleEditor } from "./NodeStyleEditor";
import {
  demoPortfolioData,
  portfolioComponentPalette,
  starterPortfolioTemplates,
} from "./templates";
import {
  PortfolioCustomCollectionItem,
  PortfolioData,
  PortfolioExperience,
  PortfolioMediaItem,
  PortfolioNodeStyle,
  PortfolioPaletteItem,
  PortfolioProject,
  PortfolioTemplateNode,
  PortfolioTemplateSchema,
  PortfolioViewport,
} from "./types";
import {
  addPortfolioChildNode,
  appendPortfolioNodeToRoot,
  clonePortfolioNode,
  getPortfolioNodeById,
  removePortfolioNode,
  reorderRootPortfolioNode,
  updatePortfolioNode,
} from "./schemaUtils";
import {
  createPortfolioPreviewId,
  getPortfolioPreviewStorageKey,
  type PortfolioPreviewPayload,
} from "./previewStorage";

const cx = (...classes: Array<string | false | null | undefined>) =>
  classes.filter(Boolean).join(" ");

const cloneTemplate = (template: PortfolioTemplateSchema): PortfolioTemplateSchema =>
  JSON.parse(JSON.stringify(template)) as PortfolioTemplateSchema;

const clonePortfolioData = (data: PortfolioData): PortfolioData =>
  JSON.parse(JSON.stringify(data)) as PortfolioData;

const viewportClasses: Record<PortfolioViewport, string> = {
  desktop: "w-[1040px] max-w-full",
  tablet: "w-[760px] max-w-full",
  mobile: "w-[390px] max-w-full",
};

type BuilderPanel = "components" | "inspector" | "data" | "theme" | "json";
type ProfileTextKey = Exclude<keyof PortfolioData["profile"], "socialLinks">;
type StatKey = "label" | "value";
type MediaEditableKey = Exclude<keyof PortfolioMediaItem, "type">;

const defaultCollectionItemFields = ["title", "description", "meta", "url"];

const colorFieldLabels: Array<{
  key: keyof PortfolioTemplateSchema["theme"];
  label: string;
}> = [
  { key: "backgroundColor", label: "Background" },
  { key: "surfaceColor", label: "Surface" },
  { key: "textColor", label: "Text" },
  { key: "mutedTextColor", label: "Muted Text" },
  { key: "accentColor", label: "Accent" },
  { key: "borderColor", label: "Border" },
];

const bindingExamples = [
  "{{profile.name}}",
  "{{profile.role}}",
  "{{profile.bio}}",
  "{{custom.tagline}}",
  "projects",
  "skills",
  "experiences",
  "collections.awards",
  "media",
  "media.0.src",
];

const sampleSectionJson = JSON.stringify(
  {
    id: "section-media-story",
    type: "section",
    label: "Media Story Section",
    style: {
      paddingY: "xl",
      paddingX: "lg",
      maxWidth: "xl",
      backgroundImage: "{{media.0.src}}",
      backgroundOverlay: "rgba(9, 10, 11, 0.55)",
      backgroundSize: "cover",
      backgroundPosition: "center",
      textColor: "#ffffff",
      radius: "lg",
      shadow: "sm",
    },
    animation: "fade-up",
    children: [
      {
        id: "media-story-copy",
        type: "text",
        label: "Media Story Copy",
        props: {
          eyebrow: "Media",
          headline: "A visual section with background image support.",
          body: "Use media records for images, videos, galleries, and section backgrounds.",
        },
        style: {
          maxWidth: "md",
          accentColor: "#ffffff",
        },
      },
      {
        id: "media-story-gallery",
        type: "mediaGallery",
        label: "Media Gallery",
        props: {
          source: "media",
          headline: "",
          limit: 3,
        },
        style: {
          columns: 3,
          gap: "md",
          aspectRatio: "video",
          mediaFit: "cover",
        },
      },
    ],
  },
  null,
  2,
);

const getBlankSection = () => {
  const blankSection = portfolioComponentPalette.find((item) => item.id === "section-blank");
  return clonePortfolioNode(blankSection?.blueprint || portfolioComponentPalette[0].blueprint);
};

const isRecord = (value: unknown): value is Record<string, unknown> =>
  Boolean(value) && typeof value === "object" && !Array.isArray(value);

const isTemplateSchema = (value: unknown): value is PortfolioTemplateSchema =>
  isRecord(value) && isRecord(value.root) && isRecord(value.theme) && typeof value.name === "string";

const isTemplateNode = (value: unknown): value is PortfolioTemplateNode =>
  isRecord(value) && typeof value.type === "string" && typeof value.label === "string";

const toTagText = (tags: string[]) => tags.join(", ");

const fromTagText = (value: string) =>
  value
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);

const makeUniqueKey = (base: string, source: Record<string, unknown>) => {
  let index = 1;
  let nextKey = base;

  while (nextKey in source) {
    index += 1;
    nextKey = `${base}${index}`;
  }

  return nextKey;
};

const stringifyForSource = (value: unknown) =>
  JSON.stringify(value, null, 2).replace(/</g, "\\u003c");

const createPortfolioPageSource = (
  template: PortfolioTemplateSchema,
  data: PortfolioData,
) => `"use client";

import { PortfolioRenderer } from "@/portfolio-engine";
import type { PortfolioData, PortfolioTemplateSchema } from "@/portfolio-engine";

const template = ${stringifyForSource(template)} satisfies PortfolioTemplateSchema;

const data = ${stringifyForSource(data)} satisfies PortfolioData;

export default function PortfolioPage() {
  return (
    <main className="min-h-screen">
      <PortfolioRenderer template={template} data={data} />
    </main>
  );
}
`;

export const PortfolioBuilder = () => {
  const [template, setTemplate] = useState<PortfolioTemplateSchema>(() =>
    cloneTemplate(starterPortfolioTemplates[0]),
  );
  const [portfolioData, setPortfolioData] = useState<PortfolioData>(() =>
    clonePortfolioData(demoPortfolioData),
  );
  const [viewport, setViewport] = useState<PortfolioViewport>("desktop");
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [draggedPaletteId, setDraggedPaletteId] = useState<string | null>(null);
  const [draggedNodeId, setDraggedNodeId] = useState<string | null>(null);
  const [activePanel, setActivePanel] = useState<BuilderPanel>("components");
  const [jsonInput, setJsonInput] = useState(sampleSectionJson);
  const [jsonError, setJsonError] = useState("");
  const [copied, setCopied] = useState(false);
  const [copiedSource, setCopiedSource] = useState(false);
  const [previewError, setPreviewError] = useState("");

  const selectedNode = useMemo(
    () => getPortfolioNodeById(template, selectedNodeId),
    [selectedNodeId, template],
  );

  const paletteGroups = useMemo(
    () =>
      portfolioComponentPalette.reduce<Record<string, PortfolioPaletteItem[]>>((groups, item) => {
        groups[item.group] = [...(groups[item.group] || []), item];
        return groups;
      }, {}),
    [],
  );

  const templateJson = useMemo(() => JSON.stringify(template, null, 2), [template]);

  const portfolioDataJson = useMemo(() => JSON.stringify(portfolioData, null, 2), [portfolioData]);

  const pageSource = useMemo(
    () => createPortfolioPageSource(template, portfolioData),
    [portfolioData, template],
  );

  const customCollectionKeys = useMemo(
    () => Object.keys(portfolioData.collections),
    [portfolioData.collections],
  );

  const addPaletteItem = (item: PortfolioPaletteItem) => {
    const node = clonePortfolioNode(item.blueprint);
    let nextSelectedNodeId = node.id;

    setTemplate((current) => {
      const selected = getPortfolioNodeById(current, selectedNodeId);

      if (selected && selected.type !== "root") {
        return addPortfolioChildNode(current, selected.id, node);
      }

      if (node.type !== "section") {
        const section = getBlankSection();
        section.label = `${node.label} Section`;
        if (node.type === "hero") {
          section.style = {
            paddingY: "xl",
            paddingX: "lg",
            maxWidth: "xl",
          };
        }
        section.children = [node];
        return appendPortfolioNodeToRoot(current, section);
      }

      return appendPortfolioNodeToRoot(current, node);
    });
    setSelectedNodeId(nextSelectedNodeId);
    setActivePanel("inspector");
  };

  const updateSelectedNode = (
    updater: (node: PortfolioTemplateNode) => PortfolioTemplateNode,
  ) => {
    if (!selectedNodeId) {
      return;
    }

    setTemplate((current) => updatePortfolioNode(current, selectedNodeId, updater));
  };

  const updateSelectedProp = (key: string, value: string) => {
    updateSelectedNode((node) => ({
      ...node,
      props: {
        ...node.props,
        [key]: key === "limit" ? Number(value) : value,
      },
    }));
  };

  const updateSelectedRawProp = (key: string, value: unknown) => {
    updateSelectedNode((node) => ({
      ...node,
      props: {
        ...node.props,
        [key]: value,
      },
    }));
  };

  const updateSelectedStyle = (key: keyof PortfolioNodeStyle, value: string) => {
    updateSelectedNode((node) => ({
      ...node,
      style: Object.fromEntries(
        Object.entries({
          ...node.style,
          [key]: key === "columns" && value ? Number(value) : value,
        }).filter(([, entryValue]) => entryValue !== ""),
      ) as PortfolioNodeStyle,
    }));
  };

  const deleteSelectedNode = () => {
    if (!selectedNodeId) {
      return;
    }

    setTemplate((current) => removePortfolioNode(current, selectedNodeId));
    setSelectedNodeId(null);
    setActivePanel("components");
  };

  const updateProfile = (key: ProfileTextKey, value: string) => {
    setPortfolioData((current) => ({
      ...current,
      profile: {
        ...current.profile,
        [key]: value,
      },
    }));
  };

  const addSocialLink = () => {
    setPortfolioData((current) => ({
      ...current,
      profile: {
        ...current.profile,
        socialLinks: [...current.profile.socialLinks, { label: "New Link", url: "https://" }],
      },
    }));
  };

  const updateSocialLink = (linkIndex: number, key: "label" | "url", value: string) => {
    setPortfolioData((current) => ({
      ...current,
      profile: {
        ...current.profile,
        socialLinks: current.profile.socialLinks.map((link, index) =>
          index === linkIndex ? { ...link, [key]: value } : link,
        ),
      },
    }));
  };

  const removeSocialLink = (linkIndex: number) => {
    setPortfolioData((current) => ({
      ...current,
      profile: {
        ...current.profile,
        socialLinks: current.profile.socialLinks.filter((_, index) => index !== linkIndex),
      },
    }));
  };

  const addStat = () => {
    setPortfolioData((current) => ({
      ...current,
      stats: [...current.stats, { label: "New Metric", value: "0" }],
    }));
  };

  const updateStat = (statIndex: number, key: StatKey, value: string) => {
    setPortfolioData((current) => ({
      ...current,
      stats: current.stats.map((stat, index) =>
        index === statIndex ? { ...stat, [key]: value } : stat,
      ),
    }));
  };

  const removeStat = (statIndex: number) => {
    setPortfolioData((current) => ({
      ...current,
      stats: current.stats.filter((_, index) => index !== statIndex),
    }));
  };

  const updateSkills = (value: string) => {
    setPortfolioData((current) => ({
      ...current,
      skills: fromTagText(value),
    }));
  };

  const addExperience = () => {
    const nextExperience: PortfolioExperience = {
      company: "Company",
      role: "Role",
      period: "2026 - Present",
      summary: "Describe your impact and responsibilities.",
    };

    setPortfolioData((current) => ({
      ...current,
      experiences: [...current.experiences, nextExperience],
    }));
  };

  const updateExperience = (
    experienceIndex: number,
    key: keyof PortfolioExperience,
    value: string,
  ) => {
    setPortfolioData((current) => ({
      ...current,
      experiences: current.experiences.map((experience, index) =>
        index === experienceIndex ? { ...experience, [key]: value } : experience,
      ),
    }));
  };

  const removeExperience = (experienceIndex: number) => {
    setPortfolioData((current) => ({
      ...current,
      experiences: current.experiences.filter((_, index) => index !== experienceIndex),
    }));
  };

  const addMedia = () => {
    const nextMedia: PortfolioMediaItem = {
      type: "image",
      title: "New Media",
      description: "Describe this image or video.",
      src: "/images/cards/cards-03.png",
      alt: "Portfolio media preview",
      poster: "",
      url: "",
    };

    setPortfolioData((current) => ({
      ...current,
      media: [...current.media, nextMedia],
    }));
    setActivePanel("data");
  };

  const updateMediaType = (mediaIndex: number, value: PortfolioMediaItem["type"]) => {
    setPortfolioData((current) => ({
      ...current,
      media: current.media.map((mediaItem, index) =>
        index === mediaIndex ? { ...mediaItem, type: value } : mediaItem,
      ),
    }));
  };

  const updateMedia = (mediaIndex: number, key: MediaEditableKey, value: string) => {
    setPortfolioData((current) => ({
      ...current,
      media: current.media.map((mediaItem, index) =>
        index === mediaIndex ? { ...mediaItem, [key]: value } : mediaItem,
      ),
    }));
  };

  const removeMedia = (mediaIndex: number) => {
    setPortfolioData((current) => ({
      ...current,
      media: current.media.filter((_, index) => index !== mediaIndex),
    }));
  };

  const addProject = () => {
    const nextProject: PortfolioProject = {
      title: "New Project",
      description: "Describe the project, your role, and the outcome.",
      image: "/images/cards/cards-03.png",
      tags: ["React", "Next.js"],
      url: "#",
    };

    setPortfolioData((current) => ({
      ...current,
      projects: [...current.projects, nextProject],
    }));
    setActivePanel("data");
  };

  const updateProject = (projectIndex: number, key: keyof PortfolioProject, value: string) => {
    setPortfolioData((current) => ({
      ...current,
      projects: current.projects.map((project, index) =>
        index === projectIndex
          ? {
              ...project,
              [key]: key === "tags" ? fromTagText(value) : value,
            }
          : project,
      ),
    }));
  };

  const addCustomField = () => {
    setPortfolioData((current) => {
      const key = makeUniqueKey("customField", current.custom);

      return {
        ...current,
        custom: {
          ...current.custom,
          [key]: "Custom value",
        },
      };
    });
  };

  const updateCustomFieldKey = (oldKey: string, nextKey: string) => {
    const trimmedKey = nextKey.trim();

    if (!trimmedKey || trimmedKey === oldKey) {
      return;
    }

    setPortfolioData((current) => {
      const nextCustom = { ...current.custom };
      const value = nextCustom[oldKey] || "";
      delete nextCustom[oldKey];
      nextCustom[trimmedKey in nextCustom ? makeUniqueKey(trimmedKey, nextCustom) : trimmedKey] =
        value;

      return {
        ...current,
        custom: nextCustom,
      };
    });
  };

  const updateCustomFieldValue = (key: string, value: string) => {
    setPortfolioData((current) => ({
      ...current,
      custom: {
        ...current.custom,
        [key]: value,
      },
    }));
  };

  const removeCustomField = (key: string) => {
    setPortfolioData((current) => {
      const nextCustom = { ...current.custom };
      delete nextCustom[key];

      return {
        ...current,
        custom: nextCustom,
      };
    });
  };

  const addCollection = () => {
    setPortfolioData((current) => {
      const key = makeUniqueKey("newCollection", current.collections);

      return {
        ...current,
        collections: {
          ...current.collections,
          [key]: [
            {
              title: "New Item",
              description: "Describe this item.",
              meta: "2026",
            },
          ],
        },
      };
    });
  };

  const updateCollectionKey = (oldKey: string, nextKey: string) => {
    const trimmedKey = nextKey.trim();

    if (!trimmedKey || trimmedKey === oldKey) {
      return;
    }

    setPortfolioData((current) => {
      const nextCollections = { ...current.collections };
      const items = nextCollections[oldKey] || [];
      delete nextCollections[oldKey];
      nextCollections[
        trimmedKey in nextCollections ? makeUniqueKey(trimmedKey, nextCollections) : trimmedKey
      ] = items;

      return {
        ...current,
        collections: nextCollections,
      };
    });
  };

  const removeCollection = (collectionKey: string) => {
    setPortfolioData((current) => {
      const nextCollections = { ...current.collections };
      delete nextCollections[collectionKey];

      return {
        ...current,
        collections: nextCollections,
      };
    });
  };

  const addCollectionItem = (collectionKey: string) => {
    setPortfolioData((current) => ({
      ...current,
      collections: {
        ...current.collections,
        [collectionKey]: [
          ...(current.collections[collectionKey] || []),
          {
            title: "New Item",
            description: "Describe this item.",
            meta: "2026",
          },
        ],
      },
    }));
  };

  const updateCollectionItem = (
    collectionKey: string,
    itemIndex: number,
    key: keyof PortfolioCustomCollectionItem,
    value: string,
  ) => {
    setPortfolioData((current) => ({
      ...current,
      collections: {
        ...current.collections,
        [collectionKey]: (current.collections[collectionKey] || []).map((item, index) =>
          index === itemIndex ? { ...item, [key]: value } : item,
        ),
      },
    }));
  };

  const addCollectionItemField = (collectionKey: string, itemIndex: number) => {
    setPortfolioData((current) => ({
      ...current,
      collections: {
        ...current.collections,
        [collectionKey]: (current.collections[collectionKey] || []).map((item, index) => {
          if (index !== itemIndex) {
            return item;
          }

          const fieldKey = makeUniqueKey("field", item);

          return {
            ...item,
            [fieldKey]: "Custom value",
          };
        }),
      },
    }));
  };

  const updateCollectionItemFieldKey = (
    collectionKey: string,
    itemIndex: number,
    oldKey: string,
    nextKey: string,
  ) => {
    const trimmedKey = nextKey.trim();

    if (!trimmedKey || trimmedKey === oldKey) {
      return;
    }

    setPortfolioData((current) => ({
      ...current,
      collections: {
        ...current.collections,
        [collectionKey]: (current.collections[collectionKey] || []).map((item, index) => {
          if (index !== itemIndex) {
            return item;
          }

          const nextItem = { ...item };
          const value = nextItem[oldKey] || "";
          delete nextItem[oldKey];
          const safeKey = trimmedKey in nextItem ? makeUniqueKey(trimmedKey, nextItem) : trimmedKey;

          return {
            ...nextItem,
            [safeKey]: value,
          };
        }),
      },
    }));
  };

  const removeCollectionItemField = (
    collectionKey: string,
    itemIndex: number,
    fieldKey: string,
  ) => {
    setPortfolioData((current) => ({
      ...current,
      collections: {
        ...current.collections,
        [collectionKey]: (current.collections[collectionKey] || []).map((item, index) => {
          if (index !== itemIndex) {
            return item;
          }

          const nextItem = { ...item };
          delete nextItem[fieldKey];
          return nextItem;
        }),
      },
    }));
  };

  const removeCollectionItem = (collectionKey: string, itemIndex: number) => {
    setPortfolioData((current) => ({
      ...current,
      collections: {
        ...current.collections,
        [collectionKey]: (current.collections[collectionKey] || []).filter(
          (_, index) => index !== itemIndex,
        ),
      },
    }));
  };

  const removeProject = (projectIndex: number) => {
    setPortfolioData((current) => ({
      ...current,
      projects: current.projects.filter((_, index) => index !== projectIndex),
    }));
  };

  const addJsonToTemplate = () => {
    setJsonError("");

    try {
      const parsedJson = JSON.parse(jsonInput) as unknown;

      if (isTemplateSchema(parsedJson)) {
        setTemplate(parsedJson);
        setSelectedNodeId(null);
        setActivePanel("theme");
        return;
      }

      if (!isTemplateNode(parsedJson)) {
        setJsonError("JSON must be a template schema or a node with type and label.");
        return;
      }

      const node = clonePortfolioNode(parsedJson);
      const nextSelectedNodeId = node.id;

      setTemplate((current) => {
        const selected = getPortfolioNodeById(current, selectedNodeId);

        if (selected && selected.type !== "root") {
          return addPortfolioChildNode(current, selected.id, node);
        }

        if (node.type === "section") {
          return appendPortfolioNodeToRoot(current, node);
        }

        const section = getBlankSection();
        section.label = `${node.label} Section`;
        if (node.type === "hero") {
          section.style = {
            paddingY: "xl",
            paddingX: "lg",
            maxWidth: "xl",
          };
        }
        section.children = [node];
        return appendPortfolioNodeToRoot(current, section);
      });

      setSelectedNodeId(nextSelectedNodeId);
      setActivePanel("inspector");
    } catch {
      setJsonError("Invalid JSON. Check quotes, commas, and brackets.");
    }
  };

  const handleCanvasDrop = () => {
    if (!draggedPaletteId) {
      return;
    }

    const paletteItem = portfolioComponentPalette.find((item) => item.id === draggedPaletteId);

    if (paletteItem) {
      addPaletteItem(paletteItem);
    }

    setDraggedPaletteId(null);
  };

  const handleDropNode = (targetNodeId: string) => {
    if (!draggedNodeId) {
      return;
    }

    setTemplate((current) => reorderRootPortfolioNode(current, draggedNodeId, targetNodeId));
    setDraggedNodeId(null);
  };

  const copyTemplateJson = async () => {
    await navigator.clipboard.writeText(templateJson);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1400);
  };

  const copyPageSource = async () => {
    await navigator.clipboard.writeText(pageSource);
    setCopiedSource(true);
    window.setTimeout(() => setCopiedSource(false), 1400);
  };

  const openPreviewInNewTab = () => {
    setPreviewError("");

    try {
      const previewId = createPortfolioPreviewId();
      const payload: PortfolioPreviewPayload = {
        template,
        data: portfolioData,
        createdAt: new Date().toISOString(),
      };

      window.localStorage.setItem(
        getPortfolioPreviewStorageKey(previewId),
        JSON.stringify(payload),
      );

      const previewWindow = window.open(
        `/templates/builder/preview?previewId=${encodeURIComponent(previewId)}`,
        "_blank",
      );

      if (!previewWindow) {
        setPreviewError("Preview was blocked. Allow popups for this site and try again.");
        return;
      }

      previewWindow.focus();
    } catch {
      setPreviewError("Preview could not open. Your browser blocked local preview data.");
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 rounded-lg border border-[#c7c4d8] bg-white px-4 py-3 xl:flex-row xl:items-center xl:justify-between">
        <div className="min-w-0">
          <p className="text-[11px] font-black uppercase tracking-[0.16em] text-[#3525cd]">
            Portfolio Builder Engine
          </p>
          <h1 className="mt-1 truncate text-[22px] font-black leading-tight text-[#090a0b]">
            Schema-driven template studio
          </h1>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <select
            value={template.id}
            onChange={(event) => {
              const nextTemplate = starterPortfolioTemplates.find(
                (item) => item.id === event.target.value,
              );

              if (nextTemplate) {
                setTemplate(cloneTemplate(nextTemplate));
                setSelectedNodeId(null);
                setActivePanel("theme");
              }
            }}
            className="h-9 rounded-md border border-[#c7c4d8] bg-[#f8f9fa] px-3 text-sm font-semibold text-[#191c1d] outline-none focus:border-[#3525cd]"
          >
            {starterPortfolioTemplates.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name}
              </option>
            ))}
          </select>

          <div className="inline-flex overflow-hidden rounded-md border border-[#c7c4d8] bg-[#f8f9fa]">
            {[
              { id: "desktop", icon: <FiMonitor size={16} />, label: "Desktop" },
              { id: "tablet", icon: <FiTablet size={16} />, label: "Tablet" },
              { id: "mobile", icon: <FiSmartphone size={16} />, label: "Mobile" },
            ].map((item) => (
              <button
                key={item.id}
                type="button"
                title={item.label}
                onClick={() => setViewport(item.id as PortfolioViewport)}
                className={cx(
                  "flex h-9 w-10 items-center justify-center transition",
                  viewport === item.id
                    ? "bg-[#3525cd] text-white"
                    : "text-[#464555] hover:text-[#3525cd]",
                )}
              >
                {item.icon}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={copyTemplateJson}
            className="inline-flex h-9 items-center gap-2 rounded-md border border-[#c7c4d8] bg-white px-3 text-sm font-bold text-[#191c1d] transition hover:border-[#3525cd] hover:text-[#3525cd]"
          >
            <FiCopy size={15} />
            {copied ? "Copied" : "Copy JSON"}
          </button>

          <button
            type="button"
            onClick={openPreviewInNewTab}
            className="inline-flex h-9 items-center gap-2 rounded-md border border-[#c7c4d8] bg-white px-3 text-sm font-bold text-[#191c1d] transition hover:border-[#3525cd] hover:text-[#3525cd]"
          >
            <FiExternalLink size={15} />
            Open Preview
          </button>

          <button
            type="button"
            onClick={copyPageSource}
            className="inline-flex h-9 items-center gap-2 rounded-md bg-[#3525cd] px-3 text-sm font-bold text-white transition hover:bg-[#4f46e5]"
          >
            <FiCode size={15} />
            {copiedSource ? "Copied" : "Copy Page Source"}
          </button>
        </div>
      </div>

      {previewError && (
        <p className="rounded-md border border-[#ffdad6] bg-[#fff3f1] px-3 py-2 text-sm font-semibold text-[#ba1a1a]">
          {previewError}
        </p>
      )}

      <div className="grid gap-4 xl:grid-cols-[330px_minmax(0,1fr)]">
        <aside className="flex min-h-[620px] flex-col overflow-hidden rounded-lg border border-[#c7c4d8] bg-white xl:h-[calc(100vh-180px)]">
          <div className="grid grid-cols-5 border-b border-[#c7c4d8] bg-[#f8f9fa] p-2">
            {[
              { id: "components", label: "Add", icon: <FiLayers size={16} /> },
              { id: "inspector", label: "Edit", icon: <FiSettings size={16} /> },
              { id: "data", label: "Data", icon: <FiDatabase size={16} /> },
              { id: "theme", label: "Theme", icon: <FiEye size={16} /> },
              { id: "json", label: "JSON", icon: <FiCode size={16} /> },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActivePanel(tab.id as BuilderPanel)}
                className={cx(
                  "flex h-10 items-center justify-center gap-1 rounded-md text-xs font-black transition",
                  activePanel === tab.id
                    ? "bg-white text-[#3525cd] shadow-sm"
                    : "text-[#464555] hover:text-[#3525cd]",
                )}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto p-4">
            {activePanel === "components" && (
              <div className="space-y-5">
                {Object.entries(paletteGroups).map(([group, items]) => (
                  <div key={group}>
                    <h3 className="mb-2 text-[11px] font-black uppercase tracking-[0.14em] text-[#777587]">
                      {group}
                    </h3>
                    <div className="grid gap-2">
                      {items.map((item) => (
                        <button
                          key={item.id}
                          type="button"
                          draggable
                          onClick={() => addPaletteItem(item)}
                          onDragStart={() => setDraggedPaletteId(item.id)}
                          className="w-full rounded-md border border-[#d9d7e8] bg-[#f8f9fa] px-3 py-2 text-left transition hover:border-[#3525cd] hover:bg-white"
                        >
                          <span className="flex items-center gap-2 text-sm font-black text-[#090a0b]">
                            <FiPlus size={14} />
                            {item.label}
                          </span>
                          <span className="mt-0.5 block text-[11px] leading-4 text-[#464555]">
                            {item.description}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activePanel === "inspector" && (
              <div className="space-y-5">
                {selectedNode ? (
                  <>
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="text-[11px] font-black uppercase tracking-[0.14em] text-[#777587]">
                          {selectedNode.type}
                        </p>
                        <h3 className="mt-1 truncate text-lg font-black text-[#090a0b]">
                          {selectedNode.label}
                        </h3>
                      </div>
                      <button
                        type="button"
                        onClick={deleteSelectedNode}
                        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-[#ffdad6] text-[#ba1a1a] transition hover:bg-[#ffdad6]"
                        aria-label="Delete selected node"
                      >
                        <FiTrash2 size={16} />
                      </button>
                    </div>

                    <label>
                      <span className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#464555]">
                        Label
                      </span>
                      <input
                        value={selectedNode.label}
                        onChange={(event) =>
                          updateSelectedNode((node) => ({ ...node, label: event.target.value }))
                        }
                        className="mt-1.5 h-9 w-full rounded-md border border-[#c7c4d8] bg-[#f8f9fa] px-3 text-sm outline-none focus:border-[#3525cd]"
                      />
                    </label>

                    {selectedNode.props && Object.keys(selectedNode.props).length > 0 && (
                      <div className="border-t border-[#d9d7e8] pt-4">
                        <h3 className="mb-3 text-sm font-black text-[#090a0b]">Content</h3>
                        <div className="space-y-3">
                          {Object.entries(selectedNode.props).map(([key, value]) => (
                            <label key={key} className="block">
                              <span className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#464555]">
                                {key}
                              </span>
                              {value !== null && typeof value === "object" ? (
                                <textarea
                                  rows={8}
                                  defaultValue={JSON.stringify(value, null, 2)}
                                  onBlur={(event) => {
                                    try {
                                      updateSelectedRawProp(key, JSON.parse(event.target.value));
                                    } catch {
                                      event.currentTarget.value = JSON.stringify(value, null, 2);
                                    }
                                  }}
                                  className="mt-1.5 w-full resize-y rounded-md border border-[#c7c4d8] bg-[#f8f9fa] px-3 py-2 font-mono text-xs leading-5 outline-none focus:border-[#3525cd]"
                                  spellCheck={false}
                                />
                              ) : key === "body" || key === "description" ? (
                                <textarea
                                  rows={3}
                                  value={String(value ?? "")}
                                  onChange={(event) => updateSelectedProp(key, event.target.value)}
                                  className="mt-1.5 w-full resize-none rounded-md border border-[#c7c4d8] bg-[#f8f9fa] px-3 py-2 text-sm outline-none focus:border-[#3525cd]"
                                />
                              ) : (
                                <input
                                  type={key === "limit" ? "number" : "text"}
                                  value={String(value ?? "")}
                                  onChange={(event) => updateSelectedProp(key, event.target.value)}
                                  className="mt-1.5 h-9 w-full rounded-md border border-[#c7c4d8] bg-[#f8f9fa] px-3 text-sm outline-none focus:border-[#3525cd]"
                                />
                              )}
                            </label>
                          ))}
                        </div>
                      </div>
                    )}

                    <NodeStyleEditor
                      node={selectedNode}
                      onAnimationChange={(animation) =>
                        updateSelectedNode((node) => ({ ...node, animation }))
                      }
                      onStyleChange={updateSelectedStyle}
                    />
                  </>
                ) : (
                  <div className="rounded-lg border border-dashed border-[#c7c4d8] bg-[#f8f9fa] px-4 py-6 text-center">
                    <FiSettings className="mx-auto text-[#777587]" size={24} />
                    <h3 className="mt-3 text-sm font-black text-[#090a0b]">Select a block to edit</h3>
                    <p className="mt-2 text-xs leading-5 text-[#464555]">
                      Click any section or component in the preview to open its content and style controls.
                    </p>
                  </div>
                )}
              </div>
            )}

            {activePanel === "theme" && (
              <div>
                <h3 className="text-lg font-black text-[#090a0b]">Theme</h3>
                <div className="mt-4 space-y-3">
                  <label className="block">
                    <span className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#464555]">
                      Template Name
                    </span>
                    <input
                      value={template.name}
                      onChange={(event) =>
                        setTemplate((current) => ({ ...current, name: event.target.value }))
                      }
                      className="mt-1.5 h-9 w-full rounded-md border border-[#c7c4d8] bg-[#f8f9fa] px-3 text-sm outline-none focus:border-[#3525cd]"
                    />
                  </label>
                  <label className="block">
                    <span className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#464555]">
                      Font Family
                    </span>
                    <input
                      value={template.theme.fontFamily}
                      onChange={(event) =>
                        setTemplate((current) => ({
                          ...current,
                          theme: { ...current.theme, fontFamily: event.target.value },
                        }))
                      }
                      className="mt-1.5 h-9 w-full rounded-md border border-[#c7c4d8] bg-[#f8f9fa] px-3 text-sm outline-none focus:border-[#3525cd]"
                    />
                  </label>
                  <div className="space-y-2 border-t border-[#d9d7e8] pt-4">
                    {colorFieldLabels.map((field) => {
                      const value = String(template.theme[field.key]);

                      return (
                        <label key={field.key} className="flex items-center justify-between gap-3">
                          <span className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#464555]">
                            {field.label}
                          </span>
                          <span className="flex items-center gap-2">
                            <code className="text-xs font-bold text-[#464555]">{value}</code>
                            <input
                              type="color"
                              value={value}
                              onChange={(event) =>
                                setTemplate((current) => ({
                                  ...current,
                                  theme: { ...current.theme, [field.key]: event.target.value },
                                }))
                              }
                              className="h-8 w-10 rounded-md border border-[#c7c4d8] bg-white p-1"
                            />
                          </span>
                        </label>
                      );
                    })}
                  </div>
                  <div className="space-y-3 border-t border-[#d9d7e8] pt-4">
                    {[
                      ["backgroundImage", "Portfolio Background Image", "{{media.1.src}}"],
                      ["backgroundOverlay", "Portfolio Overlay", "rgba(248, 249, 250, 0.82)"],
                      ["backgroundBlur", "Portfolio Background Blur", "8px"],
                    ].map(([key, label, placeholder]) => (
                      <label key={key} className="block">
                        <span className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#464555]">
                          {label}
                        </span>
                        <input
                          value={String(template.theme[key as keyof PortfolioTemplateSchema["theme"]] || "")}
                          placeholder={placeholder}
                          onChange={(event) =>
                            setTemplate((current) => ({
                              ...current,
                              theme: { ...current.theme, [key]: event.target.value },
                            }))
                          }
                          className="mt-1.5 h-9 w-full rounded-md border border-[#c7c4d8] bg-[#f8f9fa] px-3 text-sm outline-none focus:border-[#3525cd]"
                        />
                      </label>
                    ))}

                    <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-1">
                      {[
                        ["backgroundSize", "Portfolio BG Size", ["cover", "contain", "auto"]],
                        [
                          "backgroundPosition",
                          "Portfolio BG Position",
                          ["center", "top", "bottom", "left", "right"],
                        ],
                      ].map(([key, label, options]) => (
                        <label key={String(key)} className="block">
                          <span className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#464555]">
                            {String(label)}
                          </span>
                          <select
                            value={String(template.theme[key as keyof PortfolioTemplateSchema["theme"]] || "")}
                            onChange={(event) =>
                              setTemplate((current) => ({
                                ...current,
                                theme: { ...current.theme, [key as string]: event.target.value },
                              }))
                            }
                            className="mt-1.5 h-9 w-full rounded-md border border-[#c7c4d8] bg-[#f8f9fa] px-3 text-sm outline-none focus:border-[#3525cd]"
                          >
                            <option value="">Default</option>
                            {(options as string[]).map((option) => (
                              <option key={option} value={option}>
                                {option}
                              </option>
                            ))}
                          </select>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activePanel === "data" && (
              <div className="space-y-5">
                <div className="space-y-3">
                  <div>
                    <h3 className="text-lg font-black text-[#090a0b]">Portfolio Data</h3>
                    <p className="mt-1 text-xs leading-5 text-[#464555]">
                      Edit the shared content that every template section can read from.
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {[
                      ["Project", addProject],
                      ["Media", addMedia],
                      ["Stat", addStat],
                      ["Experience", addExperience],
                      ["Collection", addCollection],
                      ["Field", addCustomField],
                    ].map(([label, action]) => (
                      <button
                        key={String(label)}
                        type="button"
                        onClick={action as () => void}
                        className="inline-flex h-9 items-center gap-2 rounded-md bg-[#3525cd] px-3 text-xs font-black text-white transition hover:bg-[#4f46e5]"
                      >
                        <FiPlus size={14} />
                        {String(label)}
                      </button>
                    ))}
                  </div>
                </div>

                <section className="rounded-lg border border-[#d9d7e8] bg-[#f8f9fa] p-3">
                  <h4 className="text-sm font-black text-[#090a0b]">Profile</h4>
                  <div className="mt-3 space-y-3">
                    {[
                      ["name", "Name"],
                      ["role", "Role"],
                      ["location", "Location"],
                      ["email", "Email"],
                      ["avatar", "Profile Image"],
                    ].map(([key, label]) => (
                      <label key={key} className="block">
                        <span className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#464555]">
                          {label}
                        </span>
                        <input
                          value={String(portfolioData.profile[key as ProfileTextKey] || "")}
                          onChange={(event) =>
                            updateProfile(key as ProfileTextKey, event.target.value)
                          }
                          className="mt-1.5 h-9 w-full rounded-md border border-[#c7c4d8] bg-white px-3 text-sm outline-none focus:border-[#3525cd]"
                        />
                      </label>
                    ))}

                    <label className="block">
                      <span className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#464555]">
                        Bio
                      </span>
                      <textarea
                        rows={4}
                        value={portfolioData.profile.bio}
                        onChange={(event) => updateProfile("bio", event.target.value)}
                        className="mt-1.5 w-full resize-none rounded-md border border-[#c7c4d8] bg-white px-3 py-2 text-sm outline-none focus:border-[#3525cd]"
                      />
                    </label>
                  </div>
                </section>

                <section className="rounded-lg border border-[#d9d7e8] bg-[#f8f9fa] p-3">
                  <div className="flex items-center justify-between gap-3">
                    <h4 className="text-sm font-black text-[#090a0b]">Social Links</h4>
                    <button
                      type="button"
                      onClick={addSocialLink}
                      className="inline-flex h-8 items-center gap-2 rounded-md border border-[#c7c4d8] bg-white px-3 text-xs font-black text-[#3525cd] transition hover:border-[#3525cd]"
                    >
                      <FiPlus size={13} />
                      Link
                    </button>
                  </div>

                  <div className="mt-3 space-y-3">
                    {portfolioData.profile.socialLinks.map((link, index) => (
                      <article
                        key={`${link.label}-${index}`}
                        className="rounded-md border border-[#d9d7e8] bg-white p-3"
                      >
                        <div className="mb-3 flex items-center justify-between gap-3">
                          <p className="text-[11px] font-black uppercase tracking-[0.14em] text-[#777587]">
                            Link {index + 1}
                          </p>
                          <button
                            type="button"
                            onClick={() => removeSocialLink(index)}
                            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-[#ffdad6] text-[#ba1a1a] transition hover:bg-[#ffdad6]"
                            aria-label="Remove social link"
                          >
                            <FiTrash2 size={14} />
                          </button>
                        </div>
                        <div className="grid gap-3">
                          <label className="block">
                            <span className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#464555]">
                              Label
                            </span>
                            <input
                              value={link.label}
                              onChange={(event) =>
                                updateSocialLink(index, "label", event.target.value)
                              }
                              className="mt-1.5 h-9 w-full rounded-md border border-[#c7c4d8] bg-white px-3 text-sm outline-none focus:border-[#3525cd]"
                            />
                          </label>
                          <label className="block">
                            <span className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#464555]">
                              URL
                            </span>
                            <input
                              value={link.url}
                              onChange={(event) =>
                                updateSocialLink(index, "url", event.target.value)
                              }
                              className="mt-1.5 h-9 w-full rounded-md border border-[#c7c4d8] bg-white px-3 text-sm outline-none focus:border-[#3525cd]"
                            />
                          </label>
                        </div>
                      </article>
                    ))}
                  </div>
                </section>

                <section className="rounded-lg border border-[#d9d7e8] bg-[#f8f9fa] p-3">
                  <div className="flex items-center justify-between gap-3">
                    <h4 className="text-sm font-black text-[#090a0b]">Stats</h4>
                    <button
                      type="button"
                      onClick={addStat}
                      className="inline-flex h-8 items-center gap-2 rounded-md border border-[#c7c4d8] bg-white px-3 text-xs font-black text-[#3525cd] transition hover:border-[#3525cd]"
                    >
                      <FiPlus size={13} />
                      Stat
                    </button>
                  </div>

                  <div className="mt-3 space-y-3">
                    {portfolioData.stats.map((stat, index) => (
                      <article
                        key={`${stat.label}-${index}`}
                        className="rounded-md border border-[#d9d7e8] bg-white p-3"
                      >
                        <div className="mb-3 flex items-center justify-between gap-3">
                          <p className="text-[11px] font-black uppercase tracking-[0.14em] text-[#777587]">
                            Stat {index + 1}
                          </p>
                          <button
                            type="button"
                            onClick={() => removeStat(index)}
                            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-[#ffdad6] text-[#ba1a1a] transition hover:bg-[#ffdad6]"
                            aria-label="Remove stat"
                          >
                            <FiTrash2 size={14} />
                          </button>
                        </div>
                        <div className="grid gap-3">
                          {[
                            ["value", "Value"],
                            ["label", "Label"],
                          ].map(([key, label]) => (
                            <label key={key} className="block">
                              <span className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#464555]">
                                {label}
                              </span>
                              <input
                                value={stat[key as StatKey]}
                                onChange={(event) =>
                                  updateStat(index, key as StatKey, event.target.value)
                                }
                                className="mt-1.5 h-9 w-full rounded-md border border-[#c7c4d8] bg-white px-3 text-sm outline-none focus:border-[#3525cd]"
                              />
                            </label>
                          ))}
                        </div>
                      </article>
                    ))}
                  </div>
                </section>

                <section className="rounded-lg border border-[#d9d7e8] bg-[#f8f9fa] p-3">
                  <h4 className="text-sm font-black text-[#090a0b]">Skills</h4>
                  <label className="mt-3 block">
                    <span className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#464555]">
                      Skills
                    </span>
                    <input
                      value={toTagText(portfolioData.skills)}
                      onChange={(event) => updateSkills(event.target.value)}
                      placeholder="React, Next.js, TypeScript"
                      className="mt-1.5 h-9 w-full rounded-md border border-[#c7c4d8] bg-white px-3 text-sm outline-none focus:border-[#3525cd]"
                    />
                  </label>
                </section>

                <section className="rounded-lg border border-[#d9d7e8] bg-[#f8f9fa] p-3">
                  <div className="flex items-center justify-between gap-3">
                    <h4 className="text-sm font-black text-[#090a0b]">Media</h4>
                    <button
                      type="button"
                      onClick={addMedia}
                      className="inline-flex h-8 items-center gap-2 rounded-md border border-[#c7c4d8] bg-white px-3 text-xs font-black text-[#3525cd] transition hover:border-[#3525cd]"
                    >
                      <FiPlus size={13} />
                      Media
                    </button>
                  </div>
                  <p className="mt-1 text-xs leading-5 text-[#464555]">
                    Use these records in Media Block, Media Gallery, or section background images.
                  </p>

                  <div className="mt-3 space-y-4">
                    {portfolioData.media.map((mediaItem, index) => (
                      <article
                        key={`${mediaItem.title}-${index}`}
                        className="rounded-md border border-[#d9d7e8] bg-white p-3"
                      >
                        <div className="mb-3 flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <p className="text-[11px] font-black uppercase tracking-[0.14em] text-[#777587]">
                              Media {index + 1}
                            </p>
                            <h4 className="truncate text-sm font-black text-[#090a0b]">
                              {mediaItem.title}
                            </h4>
                            <code className="mt-1 block truncate text-[11px] font-bold text-[#3525cd]">
                              media.{index}
                            </code>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeMedia(index)}
                            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-[#ffdad6] text-[#ba1a1a] transition hover:bg-[#ffdad6]"
                            aria-label="Remove media"
                          >
                            <FiTrash2 size={14} />
                          </button>
                        </div>

                        <div className="space-y-3">
                          <label className="block">
                            <span className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#464555]">
                              Type
                            </span>
                            <select
                              value={mediaItem.type}
                              onChange={(event) =>
                                updateMediaType(
                                  index,
                                  event.target.value as PortfolioMediaItem["type"],
                                )
                              }
                              className="mt-1.5 h-9 w-full rounded-md border border-[#c7c4d8] bg-white px-3 text-sm outline-none focus:border-[#3525cd]"
                            >
                              <option value="image">image</option>
                              <option value="video">video</option>
                            </select>
                          </label>

                          {[
                            ["title", "Title"],
                            ["src", "Source URL"],
                            ["poster", "Poster Image"],
                            ["alt", "Alt Text"],
                            ["url", "Click URL"],
                          ].map(([key, label]) => (
                            <label key={key} className="block">
                              <span className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#464555]">
                                {label}
                              </span>
                              <input
                                value={String(mediaItem[key as MediaEditableKey] || "")}
                                onChange={(event) =>
                                  updateMedia(index, key as MediaEditableKey, event.target.value)
                                }
                                className="mt-1.5 h-9 w-full rounded-md border border-[#c7c4d8] bg-white px-3 text-sm outline-none focus:border-[#3525cd]"
                              />
                            </label>
                          ))}

                          <label className="block">
                            <span className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#464555]">
                              Description
                            </span>
                            <textarea
                              rows={3}
                              value={mediaItem.description || ""}
                              onChange={(event) =>
                                updateMedia(index, "description", event.target.value)
                              }
                              className="mt-1.5 w-full resize-none rounded-md border border-[#c7c4d8] bg-white px-3 py-2 text-sm outline-none focus:border-[#3525cd]"
                            />
                          </label>
                        </div>
                      </article>
                    ))}
                  </div>
                </section>

                <section className="rounded-lg border border-[#d9d7e8] bg-[#f8f9fa] p-3">
                  <div className="flex items-center justify-between gap-3">
                    <h4 className="text-sm font-black text-[#090a0b]">Experiences</h4>
                    <button
                      type="button"
                      onClick={addExperience}
                      className="inline-flex h-8 items-center gap-2 rounded-md border border-[#c7c4d8] bg-white px-3 text-xs font-black text-[#3525cd] transition hover:border-[#3525cd]"
                    >
                      <FiPlus size={13} />
                      Experience
                    </button>
                  </div>

                  <div className="mt-3 space-y-4">
                    {portfolioData.experiences.map((experience, index) => (
                      <article
                        key={`${experience.company}-${index}`}
                        className="rounded-md border border-[#d9d7e8] bg-white p-3"
                      >
                        <div className="mb-3 flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <p className="text-[11px] font-black uppercase tracking-[0.14em] text-[#777587]">
                              Experience {index + 1}
                            </p>
                            <h4 className="truncate text-sm font-black text-[#090a0b]">
                              {experience.company}
                            </h4>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeExperience(index)}
                            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-[#ffdad6] text-[#ba1a1a] transition hover:bg-[#ffdad6]"
                            aria-label="Remove experience"
                          >
                            <FiTrash2 size={14} />
                          </button>
                        </div>

                        <div className="space-y-3">
                          {[
                            ["company", "Company"],
                            ["role", "Role"],
                            ["period", "Period"],
                          ].map(([key, label]) => (
                            <label key={key} className="block">
                              <span className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#464555]">
                                {label}
                              </span>
                              <input
                                value={String(experience[key as keyof PortfolioExperience] || "")}
                                onChange={(event) =>
                                  updateExperience(
                                    index,
                                    key as keyof PortfolioExperience,
                                    event.target.value,
                                  )
                                }
                                className="mt-1.5 h-9 w-full rounded-md border border-[#c7c4d8] bg-white px-3 text-sm outline-none focus:border-[#3525cd]"
                              />
                            </label>
                          ))}

                          <label className="block">
                            <span className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#464555]">
                              Summary
                            </span>
                            <textarea
                              rows={3}
                              value={experience.summary}
                              onChange={(event) =>
                                updateExperience(index, "summary", event.target.value)
                              }
                              className="mt-1.5 w-full resize-none rounded-md border border-[#c7c4d8] bg-white px-3 py-2 text-sm outline-none focus:border-[#3525cd]"
                            />
                          </label>
                        </div>
                      </article>
                    ))}
                  </div>
                </section>

                <section className="rounded-lg border border-[#d9d7e8] bg-[#f8f9fa] p-3">
                  <div className="flex items-center justify-between gap-3">
                    <h4 className="text-sm font-black text-[#090a0b]">Projects</h4>
                    <button
                      type="button"
                      onClick={addProject}
                      className="inline-flex h-8 items-center gap-2 rounded-md border border-[#c7c4d8] bg-white px-3 text-xs font-black text-[#3525cd] transition hover:border-[#3525cd]"
                    >
                      <FiPlus size={13} />
                      Project
                    </button>
                  </div>

                  <div className="mt-3 space-y-4">
                  {portfolioData.projects.map((project, index) => (
                    <article key={`${project.title}-${index}`} className="rounded-lg border border-[#d9d7e8] bg-[#f8f9fa] p-3">
                      <div className="mb-3 flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <p className="text-[11px] font-black uppercase tracking-[0.14em] text-[#777587]">
                            Project {index + 1}
                          </p>
                          <h4 className="truncate text-sm font-black text-[#090a0b]">{project.title}</h4>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeProject(index)}
                          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-[#ffdad6] text-[#ba1a1a] transition hover:bg-[#ffdad6]"
                          aria-label="Remove project"
                        >
                          <FiTrash2 size={14} />
                        </button>
                      </div>

                      <div className="space-y-3">
                        {[
                          ["title", "Title"],
                          ["image", "Image Path"],
                          ["url", "URL"],
                        ].map(([key, label]) => (
                          <label key={key} className="block">
                            <span className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#464555]">
                              {label}
                            </span>
                            <input
                              value={String(project[key as keyof PortfolioProject] || "")}
                              onChange={(event) =>
                                updateProject(index, key as keyof PortfolioProject, event.target.value)
                              }
                              className="mt-1.5 h-9 w-full rounded-md border border-[#c7c4d8] bg-white px-3 text-sm outline-none focus:border-[#3525cd]"
                            />
                          </label>
                        ))}
                        <label className="block">
                          <span className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#464555]">
                            Description
                          </span>
                          <textarea
                            rows={3}
                            value={project.description}
                            onChange={(event) => updateProject(index, "description", event.target.value)}
                            className="mt-1.5 w-full resize-none rounded-md border border-[#c7c4d8] bg-white px-3 py-2 text-sm outline-none focus:border-[#3525cd]"
                          />
                        </label>
                        <label className="block">
                          <span className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#464555]">
                            Tags
                          </span>
                          <input
                            value={toTagText(project.tags)}
                            onChange={(event) => updateProject(index, "tags", event.target.value)}
                            className="mt-1.5 h-9 w-full rounded-md border border-[#c7c4d8] bg-white px-3 text-sm outline-none focus:border-[#3525cd]"
                          />
                        </label>
                      </div>
                    </article>
                  ))}
                  </div>
                </section>

                <section className="rounded-lg border border-[#d9d7e8] bg-[#f8f9fa] p-3">
                  <div className="flex items-center justify-between gap-3">
                    <h4 className="text-sm font-black text-[#090a0b]">Custom Fields</h4>
                    <button
                      type="button"
                      onClick={addCustomField}
                      className="inline-flex h-8 items-center gap-2 rounded-md border border-[#c7c4d8] bg-white px-3 text-xs font-black text-[#3525cd] transition hover:border-[#3525cd]"
                    >
                      <FiPlus size={13} />
                      Field
                    </button>
                  </div>
                  <p className="mt-1 text-xs leading-5 text-[#464555]">
                    Use these in text fields with bindings like {"{{custom.tagline}}"}.
                  </p>

                  <div className="mt-3 space-y-3">
                    {Object.entries(portfolioData.custom).map(([customKey, customValue]) => (
                      <article
                        key={customKey}
                        className="rounded-md border border-[#d9d7e8] bg-white p-3"
                      >
                        <div className="mb-3 flex items-center justify-between gap-3">
                          <code className="truncate text-xs font-bold text-[#3525cd]">
                            custom.{customKey}
                          </code>
                          <button
                            type="button"
                            onClick={() => removeCustomField(customKey)}
                            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-[#ffdad6] text-[#ba1a1a] transition hover:bg-[#ffdad6]"
                            aria-label="Remove custom field"
                          >
                            <FiTrash2 size={14} />
                          </button>
                        </div>
                        <div className="grid gap-3">
                          <label className="block">
                            <span className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#464555]">
                              Key
                            </span>
                            <input
                              defaultValue={customKey}
                              onBlur={(event) =>
                                updateCustomFieldKey(customKey, event.target.value)
                              }
                              className="mt-1.5 h-9 w-full rounded-md border border-[#c7c4d8] bg-white px-3 text-sm outline-none focus:border-[#3525cd]"
                            />
                          </label>
                          <label className="block">
                            <span className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#464555]">
                              Value
                            </span>
                            <textarea
                              rows={3}
                              value={customValue}
                              onChange={(event) =>
                                updateCustomFieldValue(customKey, event.target.value)
                              }
                              className="mt-1.5 w-full resize-none rounded-md border border-[#c7c4d8] bg-white px-3 py-2 text-sm outline-none focus:border-[#3525cd]"
                            />
                          </label>
                        </div>
                      </article>
                    ))}
                  </div>
                </section>

                <section className="rounded-lg border border-[#d9d7e8] bg-[#f8f9fa] p-3">
                  <div className="flex items-center justify-between gap-3">
                    <h4 className="text-sm font-black text-[#090a0b]">Collections</h4>
                    <button
                      type="button"
                      onClick={addCollection}
                      className="inline-flex h-8 items-center gap-2 rounded-md border border-[#c7c4d8] bg-white px-3 text-xs font-black text-[#3525cd] transition hover:border-[#3525cd]"
                    >
                      <FiPlus size={13} />
                      Collection
                    </button>
                  </div>
                  <p className="mt-1 text-xs leading-5 text-[#464555]">
                    Add reusable lists for new sections. Use the Custom List block and set its source
                    to collections.yourKey.
                  </p>

                  <div className="mt-3 space-y-4">
                    {customCollectionKeys.map((collectionKey) => (
                      <article
                        key={collectionKey}
                        className="rounded-md border border-[#d9d7e8] bg-white p-3"
                      >
                        <div className="mb-3 flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <code className="block truncate text-xs font-bold text-[#3525cd]">
                              collections.{collectionKey}
                            </code>
                            <p className="mt-1 text-[11px] font-semibold text-[#777587]">
                              {(portfolioData.collections[collectionKey] || []).length} items
                            </p>
                          </div>
                          <div className="flex shrink-0 gap-2">
                            <button
                              type="button"
                              onClick={() => addCollectionItem(collectionKey)}
                              className="flex h-8 w-8 items-center justify-center rounded-md border border-[#c7c4d8] text-[#3525cd] transition hover:border-[#3525cd]"
                              aria-label="Add collection item"
                            >
                              <FiPlus size={14} />
                            </button>
                            <button
                              type="button"
                              onClick={() => removeCollection(collectionKey)}
                              className="flex h-8 w-8 items-center justify-center rounded-md border border-[#ffdad6] text-[#ba1a1a] transition hover:bg-[#ffdad6]"
                              aria-label="Remove collection"
                            >
                              <FiTrash2 size={14} />
                            </button>
                          </div>
                        </div>

                        <label className="block">
                          <span className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#464555]">
                            Collection Key
                          </span>
                          <input
                            defaultValue={collectionKey}
                            onBlur={(event) =>
                              updateCollectionKey(collectionKey, event.target.value)
                            }
                            className="mt-1.5 h-9 w-full rounded-md border border-[#c7c4d8] bg-white px-3 text-sm outline-none focus:border-[#3525cd]"
                          />
                        </label>

                        <div className="mt-3 space-y-3">
                          {(portfolioData.collections[collectionKey] || []).map((item, itemIndex) => (
                            <article
                              key={`${item.title}-${itemIndex}`}
                              className="rounded-md border border-[#eceaf5] bg-[#f8f9fa] p-3"
                            >
                              <div className="mb-3 flex items-center justify-between gap-3">
                                <p className="text-[11px] font-black uppercase tracking-[0.14em] text-[#777587]">
                                  Item {itemIndex + 1}
                                </p>
                                <div className="flex shrink-0 gap-2">
                                  <button
                                    type="button"
                                    onClick={() => addCollectionItemField(collectionKey, itemIndex)}
                                    className="flex h-8 w-8 items-center justify-center rounded-md border border-[#c7c4d8] text-[#3525cd] transition hover:border-[#3525cd]"
                                    aria-label="Add collection item field"
                                  >
                                    <FiPlus size={14} />
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => removeCollectionItem(collectionKey, itemIndex)}
                                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-[#ffdad6] text-[#ba1a1a] transition hover:bg-[#ffdad6]"
                                    aria-label="Remove collection item"
                                  >
                                    <FiTrash2 size={14} />
                                  </button>
                                </div>
                              </div>

                              <div className="space-y-3">
                                {[
                                  ["title", "Title"],
                                  ["meta", "Meta"],
                                  ["url", "URL"],
                                ].map(([key, label]) => (
                                  <label key={key} className="block">
                                    <span className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#464555]">
                                      {label}
                                    </span>
                                    <input
                                      value={String(item[key] || "")}
                                      onChange={(event) =>
                                        updateCollectionItem(
                                          collectionKey,
                                          itemIndex,
                                          key,
                                          event.target.value,
                                        )
                                      }
                                      className="mt-1.5 h-9 w-full rounded-md border border-[#c7c4d8] bg-white px-3 text-sm outline-none focus:border-[#3525cd]"
                                    />
                                  </label>
                                ))}

                                <label className="block">
                                  <span className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#464555]">
                                    Description
                                  </span>
                                  <textarea
                                    rows={3}
                                    value={item.description}
                                    onChange={(event) =>
                                      updateCollectionItem(
                                        collectionKey,
                                        itemIndex,
                                        "description",
                                        event.target.value,
                                      )
                                    }
                                    className="mt-1.5 w-full resize-none rounded-md border border-[#c7c4d8] bg-white px-3 py-2 text-sm outline-none focus:border-[#3525cd]"
                                  />
                                </label>

                                {Object.entries(item)
                                  .filter(([key]) => !defaultCollectionItemFields.includes(key))
                                  .map(([fieldKey, fieldValue]) => (
                                    <div
                                      key={fieldKey}
                                      className="rounded-md border border-[#d9d7e8] bg-white p-3"
                                    >
                                      <div className="mb-3 flex items-center justify-between gap-3">
                                        <code className="truncate text-xs font-bold text-[#3525cd]">
                                          {fieldKey}
                                        </code>
                                        <button
                                          type="button"
                                          onClick={() =>
                                            removeCollectionItemField(
                                              collectionKey,
                                              itemIndex,
                                              fieldKey,
                                            )
                                          }
                                          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-[#ffdad6] text-[#ba1a1a] transition hover:bg-[#ffdad6]"
                                          aria-label="Remove collection item field"
                                        >
                                          <FiTrash2 size={14} />
                                        </button>
                                      </div>

                                      <div className="grid gap-3">
                                        <label className="block">
                                          <span className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#464555]">
                                            Key
                                          </span>
                                          <input
                                            defaultValue={fieldKey}
                                            onBlur={(event) =>
                                              updateCollectionItemFieldKey(
                                                collectionKey,
                                                itemIndex,
                                                fieldKey,
                                                event.target.value,
                                              )
                                            }
                                            className="mt-1.5 h-9 w-full rounded-md border border-[#c7c4d8] bg-white px-3 text-sm outline-none focus:border-[#3525cd]"
                                          />
                                        </label>
                                        <label className="block">
                                          <span className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#464555]">
                                            Value
                                          </span>
                                          <input
                                            value={String(fieldValue || "")}
                                            onChange={(event) =>
                                              updateCollectionItem(
                                                collectionKey,
                                                itemIndex,
                                                fieldKey,
                                                event.target.value,
                                              )
                                            }
                                            className="mt-1.5 h-9 w-full rounded-md border border-[#c7c4d8] bg-white px-3 text-sm outline-none focus:border-[#3525cd]"
                                          />
                                        </label>
                                      </div>
                                    </div>
                                  ))}
                              </div>
                            </article>
                          ))}
                        </div>
                      </article>
                    ))}
                  </div>
                </section>

                <details className="rounded-lg border border-[#d9d7e8] bg-[#f8f9fa] p-3">
                  <summary className="cursor-pointer text-sm font-black text-[#090a0b]">
                    Portfolio data JSON
                  </summary>
                  <pre className="mt-3 max-h-[280px] overflow-auto rounded-md bg-[#090a0b] p-3 text-xs leading-5 text-white">
                    {portfolioDataJson}
                  </pre>
                </details>
              </div>
            )}

            {activePanel === "json" && (
              <div className="space-y-4">
                <div className="rounded-lg border border-[#d9d7e8] bg-[#f8f9fa] p-3">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="text-sm font-black text-[#090a0b]">Add JSON block</h3>
                      <p className="mt-1 text-xs leading-5 text-[#464555]">
                        Paste a section node, component node, or full template schema.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={addJsonToTemplate}
                      className="inline-flex h-9 shrink-0 items-center gap-2 rounded-md bg-[#3525cd] px-3 text-xs font-black text-white transition hover:bg-[#4f46e5]"
                    >
                      <FiPlus size={14} />
                      Add
                    </button>
                  </div>
                  <textarea
                    rows={12}
                    value={jsonInput}
                    onChange={(event) => setJsonInput(event.target.value)}
                    className="mt-3 w-full resize-y rounded-md border border-[#c7c4d8] bg-white px-3 py-2 font-mono text-xs leading-5 text-[#090a0b] outline-none focus:border-[#3525cd]"
                    spellCheck={false}
                  />
                  {jsonError && (
                    <p className="mt-2 rounded-md border border-[#ffdad6] bg-[#fff3f1] px-3 py-2 text-xs font-semibold text-[#ba1a1a]">
                      {jsonError}
                    </p>
                  )}
                </div>

                <div>
                  <h3 className="mb-3 flex items-center gap-2 text-sm font-black text-[#090a0b]">
                    <FiCode size={16} />
                    Bindings
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {bindingExamples.map((binding) => (
                      <code key={binding} className="rounded bg-[#eef1ff] px-2 py-1 text-xs font-bold text-[#3525cd]">
                        {binding}
                      </code>
                    ))}
                  </div>
                </div>
                <pre className="max-h-[520px] overflow-auto rounded-md bg-[#090a0b] p-4 text-xs leading-5 text-white">
                  {templateJson}
                </pre>

                <details className="rounded-lg border border-[#d9d7e8] bg-[#f8f9fa] p-3">
                  <summary className="cursor-pointer text-sm font-black text-[#090a0b]">
                    Generated page source
                  </summary>
                  <pre className="mt-3 max-h-[420px] overflow-auto rounded-md bg-[#090a0b] p-4 text-xs leading-5 text-white">
                    {pageSource}
                  </pre>
                </details>
              </div>
            )}
          </div>
        </aside>

        <section
          className="flex min-h-[620px] flex-col overflow-hidden rounded-lg border border-[#c7c4d8] bg-[#e7e8e9] xl:h-[calc(100vh-180px)]"
          onDragOver={(event) => event.preventDefault()}
          onDrop={handleCanvasDrop}
        >
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#c7c4d8] bg-white px-4 py-3">
            <div>
              <h2 className="flex items-center gap-2 text-base font-black text-[#090a0b]">
                <FiEye size={18} />
                Live Preview
              </h2>
              <p className="mt-0.5 text-xs font-semibold text-[#464555]">
                {template.root.children?.length || 0} sections
              </p>
            </div>
            <div className="inline-flex items-center gap-2 rounded-full bg-[#f8f9fa] px-3 py-1.5 text-xs font-bold text-[#464555]">
              <FiMove size={14} />
              Drag sections to reorder
            </div>
          </div>

          <div className="min-h-0 flex-1 overflow-auto p-4">
            <div className={cx("mx-auto min-w-[360px] overflow-hidden rounded-xl bg-white shadow-xl transition-all duration-300", viewportClasses[viewport])}>
              <PortfolioRenderer
                template={template}
                data={portfolioData}
                mode="builder"
                viewport={viewport}
                selectedNodeId={selectedNodeId}
                onSelectNode={(nodeId) => {
                  setSelectedNodeId(nodeId || null);
                  if (nodeId) {
                    setActivePanel("inspector");
                  }
                }}
                onDragNode={setDraggedNodeId}
                onDropNode={handleDropNode}
              />
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};
