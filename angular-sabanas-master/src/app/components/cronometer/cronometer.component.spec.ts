import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CronometerComponent } from './cronometer.component';

describe('CronometerComponent', () => {
  let component: CronometerComponent;
  let fixture: ComponentFixture<CronometerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CronometerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CronometerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
