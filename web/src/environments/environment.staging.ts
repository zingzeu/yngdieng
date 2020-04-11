import {IYngdiengEnvironment} from './environment';

export const YngdiengStagingEnvironment: IYngdiengEnvironment = {
  isProduction: false,
  serverUrl: 'https://yngdieng-api-staging.mindong.asia',
  structuredExplanations: {
    enabled: true,
    showDebugToggle: true,
  }
}
