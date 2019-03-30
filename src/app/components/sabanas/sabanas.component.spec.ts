import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SabanasComponent } from './sabanas.component';

describe('SabanasComponent', () => {
  let component: SabanasComponent;
  let fixture: ComponentFixture<SabanasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SabanasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SabanasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
