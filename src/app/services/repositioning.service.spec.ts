import { TestBed } from '@angular/core/testing';

import { RepositioningService } from './repositioning.service';

describe('RepositioningService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: RepositioningService = TestBed.get(RepositioningService);
    expect(service).toBeTruthy();
  });
});
