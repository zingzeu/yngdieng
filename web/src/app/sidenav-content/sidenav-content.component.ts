import {Component, OnInit, Inject} from '@angular/core';
import {Router} from '@angular/router';
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
    private router: Router,
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

  onHomeClicked() {
    this.sideNavState.closeSideNav();
    this.router.navigate(['/']);
  }

  onSearchClicked() {
    this.sideNavState.closeSideNav();
    this.router.navigate(['/advancedSearch']);
  }

  onSearch2Clicked() {
    this.sideNavState.closeSideNav();
    this.router.navigate(['/search2/huziu']);
  }

  onSettingsClicked() {
    this.sideNavState.closeSideNav();
    this.router.navigate(['/settings']);
  }

  onHelpClicked() {
    this.sideNavState.closeSideNav();
    this.router.navigate(['/help']);
  }

  onFeedbackClicked() {
    this.sideNavState.closeSideNav();
    var win = window.open('https://support.qq.com/products/172407', '_blank');
    win.focus();
  }

  onAboutClicked() {
    this.sideNavState.closeSideNav();
    this.router.navigate(['/about']);
  }
}
