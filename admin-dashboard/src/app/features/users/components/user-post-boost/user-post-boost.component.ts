// admin-dashboard/src/app/features/users/components/user-post-boost/user-post-boost.component.ts
import { Component, OnInit, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import {
  BoostedPostsTableComponent,
  BoostedPost,
} from '../../../../shared/components/boosted-posts-table/boosted-posts-table.component';
import {
  BoostedPostsService,
  BoostedPostsFilters,
  BoostedPostResponse,
} from '../../services/boosted-posts.service';

@Component({
  selector: 'post-boost-list',
  templateUrl: 'user-post-boost.component.html',
  standalone: true,
  imports: [CommonModule, BoostedPostsTableComponent],
  providers: [MessageService],
})
export class PostBoostList implements OnInit {
  // Inject services
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private boostedPostsService = inject(BoostedPostsService);
  private messageService = inject(MessageService);

  // Convert properties to signals
  postBoost = signal<BoostedPost[]>([]);
  loading = signal<boolean>(false);
  totalCount = signal<number>(0);
  userId = signal<string>('');

  // Computed properties
  displayText = computed(
    () =>
      `Showing ${
        this.postBoost().length
      } of ${this.totalCount()} boosted posts for user ${this.userId()}`
  );

  ngOnInit() {
    // Get userId from route parameters
    this.route.parent?.params.subscribe((params) => {
      const userId = params['id'];
      if (userId) {
        this.userId.set(userId);
        this.loadUserBoostedPosts(userId);
      } else {
        console.error('No user ID found in route parameters');
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No user ID provided in the route.',
        });
      }
    });
  }

  private loadUserBoostedPosts(userId: string): void {
    console.log('Loading boosted posts for user:', userId);
    this.loading.set(true);

    const filters: BoostedPostsFilters = {
      userId: userId,
      includePostDetails: true,
      includeUserDetails: true,
      limit: 100,
      offset: 0,
      sortBy: 'created_at',
      sortOrder: 'desc',
    };

    this.boostedPostsService.getBoostedPosts(filters).subscribe({
      next: (response: BoostedPostResponse) => {
        console.log('Received user boosted posts response:', response);
        this.postBoost.set(response.data?.boostedPosts || []);
        this.totalCount.set(response.data?.totalCount || 0);
        this.loading.set(false);
        console.log('Loaded user boosted posts:', this.postBoost());
      },
      error: (error: any) => {
        console.error('Error loading user boosted posts:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to load user boosted posts. Please try again.',
        });
        this.postBoost.set([]);
        this.totalCount.set(0);
        this.loading.set(false);
      },
    });
  }

  onPostClick(post: BoostedPost): void {
    console.log('Post clicked:', post);
    // TODO: Navigate to post details or show modal
  }

  onUserClick(userId: string): void {
    console.log('User clicked:', userId);
    // Navigate to user details
    this.router.navigate(['/dashboard/users', userId]);
  }

  onRefreshClick(): void {
    console.log('Refresh clicked');
    const currentUserId = this.userId();
    if (currentUserId) {
      this.loadUserBoostedPosts(currentUserId);
    }
  }
}
