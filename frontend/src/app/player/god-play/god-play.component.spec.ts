import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GodPlayComponent } from './god-play.component';

describe('GodPlayComponent', () => {
  let component: GodPlayComponent;
  let fixture: ComponentFixture<GodPlayComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GodPlayComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GodPlayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
