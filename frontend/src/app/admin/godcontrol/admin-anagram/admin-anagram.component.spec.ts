import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminAnagramComponent } from './admin-anagram.component';

describe('AdminAnagramComponent', () => {
  let component: AdminAnagramComponent;
  let fixture: ComponentFixture<AdminAnagramComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminAnagramComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminAnagramComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
