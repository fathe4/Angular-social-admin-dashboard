import { Component, Input, Output, EventEmitter, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ButtonModule } from 'primeng/button';
import { ImageModule } from 'primeng/image';
import { Router } from '@angular/router';

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

@Component({
  selector: 'app-boosted-posts-table',
  standalone: true,
  imports: [CommonModule, TableModule, TagModule, ButtonModule, ImageModule],
  templateUrl: './boosted-posts-table.component.html',
})
export class BoostedPostsTableComponent {
  private router = inject(Router);

  @Input() boostedPosts: BoostedPost[] = [];
  @Input() showUserColumn: boolean = true;
  @Input() showLocationColumn: boolean = true;
  @Input() showPaginator: boolean = true;
  @Input() rowsPerPage: number = 10;
  @Input() loading: boolean = false;
  @Input() showRefreshButton: boolean = true;

  @Output() postClick = new EventEmitter<BoostedPost>();
  @Output() userClick = new EventEmitter<string>();
  @Output() refreshClick = new EventEmitter<void>();

  onPostClick(post: BoostedPost): void {
    this.postClick.emit(post);
  }

  onUserClick(userId: string, event: Event): void {
    event.stopPropagation();
    this.router.navigate(['/dashboard/users', userId, 'boost']);
  }

  onRefreshClick(): void {
    this.refreshClick.emit();
  }

  getStatusSeverity(status: string): string {
    switch (status.toLowerCase()) {
      case 'active':
        return 'success';
      case 'pending':
        return 'warning';
      case 'expired':
        return 'danger';
      case 'inactive':
        return 'secondary';
      default:
        return 'info';
    }
  }

  formatPrice(amount: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  }

  formatDate(dateString: string): string {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  truncateText(text: string, maxLength: number = 50): string {
    if (!text) return 'N/A';
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  }

  getLocation(post: BoostedPost): string {
    if (post.city && post.country) {
      return `${post.city}, ${post.country}`;
    } else if (post.city) {
      return post.city;
    } else if (post.country) {
      return post.country;
    }
    return 'N/A';
  }

  getPostContent(post: BoostedPost): string {
    return post.posts?.content || 'No content available';
  }

  getPostMedia(post: BoostedPost): string {
    // Check if media exists and is an array with content
    if (post.posts?.media && Array.isArray(post.posts.media) && post.posts.media.length > 0) {
      const firstMedia = post.posts.media[0];
      // Handle different media structures
      if (typeof firstMedia === 'string') {
        return firstMedia;
      } else if (firstMedia && typeof firstMedia === 'object' && firstMedia.url) {
        return firstMedia.url;
      }
    }
    return this.getDefaultPostImage();
  }

  getDefaultPostImage(): string {
    return 'https://picsum.photos/64?random=post';
  }

  getUserName(post: BoostedPost): string {
    if (post.users) {
      const firstName = post.users.first_name || '';
      const lastName = post.users.last_name || '';
      const fullName = `${firstName} ${lastName}`.trim();
      return fullName || post.users.username || `User ${post.user_id.slice(-4)}`;
    }
    return `User ${post.user_id.slice(-4)}`;
  }

  getUserProfilePicture(post: BoostedPost): string {
    return post.users?.profile_picture || 'https://picsum.photos/40?random=avatar';
  }

  getTimeLeft(expiresAt: string): string {
    const now = new Date();
    const expires = new Date(expiresAt);
    const diffTime = expires.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays <= 0) {
      return 'Expired';
    } else if (diffDays === 1) {
      return '1 day';
    } else {
      return `${diffDays} days`;
    }
  }

  onImageError(event: Event): void {
    const img = event.target as HTMLImageElement;
    img.src = this.getDefaultPostImage();
  }

  onUserImageError(event: Event): void {
    const img = event.target as HTMLImageElement;
    img.src = 'https://picsum.photos/24?random=avatar';
  }
}
