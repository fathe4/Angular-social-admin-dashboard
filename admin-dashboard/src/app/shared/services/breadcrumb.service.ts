import { Injectable } from '@angular/core';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { filter } from 'rxjs/operators';
import { MenuItem } from 'primeng/api';

export interface BreadcrumbItem extends MenuItem {
  label: string;
  routerLink?: string[];
}

@Injectable({
  providedIn: 'root',
})
export class BreadcrumbService {
  private breadcrumbsSubject = new BehaviorSubject<BreadcrumbItem[]>([]);
  public breadcrumbs$ = this.breadcrumbsSubject.asObservable();

  constructor(private router: Router, private activatedRoute: ActivatedRoute) {
    this.router.events.pipe(filter((event) => event instanceof NavigationEnd)).subscribe(() => {
      const breadcrumbs = this.createBreadcrumbs(this.activatedRoute.root);
      this.breadcrumbsSubject.next(breadcrumbs);
    });
  }

  private createBreadcrumbs(
    route: ActivatedRoute,
    url: string = '',
    breadcrumbs: BreadcrumbItem[] = []
  ): BreadcrumbItem[] {
    const children: ActivatedRoute[] = route.children;

    if (children.length === 0) {
      return breadcrumbs;
    }

    for (const child of children) {
      const routeURL: string = child.snapshot.url.map((segment) => segment.path).join('/');
      if (routeURL !== '') {
        url += `/${routeURL}`;
      }

      const breadcrumbLabel = child.snapshot.data['breadcrumb'];
      if (breadcrumbLabel) {
        breadcrumbs.push({
          label: breadcrumbLabel,
          routerLink: [url],
          icon: child.snapshot.data['breadcrumbIcon'] || null,
        });
      }

      return this.createBreadcrumbs(child, url, breadcrumbs);
    }

    return breadcrumbs;
  }

  // Method to manually set breadcrumbs if needed
  setBreadcrumbs(breadcrumbs: BreadcrumbItem[]) {
    this.breadcrumbsSubject.next(breadcrumbs);
  }

  // Method to add a breadcrumb dynamically
  addBreadcrumb(breadcrumb: BreadcrumbItem) {
    const currentBreadcrumbs = this.breadcrumbsSubject.value;
    this.breadcrumbsSubject.next([...currentBreadcrumbs, breadcrumb]);
  }
}
