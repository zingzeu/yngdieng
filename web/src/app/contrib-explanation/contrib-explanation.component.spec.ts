import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {ContribExplanationComponent} from './contrib-explanation.component';

describe('ContribExplanationComponent', () => {
  let component: ContribExplanationComponent;
  let fixture: ComponentFixture<ContribExplanationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ContribExplanationComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContribExplanationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
