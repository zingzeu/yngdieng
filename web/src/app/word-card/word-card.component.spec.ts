import {ComponentFixture, TestBed} from '@angular/core/testing';

import {WordCardComponent} from './word-card.component';

describe('WordCardComponent', () => {
  let component: WordCardComponent;
  let fixture: ComponentFixture<WordCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [WordCardComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WordCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
