import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StartContentComponent } from './start-content.component';

describe('StartContentComponent', () => {
  let component: StartContentComponent;
  let fixture: ComponentFixture<StartContentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StartContentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StartContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
