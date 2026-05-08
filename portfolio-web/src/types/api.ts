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
