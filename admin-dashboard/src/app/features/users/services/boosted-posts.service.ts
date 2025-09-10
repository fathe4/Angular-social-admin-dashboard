import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

export interface BoostedPostResponse {
  status: string;
  data: {
    boostedPosts: BoostedPost[];
    totalCount: number;
    hasMore: boolean;
  };
  pagination: {
    totalCount: number;
    hasMore: boolean;
    limit: number;
    offset: number;
  };
}

export interface BoostedPost {
  id: string;
  post_id: string;
  user_id: string;
  amount: number;
  days: number;
  status: string;
  city: string | null;
  country: string | null;
  estimated_reach: number;
  created_at: string | null;
  expires_at: string;
  coordinates: any;
  posts?: {
    id: string;
    content: string;
    media: any;
    visibility: string;
    view_count: number;
    created_at: string;
    user_id: string;
    is_boosted: boolean;
  };
  users?: {
    id: string;
    username: string;
    first_name: string;
    last_name: string;
    profile_picture: string;
    is_verified: boolean;
  };
}

export interface BoostedPostsFilters {
  status?: string;
  userId?: string;
  postId?: string;
  city?: string;
  country?: string;
  minAmount?: number;
  maxAmount?: number;
  minDays?: number;
  maxDays?: number;
  minEstimatedReach?: number;
  maxEstimatedReach?: number;
  createdAfter?: string;
  createdBefore?: string;
  expiresAfter?: string;
  expiresBefore?: string;
  includePostDetails?: boolean;
  includeUserDetails?: boolean;
  limit?: number;
  offset?: number;
  sortBy?: string;
  sortOrder?: string;
}

@Injectable({
  providedIn: 'root'
})
export class BoostedPostsService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = environment.apiUrl;

  /**
   * Get all boosted posts with optional filtering
   */
  getBoostedPosts(filters: BoostedPostsFilters = {}): Observable<BoostedPostResponse> {
    let httpParams = new HttpParams();

    // Add filters to query parameters
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        httpParams = httpParams.set(key, value.toString());
      }
    });

    console.log('Fetching boosted posts with filters:', filters);
    console.log('API URL:', `${this.apiUrl}/posts/boosts`);

    return this.http.get<BoostedPostResponse>(`${this.apiUrl}/posts/boosts`, { 
      params: httpParams 
    });
  }

  /**
   * Get boosted posts for a specific user
   */
  getUserBoostedPosts(userId: string, filters: BoostedPostsFilters = {}): Observable<BoostedPostResponse> {
    let httpParams = new HttpParams();

    // Add filters to query parameters
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        httpParams = httpParams.set(key, value.toString());
      }
    });

    return this.http.get<BoostedPostResponse>(`${this.apiUrl}/posts/boosts/my`, { 
      params: httpParams 
    });
  }
}
