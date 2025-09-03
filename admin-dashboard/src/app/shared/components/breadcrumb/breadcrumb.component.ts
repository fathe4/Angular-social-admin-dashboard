// src/app/components/breadcrumb/breadcrumb.component.ts
import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { BreadcrumbService, BreadcrumbItem } from '../../services/breadcrumb.service';
import { Subscription } from 'rxjs';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-breadcrumb',
  standalone: true,
  imports: [CommonModule, BreadcrumbModule],
  template: `
    <p-breadcrumb [model]="items" [home]="home" styleClass="custom-breadcrumb"> </p-breadcrumb>
  `,
  styles: [
    `
      :host ::ng-deep .custom-breadcrumb {
        background: transparent;
        border: none;
        padding: 1rem 0;
      }

      :host ::ng-deep .custom-breadcrumb .p-breadcrumb-list {
        background: transparent;
      }

      :host ::ng-deep .custom-breadcrumb .p-menuitem-link {
        padding: 0.5rem 0.75rem;
        border-radius: 4px;
        transition: all 0.3s ease;
      }

      :host ::ng-deep .custom-breadcrumb .p-menuitem-link:hover {
        background-color: var(--primary-color, #007ad9);
        color: white;
      }

      :host ::ng-deep .custom-breadcrumb .p-breadcrumb-chevron {
        margin: 0 0.5rem;
        color: #6c757d;
      }
    `,
  ],
})
export class BreadcrumbComponent implements OnInit, OnDestroy {
  items: MenuItem[] = [];
  home: MenuItem = {};
  private subscription: Subscription = new Subscription();

  constructor(private breadcrumbService: BreadcrumbService) {}

  ngOnInit() {
    this.home = {
      icon: 'pi pi-home',
      routerLink: ['/'],
      title: 'Home',
    };

    this.subscription = this.breadcrumbService.breadcrumbs$.subscribe(
      (breadcrumbs: BreadcrumbItem[]) => {
        this.items = breadcrumbs;
      }
    );
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
