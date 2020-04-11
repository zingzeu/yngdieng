import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DebugInfoComponent } from './debug-info.component';

describe('DebugInfoComponent', () => {
  let component: DebugInfoComponent;
  let fixture: ComponentFixture<DebugInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DebugInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DebugInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
