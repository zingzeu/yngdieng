import {Component, OnDestroy, OnInit, Inject} from '@angular/core';
import {NavigationEnd, NavigationStart, Router} from '@angular/router';
import {Subscription} from 'rxjs';
import {filter} from 'rxjs/operators';
import {Title} from '@angular/platform-browser';

import {SidenavStateService} from './sidenav-state.service';
import {YngdiengTitleService} from './yngdieng-title.service';
import {
  YNGDIENG_ENVIRONMENT,
  IYngdiengEnvironment,
} from '../environments/environment';

declare let gtag: Function;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy {
  title = '榕典';
  sideNavOpened: boolean;
  isBusy = false;

  sideNavStateSubscription: Subscription;
  navigationStartSubscription: Subscription;
  navigationEndSubscription: Subscription;

  constructor(
    @Inject(YNGDIENG_ENVIRONMENT) private environment: IYngdiengEnvironment,
    private sideNavState: SidenavStateService,
    private titleService: YngdiengTitleService,
    private router: Router
  ) {}

  get showEnvTag() {
    return !this.environment.isProduction;
  }

  get envName() {
    return this.environment.envName;
  }

  ngOnInit() {
    this.sideNavStateSubscription = this.sideNavState.sideNavOpened$.subscribe(
      opened => (this.sideNavOpened = opened)
    );
    // Resets html title on navigation
    this.navigationStartSubscription = this.router.events
      .pipe(filter(event => event instanceof NavigationStart))
      .subscribe(_event => {
        this.titleService.resetTitle();
        this.isBusy = true;
      });
    this.navigationEndSubscription = this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(_event => {
        this.isBusy = false;
        if (this.environment.isProduction) {
          // Log page navigation with Google Analytics
          gtag('event', 'page_view', {
            page_path: (_event as NavigationEnd).urlAfterRedirects,
          });
        }
      });
  }

  ngOnDestroy() {
    this.sideNavStateSubscription?.unsubscribe();
    this.navigationStartSubscription?.unsubscribe();
    this.navigationEndSubscription?.unsubscribe();
  }
}
