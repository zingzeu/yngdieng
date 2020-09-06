import {ComponentFixture, TestBed} from '@angular/core/testing';

import {SearchV2ResultComponent} from './search-v2-result.component';

describe('SearchV2ResultComponent', () => {
  let component: SearchV2ResultComponent;
  let fixture: ComponentFixture<SearchV2ResultComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SearchV2ResultComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchV2ResultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
