/**
 * Environment configuration
 */
export interface EnvironmentConfig {
  production: boolean;
  apiUrl: string;
  appName: string;
  version: string;
}

export const environment: EnvironmentConfig = {
  production: false,
  apiUrl: 'http://localhost:3000/api',
  appName: 'Frontend MVP',
  version: '1.0.0',
};
