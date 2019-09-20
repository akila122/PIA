import { Component, OnInit, OnDestroy } from "@angular/core";
import { UserModel } from "../models/UserModel";
import { Subscription } from "rxjs";
import { GoDService } from "../player/god-play/go-d.service";
import { Router } from "@angular/router";
import { GameHelperService } from "../game-helper.service";
import { LoginService } from "../home/login/login.service";
import { MusicService } from "../music.service";

@Component({
  selector: "app-my-num-solo",
  templateUrl: "./my-num-solo.component.html",
  styleUrls: ["./my-num-solo.component.css"]
})
export class MyNumSoloComponent implements OnInit, OnDestroy {
  user: UserModel;
  data: any;

  canSubmit = false;

  doSpin: boolean = true;
  loaded: boolean = false;
  infoMsg: string;
  infoColor: string = "black";
  answer: string = "";

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

  turn: number = 0;
  showRes: string;
  pickNumbersGuard: boolean = true;

  constructor(
    private router: Router,
    private helper: GameHelperService,
    private service: GoDService,
    private logger: LoginService,
    private music: MusicService
  ) {}

  ngOnDestroy() {
    this.subArr.forEach(sub => sub.unsubscribe());
  }
  ngOnInit() {
    this.user = this.logger.getUser();
    this.data = this.helper.getData();
    this.spinUs();
    for (let i = 0; i < this.disabled.length; i++) this.disabled[i] = false;

    this.subArr.push(
      this.helper.timeoutObservable.subscribe(data => {
        if (this.pickNumbersGuard) {
          this.pickNumbersGuard = false;

          this.disabled.forEach((val, i, arr) => (arr[i] = true));
          this.clickedOnce.forEach((val, i, arr) => {
            if (!val) {
              this.stopSpin(i);
              arr[i] = true;
            }
          });
          this.disabled.forEach((val, i, arr) => (arr[i] = false));
          this.startTick();
        } else this.submit();
      })
    );

    this.gameStart();
  }

  clickNum(i: number) {
    if (!this.clickedOnce[i]) {
      this.stopSpin(i);
      this.clickedOnce[i] = true;
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

    let points = compute ? 10 : 0;
    this.helper.pushPoints({bluePoints:points});

    setTimeout(() => {
      this.infoMsg = "Igra dana završena!";
      this.music.playResults();
      this.service.godFinish(this.data.godId, points);
      setTimeout(() => {
        this.router.navigate(["player"]);
      }, 2000);
    }, 3000);
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
    this.infoMsg = "Izaberite brojeve";
    this.helper.startTimeout(15000);
  }
}
