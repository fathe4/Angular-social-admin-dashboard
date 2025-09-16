import { Component, OnInit, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CardModule } from 'primeng/card';
import { AvatarModule } from 'primeng/avatar';
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';
import { BadgeModule } from 'primeng/badge';
import { TabsModule } from 'primeng/tabs';
import { TagModule } from 'primeng/tag';
import { ChipModule } from 'primeng/chip';
import { ImageModule } from 'primeng/image';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { MessageModule } from 'primeng/message';
import { UserService } from '../../services/user.service';
import {
  UserDetailsResponse,
  UserRole,
  MarketplaceStats,
  SubscriptionDetails,
  UserProfileDetails,
  UserLocationDetails,
  UserStats,
} from '../../models/user.model';
import { catchError, of, switchMap } from 'rxjs';

@Component({
  selector: 'app-user-view',
  standalone: true,
  styleUrls: ['./user-view.component.scss'],
  imports: [
    CommonModule,
    CardModule,
    AvatarModule,
    ButtonModule,
    TabsModule,
    DividerModule,
    BadgeModule,
    RouterModule,
    TagModule,
    ImageModule,
    ChipModule,
    ProgressSpinnerModule,
    MessageModule,
  ],
  templateUrl: './user-view.component.html',
})
export class UserViewComponent implements OnInit {
  // Signals for reactive state management
  private userService = inject(UserService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  // State signals
  userId = signal<string | null>(null);
  userDetails = signal<UserDetailsResponse | null>(null);
  loading = signal<boolean>(true);
  error = signal<string | null>(null);
  activeTab = signal<string>('dashboard');
  currentUrl = signal<string>('');

  // Computed signals for derived state
  user = computed(() =>
    this.userDetails()?.id
      ? {
          ...this.userDetails()!,
          // Add any additional computed properties here
        }
      : null
  );

  tabs = computed(() => {
    const id = this.userId();
    if (!id) return [];

    return [
      {
        id: 0,
        route: `/dashboard/users/${id}/dashboard`,
        label: 'Dashboard',
        icon: 'pi pi-home',
      },
      {
        id: 1,
        route: `/dashboard/users/${id}/transactions`,
        label: 'Transactions',
        icon: 'pi pi-chart-line',
      },
      {
        id: 2,
        route: `/dashboard/users/${id}/boost`,
        label: 'Posts Boost',
        icon: 'pi pi-list',
      },
    ];
  });

  // Computed signals for user data sections
  profileData = computed(() => this.userDetails()?.profile);
  locationData = computed(() => this.userDetails()?.location);
  marketplaceData = computed(() => this.userDetails()?.marketplace);
  subscriptionData = computed(() => this.userDetails()?.subscription);
  statsData = computed(() => this.userDetails()?.stats);

  ngOnInit(): void {
    // Track router events
    this.router.events.subscribe(() => {
      this.currentUrl.set(this.router.url);
    });

    // Subscribe to route params and load user details
    this.route.params
      .pipe(
        switchMap((params) => {
          const userId = params['id'];
          this.userId.set(userId);
          this.loading.set(true);
          this.error.set(null);

          return this.userService.getUserDetails(userId, {
            includeProfile: true,
            includeLocation: true,
            includeMarketplace: true,
            includeSubscription: true,
            marketplaceLimit: 10,
          });
        }),
        catchError((err) => {
          this.error.set(err.message || 'Failed to load user details');
          this.loading.set(false);
          return of(null);
        })
      )
      .subscribe((userDetails) => {
        if (userDetails) {
          this.userDetails.set(userDetails);
        }
        this.loading.set(false);
      });
  }

  // Utility methods
  getRoleClasses(role: string): string {
    const roleClasses: { [key: string]: string } = {
      ADMIN: 'bg-red-100 text-red-800',
      USER: 'bg-green-100 text-green-800',
      MODERATOR: 'bg-yellow-100 text-yellow-800',
      EDITOR: 'bg-blue-100 text-blue-800',
    };
    return roleClasses[role] || 'bg-gray-100 text-gray-800';
  }

  getJoinDuration(): string {
    const user = this.userDetails();
    if (!user?.created_at) return '0d';

    const joinDate = new Date(user.created_at);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - joinDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 30) {
      return `${diffDays}d`;
    } else if (diffDays < 365) {
      return `${Math.floor(diffDays / 30)}m`;
    } else {
      return `${Math.floor(diffDays / 365)}y`;
    }
  }

  formatDate(dateString: string): string {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
    });
  }

  getWebsiteDomain(url: string): string {
    try {
      return new URL(url).hostname.replace('www.', '');
    } catch {
      return url;
    }
  }

  // Action methods
  onEditUser(): void {
    const user = this.userDetails();
    console.log('Edit user:', user?.id);
    // TODO: Implement edit functionality
  }

  onDeleteUser(): void {
    const user = this.userDetails();
    console.log('Delete user:', user?.id);
    // TODO: Implement delete functionality
  }

  onViewProfile(): void {
    const user = this.userDetails();
    console.log('View profile:', user?.id);
    // TODO: Implement view profile functionality
  }

  setActiveTab(tab: string): void {
    this.activeTab.set(tab);
  }

  getRoleBadgeSeverity(role: UserRole): string {
    switch (role) {
      case UserRole.SUPER_ADMIN:
        return 'danger';
      case UserRole.ADMIN:
        return 'warn';
      case UserRole.MODERATOR:
        return 'info';
      case UserRole.USER:
        return 'success';
      default:
        return 'secondary';
    }
  }

  getStatusBadgeSeverity(isActive: boolean): string {
    return isActive ? 'success' : 'danger';
  }

  getVerificationBadgeSeverity(isVerified: boolean): string {
    return isVerified ? 'success' : 'warn';
  }

  // Refresh user data
  refreshUserDetails(): void {
    const userId = this.userId();
    if (!userId) return;

    this.loading.set(true);
    this.error.set(null);

    this.userService
      .getUserDetails(userId, {
        includeProfile: true,
        includeLocation: true,
        includeMarketplace: true,
        includeSubscription: true,
        marketplaceLimit: 10,
      })
      .pipe(
        catchError((err) => {
          this.error.set(err.message || 'Failed to refresh user details');
          this.loading.set(false);
          return of(null);
        })
      )
      .subscribe((userDetails) => {
        if (userDetails) {
          this.userDetails.set(userDetails);
        }
        this.loading.set(false);
      });
  }
}
