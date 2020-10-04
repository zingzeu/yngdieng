import {IYngdiengEnvironment} from './environment';

// Deployed at www.ydict.net
export const YngdiengProdEnvironment: IYngdiengEnvironment = {
  appName: '榕典',
  isProduction: true,
  serverUrl: 'https://api.ydict.net',
  structuredExplanations: {
    enabled: true,
    showDebugToggle: false,
  },
  showAudioPlayerButtons: true,
  showSearchV2InMenu: false,
  showSettingsInMenu: false,
};
