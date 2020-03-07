import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {CommonToolbarComponent} from './common-toolbar.component';

describe('CommonToolbarComponent', () => {
  let component: CommonToolbarComponent;
  let fixture: ComponentFixture<CommonToolbarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({declarations: [CommonToolbarComponent]}).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CommonToolbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
