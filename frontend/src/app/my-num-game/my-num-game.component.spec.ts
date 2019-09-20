import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MyNumGameComponent } from './my-num-game.component';

describe('MyNumGameComponent', () => {
  let component: MyNumGameComponent;
  let fixture: ComponentFixture<MyNumGameComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MyNumGameComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyNumGameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
