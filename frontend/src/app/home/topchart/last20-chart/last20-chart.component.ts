import { Component, OnInit, OnDestroy } from "@angular/core";
import { MatDialog, PageEvent } from "@angular/material";
import { ChartService } from "../chart.service";

@Component({
  selector: "app-last20-chart",
  templateUrl: "./last20-chart.component.html",
  styleUrls: ["./last20-chart.component.css"]
})
export class Last20ChartComponent implements OnInit, OnDestroy {

  constructor(public dialog: MatDialog, private service: ChartService) {}

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
    this.sub = this.service.last20Chart$.subscribe(data => {
      this.data = data;
      this.length = data.length;
      let d1 = new Date();
      let d2 =  new Date(
        d1.getFullYear(),
        d1.getMonth(),
        d1.getDate() - 19,
        d1.getHours(),
        d1.getMinutes(),
        d1.getSeconds(),
        d1.getMilliseconds()
    );
      this.label = `${d2.getDate()+1}/${d2.getMonth()+1}/${d2.getFullYear()} - ${d1.getDate()+1}/${d1.getMonth()+1}/${d1.getFullYear()}`
      this.doSpin = false;
      this.loaded = true;

     

    });
    this.service.getLast20Chart();
  }

  public fetch(event?: PageEvent) {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;

    return event;
  }
}
