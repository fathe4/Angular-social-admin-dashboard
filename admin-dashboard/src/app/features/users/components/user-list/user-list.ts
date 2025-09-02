import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { UserService } from '../../services/user.service';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-user-list',
  imports: [CommonModule, RouterLink],
  templateUrl: './user-list.html',
  styleUrl: './user-list.scss'
})
export class UserList implements OnInit {
  private readonly userService = inject(UserService);
  
  // Using Angular Signals for reactive state management
  users = signal<User[]>([]);
  loading = signal(false);
  error = signal<string | null>(null);
  
  // Pagination state
  currentPage = signal(1);
  totalUsers = signal(0);
  pageSize = signal(10);

  // Expose Math for template use
  protected readonly Math = Math;

  // Computed properties for stats (better performance than template calculations)
  get activeUsersCount(): number {
    return this.users().filter(user => user.isActive).length;
  }

  get inactiveUsersCount(): number {
    return this.users().filter(user => !user.isActive).length;
  }

  get paginationStart(): number {
    return (this.currentPage() - 1) * this.pageSize() + 1;
  }

  get paginationEnd(): number {
    return Math.min(this.currentPage() * this.pageSize(), this.totalUsers());
  }

  ngOnInit(): void {
    this.loadUsers();
  }

  async loadUsers(): Promise<void> {
    this.loading.set(true);
    this.error.set(null);
    
    try {
      // For now, let's use mock data since we haven't connected to the backend yet
      // this.userService.getUsers(this.currentPage(), this.pageSize()).subscribe({
      //   next: (response) => {
      //     this.users.set(response.users);
      //     this.totalUsers.set(response.total);
      //     this.loading.set(false);
      //   },
      //   error: (err) => {
      //     this.error.set('Failed to load users');
      //     this.loading.set(false);
      //   }
      // });

      // Mock data for demonstration
      setTimeout(() => {
        this.users.set([
          {
            id: '1',
            email: 'john@example.com',
            username: 'john_doe',
            firstName: 'John',
            lastName: 'Doe',
            isActive: true,
            createdAt: '2024-01-15T10:30:00Z',
            updatedAt: '2024-01-15T10:30:00Z',
            lastLogin: '2024-01-20T14:30:00Z',
            role: { id: '1', name: 'Admin', permissions: ['read', 'write', 'delete'] }
          },
          {
            id: '2',
            email: 'jane@example.com',
            username: 'jane_smith',
            firstName: 'Jane',
            lastName: 'Smith',
            isActive: true,
            createdAt: '2024-01-16T09:15:00Z',
            updatedAt: '2024-01-16T09:15:00Z',
            lastLogin: '2024-01-19T16:45:00Z',
            role: { id: '2', name: 'User', permissions: ['read'] }
          },
          {
            id: '3',
            email: 'bob@example.com',
            username: 'bob_wilson',
            firstName: 'Bob',
            lastName: 'Wilson',
            isActive: false,
            createdAt: '2024-01-10T08:00:00Z',
            updatedAt: '2024-01-10T08:00:00Z',
            role: { id: '2', name: 'User', permissions: ['read'] }
          }
        ]);
        this.totalUsers.set(3);
        this.loading.set(false);
      }, 1000); // Simulate API delay
      
    } catch (err) {
      this.error.set('Failed to load users');
      this.loading.set(false);
    }
  }

  onPageChange(page: number): void {
    this.currentPage.set(page);
    this.loadUsers();
  }

  toggleUserStatus(user: User): void {
    // TODO: Implement user status toggle
    console.log('Toggle status for user:', user.id);
  }

  deleteUser(user: User): void {
    // TODO: Implement user deletion with confirmation
    console.log('Delete user:', user.id);
  }
}
