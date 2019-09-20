import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FivesGameComponent } from './fives-game.component';

describe('FivesGameComponent', () => {
  let component: FivesGameComponent;
  let fixture: ComponentFixture<FivesGameComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FivesGameComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FivesGameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
