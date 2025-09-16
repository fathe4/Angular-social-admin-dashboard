export interface UserStats {
  userId: string;
  totalPosts: number;
  totalBoostedPosts: number;
  totalFriends: number;
  totalInvested: number;
  boostInvestments: number;
  subscriptionInvestments: number;
  totalPayments: number;
  subscriptionStatus: string | null;
  subscriptionTier: string | null;
  totalStories: number;
  totalComments: number;
  totalReactions: number;
  totalSavedItems: number;
  totalMarketplaceListings: number;
  averageRating: number | null;
  totalRatings: number;
  lastActiveAt: string | null;
  accountCreatedAt: string | null;
}

export interface QuickStats {
  totalPosts: number;
  totalBoostedPosts: number;
  totalFriends: number;
  totalInvested: number;
}

export interface StatsResponse {
  success: boolean;
  message: string;
  data: UserStats;
}

export interface QuickStatsResponse {
  success: boolean;
  message: string;
  data: QuickStats;
}

export interface StatsError {
  success: false;
  message: string;
  error?: string;
}
