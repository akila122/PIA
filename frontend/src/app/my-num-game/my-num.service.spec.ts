import { TestBed } from '@angular/core/testing';

import { MyNumService } from './my-num.service';

describe('MyNumService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: MyNumService = TestBed.get(MyNumService);
    expect(service).toBeTruthy();
  });
});
