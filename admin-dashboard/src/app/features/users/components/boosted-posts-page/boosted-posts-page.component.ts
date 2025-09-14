import { Component, OnInit, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { FormsModule } from '@angular/forms';
import { DatePicker } from 'primeng/datepicker';
import { Select } from 'primeng/select';
import { MessageService } from 'primeng/api';
import {
  BoostedPostsTableComponent,
  BoostedPost,
} from '../../../../shared/components/boosted-posts-table/boosted-posts-table.component';
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
    BoostedPostsTableComponent,
  ],
  providers: [MessageService],
  templateUrl: './boosted-posts-page.component.html',
  // No changeDetection needed - signals handle this automatically!
})
export class BoostedPostsPageComponent implements OnInit {
  // Inject services using inject() function
  private boostedPostsService = inject(BoostedPostsService);
  private messageService = inject(MessageService);

  // Convert all properties to signals
  boostedPosts = signal<BoostedPost[]>([]);
  loading = signal<boolean>(false);
  totalCount = signal<number>(0);

  // Filter properties as signals
  searchTerm = signal<string>('');
  statusFilter = signal<any>(undefined);
  locationFilter = signal<any>(undefined);
  priceRangeFilter = signal<any>(undefined);
  startDate = signal<Date | undefined>(undefined);
  endDate = signal<Date | undefined>(undefined);

  // Filter options (static data - no need for signals)
  statusOptions = [
    { name: 'All Status', code: '' },
    { name: 'Active', code: 'active' },
    { name: 'Pending', code: 'pending' },
    { name: 'Expired', code: 'expired' },
    { name: 'Inactive', code: 'inactive' },
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
    { name: 'San Jose', code: 'San Jose' },
  ];

  priceRangeOptions = [
    { name: 'All Prices', code: '' },
    { name: 'Under $10', code: 'under-10' },
    { name: '$10 - $50', code: '10-50' },
    { name: '$50 - $100', code: '50-100' },
    { name: '$100 - $200', code: '100-200' },
    { name: 'Over $200', code: 'over-200' },
  ];

  // Computed properties (automatically update when dependencies change)
  displayText = computed(
    () => `Showing ${this.boostedPosts().length} of ${this.totalCount()} boosted posts`
  );

  ngOnInit() {
    this.loadBoostedPosts();
  }

  private loadBoostedPosts(): void {
    console.log('Starting to load boosted posts, setting loading to true');
    this.loading.set(true);

    const filters: BoostedPostsFilters = {
      includePostDetails: true,
      includeUserDetails: true,
      limit: 100,
      offset: 0,
      sortBy: 'created_at',
      sortOrder: 'desc',
      // Server-side filters - use signal values
      status: this.statusFilter()?.code || undefined,
      city: this.locationFilter()?.code || undefined,
      minAmount: this.getMinAmount(),
      maxAmount: this.getMaxAmount(),
      createdAfter: this.startDate()?.toISOString() || undefined,
      createdBefore: this.endDate()?.toISOString() || undefined,
      // Search functionality
      search: this.searchTerm() || undefined,
    };

    this.boostedPostsService.getBoostedPosts(filters).subscribe({
      next: (response) => {
        console.log('Received response, setting loading to false');
        this.boostedPosts.set(response.data.boostedPosts);
        this.totalCount.set(response.data.totalCount);
        this.loading.set(false);
        console.log('Loaded boosted posts:', this.boostedPosts());
        console.log('Loading state after success:', this.loading());

        // ✅ NO MANUAL CHANGE DETECTION NEEDED!
        // Signals automatically trigger change detection
      },
      error: (error) => {
        console.error('Error loading boosted posts:', error);
        console.log('Error occurred, setting loading to false');
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to load boosted posts. Please try again.',
        });
        this.loading.set(false);
        console.log('Loading state after error:', this.loading());

        // ✅ NO MANUAL CHANGE DETECTION NEEDED!
      },
    });
  }

  applyFilters(): void {
    console.log('Applying filters, current loading state:', this.loading());
    this.loadBoostedPosts();
    // ✅ NO MANUAL CHANGE DETECTION NEEDED!
  }

  private getMinAmount(): number | undefined {
    const priceFilter = this.priceRangeFilter();
    if (!priceFilter?.code) return undefined;

    switch (priceFilter.code) {
      case 'under-10':
        return 0;
      case '10-50':
        return 10;
      case '50-100':
        return 50;
      case '100-200':
        return 100;
      case 'over-200':
        return 200;
      default:
        return undefined;
    }
  }

  private getMaxAmount(): number | undefined {
    const priceFilter = this.priceRangeFilter();
    if (!priceFilter?.code) return undefined;

    switch (priceFilter.code) {
      case 'under-10':
        return 10;
      case '10-50':
        return 50;
      case '50-100':
        return 100;
      case '100-200':
        return 200;
      case 'over-200':
        return undefined; // No upper limit
      default:
        return undefined;
    }
  }

  clearFilters(): void {
    this.searchTerm.set('');
    this.statusFilter.set(undefined);
    this.locationFilter.set(undefined);
    this.priceRangeFilter.set(undefined);
    this.startDate.set(undefined);
    this.endDate.set(undefined);
    this.applyFilters();
  }

  onPostClick(post: BoostedPost): void {
    console.log('Post clicked:', post);
  }

  onUserClick(userId: string): void {
    console.log('User clicked:', userId);
  }

  onRefreshClick(): void {
    console.log('Refresh clicked');
    this.loadBoostedPosts();
    // ✅ NO MANUAL CHANGE DETECTION NEEDED!
  }

  // Debug method to test loading state
  testLoadingState(): void {
    console.log('Current loading state:', this.loading());
    this.loading.set(!this.loading());
    console.log('Toggled loading state to:', this.loading());
    // ✅ NO MANUAL CHANGE DETECTION NEEDED!
  }
}
