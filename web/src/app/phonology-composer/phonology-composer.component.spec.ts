import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {PhonologyComposerComponent} from './phonology-composer.component';

describe('PhonologyComposerComponent', () => {
  let component: PhonologyComposerComponent;
  let fixture: ComponentFixture<PhonologyComposerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({declarations: [PhonologyComposerComponent]})
        .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PhonologyComposerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
