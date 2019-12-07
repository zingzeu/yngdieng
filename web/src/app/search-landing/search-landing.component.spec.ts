import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchLandingComponent } from './search-landing.component';

describe('SearchLandingComponent', () => {
  let component: SearchLandingComponent;
  let fixture: ComponentFixture<SearchLandingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SearchLandingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchLandingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
