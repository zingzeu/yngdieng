import {Component, OnInit, Inject} from '@angular/core';
import {SidenavStateService} from '../sidenav-state.service';
import {
  YNGDIENG_ENVIRONMENT,
  IYngdiengEnvironment,
} from '../../environments/environment';

@Component({
  selector: 'app-sidenav-content',
  templateUrl: './sidenav-content.component.html',
  styleUrls: ['./sidenav-content.component.scss'],
})
export class SidenavContentComponent implements OnInit {
  constructor(
    private sideNavState: SidenavStateService,
    @Inject(YNGDIENG_ENVIRONMENT) private environment: IYngdiengEnvironment
  ) {}

  ngOnInit() {}

  get showSearchV2() {
    return this.environment.showSearchV2InMenu;
  }

  get showSettings() {
    return this.environment.showSettingsInMenu;
  }

  onFeedbackClicked() {
    this.sideNavState.closeSideNav();
    var win = window.open('https://support.qq.com/products/172407', '_blank');
    win.focus();
  }
}
