import { Component, OnInit } from '@angular/core';
import { PageEvent, MatDialog } from '@angular/material';
import { ChartService } from 'src/app/home/topchart/chart.service';
import { LoginService } from 'src/app/home/login/login.service';

@Component({
  selector: 'app-duel-chart',
  templateUrl: './duel-chart.component.html',
  styleUrls: ['./duel-chart.component.css']
})
export class DuelChartComponent implements OnInit {

  constructor(public dialog: MatDialog, private service: ChartService,private logger : LoginService) {}

  data;
  doSpin = true;
  loaded = false;
  sub;

  pageEvent: PageEvent;
  datasource: null;
  pageIndex: number = 0;
  pageSize: number = 3;
  length: number;

  label;

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  ngOnInit() {
    this.sub = this.service.duelChart$.subscribe(data => {
      this.data = data;
      this.length = data.length;
      let d1 = new Date();
      let d2 =  new Date(
        d1.getFullYear(),
        d1.getMonth(),
        d1.getDate() - 6,
        d1.getHours(),
        d1.getMinutes(),
        d1.getSeconds(),
        d1.getMilliseconds()
    );
      this.label = `${d2.getDate()+1}/${d2.getMonth()+1}/${d2.getFullYear()} - ${d1.getDate()+1}/${d1.getMonth()+1}/${d1.getFullYear()}`
      this.doSpin = false;
      this.loaded = true;

     

    });
    this.service.getDuelChart(this.logger.getUser().username);
  }

  public fetch(event?: PageEvent) {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;

    return event;
  }

}
