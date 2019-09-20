import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminFivesComponent } from './admin-fives.component';

describe('AdminFivesComponent', () => {
  let component: AdminFivesComponent;
  let fixture: ComponentFixture<AdminFivesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminFivesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminFivesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
