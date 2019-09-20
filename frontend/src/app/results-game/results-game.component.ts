import { Component, OnInit, OnDestroy } from "@angular/core";
import { Router } from '@angular/router';
import { GameHelperService } from '../game-helper.service';
import { ResultsService } from './results.service';
import { LoginService } from '../home/login/login.service';
import { MusicService } from '../music.service';
import { UserModel } from '../models/UserModel';
import { Subscription } from 'rxjs';

@Component({
  selector: "app-results-game",
  templateUrl: "./results-game.component.html",
  styleUrls: ["./results-game.component.css"]
})
export class ResultsGameComponent implements OnInit,OnDestroy {
  constructor(
    private router: Router,
    private helper: GameHelperService,
    private service: ResultsService,
    private logger: LoginService,
    private music: MusicService
  ) {}

  
  user : UserModel;
  data;
  subArr : Subscription[] = [];
  doSpin: boolean = true;
  loaded: boolean = false;
  infoMsg: string;
  infoColor: string = "black";
  results;

  ngOnInit() {
    this.user = this.logger.getUser();
    this.data = this.helper.getData();
    this.subArr.push(this.service.gameResults$.subscribe(data=>{
      this.results = data;
      this.doSpin = false;
      this.loaded = true;
      this.infoMsg = "R E Z U L T A T I"
      this.music.playResults();

    }))
    this.service.getGameResults(this.data.gameId);

  }
  ngOnDestroy(): void {
    this.subArr.forEach(sub => sub.unsubscribe());
  }

  go(){
    this.router.navigate(['player']);
  }

  icons = [
    'spellcheck',
    'functions',
    'border_all',
    'language',
    'local_bar'
  ]
}
