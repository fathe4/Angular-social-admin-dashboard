import { Injectable, inject } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { UserRole } from '../models/auth.model';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  canActivate(route: ActivatedRouteSnapshot): Observable<boolean> {
    const requiredRoles = route.data?.['roles'] as UserRole[];
    
    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/auth/login']);
      return of(false);
    }

    if (!requiredRoles || requiredRoles.length === 0) {
      // No specific role required, just check if user is admin
      if (this.authService.isAdmin()) {
        return of(true);
      } else {
        this.router.navigate(['/unauthorized']);
        return of(false);
      }
    }

    // Check if user has any of the required roles
    const hasRequiredRole = this.authService.hasAnyRole(requiredRoles);
    
    if (hasRequiredRole) {
      return of(true);
    } else {
      this.router.navigate(['/unauthorized']);
      return of(false);
    }
  }
}
