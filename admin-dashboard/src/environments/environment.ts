// This file is replaced by the Angular CLI build process.
// The content here is the default configuration that gets replaced:
// - `environment.development.ts` for development builds
// - `environment.staging.ts` for staging builds
// - `environment.prod.ts` for production builds
// See angular.json for file replacement configuration.

export const environment = {
  production: true,
  apiUrl: 'https://api.dambala.ca/api/v1',
  appName: 'Social Media Dashboard',
  version: '1.0.0',

  // Default configuration (production-like)
  debug: false,
  enableLogging: false,

  // Admin specific configurations
  tokenKey: 'admin_auth_token',
  refreshTokenKey: 'admin_refresh_token',
  sessionTimeout: 3600000, // 1 hour in milliseconds

  // Feature flags
  features: {
    enableTestUsers: false,
    showDevTools: false,
    enableMockData: false,
  },

  // API endpoints
  endpoints: {
    auth: {
      login: '/auth/login',
      logout: '/auth/logout',
      refresh: '/auth/refresh-token',
      me: '/auth/me',
    },
    users: {
      list: '/users',
      detail: '/users',
      create: '/users',
      update: '/users',
      delete: '/users',
    },
    stats: {
      me: '/stats/me',
      meQuick: '/stats/me/quick',
      user: '/stats/user',
      userQuick: '/stats/user',
    },
    transactions: {
      user: '/transactions/user',
    },
  },
};
