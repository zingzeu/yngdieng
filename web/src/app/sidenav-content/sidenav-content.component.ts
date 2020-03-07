import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {SidenavStateService} from '../sidenav-state.service';

@Component({
  selector: 'app-sidenav-content',
  templateUrl: './sidenav-content.component.html',
  styleUrls: ['./sidenav-content.component.scss']
})
export class SidenavContentComponent implements OnInit {
  constructor(private router: Router, private sideNavState: SidenavStateService) {}

  ngOnInit() {}

  onHomeClicked() {
    this.sideNavState.closeSideNav();
    this.router.navigate(['/']);
  }

  onSearchClicked() {
    this.sideNavState.closeSideNav();
    this.router.navigate(['/advancedSearch']);
  }

  onHelpClicked() {
    this.sideNavState.closeSideNav();
    this.router.navigate(['/help']);
  }
}
