import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {Router, ActivationEnd} from '@angular/router';
import {Location} from '@angular/common';
import {SidenavStateService} from '../sidenav-state.service';
import {Subscription} from 'rxjs';
import {filter} from 'rxjs/operators';
import {PerformSearchEvent} from './perform-search-event';

@Component({
  selector: 'app-common-toolbar',
  templateUrl: './common-toolbar.component.html',
  styleUrls: ['./common-toolbar.component.scss'],
})
export class CommonToolbarComponent implements OnInit, OnDestroy {
  queryText;
  @Input() mode: DisplayMode = DisplayMode.Default;

  subscription: Subscription;

  get isHomePage() {
    return this.mode == DisplayMode.HomePage;
  }

  constructor(
    private sideNav: SidenavStateService,
    private router: Router,
    private location: Location
  ) {}

  ngOnInit() {
    this.subscription = this.router.events
      .pipe(filter(event => event instanceof ActivationEnd))
      .subscribe((_event: ActivationEnd) => {
        const isHomePage = _event.snapshot.url.length == 0;
        this.mode = isHomePage ? DisplayMode.HomePage : DisplayMode.Default;
        if (!isHomePage) {
          const firstPathComponent = _event.snapshot.url[0].path;
          if (
            firstPathComponent == 'search' ||
            firstPathComponent == 'search-legacy'
          ) {
            this.queryText = _event.snapshot.paramMap.get('query');
          } else {
            this.queryText = '';
          }
        }
      });
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  onMenuClicked() {
    this.sideNav.openSideNav();
  }

  onPerformSearch(event: PerformSearchEvent) {
    const currentPath = this.location.path();
    if (currentPath.startsWith('/search-legacy/') || event.isBeikIn) {
      this.redirectTo(['/search-legacy/', event.queryText]);
    } else {
      this.redirectTo(['/search/', event.queryText]);
    }
  }

  private redirectTo(commands: any[]) {
    this.router
      .navigateByUrl('/', {skipLocationChange: true})
      .then(() => this.router.navigate(commands));
  }
}

export enum DisplayMode {
  Default = 0,
  HomePage = 1,
}
