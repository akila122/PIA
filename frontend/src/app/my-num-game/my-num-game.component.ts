import { Component, OnInit, OnDestroy } from "@angular/core";
import { Router } from "@angular/router";
import { GameHelperService } from "../game-helper.service";
import { MyNumService } from "./my-num.service";
import { LoginService } from "../home/login/login.service";
import { MusicService } from "../music.service";
import { UserModel } from "../models/UserModel";
import { Observable, Subscription } from "rxjs";

@Component({
  selector: "app-my-num-game",
  templateUrl: "./my-num-game.component.html",
  styleUrls: ["./my-num-game.component.css"]
})
export class MyNumGameComponent implements OnInit, OnDestroy {
  constructor(
    private router: Router,
    private helper: GameHelperService,
    private service: MyNumService,
    private logger: LoginService,
    private music: MusicService
  ) {}

  user: UserModel;
  data: any;
  position: boolean;

  doSpin: boolean = true;
  loaded: boolean = false;
  infoMsg: string;
  infoColor: string = "black";
  answer: string = "";

  canSubmit = false;
  subArr: Subscription[] = [];

  srcSingle: number[] = Array.from(Array(10).keys()).map(data => data + 1);
  srcDouble: number[] = [10, 15, 20];
  srcTriple: number[] = [25, 50, 75, 100];
  srcRes: number[] = Array.from(Array(999).keys()).map(data => data + 1);
  disabled: boolean[] = [true, true, true, true, true, true, true];
  clickedOnce: boolean[] = [false, false, false, false, false, false, false];
  clickGuard: number[] = [];
  lastWasNum: boolean = false;
  vals: number[] = [0, 0, 0, 0, 0, 0, 0];
  spinnerHandels: any[] = [];
  opsDisabled: boolean = true;
  myTurn = false;
  turn: number = 0;
  showRes: string;

  pickNumbersGuard: boolean = true;

  ngOnDestroy() {
    this.subArr.forEach(sub => sub.unsubscribe());
  }
  ngOnInit() {
    this.user = this.logger.getUser();
    this.data = this.helper.getData();
    if (this.user.username == this.data.blueUser.username) {
      this.position = true;
    } else {
      this.position = false;
    }

    this.myTurn = this.position;
    this.spinUs();
    if (this.myTurn) {
      for (let i = 0; i < this.disabled.length; i++) this.disabled[i] = false;
    }
    this.subArr.push(
      this.helper.timeoutObservable.subscribe(data => {
        if (this.pickNumbersGuard && this.myTurn) {
          this.pickNumbersGuard = false;
          if (this.myTurn) {
            this.disabled.forEach((val, i, arr) => (arr[i] = true));
            this.clickedOnce.forEach((val, i, arr) => {
              if (!val) {
                this.stopSpin(i);
                arr[i] = true;
                this.service.setNum(
                  i,
                  this.vals[i],
                  this.position ? "redUser" : "blueUser",
                  this.data.gameId
                );
              }
            });
            this.disabled.forEach((val, i, arr) => (arr[i] = false));
            this.startTick();
          }
        } else this.submit();
      })
    );
    this.subArr.push(
      this.service.setNumObservable.subscribe(data => {
        this.stopSpin(data.i);
        this.vals[data.i] = data.val;
        if (data.i != 6) {
          this.disabled[data.i] = false;
        }
      })
    );
    this.subArr.push(
      this.service.myNumSyncObservable.subscribe(data => this.gameStart())
    );
    this.subArr.push(
      this.service.allSetObservable.subscribe(data => {
        this.opsDisabled = false;
        this.canSubmit = true;
        for (let i = 0; i < this.disabled.length; i++) {
          this.disabled[i] = false;
        }
        this.infoMsg = null;
        this.helper.startTimeout(60000);
      })
    );
    this.subArr.push(
      this.service.nextTurn.subscribe(data => {
        this.turn++;

        this.helper.pushPoints({
          bluePoints: data.bluePoints,
          redPoints: data.redPoints
        });
        this.loaded = false;
        this.infoMsg =
          "Protivnik je odgovorio\n" +
          (data.compute != null
            ? data.answer + " = " + data.compute
            : "nevalidno");
        setTimeout(() => {
          this.myTurn = !this.myTurn;
          if (this.turn == 2) {
            this.infoMsg = "Uskoro počinje 5x5...";
            this.doSpin = true;
            setTimeout(() => {
              this.router.navigate(["game", "fives"]);
              this.helper.nextGame();
            }, 2000);
          } else {
            this.pickNumbersGuard = true;
            this.showRes = null;
            this.answer = "";
            this.infoMsg = "";
            this.disabled = [true, true, true, true, true, true, true];
            this.clickedOnce = [
              false,
              false,
              false,
              false,
              false,
              false,
              false
            ];
            this.canSubmit = false;
            this.clickGuard = [];
            this.lastWasNum = false;
            this.vals = [0, 0, 0, 0, 0, 0, 0];
            this.spinnerHandels = [];
            this.opsDisabled = true;
            this.spinUs();

            if (this.myTurn) {
              for (let i = 0; i < this.disabled.length; i++)
                this.disabled[i] = false;
            }
            this.gameStart();
          }
        }, 5000);
      })
    );
    this.service.myNumLoaded(this.data.gameId);
  }

  clickNum(i: number) {
    if (!this.clickedOnce[i] && this.myTurn) {
      this.stopSpin(i);
      this.clickedOnce[i] = true;
      this.service.setNum(
        i,
        this.vals[i],
        this.position ? "redUser" : "blueUser",
        this.data.gameId
      );
      if (this.clickedOnce.reduce((prev, curr, iter, arr) => prev && curr)) {
        this.pickNumbersGuard = false;
        this.helper.stopTimeout();
        this.startTick();
      }
    } else {
      if (i == 6 || !this.canSubmit) return;
      if (
        this.answer.length == 0 ||
        (this.answer.length > 0 && !/^.*\d$/.test(this.answer))
      ) {
        this.answer += this.vals[i];
        this.clickGuard.push(i);
      }
    }
  }

  spinUs() {
    for (let i = 0; i < this.vals.length; i++) {
      if (i >= 0 && i <= 3) {
        this.spinnerHandels[i] = setInterval(() => {
          this.vals[i] = this.srcSingle[
            Math.floor(Math.random() * this.srcSingle.length)
          ];
        }, 100);
      } else if (i == 4) {
        this.spinnerHandels[i] = setInterval(() => {
          this.vals[i] = this.srcDouble[
            Math.floor(Math.random() * this.srcDouble.length)
          ];
        }, 100);
      } else if (i == 5) {
        this.spinnerHandels[i] = setInterval(() => {
          this.vals[i] = this.srcTriple[
            Math.floor(Math.random() * this.srcTriple.length)
          ];
        }, 100);
      } else {
        this.spinnerHandels[i] = setInterval(() => {
          this.vals[i] = this.srcRes[
            Math.floor(Math.random() * this.srcRes.length)
          ];
        }, 100);
      }
    }
  }
  stopSpin(i) {
    clearInterval(this.spinnerHandels[i]);
  }
  startTick(timeout: boolean = false) {
    this.canSubmit = true;
    this.infoMsg = null;
    this.opsDisabled = false;
    this.helper.startTimeout(60000);
    this.service.gameBegin(
      this.position ? "redUser" : "blueUser",
      this.data.gameId
    );
  }

  submit(flag: boolean = false) {
    this.canSubmit = false;
    if (flag) {
      this.helper.stopTimeout();
    }

    let compute;
    let sub = null;
    try {
      compute = eval(this.answer);
    } catch (e) {
      compute = null;
    }
    if (compute != null && Math.floor(compute) != compute) compute = null;
    if (compute != null) sub = Math.abs(this.vals[6] - compute);

    this.infoColor = compute != null ? "#62fc03" : "#fc0303";
    this.infoMsg = compute != null ? compute : "Nevalidan izraz";

    setTimeout(() => {
      this.infoColor = "black";
      this.loaded = false;
      this.doSpin = true;
      this.infoMsg = "Čeka se na protivnika...";

      setTimeout(() => {
        this.service.computeDone(
          this.position ? "blueUser" : "redUser",
          this.data.gameId,
          compute,
          this.answer,
          this.turn,
          sub
        );
      }, 1000);
    }, 4000);
  }
  add() {
    this.answer += "+";
  }
  sub() {
    this.answer += "-";
  }
  mul() {
    this.answer += "*";
  }
  div() {
    this.answer += "/";
  }
  leftBracket() {
    this.answer += "(";
  }
  rightBracket() {
    this.answer += ")";
  }
  del() {
    function delLast(str) {
      return str.substr(0, str.length - 1);
    }
    let lastNum = /^.*\d$/;
    if (!lastNum.test(this.answer)) {
      this.answer = delLast(this.answer);
      return;
    }
    while (this.answer.length != 0 && lastNum.test(this.answer))
      this.answer = delLast(this.answer);

    this.clickGuard.pop();
  }
  gameStart() {
    this.doSpin = false;
    this.loaded = true;
    this.infoMsg = this.myTurn ? "Izaberite brojeve" : "Protivnik bira brojeve";
    if (this.myTurn) this.helper.startTimeout(15000);
  }
}
