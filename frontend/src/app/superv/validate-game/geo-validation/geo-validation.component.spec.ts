import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GeoValidationComponent } from './geo-validation.component';

describe('GeoValidationComponent', () => {
  let component: GeoValidationComponent;
  let fixture: ComponentFixture<GeoValidationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GeoValidationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GeoValidationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
