import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MonitoringCardComponent } from './monitoring-card.component';

describe('MonitoringCardComponent', () => {
  let component: MonitoringCardComponent;
  let fixture: ComponentFixture<MonitoringCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MonitoringCardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MonitoringCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
