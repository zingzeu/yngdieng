import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {AudioAlertDialogComponent} from './audio-alert-dialog.component';

describe('AudioAlertDialogComponent', () => {
  let component: AudioAlertDialogComponent;
  let fixture: ComponentFixture<AudioAlertDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AudioAlertDialogComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AudioAlertDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
