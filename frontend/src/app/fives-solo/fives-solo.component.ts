import { Component, OnInit, OnDestroy } from "@angular/core";
import { GoDService } from "../player/god-play/go-d.service";
import { Router } from "@angular/router";
import { GameHelperService } from "../game-helper.service";
import { LoginService } from "../home/login/login.service";
import { MusicService } from "../music.service";
import { UserModel } from "../models/UserModel";
import { Subscription } from "rxjs";

@Component({
  selector: "app-fives-solo",
  templateUrl: "./fives-solo.component.html",
  styleUrls: ["./fives-solo.component.css"]
})
export class FivesSoloComponent implements OnInit,OnDestroy {
  constructor(
    private router: Router,
    private helper: GameHelperService,
    private service: GoDService,
    private logger: LoginService,
    private music: MusicService
  ) {}

  user: UserModel;
  data: any;
  endGuard: boolean = false;
  myTurn = false;

  totalPoints = 0;
  doSpin: boolean = true;
  loaded: boolean = false;
  infoMsg: string;
  infoColor: string = "black";
  answer: string = "";
  notFound: string = "";
  cnt = 0;

  revealed: boolean[][] = [
    [false, false, false, false, false],
    [false, false, false, false, false],
    [false, false, false, false, false],
    [false, false, false, false, false],
    [false, false, false, false, false]
  ];
  fives: String[][] = [];

  subArr: Subscription[] = [];

  ngOnDestroy() {
    this.subArr.forEach(sub => sub.unsubscribe());
  }

  ngOnInit() {
    this.user = this.logger.getUser();
    this.data = this.helper.getData();

    this.subArr.push(
      this.helper.timeoutObservable.subscribe(() => {
        this.submit();
      })
    );

    let cStart = this.data.game.data[Math.floor(5 * Math.random())].charAt(
      Math.floor(5 * Math.random())
    );
    for (let i = 0; i < this.data.game.data.length; i++)
      this.fives[i] = this.data.game.data[i].split("");
    for (let i = 0; i < 5; i++)
      for (let j = 0; j < 5; j++)
        this.revealed[i][j] =
          cStart.toLowerCase() == this.fives[i][j].toLowerCase();

    this.doSpin = false;
    this.loaded = true;
    this.setMyTurn();
  }

  submit(flag: boolean = false) {
    if (flag) this.helper.stopTimeout();

    this.myTurn = false;

    let oldState = [];
    for (let i = 0; i < 5; i++) {
      oldState[i] = this.revealed[i].slice(0);
    }

    let revealedData = [];
    let points = 0;

    for (let i = 0; i < 5; i++) {
      for (let j = 0; j < 5; j++) {
        if (
          !this.revealed[i][j] &&
          this.fives[i][j].toLowerCase() == this.answer.toLowerCase()
        ) {
          revealedData.push({ i: i, j: j });
          this.revealed[i][j] = true;
        }
      }
    }

    this.infoMsg = this.answer.toUpperCase();
    if (revealedData.length > 0) {
      points += revealedData.length;
      this.music.playGood();
    } else this.music.playBad();

    for (let i = 0; i < 5; i++) {
      if (
        !oldState[i].reduce((prev, curr) => prev && curr) &&
        this.revealed[i].reduce((prev, curr) => prev && curr)
      )
        points += 2;
    }
    for (let i = 0; i < 5; i++) {
      let flagOld = oldState[0][i];
      let flagNew = this.revealed[0][i];
      for (let j = 1; j < 5; j++) {
        flagOld = flagOld && oldState[j][i];
        flagNew = flagNew && this.revealed[j][i];
      }
      if (!flagOld && flagNew) {
        points += 2;
      }
    }

    let gameEnd = true;

    for (let i = 0; i < 5; i++) {
      for (let j = 0; j < 5; j++) {
        if (this.revealed[i][j] == false) {
          gameEnd = false;
          break;
        }
      }
      if (!gameEnd) break;
    }

    this.totalPoints += points;

    if (++this.cnt == 30) gameEnd = true;
    this.helper.pushPoints({
      add: true,
      bluePoints: points
    });
    this.infoColor = points > 0 ? "#62fc03" : "#fc0303";
    if (points == 0) this.notFound += this.answer;

    this.infoMsg = this.answer.toUpperCase();

    setTimeout(() => {
      if (gameEnd) this.endGame();
      else this.setMyTurn();
    }, 2000);
  }

  endGame() {
    this.music.playResults();
    if (this.cnt == 30) {
      this.infoMsg =
        "Prekoračen makismalan broj pokušaja! Igra dana je gotova!";
    } else {
      this.infoMsg = "Igra dana je gotova!";
    }

    this.service.godFinish(this.data.godId, this.totalPoints);
    setTimeout(() => this.router.navigate(["player"]), 3000);
  }

  setMyTurn() {
    this.helper.startTimeout(15000);
    this.myTurn = true;
    this.infoColor = "black";
    this.infoMsg = "Izaberite slovo";
  }
}
