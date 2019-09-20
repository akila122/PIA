import { Component, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material";
import { DatePickerComponent } from "../date-picker/date-picker.component";
import { GoDService } from "./go-d.service";
import { GeoModel, MyNumModel } from "src/app/models/GameModels";
import { Router } from "@angular/router";
import { AdminAnagramComponent } from './admin-anagram/admin-anagram.component';
import { AdminFivesComponent } from './admin-fives/admin-fives.component';
import { AdminGrailComponent } from './admin-grail/admin-grail.component';

@Component({
  selector: "app-godcontrol",
  templateUrl: "./godcontrol.component.html",
  styleUrls: ["./godcontrol.component.css"]
})
export class GODControlComponent implements OnInit {
  constructor(
    public dialog: MatDialog,
    public service: GoDService,
    public router: Router
  ) {}

  geo: GeoModel;
  myNum: MyNumModel;
  loading: number;
  errMsg: String;

  ngOnInit() {
    this.loading = 0;
    this.service.getGeo().subscribe(
      data => {
        this.geo = data;
        this.loading++;
      },
      err => (this.errMsg = err.error)
    );
    this.service.getMyNum().subscribe(
      data => {
        this.myNum = data;
        this.loading++;
      },
      err => (this.errMsg = err.error)
    );
  }

  anagramPicked() {
    this.dialog.open(AdminAnagramComponent);
  }
  grailPicked() {
    this.dialog.open(AdminGrailComponent);
  }
  fivesPicked() {
    this.dialog.open(AdminFivesComponent);
  }
  myNumPicked() {
    this.dialog.open(DatePickerComponent, {
      data: this.myNum
    });
  }
  geoPicked() {
    this.dialog.open(DatePickerComponent, {
      data: this.geo
    });
  }
}
