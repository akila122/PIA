import { Component, OnInit, Inject } from "@angular/core";
import { MatDialog, MAT_DIALOG_DATA, DateAdapter, MAT_DATE_FORMATS } from "@angular/material";
import { GoDService } from "../godcontrol/go-d.service";
import { GameModel } from 'src/app/models/GameModels';
import { AppDateAdapter, APP_DATE_FORMATS } from 'src/app/date.formater';

@Component({
  selector: "app-date-picker",
  templateUrl: "./date-picker.component.html",
  styleUrls: ["./date-picker.component.css"],
  providers: [
    {provide: DateAdapter, useClass: AppDateAdapter},
    {provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS}
  ]
})
export class DatePickerComponent implements OnInit {
  constructor(
    public dialog: MatDialog,
    public service: GoDService,
    @Inject(MAT_DIALOG_DATA) public data: GameModel
  ) {}

  today: Date = new Date();
  date: Date;
  errMsg: String;
  infoMsg: String;
  doSpin: boolean = false;

  send(){
    

    let parsed = this.date.toLocaleString().split(',')[0].split('/');
    let myLocal =  parsed[2]+'-'+parsed[0]+'-'+parsed[1]
  
   
    this.doSpin = true;
    this.service.setGoD(myLocal,this.data._id).subscribe(data=>{
      this.doSpin = false;
      this.infoMsg = data; 
    }, err =>{
      this.doSpin = false;
      this.errMsg = err.error;
    })
  }

  ngOnInit() {}
}
