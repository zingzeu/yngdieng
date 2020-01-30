import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailsMonoHanziComponent } from './details-mono-hanzi.component';

describe('DetailsMonoHanziComponent', () => {
  let component: DetailsMonoHanziComponent;
  let fixture: ComponentFixture<DetailsMonoHanziComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DetailsMonoHanziComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailsMonoHanziComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
