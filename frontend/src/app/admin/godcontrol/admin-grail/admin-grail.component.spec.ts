import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminGrailComponent } from './admin-grail.component';

describe('AdminGrailComponent', () => {
  let component: AdminGrailComponent;
  let fixture: ComponentFixture<AdminGrailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminGrailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminGrailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
