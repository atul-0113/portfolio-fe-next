export type PortfolioViewport = "desktop" | "tablet" | "mobile";

export type PortfolioNodeType =
  | "root"
  | "section"
  | "hero"
  | "text"
  | "button"
  | "stats"
  | "projectGrid"
  | "skillCloud"
  | "timeline"
  | "contact";

export type PortfolioLayout = "stack" | "split" | "grid" | "centered" | "inline";
export type PortfolioSpacing = "none" | "sm" | "md" | "lg" | "xl";
export type PortfolioRadius = "none" | "sm" | "md" | "lg" | "xl" | "full";
export type PortfolioShadow = "none" | "sm" | "md" | "lg";
export type PortfolioAnimation = "none" | "fade-up" | "slide-in" | "scale-in";
export type PortfolioAlignment = "left" | "center" | "right";

export interface PortfolioTheme {
  name: string;
  fontFamily: string;
  backgroundColor: string;
  surfaceColor: string;
  textColor: string;
  mutedTextColor: string;
  accentColor: string;
  borderColor: string;
}

export interface PortfolioNodeStyle {
  layout?: PortfolioLayout;
  align?: PortfolioAlignment;
  columns?: number;
  gap?: PortfolioSpacing;
  paddingY?: PortfolioSpacing;
  paddingX?: PortfolioSpacing;
  maxWidth?: "sm" | "md" | "lg" | "xl" | "full";
  backgroundColor?: string;
  textColor?: string;
  accentColor?: string;
  radius?: PortfolioRadius;
  shadow?: PortfolioShadow;
}

export interface PortfolioTemplateNode {
  id: string;
  type: PortfolioNodeType;
  label: string;
  isVisible?: boolean;
  props?: Record<string, unknown>;
  style?: PortfolioNodeStyle;
  animation?: PortfolioAnimation;
  children?: PortfolioTemplateNode[];
}

export interface PortfolioTemplateSchema {
  id: string;
  name: string;
  version: number;
  category: string;
  description: string;
  theme: PortfolioTheme;
  root: PortfolioTemplateNode;
}

export interface PortfolioProject {
  title: string;
  description: string;
  image: string;
  tags: string[];
  url?: string;
}

export interface PortfolioExperience {
  company: string;
  role: string;
  period: string;
  summary: string;
}

export interface PortfolioData {
  profile: {
    name: string;
    role: string;
    location: string;
    email: string;
    bio: string;
    avatar: string;
    socialLinks: Array<{
      label: string;
      url: string;
    }>;
  };
  stats: Array<{
    label: string;
    value: string;
  }>;
  skills: string[];
  projects: PortfolioProject[];
  experiences: PortfolioExperience[];
}

export interface PortfolioPaletteItem {
  id: string;
  label: string;
  description: string;
  group: "Sections" | "Components";
  blueprint: PortfolioTemplateNode;
}
