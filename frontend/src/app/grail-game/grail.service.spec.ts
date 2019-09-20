import { TestBed } from '@angular/core/testing';

import { GrailService } from './grail.service';

describe('GrailService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: GrailService = TestBed.get(GrailService);
    expect(service).toBeTruthy();
  });
});
