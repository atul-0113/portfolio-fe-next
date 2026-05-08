export type UserRole = "USER" | "ADMIN";

export interface ApiUser {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  token?: string;
  isActive?: boolean;
  isSubscribed?: boolean;
  mobileNumber?: string | null;
  createdAt?: string;
}

export interface AuthResponse {
  message: string;
  user: ApiUser & { token: string };
}

export interface CategoryResponse {
  id: string;
  categoryName: string;
  isActive: boolean;
  categoryImagePath: string | null;
  createdOn: string;
  createdById: string;
}

export interface TemplateResponse {
  id: string;
  templateName: string;
  categoryType: string;
  createdOn: string;
  createdById: string;
  isActive: boolean;
  code: string;
}

export interface DashboardAdminAction {
  admin?: string;
  initials?: string;
  action?: string;
  target?: string;
  time?: string;
  timestamp?: string;
  danger?: boolean;
}

export interface DashboardRecentItem {
  name?: string;
  type?: string;
  status?: string;
  edited?: string;
  lastEdited?: string;
  image?: string;
}

export interface DashboardResponse {
  users?: {
    total?: number;
    active?: number;
    admins?: number;
  };
  categories?: {
    total?: number;
    active?: number;
    inactive?: number;
  };
  templates?: {
    total?: number;
    active?: number;
  };
  totalUsers?: number;
  activePortfolios?: number;
  resumesBuilt?: number | string;
  capacityUsed?: number;
  usersGrowth?: string;
  portfoliosToday?: string;
  portfolioInsights?: number;
  jobApplicationUpdates?: number;
  subscriptionLabel?: string;
  analyticsChange?: string;
  analyticsBars?: number[];
  platformHealth?: {
    status?: string;
    apiInfrastructure?: string;
    aiTrainingCluster?: string;
    cdnDelivery?: string;
  };
  recentAdminActions?: DashboardAdminAction[];
  recentItems?: DashboardRecentItem[];
}

export type ResumeStatus = "draft" | "published" | "archived";
export type ResumeVisibility = "private" | "public";

export interface ResumeResponse {
  resume: Resume;
}

export interface ResumeLocation {
  city?: string;
  state?: string;
  country?: string;
  remote?: boolean;
}

export interface ResumeMetric {
  label: string;
  value: string;
}

export interface Resume {
  id?: string;
  userId?: string;
  workspaceId?: string;
  user?: {
    id: string;
    name: string;
    email: string;
  };
  metadata: {
    title: string;
    slug: string;
    domain: string;
    templateId: string;
    themeId: string;
    language: string;
    status: ResumeStatus;
    visibility: ResumeVisibility;
    version: number;
    isPrimary: boolean;
    tags: string[];
    createdAt?: string;
    updatedAt?: string;
  };
  personalInformation: {
    firstName: string;
    lastName: string;
    fullName: string;
    headline: string;
    email: string;
    phone: string;
    location: ResumeLocation;
    profilePhoto: string;
    summary: string;
    socialLinks: Record<string, string>;
  };
  sections: ResumeSection[];
  themeSettings: {
    fontFamily: string;
    fontSize: number;
    lineHeight: number;
    primaryColor: string;
    secondaryColor: string;
    backgroundColor: string;
    layout: string;
    spacing: {
      sectionGap: number;
      itemGap: number;
      pagePadding: number;
    };
    showIcons: boolean;
    showProfilePhoto: boolean;
    pageFormat: string;
  };
  exportConfigurations: {
    allowPdfExport: boolean;
    allowDocxExport: boolean;
    allowPublicSharing: boolean;
    publicResumeUrl: string;
    pdfSettings: {
      pageSize: string;
      margin: number;
      scale: number;
    };
    privacy: {
      hideEmail: boolean;
      hidePhone: boolean;
      hideLocation: boolean;
    };
  };
}

export interface ResumeSection {
  id: string;
  type: string;
  title: string;
  position: number;
  isVisible: boolean;
  config: Record<string, unknown>;
  items: ResumeSectionItem[];
}

export interface ResumeSectionItem {
  id: string;
  position: number;
  isVisible: boolean;
  content: Record<string, unknown>;
}
