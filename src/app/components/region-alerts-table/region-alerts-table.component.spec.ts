import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RegionAlertsTableComponent } from './region-alerts-table.component';

describe('RegionAlertsTableComponent', () => {
  let component: RegionAlertsTableComponent;
  let fixture: ComponentFixture<RegionAlertsTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RegionAlertsTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegionAlertsTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
