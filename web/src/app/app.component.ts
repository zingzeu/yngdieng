import {Component, OnDestroy, OnInit, Inject} from '@angular/core';
import {NavigationStart, Router} from '@angular/router';
import {Subscription} from 'rxjs';
import {filter} from 'rxjs/operators';

import {SidenavStateService} from './sidenav-state.service';
import {YngdiengTitleService} from './yngdieng-title.service';
import {
  YNGDIENG_ENVIRONMENT,
  IYngdiengEnvironment,
} from '../environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy {
  title = '榕典';
  sideNavOpened: boolean;

  sideNavStateSubscription: Subscription;
  navigateStartSubscription: Subscription;

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
    this.navigateStartSubscription = this.router.events
      .pipe(filter(event => event instanceof NavigationStart))
      .subscribe(_event => this.titleService.resetTitle());
  }

  ngOnDestroy() {
    this.sideNavStateSubscription?.unsubscribe();
    this.navigateStartSubscription?.unsubscribe();
  }
}
