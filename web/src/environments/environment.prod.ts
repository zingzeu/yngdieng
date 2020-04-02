import {IYngdiengEnvironment} from './environment';

export const YngdiengProdEnvironment: IYngdiengEnvironment = {
  isProduction: true,
  serverUrl: 'http://yngdieng-api-staging.mindong.asia:80',
  structuredExplanations: {
    enabled: true,
    showDebugToggle: true,
  }
}
