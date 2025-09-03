import { Component, inject, OnInit, signal, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { UserService } from '../../services/user.service';
import { User, UserRole } from '../../models/user.model';
import { demoUsers } from '../../Mock/user.mock';
import { FormsModule } from '@angular/forms';

// PrimeNG Modules
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { ButtonModule } from 'primeng/button';
import { AvatarModule } from 'primeng/avatar';
import { CardModule } from 'primeng/card';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { Table } from 'primeng/table';

@Component({
  selector: 'app-user-list',
  imports: [
    CommonModule,
    RouterLink,
    FormsModule,
    TableModule,
    TagModule,
    IconFieldModule,
    InputIconModule,
    InputTextModule,
    SelectModule,
    ButtonModule,
    AvatarModule,
    CardModule,
    ProgressSpinnerModule,
  ],
  templateUrl: './user-list.html',
  styleUrl: './user-list.scss',
})
export class UserList implements OnInit {
  private readonly userService = inject(UserService);

  @ViewChild('dt') dt!: Table;
  @ViewChild('globalFilter') globalFilter!: ElementRef<HTMLInputElement>;
  @ViewChild('roleFilter') roleFilter!: any;
  @ViewChild('statusFilter') statusFilter!: any;
  @ViewChild('locationFilter') locationFilter!: any;

  private searchDebounceTimer: any;

  // Using Angular Signals for reactive state management
  users = signal<User[]>([]);
  loading = signal(false);
  error = signal<string | null>(null);

  // Server-side filter state
  filterState = {
    search: '',
    role: null as UserRole | null,
    status: null as boolean | null,
    location: '',
  };

  // Pagination state
  paginationInfo = {
    currentPage: 1,
    pageSize: 10,
    total: 0,
    totalPages: 0,
    start: 0,
    end: 0,
  };

  // Filter options
  roleOptions = [
    { label: 'Admin', value: UserRole.ADMIN },
    { label: 'User', value: UserRole.USER },
    { label: 'Moderator', value: UserRole.MODERATOR },
  ];

  statusOptions = [
    { label: 'Active', value: true },
    { label: 'Inactive', value: false },
  ];

  // Page size options
  pageSizeOptions = [
    { label: '10', value: 10 },
    { label: '25', value: 25 },
    { label: '50', value: 50 },
    { label: '100', value: 100 },
  ];

  // Extract unique countries from users for filter
  get countryOptions() {
    const countries = [...new Set(this.users().map((user) => user.location))];
    return countries.map((country) => ({ label: country, value: country }));
  }

  ngOnInit(): void {
    this.loadUsers();
  }

  async loadUsers(): Promise<void> {
    this.loading.set(true);
    this.error.set(null);

    try {
      // In a real app, this would be an API call with filters and pagination
      const params = {
        page: this.paginationInfo.currentPage,
        pageSize: this.paginationInfo.pageSize,
        search: this.filterState.search,
        role: this.filterState.role,
        status: this.filterState.status,
        location: this.filterState.location,
      };

      // Simulate server-side filtering and pagination
      setTimeout(() => {
        const filteredUsers = this.applyServerSideFilters(demoUsers);
        const startIndex = (this.paginationInfo.currentPage - 1) * this.paginationInfo.pageSize;
        const endIndex = startIndex + this.paginationInfo.pageSize;
        const paginatedUsers = filteredUsers.slice(startIndex, endIndex);

        this.users.set(paginatedUsers);
        this.updatePaginationInfo(filteredUsers.length);
        this.loading.set(false);
      }, 500); // Simulate API delay
    } catch (err) {
      this.error.set('Failed to load users');
      this.loading.set(false);
    }
  }

  private applyServerSideFilters(allUsers: User[]): User[] {
    let filtered = [...allUsers];

    // Apply search filter
    if (this.filterState.search) {
      const searchLower = this.filterState.search.toLowerCase();
      filtered = filtered.filter(
        (user) =>
          user.first_name.toLowerCase().includes(searchLower) ||
          user.last_name.toLowerCase().includes(searchLower) ||
          user.email.toLowerCase().includes(searchLower) ||
          user.username.toLowerCase().includes(searchLower)
      );
    }

    // Apply role filter
    if (this.filterState.role !== null) {
      filtered = filtered.filter((user) => user.role === this.filterState.role);
    }

    // Apply status filter
    if (this.filterState.status !== null) {
      filtered = filtered.filter((user) => user.is_active === this.filterState.status);
    }

    // Apply location filter
    if (this.filterState.location) {
      filtered = filtered.filter((user) => user.location === this.filterState.location);
    }

    return filtered;
  }

  private updatePaginationInfo(totalItems: number): void {
    this.paginationInfo.total = totalItems;
    this.paginationInfo.totalPages = Math.ceil(totalItems / this.paginationInfo.pageSize);
    this.paginationInfo.start =
      (this.paginationInfo.currentPage - 1) * this.paginationInfo.pageSize + 1;
    this.paginationInfo.end = Math.min(
      this.paginationInfo.currentPage * this.paginationInfo.pageSize,
      totalItems
    );

    // Ensure start is not greater than total when no results
    if (totalItems === 0) {
      this.paginationInfo.start = 0;
      this.paginationInfo.end = 0;
    }
  }

  deleteUser(user: User): void {
    // TODO: Implement user deletion with confirmation
    console.log('Delete user:', user.id);
  }

  editUser(user: User): void {
    // TODO: Implement user editing
    console.log('Edit user:', user.id);
  }

  getFullName(user: User): string {
    return `${user.first_name} ${user.last_name}`;
  }

  getRoleSeverity(role: UserRole): 'success' | 'info' | 'warn' | 'danger' {
    switch (role) {
      case UserRole.ADMIN:
        return 'danger';
      case UserRole.MODERATOR:
        return 'warn';
      case UserRole.USER:
        return 'info';
      default:
        return 'info';
    }
  }

  getStatusSeverity(isActive: boolean): 'success' | 'danger' {
    return isActive ? 'success' : 'danger';
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  }

  // Filter change handlers
  onSearchChange(value: string): void {
    this.filterState.search = value;
    this.paginationInfo.currentPage = 1; // Reset to first page

    // Debounce search to avoid too many API calls
    if (this.searchDebounceTimer) {
      clearTimeout(this.searchDebounceTimer);
    }

    this.searchDebounceTimer = setTimeout(() => {
      this.loadUsers();
    }, 300); // Wait 300ms after user stops typing
  }

  onRoleChange(value: UserRole | null): void {
    this.filterState.role = value;
    this.paginationInfo.currentPage = 1;
    this.loadUsers();
  }

  onStatusChange(value: boolean | null): void {
    this.filterState.status = value;
    this.paginationInfo.currentPage = 1;
    this.loadUsers();
  }

  onLocationChange(value: string): void {
    this.filterState.location = value;
    this.paginationInfo.currentPage = 1;
    this.loadUsers();
  }

  clearAllFilters(): void {
    this.filterState = {
      search: '',
      role: null,
      status: null,
      location: '',
    };
    this.paginationInfo.currentPage = 1;
    this.loadUsers();
  }

  // Pagination methods
  previousPage(): void {
    if (this.paginationInfo.currentPage > 1) {
      this.paginationInfo.currentPage--;
      this.loadUsers();
    }
  }

  nextPage(): void {
    if (this.paginationInfo.currentPage < this.paginationInfo.totalPages) {
      this.paginationInfo.currentPage++;
      this.loadUsers();
    }
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.paginationInfo.totalPages) {
      this.paginationInfo.currentPage = page;
      this.loadUsers();
    }
  }

  goToPageSafe(page: number | string): void {
    if (typeof page === 'number') {
      this.goToPage(page);
    }
  }

  onPageSizeChange(pageSize: number): void {
    this.paginationInfo.pageSize = pageSize;
    this.paginationInfo.currentPage = 1;
    this.loadUsers();
  }

  getVisiblePages(): (number | string)[] {
    const { currentPage, totalPages } = this.paginationInfo;
    const pages: (number | string)[] = [];

    if (totalPages <= 7) {
      // Show all pages if total is 7 or less
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(1);

      if (currentPage > 4) {
        pages.push('...');
      }

      // Show pages around current page
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (currentPage < totalPages - 3) {
        pages.push('...');
      }

      // Always show last page
      if (totalPages > 1) {
        pages.push(totalPages);
      }
    }

    return pages;
  }

  isNumber(value: number | string): value is number {
    return typeof value === 'number';
  }
}
