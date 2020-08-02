import {IYngdiengEnvironment} from './environment';

export const YngdiengProdEnvironment: IYngdiengEnvironment = {
  appName: '榕典',
  isProduction: true,
  // TODO: use https
  serverUrl: 'http://api.yngdieng.org',
  structuredExplanations: {
    enabled: true,
    showDebugToggle: false,
  }
}
