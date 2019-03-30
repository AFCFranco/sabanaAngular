import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SabanasDetailsComponent } from './sabanas-details.component';

describe('SabanasDetailsComponent', () => {
  let component: SabanasDetailsComponent;
  let fixture: ComponentFixture<SabanasDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SabanasDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SabanasDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
