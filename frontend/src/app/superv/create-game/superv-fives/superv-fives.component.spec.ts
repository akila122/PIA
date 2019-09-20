import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SupervFivesComponent } from './superv-fives.component';

describe('SupervFivesComponent', () => {
  let component: SupervFivesComponent;
  let fixture: ComponentFixture<SupervFivesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SupervFivesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SupervFivesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
