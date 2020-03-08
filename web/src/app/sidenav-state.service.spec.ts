import {TestBed} from '@angular/core/testing';

import {SidenavStateService} from './sidenav-state.service';

describe('SidenavStateService', () => {
  let service: SidenavStateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SidenavStateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
