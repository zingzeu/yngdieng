import {Injectable} from '@angular/core';
import {Observable, Subject} from 'rxjs';

@Injectable({providedIn: 'root'})
export class SidenavStateService {
  private _sideNavOpened = true;
  private sideNavOpened = new Subject<boolean>();

  sideNavOpened$: Observable<boolean> = this.sideNavOpened.asObservable();

  constructor() {
    this.sideNavOpened.next(this._sideNavOpened);
  }

  toggleSideNav() {
    this._sideNavOpened = !this._sideNavOpened;
    this.sideNavOpened.next(this._sideNavOpened);
  }

  closeSideNav() {
    this._sideNavOpened = false;
    this.sideNavOpened.next(this._sideNavOpened);
  }

  openSideNav() {
    this._sideNavOpened = true;
    this.sideNavOpened.next(this._sideNavOpened);
  }
}
