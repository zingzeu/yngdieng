import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {SimplificationToolComponent} from './simplification-tool.component';

describe('SimplificationToolComponent', () => {
  let component: SimplificationToolComponent;
  let fixture: ComponentFixture<SimplificationToolComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({declarations: [SimplificationToolComponent]})
        .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SimplificationToolComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
