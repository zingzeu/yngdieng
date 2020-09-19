import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {FengExplanationComponent} from './feng-explanation.component';

describe('FengExplanationComponent', () => {
  let component: FengExplanationComponent;
  let fixture: ComponentFixture<FengExplanationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [FengExplanationComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FengExplanationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
