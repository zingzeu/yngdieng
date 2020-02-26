import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {PhonologyQueryRendererComponent} from './phonology-query-renderer.component';

describe('PhonologyQueryRendererComponent', () => {
  let component: PhonologyQueryRendererComponent;
  let fixture: ComponentFixture<PhonologyQueryRendererComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({declarations: [PhonologyQueryRendererComponent]})
        .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PhonologyQueryRendererComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
