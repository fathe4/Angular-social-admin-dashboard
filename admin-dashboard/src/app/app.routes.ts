import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/users',
    pathMatch: 'full'
  },
  {
    path: 'users',
    loadComponent: () => import('./features/users/components/user-list/user-list').then(m => m.UserList)
  },
  {
    path: 'posts',
    loadComponent: () => import('./shared/components/coming-soon/coming-soon').then(m => m.ComingSoon)
  },
  {
    path: 'analytics',
    loadComponent: () => import('./shared/components/coming-soon/coming-soon').then(m => m.ComingSoon)
  },
  {
    path: '**',
    redirectTo: '/users'
  }
];
