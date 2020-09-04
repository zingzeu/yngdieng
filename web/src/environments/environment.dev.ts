import {IYngdiengEnvironment} from './environment';

// Local development environment
export const YngdiengDevEnvironment: IYngdiengEnvironment = {
  appName: '榕典 (dev)',
  isProduction: false,
  // serverUrl: 'https://yngdieng-api-staging.mindong.asia',
  serverUrl: 'http://localhost:5000',
  //serverUrl: 'https://localhost:5001',
  structuredExplanations: {
    enabled: true,
    showDebugToggle: true,
  },
  showAudioPlayerButtons: true,
};
