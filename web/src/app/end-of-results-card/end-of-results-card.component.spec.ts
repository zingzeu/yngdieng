import {ComponentFixture, TestBed} from '@angular/core/testing';

import {EndOfResultsCardComponent} from './end-of-results-card.component';

describe('EndOfResultsCardComponent', () => {
  let component: EndOfResultsCardComponent;
  let fixture: ComponentFixture<EndOfResultsCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EndOfResultsCardComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EndOfResultsCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
