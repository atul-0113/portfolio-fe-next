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
