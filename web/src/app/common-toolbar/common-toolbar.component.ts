import {Component, OnInit} from '@angular/core';
import {SidenavStateService} from '../sidenav-state.service';

@Component({
  selector: 'app-common-toolbar',
  templateUrl: './common-toolbar.component.html',
  styleUrls: ['./common-toolbar.component.scss']
})
export class CommonToolbarComponent implements OnInit {
  constructor(private sideNav: SidenavStateService) {}

  ngOnInit() {}

  onMenuClicked() {
    this.sideNav.openSideNav();
  }
}
