import {InjectionToken} from '@angular/core'

export const YNGDIENG_ENVIRONMENT =
    new InjectionToken<IYngdiengEnvironment>('yngdieng-environment');

export interface IYngdiengEnvironment {
  isProduction: boolean, serverUrl: string,
}
