import { Component, OnInit, OnDestroy } from "@angular/core";
import { MatDialog, PageEvent } from "@angular/material";
import { ChartService } from "../chart.service";

@Component({
  selector: "app-monthly-chart",
  templateUrl: "./monthly-chart.component.html",
  styleUrls: ["./monthly-chart.component.css"]
})
export class MonthlyChartComponent implements OnInit, OnDestroy {
  
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

  ngOnDestroy(){
    this.sub.unsubscribe();
   }

  ngOnInit() {
    this.sub = this.service.monthlyChart$.subscribe(data => {
      this.data = data;
      this.length = data.length;
      this.doSpin = false;
      this.loaded = true;
    });
    this.service.getMonthlyChart();
  }

  public fetch(event?:PageEvent){
   
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;

    return event;
  }

  dateTranslate(){
    switch(new Date().getMonth()){
      case 0: return 'JANUAR'
      case 1: return 'FEBRUAR'
      case 2: return 'MART';
      case 3: return 'APRIL'
      case 4: return 'MAJ'
      case 5: return 'JUN';
      case 6: return 'JUL'
      case 7: return 'AVGUST'
      case 8: return 'SEPTEMBAR';
      case 9: return 'OKTOBAR'
      case 10: return 'NOVEMBAR'
      case 11: return 'DECEMBAR';
    }
  }

  

}
