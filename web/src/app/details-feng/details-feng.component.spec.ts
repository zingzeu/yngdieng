import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {DetailsFengComponent} from './details-feng.component';

describe('DetailsFengComponent', () => {
  let component: DetailsFengComponent;
  let fixture: ComponentFixture<DetailsFengComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({declarations: [DetailsFengComponent]}).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailsFengComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
