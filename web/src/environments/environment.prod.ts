import {IYngdiengEnvironment} from './environment';

// Deployed at yngdieng.org
export const YngdiengProdEnvironment: IYngdiengEnvironment = {
  appName: '榕典',
  isProduction: true,
  // TODO: use https
  serverUrl: 'http://api.yngdieng.org',
  structuredExplanations: {
    enabled: true,
    showDebugToggle: false,
  },
  showAudioPlayerButtons: false
}
