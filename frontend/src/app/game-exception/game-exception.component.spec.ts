import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GameExceptionComponent } from './game-exception.component';

describe('GameExceptionComponent', () => {
  let component: GameExceptionComponent;
  let fixture: ComponentFixture<GameExceptionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GameExceptionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GameExceptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
