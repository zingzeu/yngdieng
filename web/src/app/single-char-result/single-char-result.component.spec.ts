import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SingleCharResultComponent } from './single-char-result.component';

describe('SingleCharResultComponent', () => {
  let component: SingleCharResultComponent;
  let fixture: ComponentFixture<SingleCharResultComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SingleCharResultComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SingleCharResultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
