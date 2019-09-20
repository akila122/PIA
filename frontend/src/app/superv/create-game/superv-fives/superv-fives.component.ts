import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { FivesModel } from 'src/app/models/GameModels';
import { SupervisorService } from '../supervisor.service';

@Component({
  selector: 'app-superv-fives',
  templateUrl: './superv-fives.component.html',
  styleUrls: ['./superv-fives.component.css']
})
export class SupervFivesComponent implements OnInit {

  constructor(public service: SupervisorService,public dialog: MatDialog) {}

  model: FivesModel = {} as null;

  doSpin: Boolean = false;
  errMsg: String;
  infoMsg: String;

  ngOnInit() {
    this.model.data = [];
  }

  send() {
    this.doSpin = true;
    this.service.addFives(this.model).subscribe(
      data => {
        this.doSpin = false;
        this.infoMsg = data;
      },
      err => {
        this.errMsg = err.error;
        this.doSpin = false;
      }
    );
  }

}
