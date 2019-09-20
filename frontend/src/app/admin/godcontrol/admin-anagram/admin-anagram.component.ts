import { Component, OnInit } from "@angular/core";
import { GoDService } from "../go-d.service";
import { MatDialog } from "@angular/material";
import { AnagramModel } from "src/app/models/GameModels";
import { DatePickerComponent } from '../../date-picker/date-picker.component';

@Component({
  selector: "app-admin-anagram",
  templateUrl: "./admin-anagram.component.html",
  styleUrls: ["./admin-anagram.component.css"]
})
export class AdminAnagramComponent implements OnInit {
  constructor(public service: GoDService, public dialog: MatDialog) {}

  doSpin: Boolean = true;
  anagrams: AnagramModel[];
  iter: number = 0;

  ngOnInit() {
    this.doSpin = true;
    this.service.getAnagrams().subscribe(data => {
      this.anagrams = data;
      this.doSpin = false;
    });
  }

  goLeft() {
    this.iter = (this.iter + this.anagrams.length - 1) % this.anagrams.length;
  }
  goRight() {
    this.iter = (this.iter + 1) % this.anagrams.length;
  }
  send() {
    this.dialog.closeAll();
    this.dialog.open(DatePickerComponent,{data:this.anagrams[this.iter]})
  }
}
