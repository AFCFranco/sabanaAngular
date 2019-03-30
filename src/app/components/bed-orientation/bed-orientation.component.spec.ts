import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BedOrientationComponent } from './bed-orientation.component';

describe('BedOrientationComponent', () => {
  let component: BedOrientationComponent;
  let fixture: ComponentFixture<BedOrientationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BedOrientationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BedOrientationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
