import { Component, OnInit } from "@angular/core";
import { GoDService } from "../go-d.service";
import { MatDialog } from "@angular/material";
import { DatePickerComponent } from '../../date-picker/date-picker.component';
import { FivesModel } from 'src/app/models/GameModels';

@Component({
  selector: 'app-admin-fives',
  templateUrl: './admin-fives.component.html',
  styleUrls: ['./admin-fives.component.css']
})
export class AdminFivesComponent implements OnInit {

  constructor(public service: GoDService, public dialog: MatDialog) {}

  doSpin: Boolean = true;
  fives: FivesModel[];
  iter: number = 0;

  ngOnInit() {
    this.doSpin = true;
    this.service.getFives().subscribe(data => {
      this.fives = data;
      this.doSpin = false;
    });
  }

  goLeft() {
    this.iter = (this.iter + this.fives.length - 1) % this.fives.length;
  }
  goRight() {
    this.iter = (this.iter + 1) % this.fives.length;
  }
  send() {
    this.dialog.closeAll();
    this.dialog.open(DatePickerComponent,{data:this.fives[this.iter]})
  }

}
