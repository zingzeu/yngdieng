import {IYngdiengEnvironment} from './environment';

export const YngdiengProdEnvironment: IYngdiengEnvironment = {
  isProduction: true,
  serverUrl: 'https://yngdieng-api-staging.mindong.asia',
  structuredExplanations: {
    enabled: true,
    showDebugToggle: true,
  }
}
