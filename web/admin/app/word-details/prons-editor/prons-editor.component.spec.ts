import {ComponentFixture, TestBed} from '@angular/core/testing';

import {PronsEditorComponent} from './prons-editor.component';

describe('PronsEditorComponent', () => {
  let component: PronsEditorComponent;
  let fixture: ComponentFixture<PronsEditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PronsEditorComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PronsEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
