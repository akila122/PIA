import { TestBed } from '@angular/core/testing';

import { AnagramService } from './anagram.service';

describe('AnagramService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AnagramService = TestBed.get(AnagramService);
    expect(service).toBeTruthy();
  });
});
