import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RepositioningComponent } from './repositioning.component';

describe('RepositioningComponent', () => {
  let component: RepositioningComponent;
  let fixture: ComponentFixture<RepositioningComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RepositioningComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RepositioningComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
