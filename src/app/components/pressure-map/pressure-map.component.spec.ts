import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PressureMapComponent } from './pressure-map.component';

describe('PressureMapComponent', () => {
  let component: PressureMapComponent;
  let fixture: ComponentFixture<PressureMapComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PressureMapComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PressureMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
