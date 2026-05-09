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
  | "contact"
  | "media"
  | "mediaGallery"
  | "cta"
  | "tabs"
  | "customList";

export type PortfolioLayout = "stack" | "split" | "grid" | "centered" | "inline";
export type PortfolioSpacing = "none" | "sm" | "md" | "lg" | "xl";
export type PortfolioRadius = "none" | "sm" | "md" | "lg" | "xl" | "full";
export type PortfolioShadow = "none" | "sm" | "md" | "lg";
export type PortfolioAnimation = "none" | "fade-up" | "slide-in" | "scale-in";
export type PortfolioAlignment = "left" | "center" | "right";
export type PortfolioJustify = "start" | "center" | "end" | "between";

export interface PortfolioTheme {
  name: string;
  fontFamily: string;
  backgroundColor: string;
  surfaceColor: string;
  textColor: string;
  mutedTextColor: string;
  accentColor: string;
  borderColor: string;
  backgroundImage?: string;
  backgroundOverlay?: string;
  backgroundBlur?: string;
  backgroundSize?: "cover" | "contain" | "auto";
  backgroundPosition?: "center" | "top" | "bottom" | "left" | "right";
}

export interface PortfolioNodeStyle {
  layout?: PortfolioLayout;
  align?: PortfolioAlignment;
  columns?: number;
  gap?: PortfolioSpacing;
  paddingY?: PortfolioSpacing;
  paddingX?: PortfolioSpacing;
  marginY?: PortfolioSpacing;
  marginX?: PortfolioSpacing;
  maxWidth?: "sm" | "md" | "lg" | "xl" | "full";
  width?: string;
  height?: string;
  backgroundColor?: string;
  backgroundImage?: string;
  backgroundOverlay?: string;
  backgroundBlur?: string;
  backgroundSize?: "cover" | "contain" | "auto";
  backgroundPosition?: "center" | "top" | "bottom" | "left" | "right";
  textColor?: string;
  accentColor?: string;
  borderColor?: string;
  borderWidth?: string;
  borderStyle?: "solid" | "dashed" | "dotted" | "none";
  backdropBlur?: string;
  minHeight?: string;
  fontFamily?: string;
  fontSize?: string;
  lineHeight?: string;
  fontWeight?: string;
  imageHeight?: string;
  imageWidth?: string;
  imagePlacement?: "side" | "cover" | "top" | "none";
  aspectRatio?: "auto" | "video" | "square" | "portrait" | "wide";
  mediaFit?: "cover" | "contain";
  radius?: PortfolioRadius;
  shadow?: PortfolioShadow;
  cardWidth?: string;
  cardHeight?: string;
  cardMinHeight?: string;
  cardPaddingY?: PortfolioSpacing;
  cardPaddingX?: PortfolioSpacing;
  cardBackgroundColor?: string;
  cardBackgroundImage?: string;
  cardBackgroundOverlay?: string;
  cardBackgroundBlur?: string;
  cardTextColor?: string;
  cardAccentColor?: string;
  cardBorderColor?: string;
  cardBorderWidth?: string;
  cardBorderStyle?: "solid" | "dashed" | "dotted" | "none";
  cardRadius?: PortfolioRadius;
  cardShadow?: PortfolioShadow;
  cardFontFamily?: string;
  cardFontSize?: string;
  cardLineHeight?: string;
  cardFontWeight?: string;
  cardContentAlign?: PortfolioAlignment;
  cardContentJustify?: PortfolioJustify;
  cardContentGap?: PortfolioSpacing;
  cardValueFontSize?: string;
  cardValueFontWeight?: string;
  cardValueColor?: string;
  cardTitleFontSize?: string;
  cardTitleFontWeight?: string;
  cardTitleColor?: string;
  cardBodyFontSize?: string;
  cardBodyLineHeight?: string;
  cardBodyColor?: string;
  cardMetaFontSize?: string;
  cardMetaColor?: string;
  cardTagFontSize?: string;
  cardTagColor?: string;
  cardTagBackgroundColor?: string;
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

export type PortfolioMediaType = "image" | "video";

export interface PortfolioMediaItem {
  type: PortfolioMediaType;
  src: string;
  title: string;
  description?: string;
  alt?: string;
  poster?: string;
  url?: string;
}

export interface PortfolioCustomCollectionItem {
  title: string;
  description: string;
  meta?: string;
  url?: string;
  [key: string]: string | undefined;
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
  media: PortfolioMediaItem[];
  custom: Record<string, string>;
  collections: Record<string, PortfolioCustomCollectionItem[]>;
}

export interface PortfolioPaletteItem {
  id: string;
  label: string;
  description: string;
  group: "Sections" | "Components";
  blueprint: PortfolioTemplateNode;
}
