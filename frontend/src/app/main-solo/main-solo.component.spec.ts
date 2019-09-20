import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MainSoloComponent } from './main-solo.component';

describe('MainSoloComponent', () => {
  let component: MainSoloComponent;
  let fixture: ComponentFixture<MainSoloComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MainSoloComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MainSoloComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
