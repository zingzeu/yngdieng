import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {HistoricalDetailsComponent} from './historical-details.component';

describe('HistoricalDetailsComponent', () => {
  let component: HistoricalDetailsComponent;
  let fixture: ComponentFixture<HistoricalDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [HistoricalDetailsComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HistoricalDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
