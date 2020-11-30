import {Component, Input, OnInit} from '@angular/core';
import {SidenavStateService} from '../sidenav-state.service';

@Component({
  selector: 'app-common-toolbar',
  templateUrl: './common-toolbar.component.html',
  styleUrls: ['./common-toolbar.component.scss'],
})
export class CommonToolbarComponent implements OnInit {
  @Input() queryText;
  @Input() mode: DisplayMode = DisplayMode.Default;

  get isHomePage() {
    return this.mode == DisplayMode.HomePage;
  }

  constructor(private sideNav: SidenavStateService) {}

  ngOnInit() {}

  onMenuClicked() {
    this.sideNav.openSideNav();
  }
}

export enum DisplayMode {
  Default = 0,
  HomePage = 1,
}
