import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PressureMapIconComponent } from './pressure-map-icon.component';

describe('PressureMapIconComponent', () => {
  let component: PressureMapIconComponent;
  let fixture: ComponentFixture<PressureMapIconComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PressureMapIconComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PressureMapIconComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
