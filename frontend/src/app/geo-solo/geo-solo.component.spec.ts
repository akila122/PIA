import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GeoSoloComponent } from './geo-solo.component';

describe('GeoSoloComponent', () => {
  let component: GeoSoloComponent;
  let fixture: ComponentFixture<GeoSoloComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GeoSoloComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GeoSoloComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
