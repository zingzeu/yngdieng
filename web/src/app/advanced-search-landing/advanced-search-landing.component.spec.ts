import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdvancedSearchLandingComponent } from './advanced-search-landing.component';

describe('AdvancedSearchLandingComponent', () => {
  let component: AdvancedSearchLandingComponent;
  let fixture: ComponentFixture<AdvancedSearchLandingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdvancedSearchLandingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdvancedSearchLandingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
