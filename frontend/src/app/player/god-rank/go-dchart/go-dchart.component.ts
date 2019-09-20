import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatDialog, PageEvent } from '@angular/material';
import { ChartService } from 'src/app/home/topchart/chart.service';
import { LoginService } from 'src/app/home/login/login.service';

@Component({
  selector: 'app-go-dchart',
  templateUrl: './go-dchart.component.html',
  styleUrls: ['./go-dchart.component.css']
})
export class GoDChartComponent implements OnInit,OnDestroy {


  constructor(private service: ChartService, private logger: LoginService,private dialog : MatDialog) {}

  data;
  doSpin = true;
  loaded = false;
  sub;

  showMe = false;
  datasource: null;
  pageIndex: number = 0;
  pageSize: number = 3;
  length: number;
  infoMsg;

  label;

  ngOnDestroy() {
    this.sub.unsubscribe();
  }


  public fetch(event?: PageEvent) {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;

    return event;
  }

  ngOnInit() {
    this.sub = this.service.godChart$.subscribe(data => {
      this.data = data;
      this.length = data.length;
      if (data == "NO_GOD") {
        this.infoMsg = "Igra dana nije postavljena za današnji datum.";
      } else {
        if (data.data.length == 0) this.infoMsg = "Niko nije igrao igru dana.";

        else if (
          data.data.filter(
            x => x.user.username == this.logger.getUser().username
          ).length == 0 &&
          data.senderPlayed
        ) {
          this.showMe = true;
        }
      }
      this.doSpin = false;
      this.loaded = true;
    });

    let parsed = new Date().toLocaleString().split(',')[0].split('/');
    let myLocal =  parsed[2]+'-'+parsed[0]+'-'+parsed[1]

    this.service.getGodChart(this.logger.getUser().username,myLocal);
  }


}
