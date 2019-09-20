import { TestBed } from '@angular/core/testing';

import { FivesService } from './fives.service';

describe('FivesService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: FivesService = TestBed.get(FivesService);
    expect(service).toBeTruthy();
  });
});
