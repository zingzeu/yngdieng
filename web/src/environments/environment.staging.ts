import {IYngdiengEnvironment} from './environment';

// Staging environment. Deployed at https://yngdieng-dev.mindong.asia
export const YngdiengStagingEnvironment: IYngdiengEnvironment = {
  appName: '榕典 (Staging)',
  isProduction: false,
  serverUrl: 'https://yngdieng-api-staging.mindong.asia',
  structuredExplanations: {
    enabled: true,
    showDebugToggle: true,
  }
}
