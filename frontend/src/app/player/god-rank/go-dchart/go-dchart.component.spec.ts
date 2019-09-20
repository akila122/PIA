import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GoDChartComponent } from './go-dchart.component';

describe('GoDChartComponent', () => {
  let component: GoDChartComponent;
  let fixture: ComponentFixture<GoDChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GoDChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GoDChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
