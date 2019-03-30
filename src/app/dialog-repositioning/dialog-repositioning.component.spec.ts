import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogRepositioningComponent } from './dialog-repositioning.component';

describe('DialogRepositioningComponent', () => {
  let component: DialogRepositioningComponent;
  let fixture: ComponentFixture<DialogRepositioningComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogRepositioningComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogRepositioningComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
