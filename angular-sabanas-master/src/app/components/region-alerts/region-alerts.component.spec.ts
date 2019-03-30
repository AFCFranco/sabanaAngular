import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RegionAlertsComponent } from './region-alerts.component';

describe('RegionAlertsComponent', () => {
  let component: RegionAlertsComponent;
  let fixture: ComponentFixture<RegionAlertsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RegionAlertsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegionAlertsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
