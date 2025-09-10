import { Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';
import { UserRole } from './core/models/auth.model';

export const routes: Routes = [
  // Authentication routes (public)
  {
    path: 'auth',
    children: [
      {
        path: 'login',
        loadComponent: () =>
          import('./features/auth/components/login/login.component').then((m) => m.LoginComponent),
      },
      {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full',
      },
    ],
  },

  // Unauthorized page
  {
    path: 'unauthorized',
    loadComponent: () =>
      import('./features/auth/components/unauthorized/unauthorized.component').then(
        (m) => m.UnauthorizedComponent
      ),
  },

  // Protected dashboard routes
  {
    path: 'dashboard',
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        redirectTo: 'users',
        pathMatch: 'full',
      },
      {
        path: 'users',
        loadComponent: () =>
          import('./features/users/components/user-list/user-list').then((m) => m.UserList),
        data: { breadcrumb: 'Users' },
      },
      {
        path: 'transactions',
        loadComponent: () =>
          import('./features/users/components/transactions-page/transactions-page.component').then(
            (m) => m.TransactionsPageComponent
          ),
        data: { breadcrumb: 'Transactions' },
      },
      {
        path: 'boosted-posts',
        loadComponent: () =>
          import(
            './features/users/components/boosted-posts-page/boosted-posts-page.component'
          ).then((m) => m.BoostedPostsPageComponent),
        data: { breadcrumb: 'Boosted Posts' },
      },
      {
        path: 'users/:id',
        loadComponent: () =>
          import('./features/users/components/user-view/user-view.component').then(
            (m) => m.UserViewComponent
          ),
        children: [
          // ADD THIS NEW CHILD ROUTE
          // {
          //   path: '', // The empty path matches the parent route, acting as a default child
          //   redirectTo: 'dashboard',
          //   pathMatch: 'full',
          // },
          {
            path: 'subscriptions',
            loadComponent: () =>
              import(
                './features/users/components/user-subscriptions/user-subscription.component'
              ).then((m) => m.UserSubscriptions),
            data: { breadcrumb: 'Subscriptions' },
          },
          {
            path: 'transactions',
            loadComponent: () =>
              import(
                './features/users/components/user-transactions/user-transactions.component'
              ).then((m) => m.UserTransactionsComponent),
            data: { breadcrumb: 'Transactions' },
          },
          {
            path: 'boost',
            loadComponent: () =>
              import('./features/users/components/user-post-boost/user-post-boost.component').then(
                (m) => m.PostBoostList
              ),
            data: { breadcrumb: 'Posts Boost' },
          },
        ],
        data: { breadcrumb: 'User Details' },
      },
      {
        path: 'posts',
        loadComponent: () =>
          import('./shared/components/coming-soon/coming-soon').then((m) => m.ComingSoon),
        data: { breadcrumb: 'Posts' },
      },
      {
        path: 'analytics',
        loadComponent: () =>
          import('./shared/components/coming-soon/coming-soon').then((m) => m.ComingSoon),
        data: { breadcrumb: 'Analytics' },
      },
      {
        path: 'settings',
        children: [
          {
            path: 'general',
            loadComponent: () =>
              import('./shared/components/coming-soon/coming-soon').then((m) => m.ComingSoon),
            data: { breadcrumb: 'General Settings' },
          },
          {
            path: 'roles',
            loadComponent: () =>
              import('./shared/components/coming-soon/coming-soon').then((m) => m.ComingSoon),
            data: {
              breadcrumb: 'Role Management',
              roles: [UserRole.SUPER_ADMIN], // Only super admin can access
            },
          },
        ],
      },
    ],
  },

  // Root redirect to dashboard
  {
    path: '',
    redirectTo: '/dashboard',
    pathMatch: 'full',
  },
  // Catch-all route - redirect to dashboard
  {
    path: '**',
    redirectTo: '/dashboard',
  },
];
