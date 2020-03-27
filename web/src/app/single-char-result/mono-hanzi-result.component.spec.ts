import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {MonoHanziResultComponent} from './mono-hanzi-result.component';

describe('MonoHanziResultComponent', () => {
  let component: MonoHanziResultComponent;
  let fixture: ComponentFixture<MonoHanziResultComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({declarations: [MonoHanziResultComponent]}).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MonoHanziResultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
