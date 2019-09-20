import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ValidateGameComponent } from './validate-game.component';

describe('ValidateGameComponent', () => {
  let component: ValidateGameComponent;
  let fixture: ComponentFixture<ValidateGameComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ValidateGameComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ValidateGameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
