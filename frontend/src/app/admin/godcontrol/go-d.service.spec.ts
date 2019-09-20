import { TestBed } from '@angular/core/testing';

import { GoDService } from './go-d.service';

describe('GoDService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: GoDService = TestBed.get(GoDService);
    expect(service).toBeTruthy();
  });
});
