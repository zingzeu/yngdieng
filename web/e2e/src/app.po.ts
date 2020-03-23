import {browser, by, element, ElementFinder} from 'protractor';

export class AppPage {
  logo: ElementFinder = element(by.css('app-root .logo'));

  navigateTo() {
    return browser.get(browser.baseUrl) as Promise<any>;
  }

  getLogoTag() {
    return this.logo.getTagName() as Promise<string>;
  }

  getLogoSrc() {
    return this.logo.getAttribute('src') as Promise<string>;
  }
}
