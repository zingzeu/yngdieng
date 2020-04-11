import {IYngdiengEnvironment} from './environment';

export const YngdiengDevEnvironment: IYngdiengEnvironment = {
  isProduction: false,
  serverUrl: 'https://yngdieng-api-staging.mindong.asia:80',
  // serverUrl: 'http://localhost:8080',
  structuredExplanations: {
    enabled: true,
    showDebugToggle: true,
  }
}
