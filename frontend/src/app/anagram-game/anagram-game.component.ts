import { Component, OnInit, OnDestroy } from "@angular/core";
import { Router } from "@angular/router";
import { GameHelperService } from "../game-helper.service";
import { AnagramService } from "./anagram.service";
import { LoginService } from "../home/login/login.service";
import { UserModel } from "../models/UserModel";
import { AnagramModel } from "../models/GameModels";
import { Observable, Subscription } from "rxjs";
import { MusicService } from "../music.service";

@Component({
  selector: "app-anagram-game",
  templateUrl: "./anagram-game.component.html",
  styleUrls: ["./anagram-game.component.css"]
})
export class AnagramGameComponent implements OnInit, OnDestroy {
  user: UserModel;
  data: any;
  anagram1: AnagramModel;
  anagram2: AnagramModel;
  position: Boolean;

  anagram: AnagramModel;
  doSpin: boolean = true;
  loaded: boolean = false;
  answer: string = "";
  canClick: boolean = true;
  turn: number = 0;
  infoMsg: string;
  infoColor: string = "black";
  subArr: Subscription[] = [];

  constructor(
    private router: Router,
    private helper: GameHelperService,
    private service: AnagramService,
    private logger: LoginService,
    private music: MusicService
  ) {}

  ngOnInit() {
    this.user = this.logger.getUser();
    this.data = this.helper.getData();
    if (this.user.username == this.data.blueUser.username) {
      this.position = true;
    } else {
      this.position = false;
    }
    this.subArr.push(
      this.service.anagramData.subscribe(anagramData => {
        this.anagram1 = anagramData.anagrams.a1;
        this.anagram2 = anagramData.anagrams.a2;
        this.service.anagramSync(this.data.gameId);
      })
    );
    this.subArr.push(
      this.service.anagramStart.subscribe(() => {
        this.gameStart();
      })
    );
    this.subArr.push(
      this.service.anagramNext.subscribe(data => {
        this.helper.pushPoints({
          redPoints: data.redPoints,
          bluePoints: data.bluePoints
        });
        this.turn++;
        if (this.turn == 1) {
          this.anagram = this.anagram2;
          this.doSpin = false;
          this.answer = "";
          this.infoMsg = null;
          this.loaded = true;
          this.helper.startTimeout(60000);
        } else {
          this.infoColor = "infoMsg";
          this.infoMsg = "Uskoro počinje Moj broj...";
          setTimeout(() => {
            this.gameDone();
          }, 3000);
        }
      })
    );
    this.helper.pushPoints({ redPoints: 0, bluePoints: 0 });
    this.service.anagramLoaded(this.data.gameId);
    this.subArr.push(
      this.helper.timeoutObservable.subscribe(no => {
        this.submit();
      })
    );
  }

  gameDone() {
    this.helper.nextGame();
    this.router.navigate(["game", "mynum"]);

  }

  gameStart() {
    this.anagram = this.anagram1;
    this.doSpin = false;
    this.loaded = true;
    this.helper.startTimeout(60000);
  }

  submit(flag: boolean = false) {
    if (flag) this.helper.stopTimeout();
    this.loaded = false;
    if (this.checkAnagram(this.anagram.data.answer.toString(), this.answer)) {
      this.music.playGood();
      this.infoColor = "#62fc03";
      this.infoMsg = "Tačan odgovor!";
    } else {
      this.music.playBad();
      this.infoColor = "#fc0303";
      this.infoMsg =
        "Netačan odgovor! Rešenje je - " + this.anagram.data.answer;
    }
    setTimeout(() => {
      this.doSpin = true;
      this.infoColor = "black";
      this.infoMsg = "Čeka se na protivnika";
      setTimeout(() => {
        this.service.sendTurn(
          this.turn,
          this.checkAnagram(this.anagram.data.answer.toString(), this.answer),
          this.user.username,
          this.data.gameId
        );
      }, 3000);
    }, 3000);
  }

  

  ngOnDestroy(): void {
    this.subArr.forEach(sub => sub.unsubscribe());
  }

  checkAnagram(s1: string, s2: string): boolean {
    return s1.toLowerCase() == s2.toLowerCase();
  }
}
