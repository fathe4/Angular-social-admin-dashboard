import { Injectable, inject, signal, computed, PLATFORM_ID } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { Observable, BehaviorSubject, throwError } from 'rxjs';
import { tap, catchError, map } from 'rxjs/operators';
import { 
  LoginRequest, 
  LoginResponse, 
  AdminUser, 
  RefreshTokenResponse, 
  UserRole,
  AuthState 
} from '../models/auth.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly isBrowser = isPlatformBrowser(this.platformId);
  
  // Reactive state management with signals
  private authState = signal<AuthState>({
    isAuthenticated: false,
    user: null,
    token: null,
    refreshToken: null,
    loading: false,
    error: null
  });

  // Public computed signals
  public readonly isAuthenticated = computed(() => this.authState().isAuthenticated);
  public readonly currentUser = computed(() => this.authState().user);
  public readonly isLoading = computed(() => this.authState().loading);
  public readonly error = computed(() => this.authState().error);
  public readonly isAdmin = computed(() => {
    const user = this.authState().user;
    return user?.role === UserRole.ADMIN || user?.role === UserRole.SUPER_ADMIN || user?.role === UserRole.MODERATOR;
  });
  public readonly isSuperAdmin = computed(() => this.authState().user?.role === UserRole.SUPER_ADMIN);

  private readonly apiUrl = environment.apiUrl;

  constructor() {
    this.initializeAuthState();
  }

  /**
   * Initialize authentication state from localStorage
   */
  private initializeAuthState(): void {
    // Only initialize from localStorage if we're in the browser
    if (!this.isBrowser) {
      return;
    }

    const token = this.getToken();
    const refreshToken = this.getRefreshToken();
    const userStr = localStorage.getItem('admin_user');
    
    if (token && userStr) {
      try {
        const user = JSON.parse(userStr) as AdminUser;
        this.updateAuthState({
          isAuthenticated: true,
          user,
          token,
          refreshToken,
          loading: false,
          error: null
        });
      } catch {
        this.clearStorage();
      }
    }
  }

  /**
   * Login user with email and password
   */
  login(credentials: LoginRequest): Observable<LoginResponse> {
    this.updateAuthState({ ...this.authState(), loading: true, error: null });

    return this.http.post<LoginResponse>(`${this.apiUrl}${environment.endpoints.auth.login}`, credentials)
      .pipe(
        tap(response => {
          if (response.status === 'success') {
            const { user, token, refreshToken } = response.data;
            
            // Check if user has admin privileges
            if (!this.hasAdminRole(user.role)) {
              throw new Error('Insufficient permissions. Admin access required.');
            }

            // Store tokens and user data
            this.storeAuthData(token, refreshToken, user);
            
            // Update reactive state
            this.updateAuthState({
              isAuthenticated: true,
              user,
              token,
              refreshToken,
              loading: false,
              error: null
            });
          }
        }),
        catchError(this.handleError.bind(this))
      );
  }

  /**
   * Logout user
   */
  logout(): Observable<any> {
    const token = this.getToken();
    
    // Call backend logout endpoint if token exists
    const logoutRequest = token 
      ? this.http.post(`${this.apiUrl}${environment.endpoints.auth.logout}`, {})
      : new Observable(subscriber => subscriber.next({}));

    return logoutRequest.pipe(
      tap(() => {
        this.clearStorage();
        this.updateAuthState({
          isAuthenticated: false,
          user: null,
          token: null,
          refreshToken: null,
          loading: false,
          error: null
        });
        this.router.navigate(['/auth/login']);
      }),
      catchError(() => {
        // Even if logout fails on backend, clear local storage
        this.clearStorage();
        this.updateAuthState({
          isAuthenticated: false,
          user: null,
          token: null,
          refreshToken: null,
          loading: false,
          error: null
        });
        this.router.navigate(['/auth/login']);
        return new Observable(subscriber => subscriber.next({}));
      })
    );
  }

  /**
   * Refresh authentication token
   */
  refreshToken(): Observable<RefreshTokenResponse> {
    const refreshToken = this.getRefreshToken();
    
    if (!refreshToken) {
      return throwError(() => new Error('No refresh token available'));
    }

    return this.http.post<RefreshTokenResponse>(
      `${this.apiUrl}${environment.endpoints.auth.refresh}`, 
      { refreshToken }
    ).pipe(
      tap(response => {
        if (response.status === 'success') {
          const newToken = response.data.token;
          if (this.isBrowser) {
            localStorage.setItem(environment.tokenKey, newToken);
          }
          
          this.updateAuthState({
            ...this.authState(),
            token: newToken
          });
        }
      }),
      catchError(error => {
        this.logout();
        return throwError(() => error);
      })
    );
  }

  /**
   * Get current user from backend
   */
  getCurrentUser(): Observable<AdminUser> {
    return this.http.get<{ status: string; data: { user: AdminUser } }>(
      `${this.apiUrl}${environment.endpoints.auth.me}`
    ).pipe(
      map(response => response.data.user),
              tap(user => {
          if (!this.hasAdminRole(user.role)) {
            throw new Error('Insufficient permissions. Admin access required.');
          }
          
          if (this.isBrowser) {
            localStorage.setItem('admin_user', JSON.stringify(user));
          }
          this.updateAuthState({
            ...this.authState(),
            user
          });
        }),
      catchError(this.handleError.bind(this))
    );
  }

  /**
   * Check if user has admin role
   */
  private hasAdminRole(role: UserRole): boolean {
    return [UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.MODERATOR].includes(role);
  }

  /**
   * Store authentication data in localStorage
   */
  private storeAuthData(token: string, refreshToken: string, user: AdminUser): void {
    if (this.isBrowser) {
      localStorage.setItem(environment.tokenKey, token);
      localStorage.setItem(environment.refreshTokenKey, refreshToken);
      localStorage.setItem('admin_user', JSON.stringify(user));
    }
  }

  /**
   * Clear all authentication data from localStorage
   */
  private clearStorage(): void {
    if (this.isBrowser) {
      localStorage.removeItem(environment.tokenKey);
      localStorage.removeItem(environment.refreshTokenKey);
      localStorage.removeItem('admin_user');
    }
  }

  /**
   * Update authentication state
   */
  private updateAuthState(newState: AuthState): void {
    this.authState.set(newState);
  }

  /**
   * Get stored token
   */
  getToken(): string | null {
    if (!this.isBrowser) {
      return null;
    }
    return localStorage.getItem(environment.tokenKey);
  }

  /**
   * Get stored refresh token
   */
  getRefreshToken(): string | null {
    if (!this.isBrowser) {
      return null;
    }
    return localStorage.getItem(environment.refreshTokenKey);
  }

  /**
   * Handle HTTP errors
   */
  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'An unexpected error occurred';
    
    if (error.error?.message) {
      errorMessage = error.error.message;
    } else if (error.message) {
      errorMessage = error.message;
    }

    this.updateAuthState({
      ...this.authState(),
      loading: false,
      error: errorMessage
    });

    return throwError(() => new Error(errorMessage));
  }

  /**
   * Check if user is authenticated
   */
  isUserAuthenticated(): boolean {
    return this.isAuthenticated();
  }

  /**
   * Check if user has specific role
   */
  hasRole(role: UserRole): boolean {
    return this.currentUser()?.role === role;
  }

  /**
   * Check if user has any of the specified roles
   */
  hasAnyRole(roles: UserRole[]): boolean {
    const userRole = this.currentUser()?.role;
    return userRole ? roles.includes(userRole) : false;
  }
}
