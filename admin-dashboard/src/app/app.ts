import { Component, signal, effect, Renderer2, Inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { CommonModule } from '@angular/common';
import { DOCUMENT } from '@angular/common';
import { SidebarComponent } from './shared/sidebar/sidebar.component';
import { BreadcrumbService } from './shared/services/breadcrumb.service';
import { PrimeNG } from 'primeng/config';
import { BreadcrumbComponent } from './shared/components/breadcrumb/breadcrumb.component';

@Component({
  selector: 'app-root',
  imports: [
    CommonModule,
    RouterOutlet,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatSidenavModule,
    MatListModule,
    MatCardModule,
    MatDividerModule,
    SidebarComponent,
    BreadcrumbComponent,
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss',
  providers: [BreadcrumbService],
})
export class App implements OnInit {
  protected readonly title = signal('Social Media');
  protected readonly isSidebarOpen = signal(false);

  constructor(
    private renderer: Renderer2,
    private primeng: PrimeNG,
    @Inject(DOCUMENT) private document: Document,
    private breadcrumbService: BreadcrumbService
  ) {
    // Prevent body scroll when sidebar is open on mobile
    effect(() => {
      if (this.isSidebarOpen() && window.innerWidth < 768) {
        this.renderer.addClass(this.document.body, 'overflow-hidden');
      } else {
        this.renderer.removeClass(this.document.body, 'overflow-hidden');
      }
    });
  }

  ngOnInit() {
    this.primeng.ripple.set(true);
  }

  toggleSidebar(): void {
    this.isSidebarOpen.update((value) => !value);
  }

  closeSidebar(): void {
    this.isSidebarOpen.set(false);
  }
}
