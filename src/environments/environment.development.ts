/**
 * Environment configuration
 */
export interface EnvironmentConfig {
  production: boolean;
  apiUrl: string;
  appName: string;
  version: string;
  useMockApi: boolean;
}

export const environment: EnvironmentConfig = {
  production: false,
  apiUrl: 'http://localhost:3000',
  appName: 'Frontend Notes',
  version: '1.0.0',
  useMockApi: true,
};
