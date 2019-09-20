import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SupervComponent } from './superv.component';

describe('SupervComponent', () => {
  let component: SupervComponent;
  let fixture: ComponentFixture<SupervComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SupervComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SupervComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
