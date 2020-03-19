import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from 'rxjs';

import {SidenavStateService} from './sidenav-state.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  title = '榕典';
  sideNavOpened: boolean;

  subscription: Subscription;

  constructor(private sideNavState: SidenavStateService) {}

  ngOnInit() {
    this.subscription =
        this.sideNavState.sideNavOpened$.subscribe(opened => this.sideNavOpened = opened)
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
