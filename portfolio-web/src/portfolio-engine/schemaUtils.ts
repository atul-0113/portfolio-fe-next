import { PortfolioData, PortfolioTemplateNode, PortfolioTemplateSchema } from "./types";

export const makePortfolioNodeId = (prefix = "node") =>
  `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}`;

const cloneJsonValue = <T>(value: T): T =>
  value === undefined ? value : JSON.parse(JSON.stringify(value)) as T;

export const clonePortfolioNode = (node: PortfolioTemplateNode): PortfolioTemplateNode => ({
  ...node,
  id: makePortfolioNodeId(node.type),
  props: node.props ? cloneJsonValue(node.props) : undefined,
  style: node.style ? cloneJsonValue(node.style) : undefined,
  children: node.children?.map(clonePortfolioNode),
});

export const resolvePath = (source: unknown, path: string): unknown =>
  path.split(".").reduce<unknown>((current, key) => {
    if (current && typeof current === "object" && key in current) {
      return (current as Record<string, unknown>)[key];
    }

    return undefined;
  }, source);

export const resolveText = (value: unknown, data: PortfolioData) => {
  if (typeof value !== "string") {
    return typeof value === "number" ? String(value) : "";
  }

  return value.replace(/\{\{\s*([\w.]+)\s*\}\}/g, (_, path: string) => {
    const resolvedValue = resolvePath(data, path);
    return resolvedValue === undefined || resolvedValue === null ? "" : String(resolvedValue);
  });
};

export const asArray = <T>(value: unknown): T[] => (Array.isArray(value) ? value as T[] : []);

const mapNode = (
  node: PortfolioTemplateNode,
  nodeId: string,
  updater: (node: PortfolioTemplateNode) => PortfolioTemplateNode,
): PortfolioTemplateNode => {
  if (node.id === nodeId) {
    return updater(node);
  }

  return {
    ...node,
    children: node.children?.map((child) => mapNode(child, nodeId, updater)),
  };
};

const removeNode = (node: PortfolioTemplateNode, nodeId: string): PortfolioTemplateNode => ({
  ...node,
  children: node.children
    ?.filter((child) => child.id !== nodeId)
    .map((child) => removeNode(child, nodeId)),
});

const findNodeInTree = (
  node: PortfolioTemplateNode,
  nodeId: string,
): PortfolioTemplateNode | null => {
  if (node.id === nodeId) {
    return node;
  }

  for (const child of node.children || []) {
    const foundNode = findNodeInTree(child, nodeId);

    if (foundNode) {
      return foundNode;
    }
  }

  return null;
};

export const getPortfolioNodeById = (
  template: PortfolioTemplateSchema,
  nodeId: string | null,
) => {
  if (!nodeId) {
    return null;
  }

  return findNodeInTree(template.root, nodeId);
};

export const updatePortfolioNode = (
  template: PortfolioTemplateSchema,
  nodeId: string,
  updater: (node: PortfolioTemplateNode) => PortfolioTemplateNode,
): PortfolioTemplateSchema => ({
  ...template,
  root: mapNode(template.root, nodeId, updater),
});

export const removePortfolioNode = (
  template: PortfolioTemplateSchema,
  nodeId: string,
): PortfolioTemplateSchema => ({
  ...template,
  root: removeNode(template.root, nodeId),
});

export const appendPortfolioNodeToRoot = (
  template: PortfolioTemplateSchema,
  node: PortfolioTemplateNode,
): PortfolioTemplateSchema => ({
  ...template,
  root: {
    ...template.root,
    children: [...(template.root.children || []), node],
  },
});

export const addPortfolioChildNode = (
  template: PortfolioTemplateSchema,
  parentNodeId: string,
  node: PortfolioTemplateNode,
): PortfolioTemplateSchema =>
  updatePortfolioNode(template, parentNodeId, (parentNode) => ({
    ...parentNode,
    children: [...(parentNode.children || []), node],
  }));

export const reorderRootPortfolioNode = (
  template: PortfolioTemplateSchema,
  sourceNodeId: string,
  targetNodeId: string,
): PortfolioTemplateSchema => {
  const children = [...(template.root.children || [])];
  const sourceIndex = children.findIndex((child) => child.id === sourceNodeId);
  const targetIndex = children.findIndex((child) => child.id === targetNodeId);

  if (sourceIndex < 0 || targetIndex < 0 || sourceIndex === targetIndex) {
    return template;
  }

  const [sourceNode] = children.splice(sourceIndex, 1);
  children.splice(targetIndex, 0, sourceNode);

  return {
    ...template,
    root: {
      ...template.root,
      children,
    },
  };
};
