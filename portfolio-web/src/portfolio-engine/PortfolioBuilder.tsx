"use client";

import { useMemo, useState } from "react";
import {
  FiCode,
  FiCopy,
  FiEye,
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
import {
  demoPortfolioData,
  portfolioComponentPalette,
  starterPortfolioTemplates,
} from "./templates";
import {
  PortfolioNodeStyle,
  PortfolioPaletteItem,
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

const cx = (...classes: Array<string | false | null | undefined>) =>
  classes.filter(Boolean).join(" ");

const cloneTemplate = (template: PortfolioTemplateSchema): PortfolioTemplateSchema =>
  JSON.parse(JSON.stringify(template)) as PortfolioTemplateSchema;

const viewportClasses: Record<PortfolioViewport, string> = {
  desktop: "w-full",
  tablet: "w-[760px]",
  mobile: "w-[390px]",
};

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

const styleControls: Array<{
  key: keyof PortfolioNodeStyle;
  label: string;
  options: string[];
}> = [
  { key: "layout", label: "Layout", options: ["stack", "split", "grid", "centered", "inline"] },
  { key: "align", label: "Align", options: ["left", "center", "right"] },
  { key: "gap", label: "Gap", options: ["none", "sm", "md", "lg", "xl"] },
  { key: "paddingY", label: "Y Padding", options: ["none", "sm", "md", "lg", "xl"] },
  { key: "paddingX", label: "X Padding", options: ["none", "sm", "md", "lg", "xl"] },
  { key: "maxWidth", label: "Max Width", options: ["sm", "md", "lg", "xl", "full"] },
  { key: "radius", label: "Radius", options: ["none", "sm", "md", "lg", "xl", "full"] },
  { key: "shadow", label: "Shadow", options: ["none", "sm", "md", "lg"] },
];

const bindingExamples = [
  "{{profile.name}}",
  "{{profile.role}}",
  "{{profile.bio}}",
  "projects",
  "skills",
  "experiences",
];

const getBlankSection = () => {
  const blankSection = portfolioComponentPalette.find((item) => item.id === "section-blank");
  return clonePortfolioNode(blankSection?.blueprint || portfolioComponentPalette[0].blueprint);
};

export const PortfolioBuilder = () => {
  const [template, setTemplate] = useState<PortfolioTemplateSchema>(() =>
    cloneTemplate(starterPortfolioTemplates[0]),
  );
  const [viewport, setViewport] = useState<PortfolioViewport>("desktop");
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [draggedPaletteId, setDraggedPaletteId] = useState<string | null>(null);
  const [draggedNodeId, setDraggedNodeId] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

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

  const addPaletteItem = (item: PortfolioPaletteItem) => {
    const node = clonePortfolioNode(item.blueprint);
    let nextSelectedNodeId = node.id;

    setTemplate((current) => {
      const selected = getPortfolioNodeById(current, selectedNodeId);

      if (node.type !== "section" && selected?.type === "section") {
        return addPortfolioChildNode(current, selected.id, node);
      }

      if (node.type !== "section") {
        const section = getBlankSection();
        section.label = `${node.label} Section`;
        section.children = [node];
        return appendPortfolioNodeToRoot(current, section);
      }

      return appendPortfolioNodeToRoot(current, node);
    });
    setSelectedNodeId(nextSelectedNodeId);
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

  const updateSelectedStyle = (key: keyof PortfolioNodeStyle, value: string) => {
    updateSelectedNode((node) => ({
      ...node,
      style: {
        ...node.style,
        [key]: key === "columns" ? Number(value) : value,
      },
    }));
  };

  const deleteSelectedNode = () => {
    if (!selectedNodeId) {
      return;
    }

    setTemplate((current) => removePortfolioNode(current, selectedNodeId));
    setSelectedNodeId(null);
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

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 rounded-lg border border-[#c7c4d8] bg-white px-5 py-5 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.16em] text-[#3525cd]">
            Portfolio Builder Engine
          </p>
          <h1 className="mt-2 text-[28px] font-black leading-tight text-[#090a0b]">
            Schema-driven template studio
          </h1>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <select
            value={template.id}
            onChange={(event) => {
              const nextTemplate = starterPortfolioTemplates.find(
                (item) => item.id === event.target.value,
              );

              if (nextTemplate) {
                setTemplate(cloneTemplate(nextTemplate));
                setSelectedNodeId(null);
              }
            }}
            className="h-10 rounded-md border border-[#c7c4d8] bg-[#f8f9fa] px-3 text-sm font-semibold text-[#191c1d] outline-none focus:border-[#3525cd]"
          >
            {starterPortfolioTemplates.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name}
              </option>
            ))}
          </select>

          <div className="inline-flex overflow-hidden rounded-md border border-[#c7c4d8] bg-[#f8f9fa]">
            {[
              { id: "desktop", icon: <FiMonitor size={17} />, label: "Desktop" },
              { id: "tablet", icon: <FiTablet size={17} />, label: "Tablet" },
              { id: "mobile", icon: <FiSmartphone size={17} />, label: "Mobile" },
            ].map((item) => (
              <button
                key={item.id}
                type="button"
                title={item.label}
                onClick={() => setViewport(item.id as PortfolioViewport)}
                className={cx(
                  "flex h-10 w-11 items-center justify-center transition",
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
            className="inline-flex h-10 items-center gap-2 rounded-md border border-[#c7c4d8] bg-white px-4 text-sm font-bold text-[#191c1d] transition hover:border-[#3525cd] hover:text-[#3525cd]"
          >
            <FiCopy size={16} />
            {copied ? "Copied" : "Copy JSON"}
          </button>
        </div>
      </div>

      <div className="grid gap-5 xl:grid-cols-[280px_minmax(0,1fr)_330px]">
        <aside className="min-h-[720px] rounded-lg border border-[#c7c4d8] bg-white">
          <div className="border-b border-[#c7c4d8] px-5 py-4">
            <h2 className="flex items-center gap-2 text-base font-black text-[#090a0b]">
              <FiLayers size={18} />
              Components
            </h2>
          </div>

          <div className="space-y-6 px-4 py-5">
            {Object.entries(paletteGroups).map(([group, items]) => (
              <div key={group}>
                <h3 className="mb-3 text-xs font-black uppercase tracking-[0.14em] text-[#777587]">
                  {group}
                </h3>
                <div className="space-y-2">
                  {items.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      draggable
                      onClick={() => addPaletteItem(item)}
                      onDragStart={() => setDraggedPaletteId(item.id)}
                      className="w-full rounded-md border border-[#d9d7e8] bg-[#f8f9fa] px-3 py-3 text-left transition hover:border-[#3525cd] hover:bg-white"
                    >
                      <span className="flex items-center gap-2 text-sm font-black text-[#090a0b]">
                        <FiPlus size={15} />
                        {item.label}
                      </span>
                      <span className="mt-1 block text-xs leading-5 text-[#464555]">
                        {item.description}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </aside>

        <section
          className="min-h-[720px] overflow-x-auto rounded-lg border border-[#c7c4d8] bg-[#e7e8e9] p-5"
          onDragOver={(event) => event.preventDefault()}
          onDrop={handleCanvasDrop}
        >
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="flex items-center gap-2 text-base font-black text-[#090a0b]">
                <FiEye size={18} />
                Live Preview
              </h2>
              <p className="mt-1 text-xs font-semibold text-[#464555]">
                {template.root.children?.length || 0} sections
              </p>
            </div>
            <div className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1.5 text-xs font-bold text-[#464555]">
              <FiMove size={14} />
              Drag sections to reorder
            </div>
          </div>

          <div className={cx("mx-auto min-w-[390px] transition-all duration-300", viewportClasses[viewport])}>
            <PortfolioRenderer
              template={template}
              data={demoPortfolioData}
              mode="builder"
              selectedNodeId={selectedNodeId}
              onSelectNode={(nodeId) => setSelectedNodeId(nodeId || null)}
              onDragNode={setDraggedNodeId}
              onDropNode={handleDropNode}
            />
          </div>
        </section>

        <aside className="min-h-[720px] rounded-lg border border-[#c7c4d8] bg-white">
          <div className="border-b border-[#c7c4d8] px-5 py-4">
            <h2 className="flex items-center gap-2 text-base font-black text-[#090a0b]">
              <FiSettings size={18} />
              Inspector
            </h2>
          </div>

          <div className="space-y-6 px-5 py-5">
            {selectedNode ? (
              <>
                <div className="space-y-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-xs font-black uppercase tracking-[0.14em] text-[#777587]">
                        {selectedNode.type}
                      </p>
                      <h3 className="mt-1 text-lg font-black text-[#090a0b]">{selectedNode.label}</h3>
                    </div>
                    <button
                      type="button"
                      onClick={deleteSelectedNode}
                      className="flex h-9 w-9 items-center justify-center rounded-md border border-[#ffdad6] text-[#ba1a1a] transition hover:bg-[#ffdad6]"
                      aria-label="Delete selected node"
                    >
                      <FiTrash2 size={16} />
                    </button>
                  </div>

                  <label>
                    <span className="text-xs font-bold uppercase tracking-[0.12em] text-[#464555]">
                      Label
                    </span>
                    <input
                      value={selectedNode.label}
                      onChange={(event) =>
                        updateSelectedNode((node) => ({ ...node, label: event.target.value }))
                      }
                      className="mt-1.5 h-10 w-full rounded-md border border-[#c7c4d8] bg-[#f8f9fa] px-3 text-sm outline-none focus:border-[#3525cd]"
                    />
                  </label>

                  <label>
                    <span className="text-xs font-bold uppercase tracking-[0.12em] text-[#464555]">
                      Animation
                    </span>
                    <select
                      value={selectedNode.animation || "none"}
                      onChange={(event) =>
                        updateSelectedNode((node) => ({
                          ...node,
                          animation: event.target.value as PortfolioTemplateNode["animation"],
                        }))
                      }
                      className="mt-1.5 h-10 w-full rounded-md border border-[#c7c4d8] bg-[#f8f9fa] px-3 text-sm outline-none focus:border-[#3525cd]"
                    >
                      {["none", "fade-up", "slide-in", "scale-in"].map((item) => (
                        <option key={item} value={item}>
                          {item}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>

                {(selectedNode.props && Object.keys(selectedNode.props).length > 0) && (
                  <div className="border-t border-[#d9d7e8] pt-5">
                    <h3 className="mb-3 text-sm font-black text-[#090a0b]">Content</h3>
                    <div className="space-y-3">
                      {Object.entries(selectedNode.props).map(([key, value]) => (
                        <label key={key} className="block">
                          <span className="text-xs font-bold uppercase tracking-[0.12em] text-[#464555]">
                            {key}
                          </span>
                          {key === "body" || key === "description" ? (
                            <textarea
                              rows={4}
                              value={String(value ?? "")}
                              onChange={(event) => updateSelectedProp(key, event.target.value)}
                              className="mt-1.5 w-full resize-none rounded-md border border-[#c7c4d8] bg-[#f8f9fa] px-3 py-2 text-sm outline-none focus:border-[#3525cd]"
                            />
                          ) : (
                            <input
                              type={key === "limit" ? "number" : "text"}
                              value={String(value ?? "")}
                              onChange={(event) => updateSelectedProp(key, event.target.value)}
                              className="mt-1.5 h-10 w-full rounded-md border border-[#c7c4d8] bg-[#f8f9fa] px-3 text-sm outline-none focus:border-[#3525cd]"
                            />
                          )}
                        </label>
                      ))}
                    </div>
                  </div>
                )}

                <div className="border-t border-[#d9d7e8] pt-5">
                  <h3 className="mb-3 text-sm font-black text-[#090a0b]">Style</h3>
                  <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
                    {styleControls.map((control) => (
                      <label key={control.key}>
                        <span className="text-xs font-bold uppercase tracking-[0.12em] text-[#464555]">
                          {control.label}
                        </span>
                        <select
                          value={String(selectedNode.style?.[control.key] || "")}
                          onChange={(event) => updateSelectedStyle(control.key, event.target.value)}
                          className="mt-1.5 h-10 w-full rounded-md border border-[#c7c4d8] bg-[#f8f9fa] px-3 text-sm outline-none focus:border-[#3525cd]"
                        >
                          <option value="">Default</option>
                          {control.options.map((option) => (
                            <option key={option} value={option}>
                              {option}
                            </option>
                          ))}
                        </select>
                      </label>
                    ))}
                  </div>
                  <div className="mt-3 grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
                    {[
                      ["backgroundColor", "Background"],
                      ["textColor", "Text"],
                      ["accentColor", "Accent"],
                    ].map(([key, label]) => (
                      <label key={key}>
                        <span className="text-xs font-bold uppercase tracking-[0.12em] text-[#464555]">
                          {label}
                        </span>
                        <input
                          type="color"
                          value={String(selectedNode.style?.[key as keyof PortfolioNodeStyle] || "#ffffff")}
                          onChange={(event) =>
                            updateSelectedStyle(key as keyof PortfolioNodeStyle, event.target.value)
                          }
                          className="mt-1.5 h-10 w-full rounded-md border border-[#c7c4d8] bg-[#f8f9fa] px-2"
                        />
                      </label>
                    ))}
                  </div>
                </div>
              </>
            ) : (
              <div>
                <h3 className="text-lg font-black text-[#090a0b]">Theme</h3>
                <div className="mt-4 space-y-3">
                  <label className="block">
                    <span className="text-xs font-bold uppercase tracking-[0.12em] text-[#464555]">
                      Template Name
                    </span>
                    <input
                      value={template.name}
                      onChange={(event) =>
                        setTemplate((current) => ({ ...current, name: event.target.value }))
                      }
                      className="mt-1.5 h-10 w-full rounded-md border border-[#c7c4d8] bg-[#f8f9fa] px-3 text-sm outline-none focus:border-[#3525cd]"
                    />
                  </label>
                  <label className="block">
                    <span className="text-xs font-bold uppercase tracking-[0.12em] text-[#464555]">
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
                      className="mt-1.5 h-10 w-full rounded-md border border-[#c7c4d8] bg-[#f8f9fa] px-3 text-sm outline-none focus:border-[#3525cd]"
                    />
                  </label>
                  <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
                    {colorFieldLabels.map((field) => (
                      <label key={field.key}>
                        <span className="text-xs font-bold uppercase tracking-[0.12em] text-[#464555]">
                          {field.label}
                        </span>
                        <input
                          type="color"
                          value={String(template.theme[field.key])}
                          onChange={(event) =>
                            setTemplate((current) => ({
                              ...current,
                              theme: { ...current.theme, [field.key]: event.target.value },
                            }))
                          }
                          className="mt-1.5 h-10 w-full rounded-md border border-[#c7c4d8] bg-[#f8f9fa] px-2"
                        />
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            )}

            <div className="border-t border-[#d9d7e8] pt-5">
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

            <details className="border-t border-[#d9d7e8] pt-5">
              <summary className="cursor-pointer text-sm font-black text-[#090a0b]">
                Template JSON
              </summary>
              <pre className="mt-3 max-h-[360px] overflow-auto rounded-md bg-[#090a0b] p-4 text-xs leading-5 text-white">
                {templateJson}
              </pre>
            </details>
          </div>
        </aside>
      </div>
    </div>
  );
};
