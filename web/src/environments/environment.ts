import {InjectionToken} from '@angular/core'

export const YNGDIENG_ENVIRONMENT =
    new InjectionToken<IYngdiengEnvironment>('yngdieng-environment');

export interface IYngdiengEnvironment {
  isProduction: boolean, serverUrl: string,
      // 结构化条目解释。
      structuredExplanations: {
        enabled: boolean,
        // 显示一个 toggle，用于切换到非结构化解释.
        showDebugToggle: boolean
      },
}
