import { Component, OnInit, OnDestroy } from "@angular/core";
import { AnagramModel } from "../models/GameModels";
import { UserModel } from "../models/UserModel";
import { Subscription } from "rxjs";
import { Router } from "@angular/router";

import { LoginService } from "../home/login/login.service";
import { MusicService } from "../music.service";
import { GameHelperService } from "../game-helper.service";
import { GoDService } from "../player/god-play/go-d.service";

@Component({
  selector: "app-anagram-solo",
  templateUrl: "./anagram-solo.component.html",
  styleUrls: ["./anagram-solo.component.css"]
})
export class AnagramSoloComponent implements OnInit, OnDestroy {
  user: UserModel;
  data: any;
  anagram1: AnagramModel;

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
    private service: GoDService,
    private logger: LoginService,
    private music: MusicService
  ) {}

  ngOnInit() {
    this.user = this.logger.getUser();
    this.data = this.helper.getData();

    this.anagram = this.data.game;

    this.subArr.push(
      this.helper.timeoutObservable.subscribe(no => {
        this.submit();
      })
    );

    this.gameStart();
  }

  gameDone() {
    this.router.navigate(["player"]);
  }

  gameStart() {
    this.doSpin = false;
    this.loaded = true;
    this.helper.startTimeout(60000);
  }

  submit(flag: boolean = false) {
    if (flag) this.helper.stopTimeout();
    this.loaded = false;
    let points;
    if (this.checkAnagram(this.anagram.data.answer.toString(), this.answer)) {
      this.music.playGood();
      this.infoColor = "#62fc03";
      this.infoMsg = "Tačan odgovor!";
      points = 10;
    } else {
      this.music.playBad();
      this.infoColor = "#fc0303";
      this.infoMsg =
        "Netačan odgovor! Rešenje je - " + this.anagram.data.answer;
    }

    this.helper.pushPoints({ bluePoints: points });
    setTimeout(() => {
      this.infoColor = "black";
      this.infoMsg = "Igra dana završena!";
      this.music.playResults();
      this.service.godFinish(this.data.godId, points);
      setTimeout(() => {
        this.gameDone();
      }, 2000);
    }, 3000);
  }

  ngOnDestroy(): void {
    this.subArr.forEach(sub => sub.unsubscribe());
  }

  checkAnagram(s1: string, s2: string): boolean {
    return s1.toLowerCase() == s2.toLowerCase();
  }
}
