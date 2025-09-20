import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LogoutService {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);
  private readonly apiUrl = environment.apiUrl;

  /**
   * Logout user by calling the backend API and clearing local storage
   */
  logout(): void {
    const token = localStorage.getItem(environment.tokenKey);
    
    if (token) {
      // Call backend logout endpoint
      this.http.post(`${this.apiUrl}${environment.endpoints.auth.logout}`, {})
        .subscribe({
          next: (response) => {
            console.log('Logout successful:', response);
            this.clearLocalStorage();
            this.redirectToLogin();
          },
          error: (error) => {
            console.error('Logout API call failed:', error);
            // Even if API call fails, clear local storage and redirect
            this.clearLocalStorage();
            this.redirectToLogin();
          }
        });
    } else {
      // No token, just clear storage and redirect
      this.clearLocalStorage();
      this.redirectToLogin();
    }
  }

  /**
   * Clear all authentication data from localStorage
   */
  private clearLocalStorage(): void {
    localStorage.removeItem(environment.tokenKey);
    localStorage.removeItem(environment.refreshTokenKey);
    localStorage.removeItem('admin_user');
  }

  /**
   * Redirect to login page
   */
  private redirectToLogin(): void {
    // this.router.navigate(['/auth/login']);
  }
}
