import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GeoGameComponent } from './geo-game.component';

describe('GeoGameComponent', () => {
  let component: GeoGameComponent;
  let fixture: ComponentFixture<GeoGameComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GeoGameComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GeoGameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
