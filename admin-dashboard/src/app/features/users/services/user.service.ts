import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User, UserListResponse, CreateUserRequest, UpdateUserRequest } from '../models/user.model';

@Injectable({
  providedIn: 'root' // This makes it a singleton service
})
export class UserService {
  private readonly http = inject(HttpClient); // Modern Angular dependency injection
  private readonly apiUrl = 'http://localhost:3000/api'; // Your backend URL

  /**
   * Get all users with pagination
   */
  getUsers(page: number = 1, limit: number = 10, search?: string): Observable<UserListResponse> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString());
    
    if (search) {
      params = params.set('search', search);
    }

    return this.http.get<UserListResponse>(`${this.apiUrl}/users`, { params });
  }

  /**
   * Get a single user by ID
   */
  getUserById(id: string): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/users/${id}`);
  }

  /**
   * Create a new user
   */
  createUser(userData: CreateUserRequest): Observable<User> {
    return this.http.post<User>(`${this.apiUrl}/users`, userData);
  }

  /**
   * Update an existing user
   */
  updateUser(id: string, userData: UpdateUserRequest): Observable<User> {
    return this.http.patch<User>(`${this.apiUrl}/users/${id}`, userData);
  }

  /**
   * Delete a user (soft delete)
   */
  deleteUser(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/users/${id}`);
  }

  /**
   * Toggle user active status
   */
  toggleUserStatus(id: string): Observable<User> {
    return this.http.patch<User>(`${this.apiUrl}/users/${id}/toggle-status`, {});
  }
}
