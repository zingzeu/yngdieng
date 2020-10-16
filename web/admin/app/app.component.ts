import {Component, OnInit} from '@angular/core';
import {SidenavStateService} from './sidenav-state.service';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  sideNavOpened = true;
  sideNavStateSubscription: Subscription;

  constructor(private sideNavState: SidenavStateService) {}

  ngOnInit() {
    this.sideNavStateSubscription = this.sideNavState.sideNavOpened$.subscribe(
      opened => (this.sideNavOpened = opened)
    );
  }

  ngOnDestroy() {
    this.sideNavStateSubscription?.unsubscribe();
  }

  onMenuClicked() {
    this.sideNavState.toggleSideNav();
  }
}
