import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ResultsGameComponent } from './results-game.component';

describe('ResultsGameComponent', () => {
  let component: ResultsGameComponent;
  let fixture: ComponentFixture<ResultsGameComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ResultsGameComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResultsGameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
