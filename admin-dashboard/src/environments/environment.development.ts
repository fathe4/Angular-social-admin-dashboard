export const environment = {
  production: false,
  apiUrl: 'http://localhost:5000/api/v1',
  appName: 'Social Media Dashboard (Development)',
  version: '1.0.0-dev',
  
  // Development specific configurations
  debug: true,
  enableLogging: true,
  
  // Admin specific configurations
  tokenKey: 'admin_auth_token_dev',
  refreshTokenKey: 'admin_refresh_token_dev',
  sessionTimeout: 7200000, // 2 hours in development for easier testing
  
  // Feature flags for development
  features: {
    enableTestUsers: true,
    showDevTools: true,
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
