import {IYngdiengEnvironment} from './environment';

// Local development environment
export const YngdiengDevEnvironment: IYngdiengEnvironment = {
  isProduction: false,
  serverUrl: 'https://yngdieng-api-staging.mindong.asia',
  // serverUrl: 'http://localhost:8080',
  structuredExplanations: {
    enabled: true,
    showDebugToggle: true,
  },
  showAudioPlayerButtons: true
}
