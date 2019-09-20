import { Component, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material";
import { AnagramModel } from "src/app/models/GameModels";
import { SupervisorService } from "../supervisor.service";

@Component({
  selector: "app-superv-anagram",
  templateUrl: "./superv-anagram.component.html",
  styleUrls: ["./superv-anagram.component.css"]
})
export class SupervAnagramComponent implements OnInit {
  constructor(public service: SupervisorService,public dialog: MatDialog) {}

  model: AnagramModel = {} as null;

  doSpin: Boolean = false;
  errMsg: String;
  infoMsg: String;

  ngOnInit() {
    this.model.data = {} as null;
  }

  send() {
    this.doSpin = true;
    this.service.addAnagram(this.model).subscribe(
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
