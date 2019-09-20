import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GODControlComponent } from './godcontrol.component';

describe('GODControlComponent', () => {
  let component: GODControlComponent;
  let fixture: ComponentFixture<GODControlComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GODControlComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GODControlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
