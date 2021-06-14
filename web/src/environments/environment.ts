import {InjectionToken} from '@angular/core';

export const YNGDIENG_ENVIRONMENT = new InjectionToken<IYngdiengEnvironment>(
  'yngdieng-environment'
);

export interface IYngdiengEnvironment {
  // Name of the app, used in the html title.
  appName: string;
  slogan: string;
  // Name of the environment. Shown as a tag on the UI, for non-production environments.
  envName?: string;
  // Whether the environment is production.
  isProduction: boolean;
  // API Server URL. No trailing slash.
  serverUrl: string;
  // 结构化条目解释。
  structuredExplanations: {
    enabled: boolean;
    // 显示一个 toggle，用于切换到非结构化解释.
    showDebugToggle: boolean;
  };
  // TTS Audio player buttons
  showAudioPlayerButtons: boolean;
}
