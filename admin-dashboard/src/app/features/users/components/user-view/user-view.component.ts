import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CardModule } from 'primeng/card';
import { AvatarModule } from 'primeng/avatar';
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';
import { BadgeModule } from 'primeng/badge';
import { User, UserRole } from '../../models/user.model';
import { TabsModule } from 'primeng/tabs';
import { TagModule } from 'primeng/tag';
import { ChipModule } from 'primeng/chip';
import { ImageModule } from 'primeng/image';

@Component({
  selector: 'app-user-view',
  standalone: true,
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
  ],
  templateUrl: './user-view.component.html',
})
export class UserViewComponent implements OnInit {
  user: any = {};
  userId: string | null = null;
  activeTab: string = 'dashboard';
  currentUrl: string = '';
  tabs: any[] = []; // Initialize as empty array

  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    this.router.events.subscribe(() => {
      this.currentUrl = this.router.url;
    });

    this.route.params.subscribe((params) => {
      this.userId = params['id'];
      this.loadUser();
      this.setupTabs();
    });
  }

  private setupTabs(): void {
    if (!this.userId) return;

    this.tabs = [
      {
        id: 0,
        // ✅ Fixed: Correct absolute path for nested child routes
        route: `/dashboard/users/${this.userId}/subscriptions`,
        label: 'Subscriptions',
        icon: 'pi pi-home',
      },
      {
        id: 1,
        // ✅ Fixed: Correct absolute path for nested child routes
        route: `/dashboard/users/${this.userId}/transactions`,
        label: 'Transactions',
        icon: 'pi pi-chart-line',
      },
      {
        id: 2,
        // ✅ Fixed: These should also be nested under the current user if you want them as tabs
        // Or change them to absolute paths if they're separate sections
        route: `/dashboard/users/${this.userId}/boost`,
        label: 'Posts Boost',
        icon: 'pi pi-list',
      },
    ];

  }

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
    if (!this.user?.join_date) return '0d';

    const joinDate = new Date(this.user.join_date);
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

  formatJoinDate(dateString: string): string {
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

  private loadUser(): void {
    // Static user data for demonstration
    this.user = {
      id: this.userId || '1',
      email: 'john.doe@example.com',
      first_name: 'John',
      last_name: 'Doe',
      username: 'john_doe',
      profile_picture: 'https://randomuser.me/api/portraits/men/1.jpg',
      cover_picture: 'https://picsum.photos/seed/john/800/200',
      bio: 'Tech enthusiast, coffee lover, and weekend traveler. Passionate about creating innovative solutions and exploring new technologies.',
      location: 'New York, USA',
      contact_info: {
        phone: '+1-555-0123',
        website: 'https://johndoe.dev',
        linkedin: 'https://linkedin.com/in/johndoe',
        twitter: '@johndoe',
      },
      role: UserRole.ADMIN,
      is_verified: true,
      is_active: true,
      settings: {
        notifications: true,
        privacy: 'public',
        theme: 'light',
      },
      created_at: '2023-01-10T10:00:00Z',
      updated_at: '2023-06-05T14:30:00Z',
      phone: '+1-555-0123',
      projects: 12,
      join_date: '2023-01-10',
    };
  }

  onEditUser(): void {
    console.log('Edit user:', this.user?.id);
    // TODO: Implement edit functionality
  }

  onDeleteUser(): void {
    console.log('Delete user:', this.user?.id);
    // TODO: Implement delete functionality
  }

  onViewProfile(): void {
    console.log('View profile:', this.user?.id);
    // TODO: Implement view profile functionality
  }

  setActiveTab(tab: string): void {
    this.activeTab = tab;
  }

  getRoleBadgeSeverity(role: UserRole): string {
    switch (role) {
      case UserRole.SUPER_ADMIN:
        return 'danger';
      case UserRole.ADMIN:
        return 'warning';
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
    return isVerified ? 'success' : 'warning';
  }
}
