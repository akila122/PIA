import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { MonthlyChartComponent } from './monthly-chart/monthly-chart.component';
import { Last20ChartComponent } from './last20-chart/last20-chart.component';

@Component({
  selector: 'app-topchart',
  templateUrl: './topchart.component.html',
  styleUrls: ['./topchart.component.css']
})
export class TopchartComponent implements OnInit {

  constructor(public dialog: MatDialog) { }

  ngOnInit() {
  }


  monthly(){
    this.dialog.open(MonthlyChartComponent);

  }
  last20(){
    this.dialog.open(Last20ChartComponent);
  }
}
