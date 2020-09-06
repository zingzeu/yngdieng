import {ComponentFixture, TestBed} from '@angular/core/testing';

import {GenericMessageCardComponent} from './generic-message-card.component';

describe('GenericMessageCardComponent', () => {
  let component: GenericMessageCardComponent;
  let fixture: ComponentFixture<GenericMessageCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GenericMessageCardComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GenericMessageCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
