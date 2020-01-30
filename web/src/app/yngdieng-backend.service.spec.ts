import { TestBed } from '@angular/core/testing';

import { YngdiengBackendService } from './yngdieng-backend.service';

describe('YngdiengBackendService', () => {
  let service: YngdiengBackendService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(YngdiengBackendService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
