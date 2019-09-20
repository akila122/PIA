import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GrailSoloComponent } from './grail-solo.component';

describe('GrailSoloComponent', () => {
  let component: GrailSoloComponent;
  let fixture: ComponentFixture<GrailSoloComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GrailSoloComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GrailSoloComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
