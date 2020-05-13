import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {YngpingHelpDialogComponent} from './yngping-help-dialog.component';

describe('YngpingHelpDialogComponent', () => {
  let component: YngpingHelpDialogComponent;
  let fixture: ComponentFixture<YngpingHelpDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({declarations: [YngpingHelpDialogComponent]})
        .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(YngpingHelpDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
