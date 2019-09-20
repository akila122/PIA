import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MyNumSoloComponent } from './my-num-solo.component';

describe('MyNumSoloComponent', () => {
  let component: MyNumSoloComponent;
  let fixture: ComponentFixture<MyNumSoloComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MyNumSoloComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyNumSoloComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
