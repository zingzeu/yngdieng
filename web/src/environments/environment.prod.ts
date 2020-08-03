import {IYngdiengEnvironment} from './environment';

// Deployed at yngdieng.org
export const YngdiengProdEnvironment: IYngdiengEnvironment = {
  isProduction: true,
  // TODO: use https
  serverUrl: 'http://api.yngdieng.org',
  structuredExplanations: {
    enabled: true,
    showDebugToggle: false,
  },
  showAudioPlayerButtons: false
}
