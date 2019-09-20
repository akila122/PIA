import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FivesSoloComponent } from './fives-solo.component';

describe('FivesSoloComponent', () => {
  let component: FivesSoloComponent;
  let fixture: ComponentFixture<FivesSoloComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FivesSoloComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FivesSoloComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
