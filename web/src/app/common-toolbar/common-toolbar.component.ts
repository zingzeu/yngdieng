import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {Location} from '@angular/common';
import {SidenavStateService} from '../sidenav-state.service';
import {Subscription} from 'rxjs';

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
    private route: ActivatedRoute,
    private location: Location
  ) {}

  ngOnInit() {
    this.subscription = this.route.paramMap.subscribe(paramMap => {
      this.queryText = paramMap.get('query');
    });
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  onMenuClicked() {
    this.sideNav.openSideNav();
  }

  onPerformSearch(queryText) {
    const currentPath = this.location.path();
    if (currentPath.startsWith('/search2/')) {
      this.redirectTo(['/search2/', queryText]);
    } else {
      this.redirectTo(['/search/', queryText]);
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
