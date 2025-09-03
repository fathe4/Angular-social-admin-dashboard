import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/',
    pathMatch: 'full',
  },
  {
    path: 'users',
    loadComponent: () =>
      import('./features/users/components/user-list/user-list').then((m) => m.UserList),
    data: { breadcrumb: 'Users' },
  },
  {
    path: 'tooltips',
    loadComponent: () =>
      import('./shared/components/coming-soon/coming-soon').then((m) => m.ComingSoon),
  },
  {
    path: 'roll-base-access',
    loadComponent: () =>
      import('./shared/components/coming-soon/coming-soon').then((m) => m.ComingSoon),
  },
  {
    path: 'treeview',
    loadComponent: () =>
      import('./shared/components/coming-soon/coming-soon').then((m) => m.ComingSoon),
  },
  {
    path: 'pricing',
    loadComponent: () =>
      import('./shared/components/coming-soon/coming-soon').then((m) => m.ComingSoon),
  },
  {
    path: 'faq',
    loadComponent: () =>
      import('./shared/components/coming-soon/coming-soon').then((m) => m.ComingSoon),
  },
  {
    path: 'landing',
    loadComponent: () =>
      import('./shared/components/coming-soon/coming-soon').then((m) => m.ComingSoon),
  },
  {
    path: 'widgets',
    children: [
      {
        path: 'charts',
        loadComponent: () =>
          import('./shared/components/coming-soon/coming-soon').then((m) => m.ComingSoon),
      },
      {
        path: 'tables',
        loadComponent: () =>
          import('./shared/components/coming-soon/coming-soon').then((m) => m.ComingSoon),
      },
    ],
  },
  {
    path: 'icons',
    loadComponent: () =>
      import('./shared/components/coming-soon/coming-soon').then((m) => m.ComingSoon),
  },
  {
    path: 'sample-page',
    loadComponent: () =>
      import('./shared/components/coming-soon/coming-soon').then((m) => m.ComingSoon),
  },
  {
    path: 'forms',
    children: [
      {
        path: 'basic',
        loadComponent: () =>
          import('./shared/components/coming-soon/coming-soon').then((m) => m.ComingSoon),
      },
      {
        path: 'advanced',
        loadComponent: () =>
          import('./shared/components/coming-soon/coming-soon').then((m) => m.ComingSoon),
      },
    ],
  },
  {
    path: 'posts',
    loadComponent: () =>
      import('./shared/components/coming-soon/coming-soon').then((m) => m.ComingSoon),
  },
  {
    path: 'analytics',
    loadComponent: () =>
      import('./shared/components/coming-soon/coming-soon').then((m) => m.ComingSoon),
  },
  {
    path: '**',
    redirectTo: '/tooltips',
  },
];
