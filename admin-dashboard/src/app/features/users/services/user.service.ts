import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, catchError, switchMap } from 'rxjs/operators';
import { throwError } from 'rxjs';
import {
  User,
  UserListResponse,
  CreateUserRequest,
  UpdateUserRequest,
  UserRole,
  UsersListResponse,
  UserDetailsResponse,
  BackendUserDetailsResponse,
} from '../models/user.model';
import { environment } from '../../../../environments/environment';

// interface BackendUserResponse {
//   status: string;
//   results: number;
//   total: number;
//   page: number;
//   totalPages: number;
//   data: {
//     users: any[];
//   };
// }

interface BackendUserListResponse {
  status: string;
  results: number;
  total: number;
  page: number;
  totalPages: number;
  data: {
    users: User[];
  };
}

interface BackendSingleUserResponse {
  status: string;
  data: {
    user: User;
  };
}

@Injectable({
  providedIn: 'root', // This makes it a singleton service
})
export class UserService {
  private readonly http = inject(HttpClient); // Modern Angular dependency injection
  private readonly apiUrl = environment.apiUrl; // Use environment configuration

  /**
   * Get all users with pagination, filtering and search
   */
  getUsers(
    page: number = 1,
    limit: number = 10,
    search?: string,
    role?: UserRole,
    is_verified?: boolean,
    is_active?: boolean,
    sort_by?: string,
    order?: 'asc' | 'desc'
  ): Observable<UserListResponse> {
    let params = new HttpParams().set('page', page.toString()).set('limit', limit.toString());

    if (search) {
      params = params.set('search', search);
    }
    if (role) {
      params = params.set('role', role);
    }
    if (is_verified !== undefined) {
      params = params.set('is_verified', is_verified.toString());
    }
    if (is_active !== undefined) {
      params = params.set('is_active', is_active.toString());
    }
    if (sort_by) {
      params = params.set('sort_by', sort_by);
    }
    if (order) {
      params = params.set('order', order);
    }

    return this.http
      .get<BackendUserListResponse>(`${this.apiUrl}${environment.endpoints.users.list}`, {
        params,
      })
      .pipe(
        map((response) => ({
          users: response.data.users,
          total: response.total,
          page: response.page,
          totalPages: response.totalPages,
          limit: Math.ceil(response.total / response.results) || 10,
        })),
        catchError(this.handleError)
      );
  }

  /**
   * Get a single user by ID
   */
  getUserById(id: string): Observable<User> {
    return this.http
      .get<BackendSingleUserResponse>(`${this.apiUrl}${environment.endpoints.users.detail}/${id}`)
      .pipe(
        map((response) => response.data.user),
        catchError(this.handleError)
      );
  }

  /**
   * Create a new user
   */
  createUser(userData: CreateUserRequest): Observable<User> {
    return this.http
      .post<BackendSingleUserResponse>(
        `${this.apiUrl}${environment.endpoints.users.create}`,
        userData
      )
      .pipe(
        map((response) => response.data.user),
        catchError(this.handleError)
      );
  }
  /**
   * Get user details with comprehensive information (profile, location, marketplace, subscription)
   */
  getUserDetails(
    id: string,
    options: {
      includeProfile?: boolean;
      includeLocation?: boolean;
      includeMarketplace?: boolean;
      includeSubscription?: boolean;
      marketplaceLimit?: number;
    }
  ): Observable<UserDetailsResponse> {
    let params = new HttpParams();

    if (options.includeProfile !== undefined) {
      params = params.set('includeProfile', options.includeProfile.toString());
    }
    if (options.includeLocation !== undefined) {
      params = params.set('includeLocation', options.includeLocation.toString());
    }
    if (options.includeMarketplace !== undefined) {
      params = params.set('includeMarketplace', options.includeMarketplace.toString());
    }
    if (options.includeSubscription !== undefined) {
      params = params.set('includeSubscription', options.includeSubscription.toString());
    }
    if (options.marketplaceLimit !== undefined) {
      params = params.set('marketplaceLimit', options.marketplaceLimit.toString());
    }

    return this.http
      .get<BackendUserDetailsResponse>(
        `${this.apiUrl}${environment.endpoints.users.detail}/${id}/details`,
        {
          params,
        }
      )
      .pipe(
        map((response) => response.data.user),
        catchError(this.handleError)
      );
  }

  /**
   * Update an existing user
   */
  updateUser(id: string, userData: UpdateUserRequest): Observable<User> {
    return this.http
      .patch<BackendSingleUserResponse>(
        `${this.apiUrl}${environment.endpoints.users.update}/${id}`,
        userData
      )
      .pipe(
        map((response) => response.data.user),
        catchError(this.handleError)
      );
  }

  /**
   * Delete a user (soft delete)
   */
  deleteUser(id: string): Observable<void> {
    return this.http
      .delete<void>(`${this.apiUrl}${environment.endpoints.users.delete}/${id}/complete`)
      .pipe(catchError(this.handleError));
  }

  /**
   * Toggle user active status
   */
  toggleUserStatus(id: string): Observable<User> {
    // Use update endpoint to toggle is_active status
    return this.getUserById(id).pipe(
      map((user) => ({ is_active: !user.is_active })),
      switchMap((updateData) => this.updateUser(id, updateData))
    );
  }

  /**
   * Transform backend user list response to frontend format
   */
  // private transformUserListResponse(response: UsersListResponse): UserListResponse {
  //   return {
  //     users: response.data.users.map((user) => this.transformUser(user)),
  //     total: response.total,
  //     page: response.page,
  //     totalPages: response.totalPages,
  //     limit: Math.ceil(response.total / response.results) || 10,
  //   };
  // }

  /**
   * Transform backend user object to frontend User model
   */
  // private transformUser(backendUser: any): User {
  //   return {
  //     id: backendUser.id,
  //     email: backendUser.email,
  //     username: backendUser.username,
  //     first_name: backendUser.first_name,
  //     last_name: backendUser.last_name,
  //     role: backendUser.role as UserRole,
  //     is_verified: backendUser.is_verified,
  //     is_active: backendUser.is_active,
  //     created_at: backendUser.created_at,
  //     updated_at: backendUser.updated_at,
  //     profile_picture: backendUser.profile_picture,
  //     settings: backendUser.settings,
  //   };
  // }

  /**
   * Handle HTTP errors
   */
  private handleError(error: any): Observable<never> {
    console.error('UserService error:', error);

    let errorMessage = 'An unexpected error occurred';

    if (error.error?.message) {
      errorMessage = error.error.message;
    } else if (error.message) {
      errorMessage = error.message;
    } else if (typeof error === 'string') {
      errorMessage = error;
    }

    return throwError(() => new Error(errorMessage));
  }
}
