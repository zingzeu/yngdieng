import {IYngdiengEnvironment} from './environment';

// Deployed at yngdieng.org
export const YngdiengProdEnvironment: IYngdiengEnvironment = {
  appName: '榕典',
  isProduction: true,
  serverUrl: 'https://api.ydict.net',
  structuredExplanations: {
    enabled: true,
    showDebugToggle: false,
  },
  showAudioPlayerButtons: false
}
