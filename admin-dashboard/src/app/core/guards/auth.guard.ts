import { Injectable, inject } from '@angular/core';
import { CanActivate, CanActivateChild, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';
import { UserRole } from '../models/auth.model';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate, CanActivateChild {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    return this.checkAuthentication(route, state);
  }

  canActivateChild(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    return this.checkAuthentication(route, state);
  }

  private checkAuthentication(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> {
    // If user is already authenticated in memory, check role
    if (this.authService.isAuthenticated()) {
      return this.checkRole(route);
    }

    // If token exists but not authenticated in memory, try to get current user
    const token = this.authService.getToken();
    if (token) {
      return this.authService.getCurrentUser().pipe(
        map(() => {
          return this.checkRoleSync(route);
        }),
        catchError(() => {
          this.redirectToLogin(state.url);
          return of(false);
        })
      );
    }

    // No token, redirect to login
    this.redirectToLogin(state.url);
    return of(false);
  }

  private checkRole(route: ActivatedRouteSnapshot): Observable<boolean> {
    const requiredRoles = route.data?.['roles'] as UserRole[];
    
    if (!requiredRoles || requiredRoles.length === 0) {
      // No specific role required, just need to be admin
      return of(this.authService.isAdmin());
    }

    // Check if user has any of the required roles
    const hasRequiredRole = this.authService.hasAnyRole(requiredRoles);
    
    if (!hasRequiredRole) {
      this.router.navigate(['/unauthorized']);
      return of(false);
    }

    return of(true);
  }

  private checkRoleSync(route: ActivatedRouteSnapshot): boolean {
    const requiredRoles = route.data?.['roles'] as UserRole[];
    
    if (!requiredRoles || requiredRoles.length === 0) {
      // No specific role required, just need to be admin
      return this.authService.isAdmin();
    }

    // Check if user has any of the required roles
    const hasRequiredRole = this.authService.hasAnyRole(requiredRoles);
    
    if (!hasRequiredRole) {
      this.router.navigate(['/unauthorized']);
      return false;
    }

    return true;
  }

  private redirectToLogin(returnUrl: string): void {
    this.router.navigate(['/auth/login'], { 
      queryParams: { returnUrl } 
    });
  }
}
