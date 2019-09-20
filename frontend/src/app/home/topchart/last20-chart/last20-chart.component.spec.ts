import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Last20ChartComponent } from './last20-chart.component';

describe('Last20ChartComponent', () => {
  let component: Last20ChartComponent;
  let fixture: ComponentFixture<Last20ChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Last20ChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Last20ChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
