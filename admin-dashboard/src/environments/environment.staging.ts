export const environment = {
  production: false, // Not quite production, but production-like
  apiUrl: 'https://staging-api.dambala.ca/api/v1',
  appName: 'Social Media Dashboard (Staging)',
  version: '1.0.0-staging',
  
  // Staging specific configurations
  debug: false,
  enableLogging: true, // Keep logging for staging debugging
  
  // Admin specific configurations
  tokenKey: 'admin_auth_token',
  refreshTokenKey: 'admin_refresh_token',
  sessionTimeout: 3600000, // 1 hour in milliseconds
  
  // Feature flags for staging
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
