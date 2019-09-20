import { Component, OnInit } from "@angular/core";
import { ChartService } from "src/app/home/topchart/chart.service";
import { LoginService } from "src/app/home/login/login.service";
import { MatDialog } from '@angular/material';
import { GoDChartComponent } from './go-dchart/go-dchart.component';
import { DuelChartComponent } from './duel-chart/duel-chart.component';

@Component({
  selector: "app-god-rank",
  templateUrl: "./god-rank.component.html",
  styleUrls: ["./god-rank.component.css"]
})
export class GodRankComponent implements OnInit {

  constructor(public dialog: MatDialog) { }

  ngOnInit() {
  }


  godChart(){
    this.dialog.open(GoDChartComponent);

  }
  duelChart(){
    this.dialog.open(DuelChartComponent);
  }
}
