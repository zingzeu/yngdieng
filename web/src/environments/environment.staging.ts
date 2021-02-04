import {IYngdiengEnvironment} from './environment';

// Staging environment. Deployed at https://staging.ydict.net
export const YngdiengStagingEnvironment: IYngdiengEnvironment = {
  appName: '榕典 (测试版)',
  slogan: '福州话电子词典',
  envName: '测试版',
  isProduction: false,
  serverUrl: 'https://api.ydict.net',
  structuredExplanations: {
    enabled: true,
    showDebugToggle: true,
  },
  showAudioPlayerButtons: true,
  showSettingsInMenu: true,
};
