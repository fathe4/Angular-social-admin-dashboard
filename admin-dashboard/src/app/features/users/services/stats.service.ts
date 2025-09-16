// admin-dashboard/src/app/features/users/services/stats.service.ts
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import { UserStats, QuickStats, StatsResponse, QuickStatsResponse } from '../models/stats.model';

@Injectable({
  providedIn: 'root',
})
export class StatsService {
  private http = inject(HttpClient);
  private readonly apiUrl = environment.apiUrl;

  /**
   * Get comprehensive user statistics
   * @param userId - User ID to get stats for
   * @returns Observable<UserStats>
   */
  getUserStats(userId: string): Observable<UserStats> {
    const url = `${this.apiUrl}${environment.endpoints.stats.user}/${userId}`;

    return this.http.get<StatsResponse>(url).pipe(
      map((response) => {
        if (!response.success) {
          throw new Error(response.message);
        }
        return response.data;
      }),
      catchError(this.handleError)
    );
  }

  /**
   * Get quick user statistics (lightweight)
   * @param userId - User ID to get stats for
   * @returns Observable<QuickStats>
   */
  getQuickStats(userId: string): Observable<QuickStats> {
    const url = `${this.apiUrl}${environment.endpoints.stats.userQuick}/${userId}/quick`;

    return this.http.get<QuickStatsResponse>(url).pipe(
      map((response) => {
        if (!response.success) {
          throw new Error(response.message);
        }
        return response.data;
      }),
      catchError(this.handleError)
    );
  }

  /**
   * Handle HTTP errors
   * @param error - The error object
   * @returns Observable<never>
   */
  private handleError(error: any): Observable<never> {
    let errorMessage = 'An unknown error occurred';

    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = error.error.message;
    } else {
      // Server-side error
      if (error.error && error.error.message) {
        errorMessage = error.error.message;
      } else if (error.message) {
        errorMessage = error.message;
      } else if (error.status) {
        errorMessage = `Error ${error.status}: ${error.statusText}`;
      }
    }

    console.error('StatsService Error:', error);
    return throwError(() => new Error(errorMessage));
  }
}
