import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RepositioningSilhouetteComponent } from './repositioning-silhouette.component';

describe('RepositioningSilhouetteComponent', () => {
  let component: RepositioningSilhouetteComponent;
  let fixture: ComponentFixture<RepositioningSilhouetteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RepositioningSilhouetteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RepositioningSilhouetteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
