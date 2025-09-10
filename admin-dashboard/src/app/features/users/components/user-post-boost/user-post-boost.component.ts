import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BoostedPostsTableComponent, BoostedPost } from '../../../../shared/components/boosted-posts-table/boosted-posts-table.component';

@Component({
  selector: 'post-boost-list',
  templateUrl: 'user-post-boost.component.html',
  standalone: true,
  imports: [CommonModule, BoostedPostsTableComponent],
  providers: [],
})
export class PostBoostList implements OnInit {
  postBoost: BoostedPost[] = [];

  ngOnInit() {
    this.postBoost = [
      {
        id: 'boost-001',
        post_id: 'P-1001',
        user_id: 'user-001',
        amount: 49.99,
        days: 30,
        status: 'active',
        city: 'New York',
        country: 'USA',
        estimated_reach: 1000,
        created_at: '2025-01-15T10:30:00Z',
        expires_at: '2025-02-14T10:30:00Z',
        coordinates: null,
        posts: {
          id: 'P-1001',
          content: 'Amazing Sunset Photography - Beautiful sunset captured during my recent trip',
          media: [{ url: 'https://picsum.photos/100?random=1' }],
          visibility: 'public',
          view_count: 150,
          created_at: '2025-01-15T10:30:00Z',
          user_id: 'user-001',
          is_boosted: true
        },
        users: {
          id: 'user-001',
          username: 'photographer_john',
          first_name: 'John',
          last_name: 'Doe',
          profile_picture: 'https://picsum.photos/40?random=user1',
          is_verified: true
        }
      },
      {
        id: 'boost-002',
        post_id: 'P-1002',
        user_id: 'user-002',
        amount: 19.99,
        days: 15,
        status: 'pending',
        city: 'Los Angeles',
        country: 'USA',
        estimated_reach: 500,
        created_at: '2025-01-20T14:15:00Z',
        expires_at: '2025-02-04T14:15:00Z',
        coordinates: null,
        posts: {
          id: 'P-1002',
          content: 'Tech Innovation Showcase - Latest technology trends and innovations',
          media: [{ url: 'https://picsum.photos/100?random=2' }],
          visibility: 'public',
          view_count: 75,
          created_at: '2025-01-20T14:15:00Z',
          user_id: 'user-002',
          is_boosted: true
        },
        users: {
          id: 'user-002',
          username: 'tech_guru',
          first_name: 'Jane',
          last_name: 'Smith',
          profile_picture: 'https://picsum.photos/40?random=user1',
          is_verified: false
        }
      },
      {
        id: 'boost-003',
        post_id: 'P-1003',
        user_id: 'user-003',
        amount: 9.99,
        days: 7,
        status: 'expired',
        city: 'Chicago',
        country: 'USA',
        estimated_reach: 200,
        created_at: '2025-01-10T09:45:00Z',
        expires_at: '2025-01-17T09:45:00Z',
        coordinates: null,
        posts: {
          id: 'P-1003',
          content: 'Food Recipe Collection - Delicious recipes from around the world',
          media: [{ url: 'https://picsum.photos/100?random=3' }],
          visibility: 'public',
          view_count: 300,
          created_at: '2025-01-10T09:45:00Z',
          user_id: 'user-003',
          is_boosted: true
        },
        users: {
          id: 'user-003',
          username: 'chef_mike',
          first_name: 'Mike',
          last_name: 'Johnson',
          profile_picture: 'https://picsum.photos/40?random=user1',
          is_verified: true
        }
      },
      {
        id: 'boost-004',
        post_id: 'P-1004',
        user_id: 'user-004',
        amount: 99.99,
        days: 60,
        status: 'active',
        city: 'Houston',
        country: 'USA',
        estimated_reach: 2000,
        created_at: '2025-01-05T16:20:00Z',
        expires_at: '2025-03-06T16:20:00Z',
        coordinates: null,
        posts: {
          id: 'P-1004',
          content: 'Fitness Journey Progress - My transformation journey and fitness tips',
          media: [{ url: 'https://picsum.photos/100?random=4' }],
          visibility: 'public',
          view_count: 500,
          created_at: '2025-01-05T16:20:00Z',
          user_id: 'user-004',
          is_boosted: true
        },
        users: {
          id: 'user-004',
          username: 'fitness_sarah',
          first_name: 'Sarah',
          last_name: 'Wilson',
          profile_picture: 'https://picsum.photos/40?random=user1',
          is_verified: true
        }
      },
      {
        id: 'boost-005',
        post_id: 'P-1005',
        user_id: 'user-005',
        amount: 149.99,
        days: 90,
        status: 'inactive',
        city: 'Phoenix',
        country: 'USA',
        estimated_reach: 3000,
        created_at: '2025-01-01T12:00:00Z',
        expires_at: '2025-04-01T12:00:00Z',
        coordinates: null,
        posts: {
          id: 'P-1005',
          content: 'Travel Adventure Blog - Exploring hidden gems around the world',
          media: [{ url: 'https://picsum.photos/100?random=5' }],
          visibility: 'public',
          view_count: 800,
          created_at: '2025-01-01T12:00:00Z',
          user_id: 'user-005',
          is_boosted: true
        },
        users: {
          id: 'user-005',
          username: 'traveler_alex',
          first_name: 'Alex',
          last_name: 'Brown',
          profile_picture: 'https://picsum.photos/40?random=user1',
          is_verified: true
        }
      }
    ];
  }

  onPostClick(post: BoostedPost): void {
    console.log('Post clicked:', post);
    // TODO: Navigate to post details or show modal
  }

  onUserClick(userId: string): void {
    console.log('User clicked:', userId);
    // TODO: Navigate to user details
  }

  onRefreshClick(): void {
    console.log('Refresh clicked');
    // TODO: Reload data from API
  }
}