import {IYngdiengEnvironment} from './environment';

// Staging environment. Deployed at https://yngdieng-dev.mindong.asia
export const YngdiengStagingEnvironment: IYngdiengEnvironment = {
  isProduction: false,
  serverUrl: 'https://yngdieng-api-staging.mindong.asia',
  structuredExplanations: {
    enabled: true,
    showDebugToggle: true,
  },
  showAudioPlayerButtons: true
}
