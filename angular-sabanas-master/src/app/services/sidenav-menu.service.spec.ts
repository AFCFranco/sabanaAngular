import { TestBed } from '@angular/core/testing';

import { SidenavMenuService } from './sidenav-menu.service';

describe('SidenavMenuService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SidenavMenuService = TestBed.get(SidenavMenuService);
    expect(service).toBeTruthy();
  });
});
