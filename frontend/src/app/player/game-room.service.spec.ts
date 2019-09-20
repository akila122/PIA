import { TestBed } from '@angular/core/testing';

import { GameRoomService } from './game-room.service';

describe('GameRoomService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: GameRoomService = TestBed.get(GameRoomService);
    expect(service).toBeTruthy();
  });
});
