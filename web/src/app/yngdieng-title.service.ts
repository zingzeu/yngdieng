import {Inject, Injectable} from '@angular/core';
import {Title} from '@angular/platform-browser';

import {
  IYngdiengEnvironment,
  YNGDIENG_ENVIRONMENT,
} from '../environments/environment';

/**
 * Our wrapper of the angular {@code Title} service.
 */
@Injectable({providedIn: 'root'})
export class YngdiengTitleService {
  private readonly appName: string;
  constructor(
    @Inject(YNGDIENG_ENVIRONMENT) environment: IYngdiengEnvironment,
    private titleService: Title
  ) {
    this.appName = environment.appName;
  }

  resetTitle() {
    this.titleService.setTitle(this.appName);
  }

  setTitleForSearchResultPage(query: string) {
    this.titleService.setTitle(this.getSearchResultPageTitle(query));
  }

  setTitleForDetailsPage(word: string) {
    this.titleService.setTitle(this.getDetailsPageTitle(word));
  }

  private getSearchResultPageTitle(query: string) {
    let trimmed = query.trim();
    return (trimmed == '' ? '搜索' : trimmed) + ' | ' + this.appName;
  }

  private getDetailsPageTitle(word: string) {
    let trimmed = word.trim();
    return trimmed == '' ? this.appName : trimmed + ' | ' + this.appName;
  }
}
