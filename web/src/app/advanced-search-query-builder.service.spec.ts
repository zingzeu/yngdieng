import { TestBed } from '@angular/core/testing';

import { AdvancedSearchQueryBuilderService } from './advanced-search-query-builder.service';

describe('AdvancedSearchQueryBuilderService', () => {
  let service: AdvancedSearchQueryBuilderService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AdvancedSearchQueryBuilderService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
