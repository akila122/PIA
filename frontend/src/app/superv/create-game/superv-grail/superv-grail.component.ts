import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material';
import { SupervisorService } from '../supervisor.service';
import { GrailModel } from 'src/app/models/GameModels';

@Component({
  selector: 'app-superv-grail',
  templateUrl: './superv-grail.component.html',
  styleUrls: ['./superv-grail.component.css']
})
export class SupervGrailComponent implements OnInit {

  constructor(public service: SupervisorService,public dialog: MatDialog,public dialogRef: MatDialogRef<any>) {}

  model: GrailModel;

  doSpin: Boolean = false;
  errMsg: String;
  infoMsg: String;

  ngOnInit() {
    this.model = {
      _id: undefined,
      kind: undefined,
      data: [
        {question:"",answer:""},
        {question:"",answer:""},
        {question:"",answer:""},
        {question:"",answer:""},
        {question:"",answer:""},
        {question:"",answer:""},
        {question:"",answer:""},
        {question:"",answer:""},
        {question:"",answer:""},
        {question:"",answer:""},
        {question:"",answer:""},
        {question:"",answer:""},
        {question:"",answer:""}
      ]
    };
    this.dialogRef.updateSize('50%', '80%');
  }

  send() {
    this.doSpin = true;
    this.service.addGrail(this.model).subscribe(
      data => {
        this.doSpin = false;
        this.infoMsg = data;
        this.dialogRef.updateSize("15%","15%")
      },
      err => {
        this.errMsg = err.error;
        this.doSpin = false;
        this.dialogRef.updateSize("15%","15%")
      }
    );
  }


}
