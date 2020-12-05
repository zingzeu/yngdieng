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
  private readonly slogan: string;
  constructor(
    @Inject(YNGDIENG_ENVIRONMENT) environment: IYngdiengEnvironment,
    private titleService: Title
  ) {
    this.appName = environment.appName;
    this.slogan = environment.slogan;
  }

  resetTitle() {
    this.titleService.setTitle(this.appName + ' | ' + this.slogan);
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
