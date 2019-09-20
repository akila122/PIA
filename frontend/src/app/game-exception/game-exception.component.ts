import { Component, OnInit } from '@angular/core';
import { MusicService } from '../music.service';
import { MatDialog } from '@angular/material';

@Component({
  selector: 'app-game-exception',
  templateUrl: './game-exception.component.html',
  styleUrls: ['./game-exception.component.css']
})
export class GameExceptionComponent implements OnInit {

  constructor(private dialog : MatDialog,private music: MusicService) { }

  ngOnInit() {
    this.music.playBad();
  }

}
