import { Component, OnInit } from '@angular/core';
import { GoDService } from "../go-d.service";
import { MatDialog } from "@angular/material";
import { DatePickerComponent } from '../../date-picker/date-picker.component';
import { GrailModel } from 'src/app/models/GameModels';

@Component({
  selector: 'app-admin-grail',
  templateUrl: './admin-grail.component.html',
  styleUrls: ['./admin-grail.component.css']
})
export class AdminGrailComponent implements OnInit {
  constructor(public service: GoDService, public dialog: MatDialog) {}

  doSpin: Boolean = true;
  grails: GrailModel[];
  iter: number = 0;

  ngOnInit() {
    this.doSpin = true;
    this.service.getGrails().subscribe(data => {
      this.grails = data;
      this.doSpin = false;
    });
  }

  goLeft() {
    this.iter = (this.iter + this.grails.length - 1) % this.grails.length;
  }
  goRight() {
    this.iter = (this.iter + 1) % this.grails.length;
  }
  send() {
    this.dialog.closeAll();
    this.dialog.open(DatePickerComponent,{data:this.grails[this.iter]})
  }


}
