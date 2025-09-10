export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  status: string;
  message: string;
  data: {
    user: AdminUser;
    token: string;
    refreshToken: string;
    isPremium: boolean;
    subscription?: any;
  };
}

export interface AdminUser {
  id: string;
  email: string;
  username: string;
  first_name: string;
  last_name: string;
  role: UserRole;
  is_verified: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  settings?: UserSettings;
}

export interface UserSettings {
  notifications: {
    email: boolean;
    push: boolean;
    inApp: boolean;
  };
  privacy: {
    profileVisibility: string;
    showOnlineStatus: boolean;
    showLastActive: boolean;
  };
  theme: string;
  language: string;
}

export enum UserRole {
  USER = 'user',
  ADMIN = 'admin',
  SUPER_ADMIN = 'super_admin',
  MODERATOR = 'MODERATOR',
}

export interface RefreshTokenResponse {
  status: string;
  message: string;
  data: {
    token: string;
  };
}

export interface AuthState {
  isAuthenticated: boolean;
  user: AdminUser | null;
  token: string | null;
  refreshToken: string | null;
  loading: boolean;
  error: string | null;
}
