import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SupervGrailComponent } from './superv-grail.component';

describe('SupervGrailComponent', () => {
  let component: SupervGrailComponent;
  let fixture: ComponentFixture<SupervGrailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SupervGrailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SupervGrailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
