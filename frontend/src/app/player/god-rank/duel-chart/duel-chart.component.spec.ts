import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DuelChartComponent } from './duel-chart.component';

describe('DuelChartComponent', () => {
  let component: DuelChartComponent;
  let fixture: ComponentFixture<DuelChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DuelChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DuelChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
