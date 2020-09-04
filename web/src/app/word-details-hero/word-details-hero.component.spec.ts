import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {WordDetailsHeroComponent} from './word-details-hero.component';

describe('WordDetailsHeroComponent', () => {
  let component: WordDetailsHeroComponent;
  let fixture: ComponentFixture<WordDetailsHeroComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({declarations: [WordDetailsHeroComponent]}).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WordDetailsHeroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
