import {IYngdiengEnvironment} from './environment';

// Staging environment. Deployed at https://staging.ydict.net
export const YngdiengStagingEnvironment: IYngdiengEnvironment = {
  appName: '榕典 (Staging)',
  isProduction: false,
  serverUrl: 'https://api.ydict.net',
  structuredExplanations: {
    enabled: true,
    showDebugToggle: true,
  },
  showAudioPlayerButtons: true,
};
