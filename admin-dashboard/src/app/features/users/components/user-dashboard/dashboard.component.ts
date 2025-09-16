import { Component, OnInit, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { CardModule } from 'primeng/card';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { MessageModule } from 'primeng/message';
import { ButtonModule } from 'primeng/button';
import { BadgeModule } from 'primeng/badge';
import { DividerModule } from 'primeng/divider';
import { StatsService } from '../../services/stats.service';
import { UserStats } from '../../models/stats.model';

@Component({
  selector: 'app-user-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    CardModule,
    ProgressSpinnerModule,
    MessageModule,
    ButtonModule,
    BadgeModule,
    DividerModule,
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class UserDashboardComponent implements OnInit {
  private statsService = inject(StatsService);
  private route = inject(ActivatedRoute);

  // State signals
  userStats = signal<UserStats | null>(null);
  loading = signal<boolean>(false);
  error = signal<string | null>(null);
  currentUserId = signal<string | null>(null);
  
  // Component configuration
  showRefreshButton = true;
  compact = false;

  // Computed signals for different stat categories
  engagementStats = computed(() => {
    const stats = this.userStats();
    if (!stats) return null;

    return {
      totalPosts: stats.totalPosts,
      totalComments: stats.totalComments,
      totalReactions: stats.totalReactions,
      totalStories: stats.totalStories,
      totalSavedItems: stats.totalSavedItems
    };
  });

  financialStats = computed(() => {
    const stats = this.userStats();
    if (!stats) return null;

    return {
      totalInvested: stats.totalInvested,
      boostInvestments: stats.boostInvestments,
      subscriptionInvestments: stats.subscriptionInvestments,
      totalPayments: stats.totalPayments,
      subscriptionStatus: stats.subscriptionStatus,
      subscriptionTier: stats.subscriptionTier
    };
  });

  activityStats = computed(() => {
    const stats = this.userStats();
    if (!stats) return null;

    return {
      totalFriends: stats.totalFriends,
      totalMarketplaceListings: stats.totalMarketplaceListings,
      averageRating: stats.averageRating,
      totalRatings: stats.totalRatings,
      lastActiveAt: stats.lastActiveAt,
      accountCreatedAt: stats.accountCreatedAt
    };
  });

  ngOnInit(): void {
    // Get userId from route params
    this.route.parent?.params.subscribe(params => {
      const routeUserId = params['id'];
      if (routeUserId) {
        this.currentUserId.set(routeUserId);
        this.loadUserStats(routeUserId);
      }
    });
  }

  loadUserStats(userId: string): void {
    if (!userId) return;

    this.loading.set(true);
    this.error.set(null);

    this.statsService.getUserStats(userId).subscribe({
      next: (stats) => {
        this.userStats.set(stats);
        this.loading.set(false);
      },
      error: (error) => {
        this.error.set(error.message || 'Failed to load user statistics');
        this.loading.set(false);
      }
    });
  }

  refreshStats(): void {
    const userId = this.currentUserId();
    if (userId) {
      this.loadUserStats(userId);
    }
  }

  // Business Logic Methods
  getSubscriptionBadgeSeverity(status: string | null | undefined): 'success' | 'info' | 'warn' | 'secondary' | 'contrast' | 'danger' {
    if (!status) return 'secondary';
    
    switch (status.toLowerCase()) {
      case 'active':
        return 'success';
      case 'inactive':
      case 'cancelled':
        return 'danger';
      case 'pending':
        return 'warn';
      case 'expired':
        return 'info';
      default:
        return 'secondary';
    }
  }

  getSubscriptionIcon(status: string | null | undefined): string {
    if (!status) return 'pi pi-question-circle';
    
    switch (status.toLowerCase()) {
      case 'active':
        return 'pi pi-check-circle';
      case 'inactive':
      case 'cancelled':
        return 'pi pi-times-circle';
      case 'pending':
        return 'pi pi-clock';
      case 'expired':
        return 'pi pi-exclamation-triangle';
      default:
        return 'pi pi-question-circle';
    }
  }

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  }

  formatNumber(value: number): string {
    if (value >= 1000000) {
      return (value / 1000000).toFixed(1) + 'M';
    } else if (value >= 1000) {
      return (value / 1000).toFixed(1) + 'K';
    }
    return value.toString();
  }

  formatDate(dateString: string | null | undefined): string {
    if (!dateString) return 'N/A';
    
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }

  getTimeAgo(dateString: string | null | undefined): string {
    if (!dateString) return 'N/A';
    
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) {
      return 'Just now';
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      return `${minutes}m ago`;
    } else if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600);
      return `${hours}h ago`;
    } else if (diffInSeconds < 2592000) {
      const days = Math.floor(diffInSeconds / 86400);
      return `${days}d ago`;
    } else if (diffInSeconds < 31536000) {
      const months = Math.floor(diffInSeconds / 2592000);
      return `${months}mo ago`;
    } else {
      const years = Math.floor(diffInSeconds / 31536000);
      return `${years}y ago`;
    }
  }

  getRatingStars(rating: number | null | undefined): string[] {
    if (!rating) return ['pi pi-star-o', 'pi pi-star-o', 'pi pi-star-o', 'pi pi-star-o', 'pi pi-star-o'];
    
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push('pi pi-star-fill');
      } else if (i === fullStars && hasHalfStar) {
        stars.push('pi pi-star-half-fill');
      } else {
        stars.push('pi pi-star-o');
      }
    }
    
    return stars;
  }
}
