// Base model interface
export interface BaseModel {
  id: string;
  created_at: string;
  updated_at: string;
}

// User role types (matching backend enum)
export enum UserRole {
  ADMIN = 'admin',
  MODERATOR = 'moderator',
  SUPER_ADMIN = 'super_admin',
  USER = 'user',
}

// Main User interface (matching Supabase users table)
export interface User extends BaseModel {
  email: string;
  first_name: string;
  last_name: string;
  username: string;
  profile_picture?: string | null;
  cover_picture?: string | null;
  bio?: string | null;
  location?: string | null;
  contact_info?: Record<string, any> | null;
  role: UserRole;
  is_verified: boolean;
  is_active: boolean;
  settings?: Record<string, any> | null;
  // Additional fields for admin dashboard
  phone?: string | null;
  projects?: number;
  join_date?: string;
}

// Profile interface (matching Supabase profiles table)
export interface Profile extends BaseModel {
  user_id: string;
  location?: string | null;
  coordinates?: [number, number] | null; // PostGIS point format
  interests?: {
    categories: string[];
    tags: string[];
  } | null;
  birth_date?: string | null;
  occupation?: string | null;
  education?: string | null;
  relationship_status?:
    | 'single'
    | 'in_relationship'
    | 'engaged'
    | 'married'
    | 'complicated'
    | 'separated'
    | 'divorced'
    | 'widowed'
    | 'not_specified'
    | null;
  age?: number | null;
}

// Friendship interface (matching Supabase friendships table)
export interface Friendship extends BaseModel {
  requester_id: string;
  addressee_id: string;
  status: 'pending' | 'accepted' | 'rejected' | 'blocked';
}

// UserDevice interface (matching Supabase user_devices table)
export interface UserDevice extends BaseModel {
  user_id: string;
  device_token: string;
  device_type: 'ios' | 'android' | 'web' | 'desktop';
  device_name?: string | null;
  os_version?: string | null;
  app_version?: string | null;
  last_active: string;
  is_active: boolean;
}

// UserLocation interface (matching Supabase user_locations table)
export interface UserLocation extends BaseModel {
  user_id: string;
  coordinates: [number, number]; // PostGIS point format
  accuracy?: number | null;
  altitude?: number | null;
  heading?: number | null;
  speed?: number | null;
  city?: string | null;
  country?: string | null;
  ip_address?: string | null;
  location_source?: string | null;
  additional_metadata?: Record<string, any> | null;
  timestamp: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// File upload result interface (from storage service)
export interface FileUploadResult {
  publicUrl: string;
  path: string;
  fullPath: string;
}

// API Request/Response Types

// For creating new users
export interface CreateUserRequest {
  email: string;
  password_hash: string;
  first_name: string;
  last_name: string;
  username: string;
  profile_picture?: string | null;
  cover_picture?: string | null;
  bio?: string | null;
  location?: string | null;
  contact_info?: Record<string, any> | null;
  role?: UserRole;
  is_verified?: boolean;
  is_active?: boolean;
  settings?: Record<string, any> | null;
}

// For updating users
export interface UpdateUserRequest {
  email?: string;
  first_name?: string;
  last_name?: string;
  username?: string;
  profile_picture?: string | null;
  cover_picture?: string | null;
  bio?: string | null;
  location?: string | null;
  contact_info?: Record<string, any> | null;
  role?: UserRole;
  is_verified?: boolean;
  is_active?: boolean;
  settings?: Record<string, any> | null;
}

// For creating/updating profiles
export interface UpsertProfileRequest {
  user_id: string;
  location?: string | null;
  coordinates?: [number, number] | null;
  interests?: {
    categories: string[];
    tags: string[];
  } | null;
  birth_date?: string | null;
  occupation?: string | null;
  education?: string | null;
  relationship_status?:
    | 'single'
    | 'in_relationship'
    | 'engaged'
    | 'married'
    | 'complicated'
    | 'separated'
    | 'divorced'
    | 'widowed'
    | 'not_specified'
    | null;
}

// For creating friendships
export interface CreateFriendshipRequest {
  requester_id: string;
  addressee_id: string;
}

// For updating friendship status
export interface UpdateFriendshipStatusRequest {
  friendship_id: string;
  status: 'pending' | 'accepted' | 'rejected' | 'blocked';
}

// For registering user devices
export interface RegisterUserDeviceRequest {
  user_id: string;
  device_token: string;
  device_type: 'ios' | 'android' | 'web' | 'desktop';
  device_name?: string | null;
  os_version?: string | null;
  app_version?: string | null;
  is_active?: boolean;
}

// For updating user devices
export interface UpdateUserDeviceRequest {
  device_name?: string | null;
  os_version?: string | null;
  app_version?: string | null;
  last_active?: string;
  is_active?: boolean;
}

// For tracking user location
export interface TrackUserLocationRequest {
  user_id: string;
  coordinates: [number, number];
  accuracy?: number | null;
  altitude?: number | null;
  heading?: number | null;
  speed?: number | null;
  timestamp: string;
}

// For updating profile pictures
export interface UpdateProfilePictureRequest {
  user_id: string;
  file_result: FileUploadResult;
}

// For updating cover pictures
export interface UpdateCoverPictureRequest {
  user_id: string;
  file_result: FileUploadResult;
}

// For updating picture URLs
export interface UpdatePictureUrlRequest {
  user_id: string;
  picture_url: string;
}

// API Response Types

// For user with profile data
export interface UserWithProfileResponse {
  user: User;
  profile: Profile | null;
}

// For paginated users list (backend response format)
export interface UsersListResponse {
  data: {
    users: User[];
  };
  total: number;
  page: number;
  limit: number;
}

// For users with filtering options
export interface GetUsersOptions {
  page?: number;
  limit?: number;
  search?: string;
  role?: UserRole;
  is_verified?: boolean;
  is_active?: boolean;
  sort_by?: string;
  order?: 'asc' | 'desc';
}

// For users query response
export interface GetUsersResponse {
  users: User[];
  total: number;
}

// Error response interface
export interface ApiErrorResponse {
  message: string;
  statusCode: number;
  error?: string;
}

// Success response interface
export interface ApiSuccessResponse<T = any> {
  data: T;
  message?: string;
  statusCode: number;
}

// Frontend user list response (transformed from backend)
export interface UserListResponse {
  users: User[];
  total: number;
  page: number;
  totalPages: number;
  limit: number;
}

// User Details Endpoint Types

// User Profile Details (from userService.ts)
export interface UserProfileDetails {
  location: string | null;
  coordinates: [number, number] | null;
  interests: string[];
  birth_date: string | null;
  occupation: string | null;
  education: string | null;
  relationship_status: string | null;
}

// Marketplace Statistics
export interface MarketplaceStats {
  isActive: boolean;
  activeListingsCount: number;
  totalListingsCount: number;
  averageRating: number | null;
  totalRatings: number;
  recentListings: MarketplaceListing[];
}

// Marketplace Listing (simplified)
export interface MarketplaceListing {
  id: string;
  title: string;
  status: string;
  approval_status: string;
  created_at: string;
  subscription_tier_id?: string;
}

// Subscription Details
export interface SubscriptionDetails {
  tier: SubscriptionTier | null;
  status: 'active' | 'inactive' | 'expired' | 'none';
  startedAt: string | null;
  expiresAt: string | null;
  isActive: boolean;
}

// Subscription Tier
export interface SubscriptionTier {
  name: string;
  description: string;
  price: number;
  duration_days: number;
  featured_listings: number;
  listing_limit: number;
  priority_search: boolean;
}

// User Location Details
export interface UserLocationDetails {
  current: UserLocation | null;
  profile: string | null;
}

// User Statistics
export interface UserStats {
  totalListings: number;
  activeListings: number;
  totalRatings: number;
  averageRating: number | null;
}

// Complete User Details (without password)
export interface UserDetailsResponse {
  // Basic User Info (from User model, excluding password_hash)
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  username: string;
  profile_picture?: string;
  cover_picture?: string;
  bio?: string;
  contact_info?: Record<string, any>;
  role: UserRole;
  is_verified: boolean;
  is_active: boolean;
  settings?: Record<string, any>;
  created_at: string;
  updated_at: string;

  // Additional Details
  profile: UserProfileDetails | null;
  location: UserLocationDetails;
  marketplace: MarketplaceStats;
  subscription: SubscriptionDetails;
  stats: UserStats;
}

// Query Parameters for getUserDetails endpoint
export interface GetUserDetailsQuery {
  includeProfile?: 'true' | 'false';
  includeLocation?: 'true' | 'false';
  includeMarketplace?: 'true' | 'false';
  includeSubscription?: 'true' | 'false';
  marketplaceLimit?: string;
}

// Backend Response for getUserDetails endpoint
export interface BackendUserDetailsResponse {
  status: 'success' | 'error';
  message?: string;
  data: {
    user: UserDetailsResponse;
  };
}