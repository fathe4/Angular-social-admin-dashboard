import { Component, signal, input, output, HostListener, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive, Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { LogoutService } from '../../core/services/logout.service';

interface NavItem {
  icon: string;
  label: string;
  route?: string;
  isPro?: boolean;
  isExpandable?: boolean;
  children?: NavItem[];
}

interface NavSection {
  title?: string;
  items: NavItem[];
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    RouterLinkActive,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
  ],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent {
  // Inputs and outputs for mobile behavior
  readonly isOpen = input<boolean>(false);
  readonly sidebarClose = output<void>();

  protected readonly isWidgetsExpanded = signal(false);
  private readonly logoutService = inject(LogoutService);

  constructor(private router: Router) {}

  toggleWidgets(): void {
    this.isWidgetsExpanded.update((value) => !value);
  }

  onNavItemClick(): void {
    // Close sidebar on mobile when nav item is clicked
    this.sidebarClose.emit();
  }

  onLogoutClick(): void {
    // Call logout service
    this.logoutService.logout();

    // Close sidebar on mobile
    this.sidebarClose.emit();
  }

  onBackdropClick(): void {
    // Close sidebar when backdrop is clicked
    this.sidebarClose.emit();
  }

  onHamburgerClick(): void {
    // Close sidebar when hamburger menu is clicked
    this.sidebarClose.emit();
  }

  // Prevent sidebar click from bubbling to backdrop
  onSidebarClick(event: Event): void {
    event.stopPropagation();
  }

  @HostListener('window:resize')
  onResize(): void {
    // Close sidebar on resize to prevent layout issues
    if (window.innerWidth >= 768 && this.isOpen()) {
      this.sidebarClose.emit();
    }
  }
}
