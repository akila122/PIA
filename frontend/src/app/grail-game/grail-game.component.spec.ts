import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GrailGameComponent } from './grail-game.component';

describe('GrailGameComponent', () => {
  let component: GrailGameComponent;
  let fixture: ComponentFixture<GrailGameComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GrailGameComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GrailGameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
