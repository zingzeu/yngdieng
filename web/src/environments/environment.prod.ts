import {IYngdiengEnvironment} from './environment';

export const YngdiengProdEnvironment: IYngdiengEnvironment = {
  isProduction: true,
  // TODO: use https
  serverUrl: 'http://api.yngdieng.org',
  structuredExplanations: {
    enabled: true,
    showDebugToggle: false,
  }
}
