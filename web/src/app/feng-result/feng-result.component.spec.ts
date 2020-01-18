import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FengResultComponent } from './feng-result.component';

describe('FengResultComponent', () => {
  let component: FengResultComponent;
  let fixture: ComponentFixture<FengResultComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FengResultComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FengResultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
