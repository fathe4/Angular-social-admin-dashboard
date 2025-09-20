export const environment = {
  production: true,
  apiUrl: 'https://your-api-domain.com/api/v1', // Replace with your production API URL
  appName: 'Social Media Dashboard',
  version: '1.0.0',
  // Admin specific configurations
  tokenKey: 'admin_auth_token',
  refreshTokenKey: 'admin_refresh_token',
  sessionTimeout: 3600000, // 1 hour in milliseconds

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
  },
};
