import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GodRankComponent } from './god-rank.component';

describe('GodRankComponent', () => {
  let component: GodRankComponent;
  let fixture: ComponentFixture<GodRankComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GodRankComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GodRankComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
