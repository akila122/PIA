import { TestBed } from '@angular/core/testing';

import { GameExceptionService } from './game-exception.service';

describe('GameExceptionService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: GameExceptionService = TestBed.get(GameExceptionService);
    expect(service).toBeTruthy();
  });
});
