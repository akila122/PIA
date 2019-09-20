import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { SupervAnagramComponent } from './superv-anagram/superv-anagram.component';
import { SupervGrailComponent } from './superv-grail/superv-grail.component';
import { SupervFivesComponent } from './superv-fives/superv-fives.component';

@Component({
  selector: 'app-create-game',
  templateUrl: './create-game.component.html',
  styleUrls: ['./create-game.component.css']
})
export class CreateGameComponent implements OnInit {

  constructor(public dialog : MatDialog) { }

  ngOnInit() {
  }


  anagramPicked(){

    this.dialog.open(SupervAnagramComponent);

  }

  grailPicked(){
    this.dialog.open(SupervGrailComponent);
  }

  fivesPicked(){
    this.dialog.open(SupervFivesComponent);
  }


}
