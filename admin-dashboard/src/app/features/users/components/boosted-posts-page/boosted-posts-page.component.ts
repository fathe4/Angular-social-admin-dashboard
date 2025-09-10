import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { FormsModule } from '@angular/forms';
import { DatePicker } from 'primeng/datepicker';
import { Select } from 'primeng/select';
import { MessageService } from 'primeng/api';
import { BoostedPostsTableComponent, BoostedPost } from '../../../../shared/components/boosted-posts-table/boosted-posts-table.component';
import { BoostedPostsService, BoostedPostsFilters } from '../../services/boosted-posts.service';

@Component({
  selector: 'app-boosted-posts-page',
  standalone: true,
  imports: [
    CommonModule,
    CardModule,
    InputTextModule,
    ButtonModule,
    FormsModule,
    DatePicker,
    Select,
    BoostedPostsTableComponent
  ],
  providers: [MessageService],
  templateUrl: './boosted-posts-page.component.html',
})
export class BoostedPostsPageComponent implements OnInit {
  boostedPosts: BoostedPost[] = [];
  filteredBoostedPosts: BoostedPost[] = [];
  loading: boolean = false;
  totalCount: number = 0;
  
  // Filter properties
  searchTerm: string = '';
  statusFilter: any = undefined;
  locationFilter: any = undefined;
  priceRangeFilter: any = undefined;
  startDate: Date | undefined;
  endDate: Date | undefined;

  // Filter options
  statusOptions = [
    { name: 'All Status', code: '' },
    { name: 'Active', code: 'active' },
    { name: 'Pending', code: 'pending' },
    { name: 'Expired', code: 'expired' },
    { name: 'Inactive', code: 'inactive' }
  ];
  
  locationOptions = [
    { name: 'All Locations', code: '' },
    { name: 'New York', code: 'New York' },
    { name: 'Los Angeles', code: 'Los Angeles' },
    { name: 'Chicago', code: 'Chicago' },
    { name: 'Houston', code: 'Houston' },
    { name: 'Phoenix', code: 'Phoenix' },
    { name: 'Philadelphia', code: 'Philadelphia' },
    { name: 'San Antonio', code: 'San Antonio' },
    { name: 'San Diego', code: 'San Diego' },
    { name: 'Dallas', code: 'Dallas' },
    { name: 'San Jose', code: 'San Jose' }
  ];

  priceRangeOptions = [
    { name: 'All Prices', code: '' },
    { name: 'Under $10', code: 'under-10' },
    { name: '$10 - $50', code: '10-50' },
    { name: '$50 - $100', code: '50-100' },
    { name: '$100 - $200', code: '100-200' },
    { name: 'Over $200', code: 'over-200' }
  ];

  constructor(
    private boostedPostsService: BoostedPostsService,
    private messageService: MessageService
  ) {}

  ngOnInit() {
    this.loadBoostedPosts();
  }

  private loadBoostedPosts(): void {
    this.loading = true;
    
    const filters: BoostedPostsFilters = {
      includePostDetails: true,
      includeUserDetails: true,
      limit: 100,
      offset: 0,
      sortBy: 'created_at',
      sortOrder: 'desc'
    };

    this.boostedPostsService.getBoostedPosts(filters).subscribe({
      next: (response) => {
        this.boostedPosts = response.data.boostedPosts;
        this.totalCount = response.data.totalCount;
        this.filteredBoostedPosts = [...this.boostedPosts];
        this.loading = false;
        console.log('Loaded boosted posts:', this.boostedPosts);
      },
      error: (error) => {
        console.error('Error loading boosted posts:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to load boosted posts. Please try again.'
        });
        this.loading = false;
      }
    });
  }

  applyFilters(): void {
    this.filteredBoostedPosts = this.boostedPosts.filter(post => {
      // Search term filter
      const matchesSearch = !this.searchTerm || 
        post.post_id.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        post.posts?.content?.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        post.users?.username?.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        post.users?.first_name?.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        post.users?.last_name?.toLowerCase().includes(this.searchTerm.toLowerCase());

      // Status filter
      const matchesStatus = !this.statusFilter || !this.statusFilter.code || 
        post.status.toLowerCase() === this.statusFilter.code;

      // Location filter
      const location = this.getLocationString(post);
      const matchesLocation = !this.locationFilter || !this.locationFilter.code || 
        location.toLowerCase().includes(this.locationFilter.code.toLowerCase());

      // Price range filter
      let matchesPriceRange = true;
      if (this.priceRangeFilter && this.priceRangeFilter.code) {
        const amount = post.amount;
        switch (this.priceRangeFilter.code) {
          case 'under-10':
            matchesPriceRange = amount < 10;
            break;
          case '10-50':
            matchesPriceRange = amount >= 10 && amount <= 50;
            break;
          case '50-100':
            matchesPriceRange = amount > 50 && amount <= 100;
            break;
          case '100-200':
            matchesPriceRange = amount > 100 && amount <= 200;
            break;
          case 'over-200':
            matchesPriceRange = amount > 200;
            break;
        }
      }

      // Date range filter
      let matchesDateRange = true;
      if (this.startDate || this.endDate) {
        const postDate = new Date(post.created_at || '');
        
        if (this.startDate && this.endDate) {
          matchesDateRange = postDate >= this.startDate && postDate <= this.endDate;
        } else if (this.startDate) {
          matchesDateRange = postDate >= this.startDate;
        } else if (this.endDate) {
          matchesDateRange = postDate <= this.endDate;
        }
      }

      return matchesSearch && matchesStatus && matchesLocation && matchesPriceRange && matchesDateRange;
    });
  }

  private getLocationString(post: BoostedPost): string {
    if (post.city && post.country) {
      return `${post.city}, ${post.country}`;
    } else if (post.city) {
      return post.city;
    } else if (post.country) {
      return post.country;
    }
    return '';
  }

  clearFilters(): void {
    this.searchTerm = '';
    this.statusFilter = undefined;
    this.locationFilter = undefined;
    this.priceRangeFilter = undefined;
    this.startDate = undefined;
    this.endDate = undefined;
    this.applyFilters();
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
    this.loadBoostedPosts();
  }
}
