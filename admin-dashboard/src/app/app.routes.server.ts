import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  // Static routes that can be prerendered
  {
    path: '',
    renderMode: RenderMode.Prerender,
  },
  {
    path: 'auth/login',
    renderMode: RenderMode.Prerender,
  },
  {
    path: 'unauthorized',
    renderMode: RenderMode.Prerender,
  },
  {
    path: 'dashboard',
    renderMode: RenderMode.Prerender,
  },
  {
    path: 'dashboard/users',
    renderMode: RenderMode.Prerender,
  },
  {
    path: 'dashboard/transactions',
    renderMode: RenderMode.Prerender,
  },
  {
    path: 'dashboard/boosted-posts',
    renderMode: RenderMode.Prerender,
  },
  {
    path: 'dashboard/posts',
    renderMode: RenderMode.Prerender,
  },
  {
    path: 'dashboard/analytics',
    renderMode: RenderMode.Prerender,
  },
  {
    path: 'dashboard/settings/general',
    renderMode: RenderMode.Prerender,
  },
  {
    path: 'dashboard/settings/roles',
    renderMode: RenderMode.Prerender,
  },
  // Dynamic routes that should use server-side rendering instead of prerendering
  {
    path: 'dashboard/users/:id',
    renderMode: RenderMode.Server,
  },
  {
    path: 'dashboard/users/:id/',
    renderMode: RenderMode.Server,
  },
  {
    path: 'dashboard/users/:id/subscriptions',
    renderMode: RenderMode.Server,
  },
  {
    path: 'dashboard/users/:id/boost',
    renderMode: RenderMode.Server,
  },
  {
    path: 'dashboard/users/:id/dashboard',
    renderMode: RenderMode.Server,
  },
  {
    path: 'dashboard/users/:id/transactions',
    renderMode: RenderMode.Server,
  },
  // Catch-all for any other routes - use server rendering
  {
    path: '**',
    renderMode: RenderMode.Server,
  },
];
